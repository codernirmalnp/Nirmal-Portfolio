'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField, TextAreaField, RichTextEditor, SelectField, FeatureImageField } from '@/components/forms/FormComponents';
import { useCategories } from '../../categories/useCategories';
import { useTags } from '../../tags/useTags';
import { CategoriesProvider } from '../../categories/CategoriesContext';
import { TagsProvider } from '../../tags/TagsContext';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

const blogSchema = yup.object({
  title: yup.string().required('Blog title is required').min(5, 'Title must be at least 5 characters'),
  excerpt: yup.string().required('Excerpt is required').min(20, 'Excerpt must be at least 20 characters'),
  content: yup.string().required('Content is required').min(50, 'Content must be at least 50 characters'),
  category: yup.string().required('Category is required'),
  tags: yup.array().of(yup.string().required()).min(1, 'At least one tag is required').required(),
  status: yup.string().oneOf(['PUBLISHED', 'UNPUBLISHED'], 'Status must be published or unpublished').required(),
  imageUrl: yup.string().required('Blog image is required'),
});

type BlogFormData = yup.InferType<typeof blogSchema>;

export default function NewBlogPage() {
  return (
    <CategoriesProvider>
      <TagsProvider>
        <NewBlogPageContent />
      </TagsProvider>
    </CategoriesProvider>
  );
}

function NewBlogPageContent() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategories();
  const { tags, fetchTags } = useTags();
  const [loading, setLoading] = useState(true);

  const methods = useForm<BlogFormData>({
    resolver: yupResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      status: 'UNPUBLISHED',
      imageUrl: ''
    }
  });

  const { handleSubmit, setValue, watch } = methods;
  const watchedTags = watch('tags');

  useEffect(() => {
    Promise.all([fetchCategories(), fetchTags()]).finally(() => setLoading(false));
  }, [fetchCategories, fetchTags]);

  const handleTagToggle = (tagId: string) => {
    const currentTags = watchedTags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    setValue('tags', newTags);
  };

  const onSubmit: SubmitHandler<BlogFormData> = async (data) => {
    try {
      // Prepare payload for API
      const payload = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.category,
        tagIds: data.tags,
        imageUrl: data.imageUrl,
        status: data.status,
        // Add other fields as needed
      };
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let error: any = {};
        try {
          error = await res.json();
        } catch {
          const text = await res.text();
          console.error('API error response (not JSON):', text);
          error = { error: text };
        }
        throw new Error(error.error || 'Failed to create blog');
      }
      // Redirect to blogs list
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading form...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-white">Create New Blog</h1>
            <p className="text-white/70 font-opensans mt-1">Write and publish your next blog post</p>
          </div>
          <Link
            href="/dashboard/blogs"
            className="btn-secondary"
          >
            Back to Blogs
          </Link>
        </div>

        {/* Blog Form */}
        <div className="bg-darkBg p-6 rounded-lg border border-white/10">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <InputField
                name="title"
                label="Blog Title"
                placeholder="Enter your blog title"
                required={true}
              />

              {/* Excerpt */}
              <TextAreaField
                name="excerpt"
                label="Excerpt"
                placeholder="Write a brief summary of your blog post"
                rows={3}
                required={true}
              />

              {/* Blog Image Upload */}
              <FeatureImageField
                name="imageUrl"
                label="Blog Image"
                required={true}
                width={630}
                height={393}
              />

              {/* Category */}
              <SelectField
                name="category"
                label="Category"
                options={(categories ?? []).map(cat => ({ value: cat.id, label: cat.name }))}
                placeholder="Select a category"
                required={true}
              />

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-outfit font-medium text-white/70">
                  Tags <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-2 rounded-md text-sm font-outfit font-medium border transition-all duration-200 ${
                        watchedTags?.includes(tag.id)
                          ? 'bg-themeGradient text-white border-transparent'
                          : 'bg-black/30 text-white/70 border-white/20 hover:border-white/40'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                {methods.formState.errors.tags && (
                  <p className="text-sm text-red-400 font-opensans">
                    {methods.formState.errors.tags.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <SelectField
                name="status"
                label="Status"
                options={[
                  { value: 'PUBLISHED', label: 'Published' },
                  { value: 'UNPUBLISHED', label: 'Unpublished' }
                ]}
                placeholder="Select status"
                required={true}
              />

              {/* Content */}
              <RichTextEditor
                name="content"
                label="Blog Content"
                placeholder="Write your blog content here..."
                required={true}
              />

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-6">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Create Blog
                </button>
                <Link
                  href="/dashboard/blogs"
                  className="btn-secondary"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </DashboardLayout>
  );
} 
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField, TextAreaField, RichTextEditor, SelectField, FeatureImageField } from '@/components/forms/FormComponents';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: { id: string; name: string } | string;
  tags: ({ id: string; name: string } | string)[];
  status: 'draft' | 'published' | 'PUBLISHED' | 'UNPUBLISHED';
  imageUrl?: string;
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

export default function EditBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

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

  const { handleSubmit, setValue, watch, reset } = methods;
  const watchedTags = watch('tags');




  useEffect(() => {
    // Fetch blog, categories, and tags
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch blog
        const blogRes = await fetch(`/api/blogs?id=${blogId}`);
        let blogData = null;
        if (blogRes.ok) {
          const blogs = await blogRes.json();
          // If API returns an array, find the correct blog
          if (Array.isArray(blogs)) {
            blogData = blogs.find((b: any) => String(b.id) === String(blogId));
          } else if (blogs && blogs.id) {
            blogData = blogs;
          }
        }
        setBlog(blogData);
        // Fetch categories
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(Array.isArray(cats) ? cats : cats.categories || []);
        }
        // Fetch tags
        const tagRes = await fetch('/api/tags');
        if (tagRes.ok) {
          const tagsData = await tagRes.json();
          setTags(Array.isArray(tagsData) ? tagsData : tagsData.tags || []);
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  useEffect(() => {
    if (blog) {
      let status: 'PUBLISHED' | 'UNPUBLISHED' = 'UNPUBLISHED';
      if (typeof blog.status === 'string') {
        const s = blog.status.toUpperCase();
        if (s === 'PUBLISHED') status = 'PUBLISHED';
        else if (s === 'UNPUBLISHED') status = 'UNPUBLISHED';
      }
      reset({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category && typeof blog.category === 'object' && 'id' in blog.category ? String(blog.category.id) : '',
        tags: Array.isArray(blog.tags) ? blog.tags.map((tag: any) => typeof tag === 'object' && tag !== null && 'id' in tag ? String(tag.id) : String(tag)) : [],
        status,
        imageUrl: blog.imageUrl || ''
      });
    }
  }, [blog, reset]);

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
        id: blogId,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.category,
        tagIds: data.tags,
        status: data.status,
        imageUrl: data.imageUrl,
      };
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let error: any = {};
        try {
          error = await res.json();
        } catch {
          const text = await res.text();
          error = { error: text };
        }
        throw new Error(error.error || 'Failed to update blog');
      }
      // Redirect to blogs list
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog: ' + (error as Error).message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading blog...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  if (!blog) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-outfit font-medium text-white">Blog not found</h2>
          <Link
            href="/dashboard/blogs"
            className="mt-4 inline-block bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
          >
            Back to Blogs
          </Link>
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
            <h1 className="text-2xl font-outfit font-bold text-white">Edit Blog</h1>
            <p className="text-white/70 font-opensans mt-1">Update your blog post</p>
          </div>
          <Link
            href="/dashboard/blogs"
            className="bg-darkBg hover:bg-black/50 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200"
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

              {/* Category */}
              <SelectField
                name="category"
                label="Category"
                options={categories.map(cat => ({ value: String(cat.id), label: cat.name }))}
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
                      onClick={() => handleTagToggle(String(tag.id))}
                      className={`px-3 py-2 rounded-md text-sm font-outfit font-medium border transition-all duration-200 ${
                        (watchedTags || []).map(String).includes(String(tag.id))
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

              {/* Blog Image Upload */}
              <FeatureImageField
                name="imageUrl"
                label="Blog Image"
                required={true}
                width={630}
                height={393}
              />

              {/* Content */}
              <RichTextEditor
                name="content"
                label="Blog Content"
                placeholder="Write your blog content here..."
                required={true}
              />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-themeGradient hover:opacity-90 text-white px-6 py-3 rounded-md text-sm font-outfit font-medium transition-all duration-200"
                >
                  Update Blog
                </button>
                <Link
                  href="/dashboard/blogs"
                  className="bg-darkBg hover:bg-black/50 text-white px-6 py-3 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200 text-center"
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
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField, TextAreaField, SelectField, FeatureImageField } from '@/components/forms/FormComponents';
import { useProjects } from '../useProjects';
import { ProjectsProvider } from '../ProjectsContext';


const projectSchema = yup.object({
  title: yup.string().required('Project title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  status: yup.string().oneOf(['active', 'completed', 'archived'], 'Status must be active, completed, or archived').required(),
  projectUrl: yup.string().url('Must be a valid URL').optional(),
  githubUrl: yup.string().url('Must be a valid URL').optional()
});

export default function NewProjectPage() {
  return (
    <ProjectsProvider>
      <NewProjectPageContent />
    </ProjectsProvider>
  );
}

function NewProjectPageContent() {
  const router = useRouter();
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const { createProject } = useProjects();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      setLoadingTags(true);
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        setTags(Array.isArray(data.tags) ? data.tags : []);
      } catch {
        setTags([]);
      } finally {
        setLoadingTags(false);
      }
    }
    async function fetchCategories() {
      setLoadingCategories(true);
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchTags();
    fetchCategories();
  }, []);

  const methods = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
      projectUrl: '',
      githubUrl: ''
    }
  });

  const { handleSubmit } = methods;

  const handleTagToggle = (tag: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  const handleCategoryToggle = (cat: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (selectedTagIds.length === 0 || selectedCategoryIds.length === 0) {
      setFormError('Please select at least one tag and one category.');
      return;
    }
    setFormError(null);
    try {
      const result = await createProject({
        ...data,
        tagIds: selectedTagIds,
        categoryIds: selectedCategoryIds,
      });
      if (result.success) {
        alert('Project created successfully!');
        router.push('/dashboard/projects');
      } else {
        setFormError(result.error || 'Failed to create project. Please try again.');
      }
    } catch (error) {
      setFormError('Failed to create project. Please try again.');
      console.error('Error creating project:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-white">New Project</h1>
            <p className="text-white/70 font-opensans mt-1">Add a new project to your portfolio</p>
          </div>
          <Link
            href="/dashboard/projects"
            className="bg-darkBg hover:bg-black/50 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200"
          >
            Back to Projects
          </Link>
        </div>

        {/* Project Form */}
        <div className="bg-darkBg p-6 rounded-lg border border-white/10">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <InputField
                name="title"
                label="Project Title"
                placeholder="Enter your project title"
                required={true}
              />

              {/* Description */}
              <TextAreaField
                name="description"
                label="Description"
                placeholder="Describe your project, technologies used, and key features"
                rows={4}
                required={true}
              />

              {/* Status */}
              <SelectField
                name="status"
                label="Status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'archived', label: 'Archived' }
                ]}
                required={true}
              />

              {/* Categories */}
              <div className="space-y-2">
                <label className="block text-sm font-outfit font-medium text-white/70">
                  Categories <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {loadingCategories ? (
                    <span className="text-white/50 col-span-full">Loading categories...</span>
                  ) : categories.length === 0 ? (
                    <span className="text-white/50 col-span-full">No categories found</span>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(Number(cat.id))}
                        className={`px-3 py-2 rounded-md text-sm font-outfit font-medium border transition-all duration-200 ${
                          selectedCategoryIds.includes(Number(cat.id))
                            ? 'bg-themeGradient text-white border-transparent'
                            : 'bg-black/30 text-white/70 border-white/20 hover:border-white/40'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-outfit font-medium text-white/70">
                  Tags <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {loadingTags ? (
                    <span className="text-white/50 col-span-full">Loading tags...</span>
                  ) : tags.length === 0 ? (
                    <span className="text-white/50 col-span-full">No tags found</span>
                  ) : (
                    tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(Number(tag.id))}
                        className={`px-3 py-2 rounded-md text-sm font-outfit font-medium border transition-all duration-200 ${
                          selectedTagIds.includes(Number(tag.id))
                            ? 'bg-themeGradient text-white border-transparent'
                            : 'bg-black/30 text-white/70 border-white/20 hover:border-white/40'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Project Image Upload */}
              <FeatureImageField
                name="imageUrl"
                label="Project Image"
                required={false}
                width={630}
                height={393}
              />

              {/* Project URL */}
              <InputField
                name="projectUrl"
                label="Project URL"
                type="url"
                placeholder="https://your-project.com"
                required={false}
              />

              {/* GitHub URL */}
              <InputField
                name="githubUrl"
                label="GitHub Repository"
                type="url"
                placeholder="https://github.com/username/repository"
                required={false}
              />

              {/* Form Error */}
              {formError && (
                <div className="text-red-400 font-opensans text-sm mb-2">{formError}</div>
              )}
              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-themeGradient hover:opacity-90 text-white px-6 py-3 rounded-md text-sm font-outfit font-medium transition-all duration-200"
                >
                  Create Project
                </button>
                <Link
                  href="/dashboard/projects"
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
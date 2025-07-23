'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField, TextAreaField, SelectField, FeatureImageField } from '@/components/forms/FormComponents';
import { useProjects } from '../../useProjects';
import { ProjectsProvider } from '../../ProjectsContext';

interface Project {
  id: string;
  title: string;
  description: string;
  tags?: { id: number }[];
  categories?: { categoryId: number }[];
  tagIds?: number[];
  categoryIds?: number[];
  status: 'active' | 'completed' | 'archived';
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  tagIds: number[];
  categoryIds: number[];
  status: 'active' | 'completed' | 'archived';
  projectUrl: string;
  githubUrl: string;
  imageUrl: string | null;
}


const projectSchema = yup.object({
  title: yup.string().required('Project title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  tagIds: yup.array().of(yup.number().required()).min(1, 'At least one tag is required').required(),
  categoryIds: yup.array().of(yup.number().required()).min(1, 'At least one category is required').required(),
  status: yup.string().oneOf(['active', 'completed', 'archived'], 'Status must be active, completed, or archived').required(),
  projectUrl: yup.string().url('Must be a valid URL').default(''),
  githubUrl: yup.string().url('Must be a valid URL').default(''),
  imageUrl: yup.string()
    .nullable()
    .notRequired()
    .test('is-url-or-empty', 'Must be a valid URL', value => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    })
    .default(''),
});

export default function EditProjectPage() {
  return (
    <ProjectsProvider>
      <EditProjectForm />
    </ProjectsProvider>
  );
}

function EditProjectForm() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const { updateProject } = useProjects();

  const methods = useForm<ProjectFormData & { tagIds: number[]; categoryIds: number[] }>(
    {
      resolver: yupResolver(projectSchema),
      defaultValues: {
        title: '',
        description: '',
        tagIds: [],
        categoryIds: [],
        status: 'active',
        projectUrl: '',
        githubUrl: '',
        imageUrl: '',
      }
    }
  );

  const { handleSubmit, setValue, watch, reset } = methods;
  const watchedTagIds = watch('tagIds') || [];
  const watchedCategoryIds = watch('categoryIds') || [];

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects?id=${projectId}`);
        const data = await res.json();
        if (data && data.project) {
          setProject(data.project);
          const tagIds = Array.isArray(data.project.tags)
            ? data.project.tags
                .map((tag: any) => tag && tag.id !== undefined && tag.id !== null ? Number(tag.id) : null)
                .filter((id: any): id is number => typeof id === 'number' && !isNaN(id))
            : [];
          const categoryIds = Array.isArray(data.project.categories)
            ? data.project.categories
                .map((cat: any) => cat && cat.id !== undefined && cat.id !== null ? Number(cat.id) : null)
                .filter((id: any): id is number => typeof id === 'number' && !isNaN(id))
            : [];
          reset({
            title: data.project.title,
            description: data.project.description,
            tagIds,
            categoryIds,
            status: data.project.status,
            projectUrl: data.project.projectUrl || '',
            githubUrl: data.project.githubUrl || '',
            imageUrl: data.project.imageUrl || '',
          });
        } else {
          setProject(null);
        }
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId, reset]);

  // Ensure tags are auto-selected after loading project
  useEffect(() => {
    if (
      project &&
      Array.isArray(project.tags) &&
      project.tags.length > 0
    ) {
      const tagIds = project.tags
        .map((tag: any) => tag && tag.id !== undefined && tag.id !== null ? Number(tag.id) : null)
        .filter((id: any): id is number => typeof id === 'number' && !isNaN(id));
      setValue('tagIds', tagIds, { shouldValidate: true });
    }
    if (
      project &&
      Array.isArray(project.categories) &&
      project.categories.length > 0
    ) {
      const categoryIds = project.categories
        .map((cat: any) => cat && cat.id !== undefined && cat.id !== null ? Number(cat.id) : null)
        .filter((id: any): id is number => typeof id === 'number' && !isNaN(id));
      setValue('categoryIds', categoryIds, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, setValue]);

  const handleTagToggle = (tagId: number) => {
    if (typeof tagId !== 'number' || isNaN(tagId)) return;
    let newTagIds;
    if (watchedTagIds.includes(tagId)) {
      newTagIds = watchedTagIds.filter(t => t !== tagId);
    } else {
      newTagIds = [...watchedTagIds, tagId];
    }
    setValue('tagIds', newTagIds);
  };

  const handleCategoryToggle = (catId: number) => {
    if (typeof catId !== 'number' || isNaN(catId)) return;
    let newCategoryIds;
    if (watchedCategoryIds.includes(catId)) {
      newCategoryIds = watchedCategoryIds.filter(c => c !== catId);
    } else {
      newCategoryIds = [...watchedCategoryIds, catId];
    }
    setValue('categoryIds', newCategoryIds);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      if ((data.tagIds?.length ?? 0) === 0 || (data.categoryIds?.length ?? 0) === 0) {
        alert('Please select at least one tag and one category.');
        return;
      }
      const payload = { ...data, id: projectId };
      const result = await updateProject(payload);
      if (result.success) {
        alert('Project updated successfully!');
        router.push('/dashboard/projects');
      } else {
        alert(result.error || 'Failed to update project.');
      }
    } catch (error) {
      alert('Error updating project.');
      console.error('Error updating project:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-outfit font-medium text-white">Project not found</h2>
          <Link
            href="/dashboard/projects"
            className="mt-4 inline-block bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
          >
            Back to Projects
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
            <h1 className="text-2xl font-outfit font-bold text-white">Edit Project</h1>
            <p className="text-white/70 font-opensans mt-1">Update your project details</p>
          </div>
          <Link
            href="/dashboard/projects"
            className="bg-darkBg hover:bg-black/50 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200"
          >
            Back to Projects
          </Link>
        </div>

        {/* Project Info */}
        <div className="mb-4">
          <span className="text-xs text-white/50 font-opensans">Project ID: {project.id}</span>
          <h2 className="text-xl font-outfit font-bold text-white mt-1">{project.title}</h2>
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

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-outfit font-medium text-white/70">
                  Tags <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {project && Array.isArray(project.tags) && project.tags.length > 0 ? (
                    project.tags.map((tagObj: any, index: number) => {
                      const tagId = tagObj.id;
                      return (
                        <button
                          key={tagId}
                          type="button"
                          onClick={() => handleTagToggle(tagId)}
                          className={`px-3 py-2 rounded-md text-sm font-outfit font-medium border transition-all duration-200 ${
                            watchedTagIds.includes(tagId)
                              ? 'bg-themeGradient text-white border-transparent'
                              : 'bg-black/30 text-white/70 border-white/20 hover:border-white/40'
                          }`}
                        >
                          {tagObj.name ? tagObj.name : `Tag #${tagId}`}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-white/50 col-span-full">No tags found</span>
                  )}
                </div>
                {methods.formState.errors.tagIds && (
                  <p className="text-sm text-red-400 font-opensans">
                    {methods.formState.errors.tagIds.message}
                  </p>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="block text-sm font-outfit font-medium text-white/70">
                  Categories <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {project && Array.isArray(project.categories) && project.categories.length > 0 ? (
                    project.categories.map((catObj: any, index: number) => {
                      const catId = catObj.id;
                      return (
                        <button
                          key={catId}
                          type="button"
                          onClick={() => handleCategoryToggle(catId)}
                          className={`px-3 py-2 rounded-md text-sm font-outfit font-medium border transition-all duration-200 ${
                            watchedCategoryIds.includes(catId)
                              ? 'bg-themeGradient text-white border-transparent'
                              : 'bg-black/30 text-white/70 border-white/20 hover:border-white/40'
                          }`}
                        >
                          {catObj.name ? catObj.name : `Category #${catId}`}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-white/50 col-span-full">No categories found</span>
                  )}
                </div>
                {methods.formState.errors.categoryIds && (
                  <p className="text-sm text-red-400 font-opensans">
                    {methods.formState.errors.categoryIds.message}
                  </p>
                )}
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

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-themeGradient hover:opacity-90 text-white px-6 py-3 rounded-md text-sm font-outfit font-medium transition-all duration-200"
                >
                  Update Project
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
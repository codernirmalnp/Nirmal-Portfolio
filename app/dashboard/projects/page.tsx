'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { ProjectsProvider } from './ProjectsContext';
import { useProjects } from './useProjects';
import ProjectStats from './ProjectStats';


export default function ProjectsPage() {
  return (
    <ProjectsProvider>
      <ProjectsPageContent />
    </ProjectsProvider>
  );
}

function ProjectsPageContent() {
  const { projects, fetchProjects, deleteProject } = useProjects();
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  // const [loadingTags, setLoadingTags] = useState(true);
  // const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  // const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectName: string;
  }>({
    isOpen: false,
    projectId: null,
    projectName: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch all tags for tag name lookup
  // const fetchTags = useCallback(async () => {
  //   setLoadingTags(true);
  //   try {
  //     const res = await fetch('/api/tags');
  //     const data = await res.json();
  //     setTags(Array.isArray(data.tags) ? data.tags : []);
  //   } catch {
  //     setTags([]);
  //   } finally {
  //     setLoadingTags(false);
  //   }
  // }, []);

  // // Fetch all categories for category name lookup
  // const fetchCategories = useCallback(async () => {
  //   setLoadingCategories(true);
  //   try {
  //     const res = await fetch('/api/categories');
  //     const data = await res.json();
  //     setCategories(Array.isArray(data.categories) ? data.categories : []);
  //   } catch {
  //     setCategories([]);
  //   } finally {
  //     setLoadingCategories(false);
  //   }
  // }, []);

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
    // fetchTags();
    // fetchCategories();
  }, [fetchProjects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleDeleteClick = (projectId: string, projectName: string) => {
    setDeleteModal({
      isOpen: true,
      projectId,
      projectName
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.projectId) {
      const result = await deleteProject(deleteModal.projectId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Project deleted successfully.' });
        // Re-fetch projects to ensure UI is in sync
        fetchProjects();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete project.' });
      }
      setDeleteModal({ isOpen: false, projectId: null, projectName: '' });
    }
  };

  // Auto-hide messages after 2s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Compute project stats
  const total = projects.length;
  const active = projects.filter(p => p.status === 'active').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const archived = projects.filter(p => p.status === 'archived').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading projects...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-white">Projects</h1>
            <p className="text-white/70 font-opensans mt-1">Manage your portfolio projects</p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200 flex items-center"
          >
            <i className="bi bi-plus-circle mr-2"></i>
            New Project
          </Link>
        </div>
        {/* Feedback Message */}
        {message && (
          <div className={`p-3 rounded text-center mb-2 ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
            {message.text}
          </div>
        )}
        {/* Project Stats */}
        <ProjectStats total={total} active={active} completed={completed} archived={archived} />
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-darkBg p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-outfit font-semibold text-white line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2 ml-3">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="text-white/70 hover:text-white transition-colors"
                    title="Edit Project"
                  >
                    <i className="bi bi-pencil text-sm"></i>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(project.id, project.title)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Project"
                  >
                    <i className="bi bi-trash text-sm"></i>
                  </button>
                </div>
              </div>
              {/* Description */}
              <p className="text-white/70 font-opensans text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-2 items-center">
               
                {project?.categories?.map((catObj: any, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-themeGradient text-white text-xs font-outfit rounded border border-white/20"
                  >
                    {catObj.name || catObj.category?.name || `Category #${catObj.id}`}
                  </span>
                ))}
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project?.tags?.map((tagObj: any, index: number) => {
                
                  return (
                    <span
                      key={index}
                      className="px-2 py-1 bg-black/30 text-white/70 text-xs font-outfit rounded border border-white/20"
                    >
                      {tagObj ? tagObj.name : `Tag #${tagObj.tagId}`}
                    </span>
                  );
                })}
              </div>
              {/* Status and Dates */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-outfit border ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <div className="text-xs text-white/50 font-opensans">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-briefcase text-2xl text-white/50"></i>
            </div>
            <h3 className="text-lg font-outfit font-medium text-white mb-2">No projects yet</h3>
            <p className="text-white/70 font-opensans mb-6">Start building your portfolio by adding your first project</p>
            <Link
              href="/dashboard/projects/new"
              className="bg-themeGradient hover:opacity-90 text-white px-6 py-3 rounded-md text-sm font-outfit font-medium transition-all duration-200 inline-flex items-center"
            >
              <i className="bi bi-plus-circle mr-2"></i>
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, projectId: null, projectName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete the project"
        itemName={deleteModal.projectName}
      />
    </DashboardLayout>
  );
} 
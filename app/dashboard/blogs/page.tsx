'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import BlogStats from './BlogStats';
import BlogList from './BlogList';
import { BlogsProvider } from './BlogsContext';
import { useBlogs } from './useBlogs';



export default function BlogsPage() {
  return (
    <BlogsProvider>
      <BlogsPageContent />
    </BlogsProvider>
  );
}

function BlogsPageContent() {
  const { blogs, fetchBlogs, deleteBlog, stats, page, setPage, totalPages } = useBlogs();
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blogId: string | null;
    blogTitle: string;
  }>({
    isOpen: false,
    blogId: null,
    blogTitle: ''
  });

  useEffect(() => {
    fetchBlogs(page).finally(() => setLoading(false));
  }, [fetchBlogs, page]);

  const handleDeleteClick = (blogId: string, blogTitle: string) => {
    setDeleteModal({
      isOpen: true,
      blogId,
      blogTitle
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.blogId) {
      await deleteBlog(deleteModal.blogId);
      setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading blogs...</p>
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' })}
          onConfirm={handleDeleteConfirm}
          title="Delete Blog"
          message="Are you sure you want to delete the blog"
          itemName={deleteModal.blogTitle}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-outfit font-semibold text-white">Blogs</h1>
          <Link
            href="/dashboard/blogs/new"
            className="bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
          >
            Create New Blog
          </Link>
        </div>
        {/* Blog Stats */}
        <BlogStats
          total={stats.total}
          published={stats.published}
          unpublished={stats.unpublished}
        />
        {/* Blogs List */}
        <BlogList blogs={blogs} onDelete={handleDeleteClick} />
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-3 py-1 rounded bg-darkBg text-white border border-white/20 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-white/70 font-outfit">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-darkBg text-white border border-white/20 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog"
        message="Are you sure you want to delete the blog"
        itemName={deleteModal.blogTitle}
      />
    </DashboardLayout>
  );
} 
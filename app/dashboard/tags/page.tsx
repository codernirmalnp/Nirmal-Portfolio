'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField, ColorPickerField } from '@/components/forms/FormComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

interface Tag {
  id: number;
  name: string;
  color?: string;
  // slug, blogCount, createdAt are optional for now
  slug?: string;
  blogCount?: number;
  createdAt?: string;
}

const tagSchema = yup.object({
  name: yup.string().required('Tag name is required').min(2, 'Name must be at least 2 characters'),
  color: yup.string().required('Color is required').matches(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color')
});

type TagFormData = yup.InferType<typeof tagSchema>;

interface TagsApiResponse {
  totalTags: number;
  totalBlogs: number;
  tags: Tag[];
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    tagId: number | null;
    tagName: string;
  }>({
    isOpen: false,
    tagId: null,
    tagName: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const methods = useForm<TagFormData>({
    resolver: yupResolver(tagSchema),
    defaultValues: {
      name: '',
      color: '#3B82F6'
    }
  });

  const { handleSubmit, reset, setValue } = methods;

  // Fetch tags from API
  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      try {
        const res = await fetch('/api/tags');
        if (!res.ok) throw new Error('Failed to fetch tags');
        const data = await res.json();
        setTags(data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load tags.' });
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  // Add or update tag
  const onSubmit = async (data: TagFormData) => {
    try {
      let res;
      let tag: Tag;
      if (editingTag) {
        res = await fetch('/api/tags', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTag.id, ...data })
        });
        if (!res.ok) throw new Error('Failed to update tag');
        tag = await res.json() as Tag;
        setTags(prev => prev ? { ...prev, tags: prev.tags.map(t => t.id === tag.id ? tag : t) } : prev);
        setMessage({ type: 'success', text: 'Tag updated successfully.' });
        setEditingTag(null);
      } else {
        res = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to add tag');
        tag = await res.json() as Tag;
        setTags(prev => prev ? { ...prev, tags: [...prev.tags, tag] } : prev);
        setMessage({ type: 'success', text: 'Tag added successfully.' });
      }
      reset();
      setShowForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: (editingTag ? 'Failed to update tag.' : 'Failed to add tag.') });
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setValue('name', tag.name);
    setValue('color', tag.color || '#3B82F6');
    setShowForm(true);
  };

  const handleDeleteClick = (tagId: number, tagName: string) => {
    setDeleteModal({
      isOpen: true,
      tagId,
      tagName
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.tagId) {
      try {
        const res = await fetch('/api/tags', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteModal.tagId })
        });
        if (!res.ok) throw new Error('Failed to delete tag');
        setTags(prev => prev ? { ...prev, tags: prev.tags.filter(tag => tag.id !== deleteModal.tagId) } : prev);
        setMessage({ type: 'success', text: 'Tag deleted successfully.' });
        setDeleteModal({ isOpen: false, tagId: null, tagName: '' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete tag.' });
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTag(null);
    reset();
  };

  // Auto-hide messages after 2s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading tags...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-outfit font-semibold text-white">Tags</h1>

        {/* Feedback Message */}
        {message && (
          <div className={`p-3 rounded text-center mb-2 ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Tag Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-darkBg p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center mr-3">
                <i className="bi bi-tags text-white"></i>
              </div>
              <div>
                <p className="text-sm font-outfit font-medium text-white/70">Total Tags</p>
                <p className="text-lg font-outfit font-medium text-white">{tags?.totalTags}</p>
              </div>
            </div>
          </div>
          <div className="bg-darkBg p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-md flex items-center justify-center mr-3">
                <i className="bi bi-file-text text-blue-400"></i>
              </div>
              <div>
                <p className="text-sm font-outfit font-medium text-white/70">Total Blogs</p>
                <p className="text-lg font-outfit font-medium text-white">
                  {tags?.totalBlogs}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Tag Form */}
        {showForm && (
          <div className="bg-darkBg p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-outfit font-medium text-white mb-4">
              {editingTag ? 'Edit Tag' : 'Add New Tag'}
            </h3>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                  name="name"
                  label="Tag Name"
                  placeholder="Enter tag name"
                  required={true}
                />
                <ColorPickerField
                  name="color"
                  label="Tag Color"
                  required={true}
                />
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingTag ? 'Update Tag' : 'Add Tag'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        )}

        {/* Tags List */}
        <div className="bg-darkBg shadow overflow-hidden rounded-lg border border-white/10">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-outfit font-medium text-white">All Tags</h3>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
              >
                Add New Tag
              </button>
            )}
          </div>
          <ul className="divide-y divide-white/10">
            {tags?.tags?.map((tag) => (
              <li key={tag.id}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div>
                        <h3 className="text-lg font-outfit font-medium text-white">
                          {tag.name}
                        </h3>
                        <p className="text-sm text-white/50 font-opensans">
                          {(tag.blogCount || 0)} blogs{tag.createdAt ? ` • Created ${new Date(tag.createdAt).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    </div>
                    {/* Action Buttons - Bottom Right */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="btn-secondary px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tag.id, tag.name)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm font-outfit font-medium border border-red-500/30 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, tagId: null, tagName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Tag"
        message="Are you sure you want to delete the tag"
        itemName={deleteModal.tagName}
      />
    </DashboardLayout>
  );
} 
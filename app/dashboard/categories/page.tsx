'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField, TextAreaField } from '@/components/forms/FormComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  blogCount: number;
  createdAt: string;
}

const categorySchema = yup.object({
  name: yup.string().required('Category name is required').min(2, 'Name must be at least 2 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters')
});

type CategoryFormData = yup.InferType<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: ''
  });

  const methods = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data.categories);
        setTotalBlogs(data.totalBlogs);
        setTotalCategories(data.totalCategories);
      } catch (err) {
        // Optionally set an error message state
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      let res;
      let category: Category;
      if (editingCategory) {
        res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCategory.id, ...data })
        });
        if (!res.ok) throw new Error('Failed to update category');
        category = await res.json();
        setCategories(categories.map(cat => cat.id === category.id ? category : cat));
        setEditingCategory(null);
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to add category');
        category = await res.json();
        setCategories([...categories, category]);
      }
      reset();
      setShowForm(false);
    } catch (err) {
      // Optionally set an error message state
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description);
    setShowForm(true);
  };

  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    setDeleteModal({
      isOpen: true,
      categoryId,
      categoryName
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.categoryId) {
      try {
        const res = await fetch('/api/categories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteModal.categoryId })
        });
        if (!res.ok) throw new Error('Failed to delete category');
        setCategories(categories.filter(category => category.id !== deleteModal.categoryId));
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
      } catch (error) {
        // Optionally set an error message state
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    reset();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Loading categories...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-outfit font-semibold text-white">Categories</h1>

        {/* Category Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-darkBg p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center mr-3">
                <i className="bi bi-folder text-white"></i>
              </div>
              <div>
                <p className="text-sm font-outfit font-medium text-white/70">Total Categories</p>
                <p className="text-lg font-outfit font-medium text-white">{totalCategories}</p>
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
                <p className="text-lg font-outfit font-medium text-white">{totalBlogs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Category Form */}
        {showForm && (
          <div className="bg-darkBg p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-outfit font-medium text-white mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                  name="name"
                  label="Category Name"
                  placeholder="Enter category name"
                  required={true}
                />
                <TextAreaField
                  name="description"
                  label="Description"
                  placeholder="Enter category description"
                  rows={3}
                  required={true}
                />
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
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

        {/* Categories List */}
        <div className="bg-darkBg shadow overflow-hidden rounded-lg border border-white/10">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-outfit font-medium text-white">All Categories</h3>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
              >
                Add New Category
              </button>
            )}
          </div>
          <ul className="divide-y divide-white/10">
            {categories.map((category) => (
              <li key={category.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-themeGradient rounded-md flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-folder text-white"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-outfit font-medium text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/70 font-opensans mb-2 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center text-sm text-white/50 font-opensans">
                          <span>{category.blogCount} blogs</span>
                          <span className="mx-2">•</span>
                          <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Bottom Right */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn-secondary px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category.id, category.name)}
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
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete the category"
        itemName={deleteModal.categoryName}
      />
    </DashboardLayout>
  );
} 
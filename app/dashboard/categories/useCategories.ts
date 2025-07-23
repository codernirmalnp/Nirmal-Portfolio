import { useCallback } from 'react';
import { useCategoriesContext } from './CategoriesContext';

const CATEGORIES_API_URL = '/api/categories';

export const useCategories = () => {
  const { categories, setCategories, removeCategory } = useCategoriesContext();

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(CATEGORIES_API_URL);
      let data = [];
      try {
        data = await res.json();
      } catch {
        data = [];
      }
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  }, [setCategories]);

  // Delete a category by id
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await fetch(`${CATEGORIES_API_URL}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      removeCategory(id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }, [removeCategory]);

  // Add more methods (create, update) as needed

  return {
    categories,
    fetchCategories,
    deleteCategory,
    setCategories,
  };
}; 
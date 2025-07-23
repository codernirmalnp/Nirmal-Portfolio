import { useCallback } from 'react';
import { useTagsContext } from './TagsContext';

const TAGS_API_URL = '/api/tags';

export const useTags = () => {
  const { tags, setTags, removeTag } = useTagsContext();

  // Fetch tags from API
  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(TAGS_API_URL);
      let data = [];
      try {
        data = await res.json();
      } catch {
        data = [];
      }
      if (Array.isArray(data)) {
        setTags(data);
      } else if (Array.isArray(data.tags)) {
        setTags(data.tags);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setTags([]);
    }
  }, [setTags]);

  // Delete a tag by id
  const deleteTag = useCallback(async (id: string) => {
    try {
      await fetch(`${TAGS_API_URL}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      removeTag(id);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  }, [removeTag]);

  // Add more methods (create, update) as needed

  return {
    tags,
    fetchTags,
    deleteTag,
    setTags,
  };
}; 
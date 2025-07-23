import { useCallback } from 'react';
import { useBlogsContext } from './BlogsContext';
import React from 'react';

// Example API endpoints (replace with your actual API URLs)
const BLOGS_API_URL = '/api/blogs';

export const useBlogs = () => {
  const { blogs, setBlogs, removeBlog } = useBlogsContext();
  // Store stats and pagination in state
  const [stats, setStats] = React.useState({ total: 0, published: 0, unpublished: 0 });
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const limit = 10;

  // Fetch blogs from API
  const fetchBlogs = useCallback(async (customPage?: number) => {
    try {
      const currentPage = customPage || page;
      const res = await fetch(`/api/blogs?page=${currentPage}&limit=${limit}`);
      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setBlogs(data);
          setStats({ total: data.length, published: 0, unpublished: 0 });
          setTotalPages(1);
        } else {
          setBlogs(data.blogs || []);
          setStats({
            total: data.total || 0,
            published: data.publishedBlogs || 0,
            unpublished: data.unpublishedBlogs || 0,
          });
          setTotalPages(data.totalPages || 1);
        }
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  }, [setBlogs, page]);

  // Delete a blog by id
  const deleteBlog = useCallback(async (id: string) => {
    try {
      await fetch(`${BLOGS_API_URL}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      removeBlog(id);
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  }, [removeBlog]);

  // Add more methods (create, update) as needed

  return {
    blogs,
    fetchBlogs,
    deleteBlog,
    setBlogs, // Expose if needed for direct updates
    stats,
    page,
    setPage,
    totalPages,
    limit,
  };
}; 
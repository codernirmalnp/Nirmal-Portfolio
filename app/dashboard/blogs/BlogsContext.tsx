import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'published' | 'unpublished' | 'PUBLISHED' | 'UNPUBLISHED';
  createdAt: string;
  updatedAt: string;
}

interface BlogsContextType {
  blogs: Blog[];
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  removeBlog: (id: string) => void;
}

const BlogsContext = createContext<BlogsContextType | undefined>(undefined);

export const BlogsProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const removeBlog = useCallback((id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  }, []);

  return (
    <BlogsContext.Provider value={{ blogs, setBlogs, removeBlog }}>
      {children}
    </BlogsContext.Provider>
  );
};

export const useBlogsContext = () => {
  const context = useContext(BlogsContext);
  if (!context) {
    throw new Error('useBlogsContext must be used within a BlogsProvider');
  }
  return context;
}; 
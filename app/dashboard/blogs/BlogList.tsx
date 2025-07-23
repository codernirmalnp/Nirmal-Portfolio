import React from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string | { name: string };
  tags: string[];
  status: 'published' | 'unpublished' | 'PUBLISHED' | 'UNPUBLISHED';
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  blogs: Blog[];
  onDelete: (blogId: string, blogTitle: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onDelete }) => (
  <div className="bg-darkBg shadow overflow-hidden rounded-lg border border-white/10">
    <div className="px-4 py-3 border-b border-white/10">
      <h3 className="text-lg font-outfit font-medium text-white">All Blogs</h3>
    </div>
    <ul className="divide-y divide-white/10">
      {blogs.map((blog) => (
        <li key={blog.id}>
          <div className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-themeGradient rounded-md flex items-center justify-center">
                  <i className="bi bi-file-text text-white"></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                  <h3 className="text-lg font-outfit font-medium text-white truncate">
                    {blog.title}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-outfit font-medium ${
                    ['published', 'PUBLISHED'].includes(blog.status)
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <p className="text-sm text-white/70 font-opensans mb-2 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-white/50 font-opensans space-y-1 sm:space-y-0">
                  <span>Category: {typeof blog.category === 'object' && blog.category !== null ? (blog.category as { name: string }).name : blog.category}</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span>Tags: {Array.isArray(blog.tags) && blog.tags.length > 0 && typeof blog.tags[0] === 'object' ? (blog.tags as any[]).map(tag => tag.name).join(', ') : blog.tags.join(', ')}</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                </div>
                {/* Action Buttons - Bottom Right */}
                <div className="flex justify-end mt-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/blogs/${blog.id}/edit`}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(blog.id, blog.title)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm font-outfit font-medium border border-red-500/30 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default BlogList; 
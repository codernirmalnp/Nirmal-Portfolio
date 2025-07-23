import React from 'react';

interface BlogStatsProps {
  total: number;
  published: number;
  unpublished: number;
}

const BlogStats: React.FC<BlogStatsProps> = ({ total, published, unpublished }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-file-text text-white"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Total Blogs</p>
          <p className="text-lg font-outfit font-medium text-white">{total}</p>
        </div>
      </div>
    </div>
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-green-500/20 rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-check-circle text-green-400"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Published</p>
          <p className="text-lg font-outfit font-medium text-white">{published}</p>
        </div>
      </div>
    </div>
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-yellow-500/20 rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-pencil text-yellow-400"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Unpublished</p>
          <p className="text-lg font-outfit font-medium text-white">{unpublished}</p>
        </div>
      </div>
    </div>
  </div>
);

export default BlogStats; 
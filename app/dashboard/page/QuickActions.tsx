import React from 'react';
import Link from 'next/link';

const QuickActions: React.FC = () => (
  <div>
    <h2 className="text-lg font-outfit font-medium text-white mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/dashboard/blogs/new"
        className="bg-themeGradient hover:opacity-90 text-white p-4 rounded-lg flex items-center justify-between transition-all duration-200"
      >
        <span className="font-outfit font-medium">Create New Blog</span>
        <i className="bi bi-plus-lg"></i>
      </Link>
      <Link
        href="/dashboard/categories"
        className="bg-darkBg hover:bg-black/50 text-white p-4 rounded-lg flex items-center justify-between border border-white/10 transition-all duration-200"
      >
        <span className="font-outfit font-medium">Add Category</span>
        <i className="bi bi-plus-lg"></i>
      </Link>
      <Link
        href="/dashboard/tags"
        className="bg-darkBg hover:bg-black/50 text-white p-4 rounded-lg flex items-center justify-between border border-white/10 transition-all duration-200"
      >
        <span className="font-outfit font-medium">Add Tag</span>
        <i className="bi bi-plus-lg"></i>
      </Link>
    </div>
  </div>
);

export default QuickActions; 
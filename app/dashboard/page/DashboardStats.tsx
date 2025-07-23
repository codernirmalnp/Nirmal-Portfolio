import React from 'react';
import Link from 'next/link';

interface DashboardStatsProps {
  blogs: number;
  categories: number;
  tags: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ blogs, categories, tags }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <div className="bg-darkBg overflow-hidden shadow rounded-lg border border-white/10">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center">
              <i className="bi bi-file-text text-white"></i>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-outfit font-medium text-white/70 truncate">
                Total Blogs
              </dt>
              <dd className="text-lg font-outfit font-medium text-white">
                {blogs}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-black/30 px-5 py-3 border-t border-white/10">
        <div className="text-sm">
          <Link
            href="/dashboard/blogs"
            className="font-outfit font-medium text-white/70 hover:text-white transition-all duration-200"
          >
            View all blogs
          </Link>
        </div>
      </div>
    </div>
    <div className="bg-darkBg overflow-hidden shadow rounded-lg border border-white/10">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center">
              <i className="bi bi-folder text-white"></i>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-outfit font-medium text-white/70 truncate">
                Categories
              </dt>
              <dd className="text-lg font-outfit font-medium text-white">
                {categories}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-black/30 px-5 py-3 border-t border-white/10">
        <div className="text-sm">
          <Link
            href="/dashboard/categories"
            className="font-outfit font-medium text-white/70 hover:text-white transition-all duration-200"
          >
            Manage categories
          </Link>
        </div>
      </div>
    </div>
    <div className="bg-darkBg overflow-hidden shadow rounded-lg border border-white/10">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center">
              <i className="bi bi-tags text-white"></i>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-outfit font-medium text-white/70 truncate">
                Tags
              </dt>
              <dd className="text-lg font-outfit font-medium text-white">
                {tags}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-black/30 px-5 py-3 border-t border-white/10">
        <div className="text-sm">
          <Link
            href="/dashboard/tags"
            className="font-outfit font-medium text-white/70 hover:text-white transition-all duration-200"
          >
            Manage tags
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardStats; 
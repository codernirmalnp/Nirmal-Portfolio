import Link from 'next/link';

interface DashboardNavProps {
  activePage: 'overview' | 'blogs' | 'categories' | 'tags';
}

export default function DashboardNav({ activePage }: DashboardNavProps) {
  return (
    <nav className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <Link
            href="/dashboard"
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activePage === 'overview'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/dashboard/blogs"
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activePage === 'blogs'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            Blogs
          </Link>
          <Link
            href="/dashboard/categories"
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activePage === 'categories'
                ? 'border-green-500 text-white'
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            Categories
          </Link>
          <Link
            href="/dashboard/tags"
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activePage === 'tags'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            Tags
          </Link>
        </div>
      </div>
    </nav>
  );
} 
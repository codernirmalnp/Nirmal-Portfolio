'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: 'bi bi-speedometer2',
      active: pathname === '/dashboard'
    },
    {
      name: 'Blogs',
      href: '/dashboard/blogs',
      icon: 'bi bi-file-text',
      active: pathname.startsWith('/dashboard/blogs')
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: 'bi bi-briefcase',
      active: pathname.startsWith('/dashboard/projects')
    },
    {
      name: 'Categories',
      href: '/dashboard/categories',
      icon: 'bi bi-folder',
      active: pathname.startsWith('/dashboard/categories')
    },
    {
      name: 'Tags',
      href: '/dashboard/tags',
      icon: 'bi bi-tags',
      active: pathname.startsWith('/dashboard/tags')
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Completely Fixed, No Scrolling */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-darkBg border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:z-auto lg:fixed lg:left-0
      `}>
        {/* Sidebar Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0 bg-darkBg">
          <h2 className="text-xl font-outfit font-medium text-white">Dashboard</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white transition-colors"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Navigation Menu - Fixed Height, No Scrolling */}
        <nav className="flex-1 p-4 overflow-hidden">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-outfit font-medium
                    ${item.active 
                      ? 'bg-themeGradient text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <i className={`${item.icon} mr-3 text-lg`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-white/10 my-4"></div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-outfit font-medium text-white/70 mb-3 uppercase tracking-wider px-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/blogs/new"
                onClick={onClose}
                className="flex items-center px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-outfit"
              >
                <i className="bi bi-plus-circle mr-3"></i>
                New Blog
              </Link>
              <Link
                href="/dashboard/categories"
                onClick={onClose}
                className="flex items-center px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-outfit"
              >
                <i className="bi bi-plus-circle mr-3"></i>
                Add Category
              </Link>
              <Link
                href="/dashboard/tags"
                onClick={onClose}
                className="flex items-center px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-outfit"
              >
                <i className="bi bi-plus-circle mr-3"></i>
                Add Tag
              </Link>
              <Link
                href="/dashboard/projects/new"
                onClick={onClose}
                className="flex items-center px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-outfit"
              >
                <i className="bi bi-plus-circle mr-3"></i>
                New Project
              </Link>
            </div>
          </div>
        </nav>

        {/* User Info and Sign Out - Fixed at bottom */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 bg-darkBg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-themeGradient rounded-full flex items-center justify-center mr-3">
                <i className="bi bi-person text-white text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-outfit font-medium text-white">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-white/50 font-opensans">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-outfit font-medium border border-red-500/30 transition-all duration-200 flex items-center justify-center"
          >
            <i className="bi bi-box-arrow-right mr-2"></i>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
} 
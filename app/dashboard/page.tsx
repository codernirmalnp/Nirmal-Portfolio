'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardStats from './page/DashboardStats';
import QuickActions from './page/QuickActions';

export default function Dashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    categories: 0,
    tags: 0
  });

  useEffect(() => {
    // Load dashboard stats
    // In a real app, this would fetch from your API
    setStats({
      blogs: 12,
      categories: 5,
      tags: 8
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-outfit font-semibold text-white">Overview</h1>

        {/* Stats Cards */}
        <DashboardStats blogs={stats.blogs} categories={stats.categories} tags={stats.tags} />

        {/* Quick Actions */}
        <QuickActions />
        {/* Account Settings */}
        <div>
          <Link href="/dashboard/account" className="inline-block mt-6 bg-darkBg hover:bg-black/50 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200">
            Account Settings
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
} 
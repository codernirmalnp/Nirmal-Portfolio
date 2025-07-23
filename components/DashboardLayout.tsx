'use client';

import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import ProtectedRoute from './ProtectedRoute';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="h-screen bg-darkBg flex overflow-hidden">
        {/* Sidebar - Completely Fixed */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          {/* Header - Completely Fixed */}
          <header className="bg-black/30 border-b border-white/10 px-6 py-4 flex-shrink-0 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-white/70 hover:text-white transition-colors mr-4"
                >
                  <i className="bi bi-list text-xl"></i>
                </button>
                <h1 className="text-xl font-outfit font-semibold text-white">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-md hover:bg-white/10 transition-colors text-white/70">
                  <i className="bi bi-bell text-lg"></i>
                </button>
                <div className="w-8 h-8 bg-themeGradient rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-outfit font-medium">A</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content - Only This Scrolls */}
          <main className="flex-1 overflow-y-auto p-6 bg-darkBg">
            <div className="max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
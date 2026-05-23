import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ErrorBoundary from '../../ErrorBoundary';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* 1. The Left Sidebar (Admin Version) */}
      <AdminSidebar />

      {/* 2. The Main Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The Main Content Area — adds top padding on mobile to offset fixed header */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
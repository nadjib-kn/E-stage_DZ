import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ErrorBoundary from '../../ErrorBoundary';

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* 1. The Left Sidebar (handles its own mobile/desktop visibility) */}
      <Sidebar />

      {/* 2. The Main Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The Main Content Area — adds top padding on mobile to offset fixed header */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pt-16 lg:pt-10">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
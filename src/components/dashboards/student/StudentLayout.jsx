import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ErrorBoundary from '../../ErrorBoundary';
// TopNavbar import is gone!

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans transition-colors duration-300">
      
      {/* 1. The Left Sidebar */}
      <Sidebar />

      {/* 2. The Main Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* The TopNavbar is fully removed from here */}

        {/* The Main Content Area (Where pages change) */}
        <main className="flex-1 overflow-y-auto p-10">
          {/* <Outlet /> renders whatever page the user clicks on in the Sidebar. */}
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        
      </div>
    </div>
  );
};

export default StudentLayout;
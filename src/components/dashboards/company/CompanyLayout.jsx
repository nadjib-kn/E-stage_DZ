import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';

const CompanyLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans transition-colors duration-300">
      
      {/* 1. The Left Sidebar (Company Version) */}
      <CompanySidebar />

      {/* 2. The Main Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* The Main Content Area (Where pages change based on the route) */}
        <main className="flex-1 overflow-y-auto p-5">
          {/* <Outlet /> renders the specific page (Dashboard, Offers, etc.) */}
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default CompanyLayout;
import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';
import ErrorBoundary from '../../ErrorBoundary';
import { useAuth } from '../../../context/AuthContext';

const CompanyLayout = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If the company is not approved, force them to stay on the profile page
  const isApproved = currentUser?.verificationStatus === 'approved';
  const isProfilePage = location.pathname.includes('/company/profile');

  if (!isApproved && !isProfilePage) {
    return <Navigate to="/company/profile" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans transition-colors duration-300">
      
      {/* 1. The Left Sidebar (Company Version) */}
      <CompanySidebar />

      {/* 2. The Main Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Verification Warning Banner */}
        {!isApproved && (
          <div className="bg-amber-100 dark:bg-amber-500/20 border-b border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 p-4 text-sm font-bold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Your account is currently pending verification. Please complete your profile below. You cannot post offers until an Admin approves your account.
          </div>
        )}

        {/* The Main Content Area */}
        <main className="flex-1 overflow-y-auto p-5">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        
      </div>
    </div>
  );
};

export default CompanyLayout;
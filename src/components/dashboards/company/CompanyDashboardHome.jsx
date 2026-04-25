import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompanyData } from '../../../context/CompanyDataContext';

const CompanyDashboardHome = () => {
  const { currentUser } = useAuth();
  const { dashboardStats, companyJobs, companyApplications } = useCompanyData();

  // Basic limits for the tables
  const recentApplications = companyApplications.slice(0, 4);
  const activeOffersPreview = companyJobs.filter(job => job.status === 'Active').slice(0, 3);

  // ================= DYNAMIC STAT CALCULATIONS =================
  // By calculating this right here, it will always be 100% accurate based on your actual data
  const realPendingCount = companyApplications.filter(app => app.status === 'Pending').length;
  const realTotalApplicationsCount = companyApplications.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#2563EB] to-[#14B8A6] p-8 rounded-3xl text-white shadow-lg shadow-blue-500/20">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Welcome back, {currentUser?.companyName || 'Company'}! 👋
          </h1>
          <p className="text-white/80 font-medium">Here is what's happening with your internship listings today.</p>
        </div>
        <Link 
          to="/company/post-offer" 
          className="mt-4 md:mt-0 bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
        >
          + Post New Offer
        </Link>
      </div>

{/* ================= STATS CARDS ================= */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Offers Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-emerald-400/30 dark:hover:border-emerald-500/50 transition-colors">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Active Offers</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{dashboardStats.activeOffers || activeOffersPreview.length}</h3>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-[#2563EB]/30 dark:hover:border-blue-500/50 transition-colors">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Total Applications</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{realTotalApplicationsCount}</h3>
          </div>
        </div>

        {/* Pending Review Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-amber-400/30 dark:hover:border-amber-500/50 transition-colors">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Pending Review</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{realPendingCount}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= RECENT APPLICANTS ================= */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applicants</h2>
            <Link to="/company/applicants" className="text-sm font-bold text-[#2563EB] dark:text-blue-400 hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Applied For</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={app.student?.avatar} alt={app.student?.firstName} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{app.student?.firstName} {app.student?.lastName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{app.student?.major}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{app.jobTitle}</td>
                      <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{app.dateApplied}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full 
                          ${app.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : ''}
                          ${app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}
                          ${app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                        `}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500 dark:text-slate-400">No applications yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= ACTIVE OFFERS ================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Offers</h2>
            <Link to="/company/offers" className="text-sm font-bold text-[#2563EB] dark:text-blue-400 hover:underline">Manage</Link>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4">
            {activeOffersPreview.length > 0 ? (
              activeOffersPreview.map((job) => (
                <div key={job.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm dark:hover:bg-slate-700/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{job.role}</h3>
                    <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">Active</span>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{job.type}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{job.location}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                <p className="mb-4">No active offers right now.</p>
                <Link to="/company/post-offer" className="text-sm font-bold text-[#2563EB] dark:text-blue-400 hover:underline">Create one</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDashboardHome;
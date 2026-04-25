// src/components/dashboards/admin/AdminManageJobs.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { mockDatabase } from '../../../data/mockData'; // Fallback import

const AdminManageJobs = () => {
  // Added blockJob from context (we will add this to Context in Step 2)
  const { allJobs, deleteJob, blockJob } = useAdmin(); 
  
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'closed', 'draft', 'blocked'
  const [searchQuery, setSearchQuery] = useState('');

  // New state for our custom action modal
  const [actionModal, setActionModal] = useState({ isOpen: false, job: null });

  // Use jobs from context or fallback directly to mockData.js structure
  const jobsList = allJobs?.length > 0 ? allJobs : mockDatabase.jobs;
  
  // Calculate applicants for each job based on the applications array
  const getApplicantCount = (jobId) => {
    return mockDatabase?.applications?.filter(app => app.jobId === jobId).length || 0;
  };

  // Filter logic
  const filteredJobs = jobsList.filter(job => {
    const matchesFilter = filter === 'all' || job.status.toLowerCase() === filter.toLowerCase();
    
    const searchString = `${job.role} ${job.company} ${job.location}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate summary stats
  const totalJobs = jobsList.length;
  const activeJobs = jobsList.filter(j => j.status.toLowerCase() === 'active').length;
  const closedJobs = jobsList.filter(j => j.status.toLowerCase() === 'closed').length;

  // Modal Action Handlers
  const openModal = (job) => setActionModal({ isOpen: true, job });
  const closeModal = () => setActionModal({ isOpen: false, job: null });

  const handleConfirmDelete = () => {
    if (deleteJob && actionModal.job) {
      deleteJob(actionModal.job.id);
    }
    closeModal();
  };

  const handleConfirmBlock = () => {
    if (blockJob && actionModal.job) {
      blockJob(actionModal.job.id);
    } else {
      console.log('Block job with ID:', actionModal.job?.id);
    }
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8 relative">
      
      {/* ================= HEADER & SEARCH/STATS ================= */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Manage Internships
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Monitor and moderate internship offers posted by companies.</p>
        </div>

        {/* Quick Stats / Search Area */}
        <div className="w-full md:w-96 relative shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
            <input
            type="text"
            placeholder="Search by role, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* ================= TABS & FILTERS (Matched to Users Page) ================= */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto hide-scrollbar">
        {['all', 'active', 'closed', 'draft', 'blocked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap capitalize ${
              filter === tab 
                ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {tab === 'all' ? 'All Offers' : tab}
          </button>
        ))}
      </div>

      {/* ================= INTERNSHIPS TABLE ================= */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700">
                <th className="p-5 font-semibold">Role & Details</th>
                <th className="p-5 font-semibold">Company</th>
                <th className="p-5 font-semibold">Status & Deadlines</th>
                <th className="p-5 font-semibold text-center">Applicants</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className={`border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group ${job.status.toLowerCase() === 'blocked' ? 'bg-slate-50/30 dark:bg-slate-700/20' : ''}`}>
                    
                    {/* Role Details Column */}
                    <td className="p-5">
                      <div>
                        <p className={`text-sm font-bold transition-colors cursor-pointer ${job.status.toLowerCase() === 'blocked' ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400'}`}>
                          {job.role}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="uppercase tracking-wider text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">ID: {job.id}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          <span>{job.type}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Company Column */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex flex-shrink-0 items-center justify-center font-bold text-sm shadow-sm ${job.status.toLowerCase() === 'blocked' ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 grayscale' : job.logoColor || 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                          {job.logo || job.company.charAt(0)}
                        </div>
                        <p className={`text-sm font-bold ${job.status.toLowerCase() === 'blocked' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{job.company}</p>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md
                          ${job.status.toLowerCase() === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 
                            job.status.toLowerCase() === 'closed' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 
                            job.status.toLowerCase() === 'blocked' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20' :
                            'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                            ${job.status.toLowerCase() === 'active' ? 'bg-emerald-500 dark:bg-emerald-400' : 
                              job.status.toLowerCase() === 'closed' ? 'bg-red-500 dark:bg-red-400' : 
                              job.status.toLowerCase() === 'blocked' ? 'bg-orange-500 dark:bg-orange-400' : 
                              'bg-slate-400 dark:bg-slate-500'}
                          `}></span>
                          {job.status}
                        </span>
                        
                        {job.deadline && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium ml-0.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Exp: {job.deadline}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Applications Column */}
                    <td className="p-5">
                      <div className="flex justify-center">
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm border flex items-center gap-1.5
                          ${job.status.toLowerCase() === 'blocked' ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600' : 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 border-blue-100 dark:border-blue-500/20'}
                        `}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          {getApplicantCount(job.id)}
                        </div>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Offer Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {/* Open Modal Button */}
                        <button 
                          onClick={() => openModal(job)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Manage Offer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No internships found</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No results match the current filter or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ACTION MODAL ================= */}
      {actionModal.isOpen && actionModal.job && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Manage Internship</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Take action on the <span className="font-bold text-slate-700 dark:text-slate-300">{actionModal.job.role}</span> offer by <span className="font-bold text-slate-700 dark:text-slate-300">{actionModal.job.company}</span>.
              </p>
            </div>
            
            <div className="p-6 space-y-3 bg-slate-50/50 dark:bg-slate-700/50">
              {/* Block/Suspend Button */}
              <button 
                onClick={handleConfirmBlock}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-500/30 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors group"
              >
                <div className="text-left">
                  <p className="font-bold text-orange-700 dark:text-orange-400">
                    {actionModal.job.status.toLowerCase() === 'blocked' ? 'Unblock Offer' : 'Block Offer'}
                  </p>
                  <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-0.5">
                    {actionModal.job.status.toLowerCase() === 'blocked' ? 'Restore visibility to students.' : 'Hide this offer from students. Can be undone.'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
              </button>

              {/* Delete Button */}
              <button 
                onClick={handleConfirmDelete}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/50 transition-colors group"
              >
                <div className="text-left">
                  <p className="font-bold text-red-700 dark:text-red-400">Permanently Delete</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">Erase the posting and all applications. Cannot be undone.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
              </button>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminManageJobs;
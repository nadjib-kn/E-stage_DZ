import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext'; // Import our Context!

// --- Enhanced Status Badge Component ---
const StatusBadge = ({ status }) => {
  const config = {
    Pending: {
      colors: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
      icon: (
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    Accepted: {
      colors: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
      icon: (
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    Rejected: {
      colors: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
      icon: (
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  };

  const { colors, icon } = config[status] || config.Pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colors}`}>
      {icon}
      {status}
    </span>
  );
};

const MyApplications = () => {
  // Pull in the active applications list from Context
  const { myApplications } = useStudent();
  const [filter, setFilter] = useState('All');

  // Filter the applications based on the selected tab
  const filteredApps = filter === 'All' 
    ? myApplications 
    : myApplications.filter(app => app.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Page Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-end justify-between transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage the status of your internship applications.</p>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 overflow-x-auto hide-scrollbar">
        {['All', 'Pending', 'Accepted', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === tab 
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Applications Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Head */}
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Company & Role</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors group">
                    
                    {/* Role & Company */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${app.logoColor}`}>
                          {app.logo}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">{app.role}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{app.company}</div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {app.location}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{app.dateApplied}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-sm font-bold text-[#2563EB] hover:text-[#1d4ed8] dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50/50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2.5 rounded-xl transition-colors">
                        View Details
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 text-slate-300 dark:text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No applications found</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} applications at the moment.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredApps.length > 0 && (
          <div className="bg-slate-50/50 dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Showing <span className="font-bold text-slate-700 dark:text-slate-200">{filteredApps.length}</span> results</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 cursor-not-allowed shadow-sm">Previous</button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">Next</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyApplications;
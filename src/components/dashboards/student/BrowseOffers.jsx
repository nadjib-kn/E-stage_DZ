import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';

const BrowseOffers = () => {
  const { jobs, applyForJob, cancelApplication } = useStudent();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [typeFilter, setTypeFilter] = useState('All Types');

  // Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter the Context jobs based on user input
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'All Locations' || job.location === locationFilter;
    const matchesType = typeFilter === 'All Types' || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  // Open the Apply Modal
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setErrorMessage('');
    setIsSuccess(false);
    setIsApplyModalOpen(true);
  };

  // Open the Cancel/Withdraw Modal
  const handleCancelClick = (job) => {
    setSelectedJob(job);
    setIsCancelModalOpen(true);
  };

  // Process Application
  const confirmApplication = () => {
    if (!selectedJob) return;
    const result = applyForJob(selectedJob.id);
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setSelectedJob(null);
      }, 2000);
    } else {
      setErrorMessage(result.message || 'Something went wrong. Please try again.');
    }
  };

  // Process Cancellation
  const confirmCancel = () => {
    if (!selectedJob) return;
    const result = cancelApplication(selectedJob.id);
    
    if (result.success) {
      setIsCancelModalOpen(false);
      setSelectedJob(null);
    }
  };

  return (
    <div className="space-y-8 relative font-sans">
      {/* 1. Header & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-6 items-end justify-between transition-colors duration-300">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Find your next internship</h1>
          <p className="text-slate-500 mb-6">Discover opportunities from top companies in Algeria.</p>
          <div className="relative">
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer transition-colors"
          >
            <option>All Locations</option>
            <option>Algiers</option>
            <option>Oran</option>
            <option>Constantine</option>
            <option>Remote</option>
          </select>
          <select 
            value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer transition-colors"
          >
            <option>All Types</option>
            <option>On-site</option>
            <option>Hybrid</option>
            <option>Remote</option>
          </select>
        </div>
      </div>

      {/* 2. Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col h-full overflow-hidden group">
              
              <div className="p-6 pb-5 flex-grow flex flex-col relative">
                {/* Status Badge (Top Right) */}
                <div className="absolute top-6 right-6">
                  {job.hasApplied ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      Applied
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Accepting
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pr-16 mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 border border-slate-100 dark:border-slate-700/50 ${job.logoColor}`}>
                    {job.logo}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-[#2563EB] transition-colors" title={job.role}>
                      {job.role}
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-bold">{job.company}</p>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {job.posted}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 truncate max-w-full">
                    <span className="text-base leading-none">📍</span> {job.location}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 truncate max-w-full">
                    <span className="text-base leading-none">💼</span> {job.type}
                  </span>
                  {job.deadline && (
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 truncate max-w-full">
                      <span className="text-base leading-none">⏳</span> {job.deadline}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4 mt-auto transition-colors">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Unpaid / Standard</span>
                
                {job.hasApplied ? (
                  <button 
                    onClick={() => handleCancelClick(job)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                  >
                    Withdraw
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-300">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No internships found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Try adjusting your search terms or location and type filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setLocationFilter('All Locations'); setTypeFilter('All Types'); }}
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 1. JOB DETAILS & APPLY MODAL */}
      {/* ========================================== */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[24px] w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 border border-slate-100 dark:border-slate-700/50 ${selectedJob.logoColor}`}>
                  {selectedJob.logo}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1">{selectedJob.role}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{selectedJob.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              {!isSuccess ? (
                <div className="space-y-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <span className="text-base leading-none">📍</span> {selectedJob.location}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <span className="text-base leading-none">💼</span> {selectedJob.type}
                    </span>
                    {selectedJob.duration && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <span className="text-base leading-none">⏱️</span> {selectedJob.duration}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Job Description</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      {selectedJob.description || "No specific description provided by the company."}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Requirements & Skills</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      {selectedJob.requirements || "No specific requirements provided by the company."}
                    </div>
                  </div>
                  
                  {errorMessage && (
                    <div className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl border border-red-100 dark:border-red-500/20 font-medium">
                      {errorMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300 h-full justify-center">
                  <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-500/20">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Application Sent!</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Your profile and resume have been securely delivered to <span className="font-bold">{selectedJob?.company}</span>. Good luck!</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isSuccess && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Your <span className="font-bold">default profile</span> and <span className="font-bold">CV</span> will be sent.
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => setIsApplyModalOpen(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto">
                    Cancel
                  </button>
                  <button onClick={confirmApplication} className="px-8 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold transition-colors shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] w-full sm:w-auto flex items-center justify-center gap-2">
                    Submit Application
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. WITHDRAW MODAL */}
      {/* ========================================== */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[24px] w-full max-w-md shadow-2xl relative p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 ring-8 ring-red-50/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Withdraw Application</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                Are you sure you want to withdraw your application for <span className="font-bold text-slate-900 dark:text-white">{selectedJob?.company}</span>? This action cannot be undone and will remove it from your dashboard.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                >
                  Keep Application
                </button>
                <button 
                  onClick={confirmCancel}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-[0_8px_20px_-6px_rgba(220,38,38,0.4)]"
                >
                  Yes, Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseOffers;
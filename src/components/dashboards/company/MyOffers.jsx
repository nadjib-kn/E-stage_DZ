import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyData } from '../../../context/CompanyDataContext';

const MyOffers = () => {
  // Ensure 'updateJob' is implemented in your CompanyDataContext!
  const { companyJobs, companyApplications, toggleJobStatus, deleteJob, updateJob } = useCompanyData();
  
  // States for Modals and UI
  const [filter, setFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null); // View Details Modal
  const [jobToDelete, setJobToDelete] = useState(null); // Delete Confirmation Modal
  const [toastMessage, setToastMessage] = useState(''); // Success Messages
  
  // States for Editing
  const [jobToEdit, setJobToEdit] = useState(null); // Edit Modal visibility
  const [editFormData, setEditFormData] = useState({}); // Holds the form data while editing

  // Filter jobs based on selected tab
  const filteredJobs = filter === 'All' 
    ? companyJobs 
    : companyJobs.filter(job => job.status === filter);

  const getApplicantCount = (jobId) => {
    return companyApplications?.filter(app => app.jobId === jobId).length || 0;
  };

  // Toast Notification handler
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (jobToDelete && deleteJob) {
      deleteJob(jobToDelete.id);
      showToast('Offer deleted successfully.');
    }
    setJobToDelete(null);
  };

  // Edit Handlers
  const openEditModal = (job) => {
    setJobToEdit(job);
    setEditFormData(job); // Pre-fill the form with the selected job's data
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (updateJob && jobToEdit) {
      updateJob(jobToEdit.id, editFormData);
      showToast('Offer updated successfully.');
    }
    setJobToEdit(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans relative">
      
      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 fade-in duration-300">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Offers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your internship listings and track applicants.</p>
        </div>
        <Link 
          to="/company/post-offer" 
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Post New Offer
        </Link>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="flex gap-2 mb-8 border-b border-slate-100 dark:border-slate-700 pb-4 overflow-x-auto no-scrollbar">
        {['All', 'Active', 'Closed', 'Draft'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              filter === status 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {status}
            <span className={`ml-2 opacity-80 font-medium text-xs px-1.5 py-0.5 rounded-full ${filter === status ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
              {status === 'All' ? companyJobs?.length || 0 : companyJobs?.filter(j => j.status === status).length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* ================= JOB LISTINGS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs?.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full overflow-hidden group">
              
              <div className="p-6 pb-5 flex-grow flex flex-col relative">
                <div className="absolute top-6 right-6">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                    job.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 
                    job.status === 'Closed' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 
                    'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-emerald-500 animate-pulse' : job.status === 'Closed' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                    {job.status}
                  </div>
                </div>

                <div className="pr-20 mb-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-2" title={job.role}>
                    {job.role}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Posted {job.posted}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 truncate max-w-full">
                    <span className="text-base leading-none">📍</span> {job.location}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 truncate max-w-full">
                    <span className="text-base leading-none">💼</span> {job.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 truncate max-w-full">
                    <span className="text-base leading-none">⏱️</span> {job.duration}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4 mt-auto">
                
                <Link 
                  to="/company/applicants"
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:border-[#2563EB] dark:hover:border-blue-500 hover:shadow-md transition-all group/app shrink-0"
                  title="View Applicants"
                >
                  <div className="bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 p-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Applicants</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white group-hover/app:text-[#2563EB] dark:group-hover/app:text-blue-400 leading-none transition-colors">
                      {getApplicantCount(job.id)}
                    </span>
                  </div>
                </Link>
                
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {/* Status Toggle */}
                  {job.status === 'Active' ? (
                    <button 
                      onClick={() => { toggleJobStatus(job.id, 'Closed'); showToast('Offer marked as closed.'); }}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors tooltip-trigger"
                      title="Close Offer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </button>
                  ) : job.status === 'Closed' ? (
                    <button 
                      onClick={() => { toggleJobStatus(job.id, 'Active'); showToast('Offer reopened successfully.'); }}
                      className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 rounded-xl transition-colors tooltip-trigger"
                      title="Reopen Offer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  ) : job.status === 'Draft' ? (
                    <button 
                      onClick={() => { toggleJobStatus(job.id, 'Active'); showToast('Draft published successfully!'); }}
                      className="p-2 text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded-xl transition-colors tooltip-trigger"
                      title="Publish Draft"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </button>
                  ) : null}

                  {/* View Details */}
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="p-2 text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded-xl transition-colors tooltip-trigger"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>

                  {/* Edit Offer */}
                  <button 
                    onClick={() => openEditModal(job)}
                    className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/10 rounded-xl transition-colors tooltip-trigger"
                    title="Edit Offer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => setJobToDelete(job)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-xl transition-colors tooltip-trigger"
                    title="Delete Offer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No offers found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">You don't have any internship offers matching this filter right now.</p>
            <Link 
              to="/company/post-offer" 
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Create your first offer
            </Link>
          </div>
        )}
      </div>

      {/* ================= EDIT OFFER MODAL ================= */}
      {jobToEdit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit Offer</h2>
              <button 
                onClick={() => setJobToEdit(null)} 
                className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
              <form id="editJobForm" onSubmit={handleEditSubmit} className="space-y-5">
                
                {/* Role */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Job Role / Title</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={editFormData.role || ''} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={editFormData.location || ''} 
                      onChange={handleEditChange} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      required 
                    />
                  </div>
                  
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                    <input 
                      type="text" 
                      name="duration" 
                      value={editFormData.duration || ''} 
                      onChange={handleEditChange} 
                      placeholder="e.g., 3 Months, 6 Months"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      required 
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
                  <input 
                    type="text" 
                    name="type" 
                    value={editFormData.type || ''} 
                    onChange={handleEditChange} 
                    placeholder="e.g., On-site, Remote, Hybrid"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required 
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={editFormData.description || ''} 
                    onChange={handleEditChange} 
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y"
                    required 
                  ></textarea>
                </div>
                
                {/* Requirements (Optional) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Requirements (Optional)</label>
                  <textarea 
                    name="requirements" 
                    value={editFormData.requirements || ''} 
                    onChange={handleEditChange} 
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y"
                  ></textarea>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-end shrink-0 gap-3">
              <button 
                onClick={() => setJobToEdit(null)} 
                type="button"
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                form="editJobForm"
                type="submit"
                className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-md"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= CONFIRM DELETE MODAL ================= */}
      {jobToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delete Offer?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                Are you sure you want to delete <strong>"{jobToDelete.role}"</strong>? All associated applicant data will also be permanently removed.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmDelete}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-600/20"
                >
                  Yes, Delete Offer
                </button>
                <button 
                  onClick={() => setJobToDelete(null)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= JOB DETAILS VIEW MODAL ================= */}
      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white break-words">{selectedJob.role}</h2>
                  <span className={`shrink-0 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-full border ${
                    selectedJob.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                    selectedJob.status === 'Closed' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 
                    'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedJob.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Posted on {selectedJob.posted}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="shrink-0 p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={selectedJob.location}>{selectedJob.location}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={selectedJob.type}>{selectedJob.type}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={selectedJob.duration}>{selectedJob.duration}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                  <p className="text-[10px] font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-1">Applicants</p>
                  <p className="text-sm font-black text-blue-900 dark:text-blue-100">{getApplicantCount(selectedJob.id)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                  Description
                </h3>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap bg-white dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 p-5 rounded-2xl shadow-sm">
                  {selectedJob.description || "No detailed description provided for this offer."}
                </div>
              </div>
              {selectedJob.requirements && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Requirements
                  </h3>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap bg-white dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 p-5 rounded-2xl shadow-sm">
                    {selectedJob.requirements}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex flex-wrap justify-end shrink-0 gap-3">
              <Link to="/company/applicants" className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center w-full sm:w-auto">
                View Applicants
              </Link>
              <button onClick={() => setSelectedJob(null)} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md text-center w-full sm:w-auto">
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOffers;
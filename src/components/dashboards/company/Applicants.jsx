import React, { useState, useMemo } from 'react';
import { useCompanyData } from '../../../context/CompanyDataContext';
import AdminProfilePreviewModal from '../admin/AdminProfilePreviewModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const resolveAvatarSrc = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  if (avatar.startsWith('avatars/')) return `${API_URL}/uploads/${avatar}`;
  if (!avatar.startsWith('/')) return `${API_URL}/${avatar}`;
  return `${API_URL}${avatar}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const UserAvatar = ({ user, size = 'md' }) => {
  const [imgErr, setImgErr] = useState(false);
  const src = resolveAvatarSrc(user?.avatar);
  const letter = user?.firstName?.charAt(0)?.toUpperCase() || user?.lastName?.charAt(0)?.toUpperCase() || 'U';
  const dim = size === 'lg' ? 'w-20 h-20 text-3xl border-4 border-white dark:border-slate-800 shadow-md' : 'w-14 h-14 text-xl border border-slate-200 dark:border-slate-600';

  if (src && !imgErr) {
    return (
      <img src={src} alt={user?.firstName || 'User'} className={`${dim} rounded-full object-cover flex-shrink-0 bg-slate-100 dark:bg-slate-700`} onError={() => setImgErr(true)} />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 flex-shrink-0`}>
      {letter}
    </div>
  );
};

const Applicants = () => {
  const { companyApplications, updateApplicationStatus } = useCompanyData();
  
  // UI States
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All'); // Filter by specific offer
  const [selectedApplicant, setSelectedApplicant] = useState(null); // Controls the Application Details Modal
  const [previewUser, setPreviewUser] = useState(null); // Controls the Student Profile Preview Modal
  const [toastMessage, setToastMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null); // Controls the Confirmation Modal

  // Toast Notification handler
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Extract unique job roles from applications for the dropdown filter
  const uniqueJobs = useMemo(() => {
    const jobs = new Set();
    companyApplications?.forEach(app => {
      if (app.job?.role) jobs.add(app.job.role);
    });
    return Array.from(jobs);
  }, [companyApplications]);

  // 1. Simplified Filtering (Pending, Accepted, Rejected) + Job Filter
  const filteredApplications = useMemo(() => {
    if (!companyApplications) return [];
    
    let result = companyApplications;
    
    if (filterStatus !== 'All') {
      result = result.filter(app => app.status === filterStatus);
    }
    
    if (selectedJobFilter !== 'All') {
      result = result.filter(app => app.job?.role === selectedJobFilter);
    }
    
    return result;
  }, [companyApplications, filterStatus, selectedJobFilter]);

  // 2. Request Status Update (Opens Confirmation)
  const requestStatusUpdate = (e, id, newStatus) => {
    e.stopPropagation(); // Prevents the profile modal from opening when clicking a button
    setConfirmDialog({ applicantId: id, newStatus });
  };

  // 3. Execute Status Update (After clicking "Yes" in confirmation)
  const executeStatusUpdate = () => {
    if (!confirmDialog) return;
    
    const { applicantId, newStatus } = confirmDialog;
    
    updateApplicationStatus(applicantId, newStatus);
    showToast(`Applicant moved to ${newStatus}`);
    
    // If the profile modal is open, update its state too
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }
    
    // Close confirmation dialog
    setConfirmDialog(null);
  };

  // Helper for Status Badges
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">Pending</span>;
      case 'Accepted': return <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">Accepted</span>;
      case 'Rejected': return <span className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">Rejected</span>;
      default: return <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans relative">
      
      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 fade-in duration-300">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ================= HEADER & FILTERS ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Applicants</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Review candidate profiles and manage applications.</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Pending', 'Accepted', 'Rejected'].map((status) => {
              // Calculate counts based on the current job filter
              const count = selectedJobFilter === 'All' 
                ? (status === 'All' ? companyApplications?.length || 0 : companyApplications?.filter(a => a.status === status).length || 0)
                : (status === 'All' 
                    ? companyApplications?.filter(a => a.job?.role === selectedJobFilter).length || 0 
                    : companyApplications?.filter(a => a.status === status && a.job?.role === selectedJobFilter).length || 0);

              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                    filterStatus === status 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {status}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterStatus === status ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Job Offer Dropdown Filter */}
          {uniqueJobs.length > 0 && (
            <div className="relative w-full md:w-64">
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
              >
                <option value="All">All Offers</option>
                {uniqueJobs.map((job, index) => (
                  <option key={index} value={job}>{job}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= APPLICANT LIST ================= */}
      <div className="flex flex-col gap-4">
        {filteredApplications?.length > 0 ? (
          filteredApplications.map((app) => (
            <div 
              key={app.id} 
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Applicant Info */}
              <div className="flex items-center gap-4 flex-grow min-w-0">
                <div 
                  className="cursor-pointer" 
                  onClick={(e) => { e.stopPropagation(); setPreviewUser(app.student); }}
                >
                  <UserAvatar user={app.student} />
                </div>
                <div className="min-w-0">
                  <h3 
                    onClick={(e) => { e.stopPropagation(); setPreviewUser(app.student); }}
                    className="text-lg font-bold text-slate-900 dark:text-white truncate hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors cursor-pointer inline-block"
                  >
                    {app.student?.firstName} {app.student?.lastName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate mb-1">
                    {app.job?.role || '—'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{app.student?.university}</span>
                    <span>•</span>
                    <span>Applied: {formatDate(app.dateApplied)}</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedApplicant(app)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Details
                  </button>
                  {getStatusBadge(app.status)}
                </div>

                <div className="flex items-center gap-2">
                  {/* Simplest Card Actions: Accept or Reject */}
                  {app.status !== 'Accepted' && (
                    <button 
                      onClick={(e) => requestStatusUpdate(e, app.id, 'Accepted')}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-emerald-500 text-slate-400 dark:text-slate-300 hover:text-white rounded-xl transition-colors tooltip-trigger"
                      title="Accept"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    </button>
                  )}
                  {app.status !== 'Rejected' && (
                    <button 
                      onClick={(e) => requestStatusUpdate(e, app.id, 'Rejected')}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-500 text-slate-400 dark:text-slate-300 hover:text-white rounded-xl transition-colors tooltip-trigger"
                      title="Reject"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                  {app.status !== 'Pending' && (
                    <button 
                      onClick={(e) => requestStatusUpdate(e, app.id, 'Pending')}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-amber-500 text-slate-400 dark:text-slate-300 hover:text-white rounded-xl transition-colors tooltip-trigger"
                      title="Revert to Pending"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">No applicants found</h3>
            <p className="text-slate-500 dark:text-slate-400">There are currently no students in the "{filterStatus}" stage.</p>
          </div>
        )}
      </div>

      {/* ================= STUDENT PROFILE MODAL ================= */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex items-start justify-between border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setPreviewUser(selectedApplicant.student)}
                  title="View Student Profile"
                >
                  <UserAvatar user={selectedApplicant.student} size="lg" />
                </div>
                <div>
                  <h2 
                    className="text-2xl font-black text-slate-900 dark:text-white cursor-pointer hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors"
                    onClick={() => setPreviewUser(selectedApplicant.student)}
                    title="View Student Profile"
                  >
                    {selectedApplicant.student?.firstName} {selectedApplicant.student?.lastName}
                  </h2>
                  <div className="mt-2">{getStatusBadge(selectedApplicant.status)}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApplicant(null)} 
                className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-full transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
              
              {/* Applied Offer Details */}
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p className="text-[10px] font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider">Offer Applied For</p>
                  </div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">{selectedApplicant.job?.role || '—'}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">University</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedApplicant.student?.university || '—'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Major</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedApplicant.student?.major || '—'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Applied On</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(selectedApplicant.dateApplied)}</p>
                </div>
              </div>

              {/* Resume Button */}
              <a 
                href={selectedApplicant.student?.resumeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-2xl transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                View Full Resume
              </a>

            </div>

            {/* Modal Actions (Bottom) */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={(e) => requestStatusUpdate(e, selectedApplicant.id, 'Rejected')}
                  disabled={selectedApplicant.status === 'Rejected'}
                  className="flex-1 py-3 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600 hover:border-red-200 dark:hover:border-red-500/30 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Candidate
                </button>
                <button 
                  onClick={(e) => requestStatusUpdate(e, selectedApplicant.id, 'Accepted')}
                  disabled={selectedApplicant.status === 'Accepted'}
                  className="flex-1 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept Candidate
                </button>
              </div>
              
              {selectedApplicant.status !== 'Pending' && (
                <button 
                  onClick={(e) => requestStatusUpdate(e, selectedApplicant.id, 'Pending')}
                  className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-500/10 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  Revert to Pending
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center p-8">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              confirmDialog.newStatus === 'Accepted' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' 
              : confirmDialog.newStatus === 'Rejected' ? 'bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400'
              : 'bg-amber-100 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400'
            }`}>
              {confirmDialog.newStatus === 'Accepted' ? (
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : confirmDialog.newStatus === 'Rejected' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              )}
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              You are about to mark this applicant as <strong className={
                confirmDialog.newStatus === 'Accepted' ? 'text-emerald-600 dark:text-emerald-400' 
                : confirmDialog.newStatus === 'Rejected' ? 'text-red-600 dark:text-red-400'
                : 'text-amber-600 dark:text-amber-400'
              }>{confirmDialog.newStatus}</strong>.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executeStatusUpdate}
                className={`flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-md ${
                  confirmDialog.newStatus === 'Accepted' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                  : confirmDialog.newStatus === 'Rejected' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                }`}
              >
                Yes, {confirmDialog.newStatus}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STUDENT PROFILE PREVIEW MODAL ================= */}
      {previewUser && (
        <AdminProfilePreviewModal 
          user={previewUser} 
          onClose={() => setPreviewUser(null)} 
        />
      )}

    </div>
  );
};

export default Applicants;
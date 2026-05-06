import React, { useState, useCallback } from 'react';
import { useStudent } from '../../../context/StudentContext';
import apiClient from '../../../api/apiClient';
import CompanyProfilePopup from './CompanyProfilePopup';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const resolveLogoSrc = (logo) => {
  if (!logo) return null;
  if (logo.startsWith('http') || logo.startsWith('data:')) return logo;
  if (logo.startsWith('avatars/')) return `${API_URL}/uploads/${logo}`;
  if (!logo.startsWith('/')) return `${API_URL}/${logo}`;
  return `${API_URL}${logo}`;
};

const GRAD_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

const CardAvatar = ({ name, logo, size = 'md' }) => {
  const [imgErr, setImgErr] = useState(false);
  const src = resolveLogoSrc(logo);
  const letter = name?.charAt(0)?.toUpperCase() || 'C';
  const grad = GRAD_COLORS[(name?.charCodeAt(0) || 0) % GRAD_COLORS.length];
  const dim = size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-12 h-12 text-xl';

  if (src && !imgErr) {
    return (
      <div className={`${dim} rounded-xl shrink-0 overflow-hidden bg-white dark:bg-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-600`}>
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center font-black text-white shrink-0 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-600`}>
      {letter}
    </div>
  );
};

const Tag = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
    {icon && <span className="opacity-70">{icon}</span>}{text}
  </span>
);

const BrowseOffers = () => {
  const { jobs, applyForJob, cancelApplication } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const s = searchTerm.toLowerCase();
    return (job.role?.toLowerCase().includes(s) || job.company?.toLowerCase().includes(s))
      && (locationFilter === 'All Locations' || job.location === locationFilter)
      && (typeFilter === 'All Types' || job.type === typeFilter);
  });

  const handleApplyClick = (job) => { setSelectedJob(job); setErrorMessage(''); setIsSuccess(false); setIsApplyModalOpen(true); };
  const handleCancelClick = (job) => { setSelectedJob(job); setIsCancelModalOpen(true); };

  const confirmApplication = async () => {
    if (!selectedJob) return;
    const result = await applyForJob(selectedJob.id);
    if (result.success) { setIsSuccess(true); setTimeout(() => { setIsApplyModalOpen(false); setSelectedJob(null); }, 2000); }
    else setErrorMessage(result.message || 'Something went wrong.');
  };

  const confirmCancel = async () => {
    if (!selectedJob) return;
    const result = await cancelApplication(selectedJob.id);
    if (result.success) { setIsCancelModalOpen(false); setSelectedJob(null); }
  };

  const handleCompanyClick = useCallback(async (job) => {
    setLoadingCompany(true);
    setCompanyProfile({ companyName: job.company, avatar: job.logo, _loading: true });
    try {
      if (job.companyId) {
        const { data } = await apiClient.get(`/api/users/company/${job.companyId}`);
        setCompanyProfile(data.data.company);
      } else {
        setCompanyProfile({ companyName: job.company, location: job.location, avatar: job.logo });
      }
    } catch {
      setCompanyProfile({ companyName: job.company, location: job.location, avatar: job.logo });
    } finally {
      setLoadingCompany(false);
    }
  }, []);

  const closeCompany = () => { setCompanyProfile(null); setLoadingCompany(false); };

  return (
    <div className="space-y-8 relative font-sans">

      {/* ── Header / Search ── */}
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 items-end justify-between">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Find your next internship</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">Discover opportunities from top companies in Algeria.</p>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by role or company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm font-medium rounded-xl px-4 py-3 focus:outline-none cursor-pointer">
            <option>All Locations</option><option>Algiers</option><option>Oran</option><option>Constantine</option><option>Remote</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm font-medium rounded-xl px-4 py-3 focus:outline-none cursor-pointer">
            <option>All Types</option><option>On-site</option><option>Hybrid</option><option>Remote</option><option>Internship</option>
          </select>
        </div>
      </div>

      {/* ── Job Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.length > 0 ? filteredJobs.map(job => (
          <div
            key={job.id}
            className="relative group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
          >
            {/* ── Status badge – absolute top-right ── */}
            {job.hasApplied ? (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 z-10">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg>
                Applied
              </span>
            ) : (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                Accepting
              </span>
            )}
            {/* ── Card body ── */}
            <div className="px-5 pb-5 pt-[41px] flex-grow flex flex-col gap-4">

              {/* Row 1: Logo + Company name */}
              <div className="flex items-center gap-3">
                <CardAvatar name={job.company} logo={job.logo} size="lg" />
                <div className="min-w-0">
                  <button
                    onClick={() => handleCompanyClick(job)}
                    className="text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words block text-left leading-tight w-full"
                  >
                    {job.company}
                  </button>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-none">Company</p>
                </div>
              </div>

              {/* Row 2: Job title */}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-1">
                {job.role}
              </h2>

              {/* Row 3: Tag pills */}
              <div className="flex flex-wrap gap-1.5">
                <Tag icon="📍" text={job.location} />
                <Tag icon="💼" text={job.type} />
                {job.duration && <Tag icon="⏱" text={job.duration} />}
                {job.deadline && <Tag icon="⏳" text={job.deadline} />}
              </div>
            </div>

            {/* ── Divider + Action bar ── */}
            <div className="border-t border-slate-100 dark:border-slate-700/70 px-5 py-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {job.posted ? `Posted ${job.posted}` : 'Recently posted'}
              </span>

              {job.hasApplied ? (
                <button
                  onClick={() => handleCancelClick(job)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  Withdraw
                </button>
              ) : (
                <button
                  onClick={() => handleApplyClick(job)}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-colors"
                >
                  View &amp; Apply
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No internships found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setLocationFilter('All Locations'); setTypeFilter('All Types'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Apply Modal ── */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <CardAvatar name={selectedJob.company} logo={selectedJob.logo} />
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedJob.role}</h2>
                  <button onClick={() => { setIsApplyModalOpen(false); handleCompanyClick(selectedJob); }}
                    className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">{selectedJob.company}</button>
                </div>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!isSuccess ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Tag emoji="📍" text={selectedJob.location} />
                    <Tag emoji="💼" text={selectedJob.type} />
                    {selectedJob.duration && <Tag emoji="⏱️" text={selectedJob.duration} />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700 whitespace-pre-wrap">
                      {selectedJob.description || 'No description provided.'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Requirements</p>
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700 whitespace-pre-wrap">
                      {selectedJob.requirements || 'No requirements specified.'}
                    </div>
                  </div>
                  {errorMessage && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100">{errorMessage}</div>}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Application Sent!</h2>
                  <p className="text-slate-500 text-sm">Sent to <strong>{selectedJob.company}</strong>. Good luck!</p>
                </div>
              )}
            </div>

            {!isSuccess && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-800">
                <p className="text-xs text-slate-400 hidden sm:block">Your <span className="font-bold text-slate-600 dark:text-slate-300">profile & CV</span> will be sent.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsApplyModalOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                  <button onClick={confirmApplication} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
                    Submit <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Withdraw Modal ── */}
      {isCancelModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Withdraw Application?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will remove your application for <strong className="text-slate-700 dark:text-slate-200">{selectedJob.company}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Keep It</button>
              <button onClick={confirmCancel} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md">Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Company Profile Popup ── */}
      <CompanyProfilePopup company={companyProfile} loading={loadingCompany} onClose={closeCompany} />
    </div>
  );
};

export default BrowseOffers;
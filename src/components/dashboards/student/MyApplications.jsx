import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GRAD_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

// Resolve logo URL (same logic as BrowseOffers)
const resolveLogoSrc = (logo) => {
  if (!logo) return null;
  if (logo.startsWith('http') || logo.startsWith('data:')) return logo;
  if (logo.startsWith('avatars/')) return `${API_URL}/uploads/${logo}`;
  if (!logo.startsWith('/')) return `${API_URL}/${logo}`;
  return `${API_URL}${logo}`;
};

const JobAvatar = ({ name, logo, size = 'md' }) => {
  const [imgErr, setImgErr] = useState(false);
  const src = resolveLogoSrc(logo);
  const letter = name?.charAt(0)?.toUpperCase() || 'C';
  const grad = GRAD_COLORS[(name?.charCodeAt(0) || 0) % GRAD_COLORS.length];
  const dim = size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-11 h-11 text-lg';

  if (src && !imgErr) {
    return (
      <div className={`${dim} rounded-xl shrink-0 overflow-hidden bg-white dark:bg-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-600`}>
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center font-black text-white shrink-0 shadow-sm`}>
      {letter}
    </div>
  );
};

// Format ISO date → "May 3, 2026"
const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
};

const StatusBadge = ({ status }) => {
  const config = {
    Pending:       { cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',   icon: '⏳' },
    'Under Review':{ cls: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',         icon: '🔍' },
    Interview:     { cls: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20', icon: '📅' },
    Accepted:      { cls: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', icon: '✅' },
    Rejected:      { cls: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',               icon: '❌' },
  };
  const { cls, icon } = config[status] || config.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span>{icon}</span>{status}
    </span>
  );
};

// ── View Details Modal ────────────────────────────────────────────────────────
const JobDetailModal = ({ app, onClose }) => {
  if (!app) return null;
  const job = app.job || {};

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-start gap-4">
          <JobAvatar name={job.company} logo={job.logo} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{job.role}</h2>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{job.company}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.location && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-0.5 rounded-full">
                  📍 {job.location}
                </span>
              )}
              {job.type && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-0.5 rounded-full">
                  💼 {job.type}
                </span>
              )}
              {job.duration && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-0.5 rounded-full">
                  ⏱ {job.duration}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Application status */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/40 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Application status</span>
            <StatusBadge status={app.status} />
          </div>

          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/40 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Date applied</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatDate(app.dateApplied)}</span>
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Requirements</p>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl whitespace-pre-wrap">
                {job.requirements}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyApplications = () => {
  const { myApplications } = useStudent();
  const [filter, setFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = filter === 'All'
    ? myApplications
    : myApplications.filter(app => app.status === filter);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage the status of your internship applications.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', 'Pending', 'Under Review', 'Interview', 'Accepted', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Company &amp; Role</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredApps.length > 0 ? filteredApps.map((app) => {
                const job = app.job || {};
                return (
                  <tr key={app.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors group">

                    {/* Company & Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <JobAvatar name={job.company} logo={job.logo} />
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.role || '—'}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {job.company || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {job.location ? (
                          <>
                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </>
                        ) : '—'}
                      </div>
                    </td>

                    {/* Date Applied */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {formatDate(app.dateApplied)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50/60 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-slate-700">
                      <svg className="w-7 h-7 text-slate-300 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No applications found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {filter !== 'All' ? `No ${filter.toLowerCase()} applications.` : "You haven't applied to any internships yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredApps.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-700/30">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-700 dark:text-slate-200">{filteredApps.length}</span> result{filteredApps.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button disabled className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-400 bg-white dark:bg-slate-800 cursor-not-allowed">Previous</button>
              <button disabled className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-400 bg-white dark:bg-slate-800 cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedApp && <JobDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
    </div>
  );
};

export default MyApplications;
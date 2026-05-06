import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const resolveAvatar = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  if (avatar.startsWith('avatars/')) return `${API_URL}/uploads/${avatar}`;
  if (!avatar.startsWith('/')) return `${API_URL}/${avatar}`;
  return `${API_URL}${avatar}`;
};

const InfoRow = ({ icon, label, value, isLink }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0 text-slate-500 dark:text-slate-400">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate block">{value}</a>
      ) : (
        <p className="text-sm font-medium text-slate-900 dark:text-white">{value || 'N/A'}</p>
      )}
    </div>
  </div>
);

const CompanyProfilePopup = ({ company, loading, onClose }) => {
  if (!company && !loading) return null;

  const avatarSrc = resolveAvatar(company?.avatar);
  const letter = company?.companyName?.charAt(0)?.toUpperCase() || 'C';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient Banner — avatar sits half inside, half outside at the bottom */}
        <div className="h-32 bg-gradient-to-r from-[#2563EB] to-indigo-600 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Avatar anchored to banner bottom — half overlaps white body */}
          <div className="absolute bottom-0 left-7 translate-y-1/2">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg border border-slate-100 dark:border-slate-700">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={company?.companyName}
                  className="w-full h-full object-cover rounded-full"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.querySelector('.fallback-letter').style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="fallback-letter w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center font-bold text-white text-2xl"
                style={{ display: avatarSrc ? 'none' : 'flex' }}
              >
                {letter}
              </div>
            </div>
          </div>
        </div>

        <div className="px-7 pb-7">
          {/* Space for avatar overlap + verified badge row */}
          <div className="flex items-start justify-end mb-5" style={{ paddingTop: '2.75rem' }}>
            {company?.verificationStatus === 'approved' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Verified
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : company && (
            <>
              {/* Name & Industry */}
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{company.companyName}</h2>
              {company.industry && (
                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">{company.industry}</p>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {company.location && (
                  <InfoRow
                    label="Location"
                    value={company.location}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  />
                )}
                {company.size && (
                  <InfoRow
                    label="Company Size"
                    value={`${company.size} Employees`}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  />
                )}
                {company.website && (
                  <InfoRow
                    label="Website"
                    value={company.website}
                    isLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                  />
                )}
              </div>

              {/* About */}
              {company.about && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">About {company.companyName}</h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {company.about}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePopup;

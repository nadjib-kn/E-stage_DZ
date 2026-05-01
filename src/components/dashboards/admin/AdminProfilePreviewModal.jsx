import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminProfilePreviewModal = ({ user, onClose }) => {
  if (!user) return null;

  // Resolve avatar URL
  const resolveAvatar = (avatarUrl) => {
    if (!avatarUrl) {
      if (user.role === 'student') {
        return `https://api.dicebear.com/8.x/initials/svg?seed=${user.firstName || 'Student'}`;
      } else {
        return `https://api.dicebear.com/7.x/identicon/svg?seed=${user.companyName || 'Company'}&backgroundColor=ffffff`;
      }
    }
    if (avatarUrl.startsWith('http') || avatarUrl.startsWith('data:')) {
      return avatarUrl;
    }
    return `${API_URL}${avatarUrl}`;
  };

  // Safe parse skills
  const getSkills = () => {
    if (!user.skills) return [];
    if (Array.isArray(user.skills)) return user.skills;
    try {
      return JSON.parse(user.skills);
    } catch {
      return [];
    }
  };

  const skills = getSkills();
  const avatarImage = resolveAvatar(user.avatar);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Profile Preview</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-0 pb-10">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-[#2563EB] to-indigo-600 w-full"></div>
          
          <div className="px-8 pb-8">
            <div className="-mt-12 flex justify-between items-end mb-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 p-1 rounded-full shadow-md border border-slate-100 dark:border-slate-700 shrink-0">
                <img src={avatarImage} alt="Profile" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border
                ${user.role === 'student' 
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 border-blue-100 dark:border-blue-500/20' 
                  : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'}
              `}>
                {user.role === 'student' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Student Profile
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    Company Profile
                  </>
                )}
              </span>
            </div>

            {/* Main Header Info */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {user.role === 'student' ? `${user.firstName} ${user.lastName}` : user.companyName}
              </h2>
              <p className="text-[#2563EB] dark:text-blue-400 font-bold text-sm mt-1">
                {user.role === 'student' 
                  ? `${user.major || 'Major not specified'} at ${user.university || 'University not specified'}`
                  : user.industry || 'Industry not specified'
                }
              </p>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Email</p>
                    <a href={`mailto:${user.email}`} className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline">
                      {user.email}
                    </a>
                  </div>
                </div>

                {user.role === 'student' && (
                  <>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Phone</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Graduation Year</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.graduationYear || 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}

                {user.role === 'company' && (
                  <>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Location</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.location || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Company Size</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.size ? `${user.size} Employees` : 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <div className="truncate w-full">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      {user.role === 'student' ? 'Portfolio / Website' : 'Official Website'}
                    </p>
                    <a href={user.role === 'student' ? user.portfolioUrl : user.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline truncate block">
                      {(user.role === 'student' ? user.portfolioUrl : user.website) || 'N/A'}
                    </a>
                  </div>
                </div>

                {user.role === 'student' && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                    </div>
                    <div className="truncate w-full">
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">GitHub</p>
                      <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline truncate block">
                        {user.githubUrl || 'N/A'}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role-Specific Content */}
            {user.role === 'student' ? (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? skills.map((skill, index) => (
                      <span key={index} className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold">
                        {skill}
                      </span>
                    )) : <span className="text-sm text-slate-400 italic">No skills added.</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Resume / CV</h3>
                  {user.resumeUrl ? (
                    <a href={`${API_URL}${user.resumeUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] transition-colors truncate">View Resume Document</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide font-medium">Click to open PDF</p>
                      </div>
                    </a>
                  ) : (
                    <div className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No resume uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">About {user.companyName}</h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {user.about ? user.about : <span className="italic text-slate-400 dark:text-slate-500">No company description provided yet.</span>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePreviewModal;

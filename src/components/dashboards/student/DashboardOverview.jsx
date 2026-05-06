import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useStudent } from '../../../context/StudentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const renderAppLogo = (app, roundedClass = 'rounded-xl') => {
  const companyName = app.job?.company || app.company || 'Company';
  const avatar = app.job?.logo || app.logo;
  const fallback = avatar || companyName.charAt(0)?.toUpperCase() || '🏢';
  
  if (typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('uploads/') || avatar.startsWith('avatars/') || avatar.startsWith('/'))) {
    let src = avatar;
    if (!src.startsWith('http')) {
      if (src.startsWith('avatars/')) src = `/uploads/${src}`;
      else if (!src.startsWith('/')) src = `/${src}`;
      src = `${API_URL}${src}`;
    }
    return <img src={src} alt={companyName} className={`w-full h-full object-cover ${roundedClass}`} />;
  }
  return fallback;
};

const DashboardOverview = () => {
  // 1. Pull data from our contexts
  const { currentUser } = useAuth();
  const { myApplications } = useStudent();

  // 2. Calculate dynamic stats
  const totalApplications = myApplications?.length || 0;
  const pendingApplications = myApplications?.filter(app => app.status === 'Pending').length || 0;
  const acceptedApplications = myApplications?.filter(app => app.status === 'Accepted').length || 0;
  
  // 3. Get the 3 most recent applications
  const recentApplications = myApplications ? [...myApplications].reverse().slice(0, 3) : [];

  // Helper to ensure skills is correctly parsed
  const parseSkills = (skills) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
      try { return JSON.parse(skills); } catch (e) { return []; }
    }
    return [];
  };

  // --- NEW: Profile Strength Calculation ---
  const calculateProfileStrength = () => {
    // If no user is loaded yet, return 0
    if (!currentUser) return { percentage: 0, checklist: [] };
    
    const parsedSkills = parseSkills(currentUser.skills);

    // Define the criteria for a "complete" profile based on your MyProfile state
    const checklist = [
      {
        id: 'basic',
        label: 'Basic Information',
        completed: Boolean(currentUser.firstName && currentUser.lastName && currentUser.phone)
      },
      {
        id: 'academic',
        label: 'Academic Details',
        completed: Boolean(currentUser.university && currentUser.major && currentUser.graduationYear)
      },
      {
        id: 'resume',
        label: 'Resume Uploaded',
        completed: Boolean(currentUser.resumeUrl || currentUser.resumeName)
      },
      {
        id: 'skills',
        label: 'Skills Added',
        completed: Boolean(parsedSkills.length > 0)
      },
      {
        id: 'links',
        label: 'Portfolio or GitHub',
        completed: Boolean(currentUser.portfolioUrl || currentUser.githubUrl)
      }
    ];

    const completedItems = checklist.filter(item => item.completed).length;
    const percentage = Math.round((completedItems / checklist.length) * 100);

    return { percentage, checklist };
  };

  const { percentage, checklist } = calculateProfileStrength();

  // Status Badge Helper
  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-600 border-amber-200",
      Accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
      Rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* --- 1. Welcome Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#2563EB] to-[#14B8A6] p-8 rounded-3xl text-white shadow-lg shadow-blue-500/20">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Welcome back, {currentUser?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-white/80 font-medium">Here is what is happening with your internship applications today.</p>
        </div>
        <Link to="/student/browse" className="mt-4 md:mt-0 bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap">
          Find New Offers
        </Link>
      </div>

      {/* --- 2. Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-[#2563EB]/30 dark:hover:border-blue-500/50 transition-colors">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Total Applications</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalApplications}</h3>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-amber-400/30 dark:hover:border-amber-500/50 transition-colors">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Pending Reviews</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{pendingApplications}</h3>
          </div>
        </div>

        {/* Accepted Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-emerald-400/30 dark:hover:border-emerald-500/50 transition-colors">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Accepted Offers</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{acceptedApplications}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* --- 3. Recent Applications List --- */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Applications</h2>
            <Link to="/student/applications" className="text-[#2563EB] dark:text-blue-400 hover:text-[#1d4ed8] dark:hover:text-blue-300 text-sm font-bold transition-colors">View All</Link>
          </div>

          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${app.logoColor || 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                      {renderAppLogo(app, 'rounded-xl')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">{app.job?.role || '—'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{app.job?.company || 'Company'} • Applied {formatDate(app.dateApplied)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={app.status} />
                    <button className="text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 p-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">You haven't applied to any internships yet.</p>
                <Link to="/student/browse" className="text-[#2563EB] dark:text-blue-400 font-bold text-sm mt-2 inline-block hover:underline">Start browsing</Link>
              </div>
            )}
          </div>
        </div>

        {/* --- 4. Profile Completion Widget --- */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Profile Strength</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">A complete profile increases your chances of getting hired.</p>
            
            {/* Dynamic Progress Circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* Background Circle */}
                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                {/* Progress Circle - strokeDasharray matches the percentage exactly! */}
                <path 
                  className="text-[#2563EB] transition-all duration-1000 ease-out" 
                  strokeDasharray={`${percentage}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{percentage}%</span>
              </div>
            </div>

            {/* Dynamic Checklist */}
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item.id} className={`flex items-center gap-3 text-sm font-medium ${item.completed ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.completed ? (
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0"></div>
                  )}
                  <span className="truncate">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/student/profile" className="w-full block text-center mt-6 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#2563EB] dark:text-blue-400 py-3 rounded-xl text-sm font-bold transition-colors">
            {percentage === 100 ? 'Edit Profile' : 'Complete Profile'}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
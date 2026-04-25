import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const MyProfile = () => {
  const { currentUser, updateUser } = useAuth();
  
  // States
  const [isSaved, setIsSaved] = useState(false);
  const [isPreview, setIsPreview] = useState(false); 
  const [newSkill, setNewSkill] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    portfolioUrl: currentUser?.portfolioUrl || '',
    githubUrl: currentUser?.githubUrl || '',
    university: currentUser?.university || '',
    major: currentUser?.major || '',
    graduationYear: currentUser?.graduationYear || '',
    skills: currentUser?.skills || [],
    avatar: currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default&backgroundColor=e2e8f0",
    resumeUrl: currentUser?.resumeUrl || '',
    resumeName: currentUser?.resumeName || (currentUser?.resumeUrl ? 'My_Resume.pdf' : ''),
  });

  // Hidden File Inputs
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        ...currentUser,
        skills: currentUser.skills || prev.skills,
        resumeName: currentUser.resumeName || prev.resumeName
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateUser) {
      updateUser(formData); 
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, avatar: URL.createObjectURL(file) });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ 
        ...formData, 
        resumeName: file.name,
        resumeUrl: URL.createObjectURL(file) 
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // --------------------------------------------------------------------------
  // RENDER: EMPLOYER PREVIEW MODE
  // --------------------------------------------------------------------------
  if (isPreview) {
    return (
      <div className="max-w-4xl animate-in fade-in duration-300 pb-10">
        
        {/* Header Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Employer View</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">This is how your profile appears to recruiters.</p>
          </div>
          <button 
            onClick={() => setIsPreview(false)}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Edit
          </button>
        </div>

        {/* Read-Only Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-[#2563EB] to-indigo-600 w-full"></div>
          
          <div className="px-8 pb-8">
            <div className="-mt-12 flex justify-between items-end mb-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 p-1 rounded-full shadow-md border border-slate-100 dark:border-slate-700 shrink-0">
                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-100 dark:border-blue-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Student Profile
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{formData.firstName} {formData.lastName}</h2>
              <p className="text-[#2563EB] dark:text-blue-400 font-bold text-sm mt-1">{formData.major || 'Major not specified'} at {formData.university || 'University not specified'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Info Grid Left */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Email</p>
                    <a href={`mailto:${currentUser?.email}`} className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline">
                      {currentUser?.email || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Phone</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.phone || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Graduation Year</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.graduationYear || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Info Grid Right */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Portfolio</p>
                    <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline truncate block">
                      {formData.portfolioUrl || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">GitHub</p>
                    <a href={formData.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline truncate block">
                      {formData.githubUrl || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Resume Section */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? formData.skills.map((skill, index) => (
                    <span key={index} className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold">
                      {skill}
                    </span>
                  )) : <span className="text-sm text-slate-400 italic">No skills added.</span>}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Attached Document</h3>
                {formData.resumeUrl ? (
                  <a 
                    href={formData.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="border border-slate-200 dark:border-slate-600 rounded-2xl p-4 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between group hover:border-[#2563EB]/40 dark:hover:border-blue-500/40 hover:bg-blue-50/30 dark:hover:bg-blue-500/10 transition-all cursor-pointer block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100/60 text-red-500 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">{formData.resumeName || 'Resume.pdf'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Click to view document</p>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="border border-slate-100 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800 flex items-center gap-3 opacity-70">
                    <div className="w-12 h-12 bg-slate-200/50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No CV attached</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: EDIT MODE (Default)
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-4xl animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Update your personal details, academic information, and resume.</p>
        </div>
        <div className="flex items-center gap-4">
          {isSaved && (
            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
              ✅ Saved!
            </span>
          )}
          <button 
            onClick={() => setIsPreview(true)}
            className="px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-blue-100 dark:border-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview as Company
          </button>
        </div>
      </div>

      {/* Identity Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-5">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <div 
            onClick={triggerFileInput}
            className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-800 relative group cursor-pointer overflow-hidden shadow-sm"
          >
            <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{formData.firstName || 'Student'} {formData.lastName || 'Name'}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{formData.major || 'No major specified'}</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* General Information Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={currentUser?.email || ''} 
                  disabled
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+213 XX XX XX XX"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Portfolio Website</label>
                <input 
                  type="url" 
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-[#2563EB] dark:text-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">GitHub Profile</label>
                <input 
                  type="url" 
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-[#2563EB] dark:text-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Background Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Background</h3>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">University / Institute</label>
                <input 
                  type="text" 
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Graduation Year</label>
                <input 
                  type="text" 
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2025"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Major / Field of Study</label>
                <input 
                  type="text" 
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science - Software Engineering"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documents & Skills Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documents & Skills</h3>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Your Resume (CV)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white dark:bg-slate-800 text-red-500 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formData.resumeName || 'No resume uploaded'}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Upload a PDF version of your latest CV</p>
                  </div>
                </div>
                <input type="file" accept=".pdf" ref={pdfInputRef} onChange={handlePdfUpload} className="hidden" />
                <button 
                  type="button" 
                  onClick={() => pdfInputRef.current.click()} 
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto shadow-sm"
                >
                  {formData.resumeName ? 'Replace Document' : 'Upload File'}
                </button>
              </div>
            </div>

            {/* Skills Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Top Skills</label>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g. React.js, Python, Figma..."
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                />
                <button 
                  type="button" 
                  onClick={handleAddSkill} 
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto"
                >
                  Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[#2563EB] dark:text-blue-400 rounded-lg text-sm font-bold flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-blue-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <span className="text-sm text-slate-400 font-medium italic py-2">No skills added yet.</span>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 border-t border-slate-50 dark:border-slate-700 gap-4">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Click your profile picture above to change your avatar.
              </p>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';

const CompanyProfile = () => {
  // Pull our user data and the updateUser function from context
  const { currentUser, updateUser } = useAuth();
  
  // Reference for our hidden file input
  const fileInputRef = useRef(null);
  
  // States
  const [isSaved, setIsSaved] = useState(false);
  const [isPreview, setIsPreview] = useState(false); // New state to toggle student preview

  // Local state to hold the form data, defaulting to current user data
  const [formData, setFormData] = useState({
    companyName: currentUser?.companyName || 'TechCorp DZ',
    industry: currentUser?.industry || 'Software Development',
    website: currentUser?.website || 'https://www.techcorp.dz',
    location: currentUser?.location || 'Algiers, Bab Ezzouar',
    size: currentUser?.size || '10-50',
    email: currentUser?.email || 'hr@techcorp.dz',
    about: currentUser?.about || '',
    avatar: currentUser?.avatar || "https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp&backgroundColor=ffffff"
  });

  // Handle standard text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle the profile photo upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // FIX: Revoke the old blob URL to prevent memory leak
      if (formData.avatar && formData.avatar.startsWith('blob:')) {
        URL.revokeObjectURL(formData.avatar);
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: imageUrl
      }));
    }
  };

  // Trigger the hidden file input when clicking the avatar circle
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle Save
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (updateUser) {
      updateUser({
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        location: formData.location,
        size: formData.size,
        email: formData.email,
        about: formData.about,
        avatar: formData.avatar,
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER: STUDENT PREVIEW MODE
  // --------------------------------------------------------------------------
  if (isPreview) {
    return (
      <div className="max-w-4xl animate-in fade-in duration-300 pb-10">
        {/* Header Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student View</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">This is how students see your profile.</p>
          </div>
          <button 
            onClick={() => setIsPreview(false)}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
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
                <img src={formData.avatar} alt="Company Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                Verified Business
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{formData.companyName}</h2>
              <p className="text-[#2563EB] dark:text-blue-400 font-bold text-sm mt-1">{formData.industry || 'Industry not specified'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Info Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Location</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.location || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Company Size</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formData.size ? `${formData.size} Employees` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Website</p>
                    <a href={formData.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline">
                      {formData.website || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Contact Email</p>
                    <a href={`mailto:${formData.email}`} className="text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline">
                      {formData.email || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">About {formData.companyName}</h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {formData.about ? formData.about : <span className="italic text-slate-400 dark:text-slate-500">No company description provided yet.</span>}
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
    <div className="max-w-4xl animate-in fade-in duration-300 pb-10 p-5">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Company Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Update your business information so students can learn about you.</p>
        </div>
        <div className="flex items-center gap-4">
          {isSaved && (
            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
              ✅ Saved!
            </span>
          )}
          <button 
            onClick={() => setIsPreview(true)}
            className="px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-blue-100 dark:border-blue-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview as Student
          </button>
        </div>
      </div>

      {/* Identity & Branding Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-5">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div 
            onClick={triggerFileInput}
            className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-800 relative group cursor-pointer overflow-hidden shadow-sm"
          >
            <img src={formData.avatar} alt="Company Logo" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{formData.companyName}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{formData.industry || 'Industry missing'}</p>
                    {currentUser?.verificationStatus === 'approved' && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-100 dark:border-emerald-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            Verified Business
          </span>
        )}
          </div>
        </div>
      </div>

      {/* General Information Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">General Information</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Company Name</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Official Website</label>
              <input 
                type="url" 
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Industry/Domain</label>
              {/* Changed from select to free-text input */}
              <input 
                type="text" 
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Software Development, AI, Logistics"
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Headquarters Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Company Size</label>
              {/* Changed from select to free-text input */}
              <input 
                type="text" 
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 50-200, Over 1000, 1-10"
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Contact Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">About the Company (Culture & Mission)</label>
            <textarea 
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your company's vision, history, and what it's like to work with you..."
              className="w-full p-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-y"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 border-t border-slate-50 dark:border-slate-700 gap-4">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Click the logo image above to change your profile picture.
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
        </form>
      </div>

    </div>
  );
};

export default CompanyProfile;
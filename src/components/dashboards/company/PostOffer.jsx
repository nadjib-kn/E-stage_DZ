import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyData } from '../../../context/CompanyDataContext';

const PostOffer = () => {
  const { createNewOffer } = useCompanyData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    type: 'Internship',
    location: '',
    duration: '',
    description: '',
    requirements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modified to accept a target status ('Active' or 'Draft')
  const handleSubmit = (e, targetStatus) => {
    e.preventDefault();
    
    // Check required fields (basic validation)
    if (!formData.role || !formData.location || !formData.duration) {
      alert("Please fill in all required fields (Role, Location, Duration).");
      return;
    }
    
    // Pass ALL data including description and explicit status
    createNewOffer({
      ...formData,
      status: targetStatus
    });

    navigate('/company/offers');
  };

  return (
    <div className="p-5 max-w-5xl mx-auto font-sans">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Post a New Offer</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Fill out the details below to attract top student talent for your open roles.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
        {/* Removed onSubmit from form, handled by buttons instead */}
        <form className="space-y-6">
          
          <div>
            <label htmlFor="role" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Role / Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              id="role"
              name="role"
              required
              placeholder="e.g., Frontend Developer Intern"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
              <select 
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              >
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="location"
                name="location"
                required
                placeholder="e.g., Algiers, Remote"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="duration"
                name="duration"
                required
                placeholder="e.g., 3 Months"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
            <textarea 
              id="description"
              name="description"
              rows="4"
              placeholder="Describe the day-to-day responsibilities..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requirements / Skills</label>
            <textarea 
              id="requirements"
              name="requirements"
              rows="3"
              placeholder="e.g., React, Node.js, strong communication..."
              value={formData.requirements}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex flex-wrap justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/company/offers')}
              className="px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'Draft')}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
            >
              Save as Draft
            </button>
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'Active')}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-xl font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5"
            >
              Publish Offer
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default PostOffer;
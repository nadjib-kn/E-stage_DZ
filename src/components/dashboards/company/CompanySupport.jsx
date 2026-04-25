import React, { useState } from 'react';

const CompanySupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this will send a POST request to your backend
    alert('Message sent! Our admin team will contact you shortly.');
    setFormData({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* 1. Page Header */}
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Company Support</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Need assistance with your job postings or account? Send us a message.</p>
        </div>
      </div>

      {/* 2. Clean Support Form */}
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] outline-none transition-all text-sm font-medium text-slate-900 dark:text-white"
              placeholder="What is this regarding?"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea 
              required
              rows="6"
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] outline-none transition-all resize-none text-sm font-medium text-slate-900 dark:text-white"
              placeholder="Describe your issue or question in detail..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              Prefer email? <a href="mailto:support@estagedz.com" className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline">support@estagedz.com</a>
            </span>
            <button 
              type="submit" 
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 whitespace-nowrap"
            >
              Submit Request
            </button>
          </div>
          
        </form>
      </div>

    </div>
  );
};

export default CompanySupport;
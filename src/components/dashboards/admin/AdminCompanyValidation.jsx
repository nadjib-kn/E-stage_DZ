import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const AdminCompanyValidation = () => {
  const { allUsers, updateCompanyStatus } = useAdmin();
  
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for feedback and confirmation
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: '', company: null });

  // Fallback data
  const defaultCompanies = [
    { id: "comp_techminds", companyName: "TechMinds Solutions", email: "contact@techminds.dz", verificationStatus: "pending", industry: "Software Development", logo: "T" },
    { id: "comp_yassir", companyName: "Yassir", email: "hr@yassir.dz", verificationStatus: "approved", industry: "Technology", logo: "Y" },
    { id: "comp_scam", companyName: "CryptoDZ Investment", email: "fake@crypto-dz.com", verificationStatus: "rejected", industry: "Finance", logo: "C" }
  ];

  const companies = allUsers?.filter(u => u.role === 'company') || defaultCompanies;

  const filteredCompanies = companies.filter(company => {
    const matchesFilter = company.verificationStatus === filter;
    const matchesSearch = company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          company.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const showToast = (message, type = 'success') => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Modal instead of window.confirm
  const openConfirmation = (action, company) => {
    setConfirmModal({ isOpen: true, action, company });
  };

  // Execute action when user clicks "Confirm" in the modal
  const executeAction = () => {
    const { action, company } = confirmModal;
    
    if (action === 'approve') {
      if (updateCompanyStatus) updateCompanyStatus(company.id, 'approved');
      showToast(`${company.companyName} has been successfully approved.`);
    } else if (action === 'reject') {
      if (updateCompanyStatus) updateCompanyStatus(company.id, 'rejected');
      showToast(`${company.companyName} has been rejected.`, "error");
    }
    
    // Close modal
    setConfirmModal({ isOpen: false, action: '', company: null });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8 relative">
      
      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-xl text-white text-sm font-bold animate-in slide-in-from-bottom-5 z-50 flex items-center gap-3 ${toastMessage.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toastMessage.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {toastMessage.text}
        </div>
      )}

      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmModal.isOpen && confirmModal.company && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${confirmModal.action === 'approve' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
              {confirmModal.action === 'approve' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {confirmModal.action === 'approve' ? 'Approve Company?' : 'Reject Company?'}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              {confirmModal.action === 'approve' 
                ? `Are you sure you want to approve ` 
                : `Are you sure you want to reject `}
              <span className="font-bold text-slate-700 dark:text-slate-300">{confirmModal.company.companyName}</span>?
              {confirmModal.action === 'approve' 
                ? " They will immediately be granted access to log in and post internship opportunities." 
                : " They will be restricted from accessing the platform and posting jobs."}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, action: '', company: null })}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                className={`flex-1 px-4 py-3 text-white text-sm font-bold rounded-xl transition-colors shadow-sm ${
                  confirmModal.action === 'approve' 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Yes, {confirmModal.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HEADER & SEARCH ================= */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Company Validation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Verify company identities to ensure platform security and prevent fraud.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search by company name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            filter === 'pending' ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Pending Review
          {companies.filter(c => c.verificationStatus === 'pending').length > 0 && (
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 py-0.5 px-2 rounded-full text-xs">
              {companies.filter(c => c.verificationStatus === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'approved' ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'rejected' ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* ================= COMPANY LIST ================= */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-6 lg:items-center justify-between hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300">
              
              {/* Left: Company Identity */}
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex flex-shrink-0 items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-lg">
                  {company.logo || company.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{company.companyName}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{company.industry || "Unknown Industry"}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{company.email}</p>
                </div>
              </div>

              {/* Middle: Manual Verification Email View */}
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl flex-1 border border-slate-100 dark:border-slate-600 flex flex-col justify-center items-start">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Manual Verification</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Contact the company to verify their identity before making a decision.</p>
                <a 
                  href={`mailto:${company.email}?subject=E-Stage DZ - Account Verification Required&body=Hello ${company.companyName} team,%0D%0A%0D%0AWe are currently reviewing your registration on E-Stage DZ. To complete the approval process, please reply to this email to verify your business identity.%0D%0A%0D%0AThank you,%0D%0AE-Stage DZ Admin Team`}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email Company to Verify
                </a>
              </div>

              {/* Right: Actions & Status */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-center lg:w-48 gap-3">
                {filter === 'pending' ? (
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button 
                      onClick={() => openConfirmation('approve', company)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => openConfirmation('reject', company)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className={`px-4 py-1.5 text-sm font-bold rounded-full border capitalize
                    ${company.verificationStatus === 'approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'}
                  `}>
                    {company.verificationStatus}
                  </span>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors duration-300">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">All caught up!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">There are no companies with a "{filter}" status matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCompanyValidation;
import React, { useState } from 'react';
import { useAdmin } from "../../../context/AdminContext";
import AdminProfilePreviewModal from './AdminProfilePreviewModal';

const AdminManageUsers = () => {
  // Added suspendUser and restoreUser from context
  const { allUsers, deleteUser, suspendUser, restoreUser } = useAdmin(); 
  const [filter, setFilter] = useState('all'); // 'all', 'student', 'company'
  const [searchQuery, setSearchQuery] = useState('');
  
  // New state for our custom action modal
  const [actionModal, setActionModal] = useState({ isOpen: false, user: null });
  // State for profile preview modal
  const [previewUser, setPreviewUser] = useState(null);

  // Filter users based on search query and selected tab
  const filteredUsers = allUsers.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    
    const searchString = user.role === 'student' 
      ? `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase()
      : `${user.companyName} ${user.email}`.toLowerCase();
      
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Modal Action Handlers
  const openModal = (user) => setActionModal({ isOpen: true, user });
  const closeModal = () => setActionModal({ isOpen: false, user: null });

  const handleConfirmDelete = () => {
    if (deleteUser && actionModal.user) {
      deleteUser(actionModal.user.id);
    }
    closeModal();
  };

  const handleConfirmSuspend = () => {
    if (suspendUser && actionModal.user) {
      suspendUser(actionModal.user.id);
    }
    closeModal();
  };

  const handleConfirmRestore = () => {
    if (restoreUser && actionModal.user) {
      restoreUser(actionModal.user.id);
    }
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8 relative">
      
      {/* ================= HEADER & SEARCH ================= */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Manage Users
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">View, search, and manage all accounts on the E-Stage platform.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* ================= TABS & FILTERS ================= */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'all' 
              ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setFilter('student')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'student' 
              ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setFilter('company')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'company' 
              ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          Companies
        </button>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700">
                <th className="p-5 font-semibold">User Details</th>
                <th className="p-5 font-semibold">Contact</th>
                <th className="p-5 font-semibold">Account Type</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                    
                    {/* User Details Column */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex flex-shrink-0 items-center justify-center text-[#2563EB] dark:text-blue-400 font-bold text-sm">
                          {user.role === 'student' 
                            ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` 
                            : user.companyName?.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${['suspended', 'deleted'].includes(user.status) ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {user.role === 'student' ? `${user.firstName} ${user.lastName}` : user.companyName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="p-5">
                      <p className={`text-sm font-medium ${['suspended', 'deleted'].includes(user.status) ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {user.email}
                      </p>
                    </td>

                    {/* Account Type Column */}
                    <td className="p-5 flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg capitalize
                        ${user.role === 'student' ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-500/20' : 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20'}
                      `}>
                        {user.role}
                      </span>
                      {/* Suspended Badge */}
                      {user.status === 'suspended' && (
                        <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-md uppercase bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
                          Suspended
                        </span>
                      )}
                      {/* Deleted Badge */}
                      {user.status === 'deleted' && (
                        <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-md uppercase bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                          Deleted
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        <div className="relative group/eye">
                          <button 
                            onClick={() => setPreviewUser(user)}
                            className="p-2 text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          {/* Custom Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-bold rounded-lg shadow-lg opacity-0 translate-y-2 group-hover/eye:opacity-100 group-hover/eye:translate-y-0 transition-all pointer-events-none whitespace-nowrap z-10">
                            View Profile
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
                          </div>
                        </div>

                        <div className="relative group/trash">
                          <button 
                            onClick={() => openModal(user)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                          {/* Custom Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded-lg shadow-lg opacity-0 translate-y-2 group-hover/trash:opacity-100 group-hover/trash:translate-y-0 transition-all pointer-events-none whitespace-nowrap z-10">
                            Manage Account
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600"></div>
                          </div>
                        </div>

                      </div>
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No users found</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your search query or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ACTION MODAL ================= */}
      {actionModal.isOpen && actionModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Manage Account</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Take action on <span className="font-bold text-slate-700 dark:text-slate-300">
                  {actionModal.user.role === 'student' 
                    ? `${actionModal.user.firstName} ${actionModal.user.lastName}` 
                    : actionModal.user.companyName}
                </span>'s account.
              </p>
            </div>
            
            <div className="p-6 space-y-3 bg-slate-50/50 dark:bg-slate-700/50">
              {actionModal.user.status === 'deleted' ? (
                <button 
                  onClick={handleConfirmRestore}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-500/30 rounded-xl hover:bg-green-50 dark:hover:bg-green-500/10 hover:border-green-300 dark:hover:border-green-500/50 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-bold text-green-700 dark:text-green-400">Restore Account</p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5">Reactivate user and restore all access.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </div>
                </button>
              ) : (
                <>
                  {/* Suspend Button */}
                  <button 
                    onClick={handleConfirmSuspend}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-500/30 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-orange-700 dark:text-orange-400">{actionModal.user.status === 'suspended' ? 'Unsuspend Account' : 'Suspend Account'}</p>
                      <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-0.5">Temporarily block access. Can be undone.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={handleConfirmDelete}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/50 transition-colors group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-red-700 dark:text-red-400">Permanently Delete</p>
                      <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">Erase user and all their data. Cannot be undone.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </div>
                  </button>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROFILE PREVIEW MODAL ================= */}
      <AdminProfilePreviewModal 
        user={previewUser} 
        onClose={() => setPreviewUser(null)} 
      />

    </div>
  );
};

export default AdminManageUsers;
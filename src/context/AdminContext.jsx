// src/context/AdminContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useDatabase } from './DatabaseContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { db, updateDb } = useDatabase();

  // --------------------------------------------------------
  // DERIVED STATE: Easily access lists of specific items
  // Added optional chaining (?.) so it never crashes on empty data
  // --------------------------------------------------------
  const allUsers = db?.users || [];
  const allStudents = useMemo(() => allUsers.filter(u => u?.role === 'student'), [allUsers]);
  const allCompanies = useMemo(() => allUsers.filter(u => u?.role === 'company'), [allUsers]);
  const allJobs = db?.jobs || [];
  const allApplications = db?.applications || [];
  const allTickets = db?.tickets || []; 

  const adminStats = useMemo(() => ({
    totalStudents: allStudents.length,
    totalCompanies: allCompanies.length,
    activeJobs: allJobs.filter(j => j?.status === 'Active').length,
    totalApplications: allApplications.length,
    pendingCompanies: allCompanies.filter(c => c?.verificationStatus === 'pending').length,
    openTickets: allTickets.filter(t => t?.status === 'open').length,
  }), [allStudents, allCompanies, allJobs, allApplications, allTickets]);

  // --------------------------------------------------------
  // ADMIN POWERS - USER MANAGEMENT
  // --------------------------------------------------------
  const deleteUser = (userId) => {
    updateDb(prev => {
      const userToDelete = prev.users.find(u => u.id === userId);
      let updatedJobs = prev.jobs;
      let updatedApplications = prev.applications;

      // Cascade deletion logic
      if (userToDelete?.role === 'company') {
        const companyJobIds = prev.jobs.filter(j => j.companyId === userId).map(j => j.id);
        updatedJobs = prev.jobs.filter(j => j.companyId !== userId);
        updatedApplications = prev.applications.filter(app => !companyJobIds.includes(app.jobId));
      } else if (userToDelete?.role === 'student') {
        updatedApplications = prev.applications.filter(app => app.studentId !== userId);
      }

      return {
        ...prev,
        users: prev.users.filter(u => u.id !== userId),
        jobs: updatedJobs,
        applications: updatedApplications
      };
    });
  };

  const suspendUser = (userId) => {
    updateDb(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === userId 
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } 
          : u
      )
    }));
  };

  // --------------------------------------------------------
  // ADMIN POWERS - COMPANY VALIDATION
  // --------------------------------------------------------
  const approveCompany = (companyId) => {
    updateDb(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id === companyId ? { ...u, verificationStatus: 'approved' } : u
      )
    }));
  };

  const rejectCompany = (companyId) => {
    updateDb(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id === companyId ? { ...u, verificationStatus: 'rejected' } : u
      )
    }));
  };

  // Convenience wrapper used by AdminCompanyValidation
  const updateCompanyStatus = (companyId, newStatus) => {
    if (newStatus === 'approved') {
      approveCompany(companyId);
    } else if (newStatus === 'rejected') {
      rejectCompany(companyId);
    }
  };

  // --------------------------------------------------------
  // ADMIN POWERS - JOBS/INTERNSHIPS
  // --------------------------------------------------------
  const deleteJob = (jobId) => {
    updateDb(prev => ({
      ...prev,
      jobs: prev.jobs.filter(job => job.id !== jobId),
      applications: prev.applications.filter(app => app.jobId !== jobId)
    }));
  };

  // Block/Unblock Job Logic
  const blockJob = (jobId) => {
    updateDb(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => 
        j.id === jobId 
          // If it's already blocked, switch it back to Active. Otherwise, Block it.
          ? { ...j, status: j.status?.toLowerCase() === 'blocked' ? 'Active' : 'Blocked' } 
          : j
      )
    }));
  };

  // --------------------------------------------------------
  // ADMIN POWERS - CONFLICTS & TICKETS
  // --------------------------------------------------------
  const resolveTicket = (ticketId) => {
    updateDb(prev => ({
      ...prev,
      tickets: prev.tickets.map(t =>
        t.id === ticketId ? { ...t, status: 'resolved' } : t
      )
    }));
  };

  return (
    <AdminContext.Provider value={{
      allUsers,
      allStudents,
      allCompanies,
      allJobs,
      allApplications,
      allTickets,
      adminStats,
      deleteUser,
      suspendUser,      
      deleteJob,
      blockJob,
      approveCompany,
      rejectCompany,
      updateCompanyStatus, // FIX: Now exported for AdminCompanyValidation
      resolveTicket
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
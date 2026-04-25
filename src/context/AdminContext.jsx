// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { readDB, writeDB } from '../utils/storageHelper';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // 1. Load the entire database
  const [db, setDb] = useState(readDB());

  // 2. Auto-save any changes the Admin makes
  useEffect(() => {
    if (db) {
      writeDB(db);
    }
  }, [db]);

  // --------------------------------------------------------
  // DERIVED STATE: Easily access lists of specific items
  // Added optional chaining (?.) so it never crashes on empty data
  // --------------------------------------------------------
  const allUsers = db?.users || [];
  const allStudents = allUsers.filter(u => u?.role === 'student');
  const allCompanies = allUsers.filter(u => u?.role === 'company');
  const allJobs = db?.jobs || [];
  const allApplications = db?.applications || [];
  const allTickets = db?.tickets || []; 

  const adminStats = {
    totalStudents: allStudents.length,
    totalCompanies: allCompanies.length,
    activeJobs: allJobs.filter(j => j?.status === 'Active').length,
    totalApplications: allApplications.length,
    pendingCompanies: allCompanies.filter(c => c?.verificationStatus === 'pending').length,
    openTickets: allTickets.filter(t => t?.status === 'open').length,
  };

  // --------------------------------------------------------
  // ADMIN POWERS - USER MANAGEMENT
  // --------------------------------------------------------
  const deleteUser = (userId) => {
    setDb(prev => {
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
    setDb(prev => ({
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
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id === companyId ? { ...u, verificationStatus: 'approved' } : u
      )
    }));
  };

  const rejectCompany = (companyId) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id === companyId ? { ...u, verificationStatus: 'rejected' } : u
      )
    }));
  };

  // --------------------------------------------------------
  // ADMIN POWERS - JOBS/INTERNSHIPS
  // --------------------------------------------------------
  const deleteJob = (jobId) => {
    setDb(prev => ({
      ...prev,
      jobs: prev.jobs.filter(job => job.id !== jobId),
      applications: prev.applications.filter(app => app.jobId !== jobId)
    }));
  };

  // NEW: Block/Unblock Job Logic
  const blockJob = (jobId) => {
    setDb(prev => ({
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
    setDb(prev => ({
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
      blockJob,         // Exposed the new blockJob function here
      approveCompany,
      rejectCompany,
      resolveTicket
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
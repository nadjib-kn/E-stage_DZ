// src/context/CompanyDataContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useDatabase } from './DatabaseContext';

const CompanyDataContext = createContext();

export const CompanyDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { db, updateDb } = useDatabase();

  // --------------------------------------------------------
  // DERIVED STATE: Wrapped in useMemo for performance
  // --------------------------------------------------------
  
  // Get only this company's jobs
  const companyJobs = useMemo(() => {
    return currentUser 
      ? db.jobs.filter(job => job.companyId === currentUser.id) 
      : [];
  }, [db.jobs, currentUser]);

  // Get only applications for this company's jobs and attach student/job details
  const companyApplications = useMemo(() => {
    if (!currentUser) return [];
    return db.applications
      .filter(app => companyJobs.some(job => job.id === app.jobId))
      .map(app => {
        const studentInfo = db.users.find(u => u.id === app.studentId);
        const jobInfo = companyJobs.find(j => j.id === app.jobId);
        return {
          ...app,
          student: studentInfo,
          jobTitle: jobInfo ? jobInfo.role : "Unknown Role"
        };
      })
      .reverse();
  }, [db.applications, db.users, companyJobs, currentUser]);

  // Auto-calculate stats for the dashboard cards
  const dashboardStats = useMemo(() => ({
    activeOffers: companyJobs.filter(j => j.status === 'Active').length,
    totalApplications: companyApplications.length,
    pendingApplications: companyApplications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length
  }), [companyJobs, companyApplications]);

  // --------------------------------------------------------
  // ACTIONS: Updating the shared DB
  // --------------------------------------------------------

  const updateApplicationStatus = (applicationId, newStatus) => {
    updateDb(prev => ({
      ...prev,
      applications: prev.applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    }));
  };

  const createNewOffer = (newJobData) => {
    const newJob = {
      id: `j_${Date.now()}`, 
      companyId: currentUser.id,
      company: currentUser.companyName,
      logo: currentUser.logo,
      logoColor: currentUser.logoColor,
      posted: "Just now",
      ...newJobData, 
      status: newJobData.status || "Active" 
    };

    updateDb(prev => ({
      ...prev,
      jobs: [newJob, ...prev.jobs]
    }));
  };

  const toggleJobStatus = (jobId, newStatus) => {
    updateDb(prev => ({
      ...prev,
      jobs: prev.jobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    }));
  };

  const updateJob = (jobId, updatedData) => {
    updateDb(prev => ({
      ...prev,
      jobs: prev.jobs.map(job =>
        job.id === jobId ? { ...job, ...updatedData } : job
      )
    }));
  };

  const deleteJob = (jobId) => {
    updateDb(prev => ({
      ...prev,
      // Remove the job
      jobs: prev.jobs.filter(job => job.id !== jobId),
      // Remove all applications associated with this job
      applications: prev.applications.filter(app => app.jobId !== jobId)
    }));
  };

  // Keep a dummy refresh function so existing components don't break
  const loadCompanyData = () => {
    // No-op: the shared DatabaseContext is already the single source of truth
  };

  return (
    <CompanyDataContext.Provider value={{
      companyJobs,
      companyApplications,
      dashboardStats,
      updateApplicationStatus,
      createNewOffer,
      toggleJobStatus,
      updateJob,
      deleteJob,
      refreshData: loadCompanyData
    }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export const useCompanyData = () => useContext(CompanyDataContext);
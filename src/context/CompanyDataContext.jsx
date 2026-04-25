// src/context/CompanyDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { readDB, writeDB } from '../utils/storageHelper';

const CompanyDataContext = createContext();

export const CompanyDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // 1. Initialize the whole database from Local Storage
  const [db, setDb] = useState(readDB());

  // 2. Auto-save to Local Storage whenever 'db' changes
  useEffect(() => {
    writeDB(db);
  }, [db]);

  // --------------------------------------------------------
  // DERIVED STATE: Automatically calculates based on the DB
  // --------------------------------------------------------
  
  // Get only this company's jobs
  const companyJobs = currentUser 
    ? db.jobs.filter(job => job.companyId === currentUser.id) 
    : [];

  // Get only applications for this company's jobs and attach student/job details
  const companyApplications = currentUser
    ? db.applications
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
        .reverse()
    : [];

  // Auto-calculate stats for the dashboard cards
  const dashboardStats = {
    activeOffers: companyJobs.filter(j => j.status === 'Active').length,
    totalApplications: companyApplications.length,
    pendingApplications: companyApplications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length
  };

  // --------------------------------------------------------
  // ACTIONS: Updating the DB
  // --------------------------------------------------------

  const updateApplicationStatus = (applicationId, newStatus) => {
    setDb(prev => ({
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

    setDb(prev => ({
      ...prev,
      jobs: [newJob, ...prev.jobs]
    }));
  };

  const toggleJobStatus = (jobId, newStatus) => {
    setDb(prev => ({
      ...prev,
      jobs: prev.jobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    }));
  };

  const updateJob = (jobId, updatedData) => {
    setDb(prev => ({
      ...prev,
      jobs: prev.jobs.map(job =>
        job.id === jobId ? { ...job, ...updatedData } : job
      )
    }));
  };

  const deleteJob = (jobId) => {
    setDb(prev => ({
      ...prev,
      // Remove the job
      jobs: prev.jobs.filter(job => job.id !== jobId),
      // Remove all applications associated with this job
      applications: prev.applications.filter(app => app.jobId !== jobId)
    }));
  };

  // Keep a dummy refresh function so existing components don't break
  const loadCompanyData = () => {
    setDb(readDB());
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
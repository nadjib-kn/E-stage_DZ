// src/context/StudentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { readDB, writeDB } from '../utils/storageHelper';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Initialize state from Local Storage
  const [db, setDb] = useState(readDB());

  // Keep state in sync with local storage whenever db changes
  useEffect(() => {
    writeDB(db);
  }, [db]);

  const applyForJob = (jobId) => {
    if (!currentUser) return { success: false, message: "Not logged in" };

    const alreadyApplied = db.applications.some(
      (app) => app.jobId === jobId && app.studentId === currentUser.id
    );

    if (alreadyApplied) {
      return { success: false, message: "You have already applied for this role." };
    }

    const newApplication = {
      id: `app_${Date.now()}`,
      studentId: currentUser.id,
      jobId: jobId,
      status: "Pending",
      dateApplied: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setDb(prev => ({ ...prev, applications: [...prev.applications, newApplication] }));
    return { success: true, message: "Application submitted successfully!" };
  };

  const cancelApplication = (jobId) => {
    if (!currentUser) return { success: false, message: "Not logged in" };

    const updatedApplications = db.applications.filter(
      (app) => !(app.jobId === jobId && app.studentId === currentUser.id)
    );

    setDb(prev => ({ ...prev, applications: updatedApplications }));
    return { success: true, message: "Application cancelled successfully." };
  };

  const getJobsWithStatus = () => {
    if (!currentUser) return db.jobs;

    return db.jobs.map(job => {
      const hasApplied = db.applications.some(
        app => app.jobId === job.id && app.studentId === currentUser.id
      );
      return { ...job, hasApplied };
    });
  };

  const getMyApplications = () => {
    if (!currentUser) return [];

    const myApps = db.applications.filter(app => app.studentId === currentUser.id);

    return myApps.map(app => {
      const jobDetails = db.jobs.find(job => job.id === app.jobId);
      return { ...jobDetails, ...app }; 
    });
  };
  
  return (
    <StudentContext.Provider value={{ 
      jobs: getJobsWithStatus(), 
      applyForJob, 
      cancelApplication, 
      myApplications: getMyApplications() 
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
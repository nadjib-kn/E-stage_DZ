// src/context/StudentContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useDatabase } from './DatabaseContext';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { db, updateDb } = useDatabase();

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

    updateDb(prev => ({ ...prev, applications: [...prev.applications, newApplication] }));
    return { success: true, message: "Application submitted successfully!" };
  };

  // FIX: Use functional updater to avoid stale closure bug.
  // Previously, the filter was computed outside setDb, capturing a stale `db`.
  const cancelApplication = (jobId) => {
    if (!currentUser) return { success: false, message: "Not logged in" };

    updateDb(prev => ({
      ...prev,
      applications: prev.applications.filter(
        (app) => !(app.jobId === jobId && app.studentId === currentUser.id)
      )
    }));
    return { success: true, message: "Application cancelled successfully." };
  };

  // FIX: Wrapped in useMemo to prevent recalculation on every render.
  // FIX: Only show Active jobs to students (was showing Draft/Closed/Blocked).
  const jobs = useMemo(() => {
    if (!currentUser) return db.jobs.filter(job => job.status === 'Active');

    return db.jobs
      .filter(job => job.status === 'Active')
      .map(job => {
        const hasApplied = db.applications.some(
          app => app.jobId === job.id && app.studentId === currentUser.id
        );
        return { ...job, hasApplied };
      });
  }, [db.jobs, db.applications, currentUser]);

  // FIX: Wrapped in useMemo to prevent recalculation on every render.
  const myApplications = useMemo(() => {
    if (!currentUser) return [];

    const myApps = db.applications.filter(app => app.studentId === currentUser.id);

    return myApps.map(app => {
      const jobDetails = db.jobs.find(job => job.id === app.jobId);
      return { ...jobDetails, ...app }; 
    });
  }, [db.applications, db.jobs, currentUser]);
  
  return (
    <StudentContext.Provider value={{ 
      jobs, 
      applyForJob, 
      cancelApplication, 
      myApplications 
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
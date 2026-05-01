// src/context/StudentContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../api/apiClient';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active jobs (with hasApplied flag from backend)
  const fetchJobs = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const { data } = await apiClient.get('/api/jobs');
      setJobs(data.data.jobs);
    } catch (e) {
      console.error('fetchJobs:', e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch student's own applications
  const fetchMyApplications = useCallback(async () => {
    if (currentUser?.role !== 'student') return;
    try {
      const { data } = await apiClient.get('/api/applications/mine');
      setMyApplications(data.data.applications);
    } catch (e) {
      console.error('fetchMyApplications:', e);
    }
  }, [currentUser]);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    if (currentUser?.role !== 'student') return;
    try {
      const { data } = await apiClient.get('/api/dashboard/student');
      setDashboardStats(data.data);
    } catch (e) {
      console.error('fetchDashboardStats:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === 'student') {
      fetchJobs();
      fetchMyApplications();
      fetchDashboardStats();
    }
  }, [currentUser, fetchJobs, fetchMyApplications, fetchDashboardStats]);

  const applyForJob = async (jobId) => {
    try {
      await apiClient.post(`/api/applications/apply/${jobId}`);
      // Refresh both lists
      await Promise.all([fetchJobs(), fetchMyApplications(), fetchDashboardStats()]);
      return { success: true, message: 'Application submitted successfully!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply.';
      return { success: false, message };
    }
  };

  const cancelApplication = async (jobId) => {
    try {
      await apiClient.delete(`/api/applications/cancel/${jobId}`);
      await Promise.all([fetchJobs(), fetchMyApplications(), fetchDashboardStats()]);
      return { success: true, message: 'Application withdrawn.' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel.';
      return { success: false, message };
    }
  };

  return (
    <StudentContext.Provider value={{
      jobs, myApplications, dashboardStats, isLoading,
      applyForJob, cancelApplication,
      refreshJobs: fetchJobs,
      refreshApplications: fetchMyApplications,
      refreshDashboard: fetchDashboardStats,
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
// src/context/CompanyDataContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../api/apiClient';

const CompanyDataContext = createContext();

export const CompanyDataProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyApplications, setCompanyApplications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ activeOffers: 0, totalApplications: 0, pendingApplications: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompanyJobs = useCallback(async () => {
    if (currentUser?.role !== 'company') return;
    try {
      const { data } = await apiClient.get('/api/jobs/company');
      setCompanyJobs(data.data.jobs);
    } catch (e) { console.error('fetchCompanyJobs:', e); }
  }, [currentUser]);

  const fetchCompanyApplications = useCallback(async () => {
    if (currentUser?.role !== 'company') return;
    try {
      const { data } = await apiClient.get('/api/applications/company');
      setCompanyApplications(data.data.applications);
    } catch (e) { console.error('fetchCompanyApplications:', e); }
  }, [currentUser]);

  const fetchDashboard = useCallback(async () => {
    if (currentUser?.role !== 'company') return;
    try {
      const { data } = await apiClient.get('/api/dashboard/company');
      setDashboardStats(data.data.stats);
    } catch (e) { console.error('fetchDashboard:', e); }
  }, [currentUser]);

  const refreshData = useCallback(() => {
    return Promise.all([fetchCompanyJobs(), fetchCompanyApplications(), fetchDashboard()]);
  }, [fetchCompanyJobs, fetchCompanyApplications, fetchDashboard]);

  useEffect(() => {
    if (currentUser?.role === 'company') refreshData();
  }, [currentUser, refreshData]);

  const createNewOffer = async (jobData) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.post('/api/jobs', jobData);
      await refreshData();
      return { success: true, job: data.data.job };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create offer.' };
    } finally { setIsLoading(false); }
  };

  const updateJob = async (jobId, updatedData) => {
    try {
      const { data } = await apiClient.put(`/api/jobs/${jobId}`, updatedData);
      await refreshData();
      return { success: true, job: data.data.job };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update.' };
    }
  };

  const toggleJobStatus = async (jobId, newStatus) => {
    try {
      await apiClient.patch(`/api/jobs/${jobId}/status`, { status: newStatus });
      await refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update status.' };
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await apiClient.delete(`/api/jobs/${jobId}`);
      await refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete.' };
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await apiClient.patch(`/api/applications/${applicationId}/status`, { status: newStatus });
      await fetchCompanyApplications();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update status.' };
    }
  };

  return (
    <CompanyDataContext.Provider value={{
      companyJobs, companyApplications, dashboardStats, isLoading,
      createNewOffer, updateJob, toggleJobStatus, deleteJob,
      updateApplicationStatus, refreshData,
    }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export const useCompanyData = () => useContext(CompanyDataContext);
// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../api/apiClient';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [allUsers, setAllUsers] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [adminStats, setAdminStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (currentUser?.role !== 'admin') return;
    try {
      setIsLoading(true);
      const [usersRes, jobsRes, ticketsRes, statsRes, pendingRes] = await Promise.all([
        apiClient.get('/api/admin/users'),
        apiClient.get('/api/admin/jobs'),
        apiClient.get('/api/admin/tickets'),
        apiClient.get('/api/admin/stats'),
        apiClient.get('/api/admin/companies/validation'),
      ]);
      setAllUsers(usersRes.data.data.users);
      setAllJobs(jobsRes.data.data.jobs);
      setAllTickets(ticketsRes.data.data.tickets);
      setAdminStats(statsRes.data.data.stats);
      setPendingCompanies(pendingRes.data.data.companies);
      // Derive allApplications from stats endpoint recent data
      setAllApplications(statsRes.data.data.recentApplications || []);
    } catch (e) { console.error('Admin fetchAll:', e); }
    finally { setIsLoading(false); }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === 'admin') fetchAll();
  }, [currentUser, fetchAll]);

  // Computed values (match old context API)
  const allStudents = allUsers.filter(u => u.role === 'student');
  const allCompanies = allUsers.filter(u => u.role === 'company');

  const suspendUser = async (userId) => {
    const user = allUsers.find(u => u.id === userId);
    const newStatus = user?.status === 'suspended' ? 'active' : 'suspended';
    try {
      await apiClient.patch(`/api/admin/users/${userId}/suspend`, { status: newStatus });
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const deleteUser = async (userId) => {
    try {
      await apiClient.delete(`/api/admin/users/${userId}`);
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const restoreUser = async (userId) => {
    try {
      await apiClient.patch(`/api/admin/users/${userId}/restore`);
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const blockJob = async (jobId) => {
    try {
      await apiClient.patch(`/api/admin/jobs/${jobId}/block`);
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const deleteJob = async (jobId) => {
    try {
      await apiClient.delete(`/api/admin/jobs/${jobId}`);
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const approveCompany = async (companyId) => {
    try {
      await apiClient.patch(`/api/admin/companies/${companyId}/verify`, { verificationStatus: 'approved' });
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const rejectCompany = async (companyId) => {
    try {
      await apiClient.patch(`/api/admin/companies/${companyId}/verify`, { verificationStatus: 'rejected' });
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  const updateCompanyStatus = (companyId, newStatus) => {
    if (newStatus === 'approved') return approveCompany(companyId);
    if (newStatus === 'rejected') return rejectCompany(companyId);
  };

  const resolveTicket = async (ticketId) => {
    try {
      await apiClient.patch(`/api/admin/tickets/${ticketId}/resolve`, { status: 'resolved' });
      await fetchAll();
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message }; }
  };

  return (
    <AdminContext.Provider value={{
      allUsers, allStudents, allCompanies, allJobs,
      allApplications, allTickets, pendingCompanies,
      adminStats, isLoading,
      suspendUser, deleteUser, restoreUser,
      blockJob, deleteJob,
      approveCompany, rejectCompany, updateCompanyStatus,
      resolveTicket, refreshData: fetchAll,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import all your public components
import Navbar from './components/Navbar';
import Hero from './components/hero';
import Title from './components/Title';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Invitation from './components/Invitation';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

// Import Student Pages
import DashboardOverview from './components/dashboards/student/DashboardOverview';
import BrowseOffers from './components/dashboards/student/BrowseOffers';
import MyApplications from './components/dashboards/student/MyApplications';
import MyProfile from './components/dashboards/student/MyProfile';
import StudentSupport from './components/dashboards/student/StudentSupport'; // <-- ADDED: Student Support Import

// Import your Dashboard Layouts
import StudentLayout from './components/dashboards/student/StudentLayout';
import CompanyLayout from './components/dashboards/company/CompanyLayout';
import AdminLayout from './components/dashboards/admin/AdminLayout';

// Import Company Pages
import Applicants from './components/dashboards/company/Applicants';
import MyOffers from './components/dashboards/company/MyOffers';
import CompanyProfile from './components/dashboards/company/CompanyProfile';
import CompanyDashboardHome from './components/dashboards/company/CompanyDashboardHome';
import PostOffer from './components/dashboards/company/PostOffer';
import CompanySupport from './components/dashboards/company/CompanySupport'; // <-- ADDED: Company Support Import

// Import Admin Pages
import AdminConflicts from './components/dashboards/admin/AdminConflicts';
import AdminCompanyValidation from './components/dashboards/admin/AdminCompanyValidation';
import AdminManageJobs from './components/dashboards/admin/AdminManageJobs';
import AdminDashboardOverview from './components/dashboards/admin/AdminDashboardOverview';
import AdminManageUsers from './components/dashboards/admin/AdminManageUsers';

// Import the Providers
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { CompanyDataProvider } from './context/CompanyDataContext'; 
import { AdminProvider } from './context/AdminContext'; 
import { ThemeProvider } from './context/ThemeContext';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <section id="home" className="scroll-mt-24"><Hero /></section>
      <section id="features" className="scroll-mt-12"><Title text="Features" /><Features /></section>
      <section id="how-it-works" className="scroll-mt-12">
        <Title text="How it Works" subText="E-Stage DZ simplifies the bridge between university theory and professional life." />
        <HowItWorks />
      </section>
      <Invitation />
      <section id="contact" className="scroll-mt-2">
        <ContactUs title="Contact Us" subText="Have questions? Our team is here to help you take the next step." />
      </section>
      <Footer />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <LandingPage />
          </motion.div>
        } />
        
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <LoginPage />
          </motion.div>
        } />

        {/* ================= DASHBOARD ROUTES ================= */}
        
        {/* Student Dashboard */}
        <Route path="/student" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full w-full">
            <StudentLayout />
          </motion.div>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="browse" element={<BrowseOffers />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="support" element={<StudentSupport />} /> {/* <-- ADDED: Student Support Route */}
        </Route>

        {/* Company Dashboard */}
        <Route path="/company" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full w-full">
            <CompanyLayout />
          </motion.div>
        }>
          {/* Redirect /company to /company/dashboard automatically */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Company Routes mapped to Sidebar */}
          <Route path="dashboard" element={<CompanyDashboardHome />} />
          <Route path="offers" element={<MyOffers />} />
          <Route path="post-offer" element={<PostOffer />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="support" element={<CompanySupport />} /> {/* <-- ADDED: Company Support Route */}
          <Route path="settings" element={<h1 className="text-2xl font-bold text-slate-900">Settings (Coming Soon)</h1>} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full w-full">
            <AdminLayout />
          </motion.div>
        }>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="users" element={<AdminManageUsers />} />
          <Route path="jobs" element={<AdminManageJobs />} />
          <Route path="validation" element={<AdminCompanyValidation />} />
          <Route path="conflicts" element={<AdminConflicts />} /> 
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider> 
          <StudentProvider>
            <CompanyDataProvider> 
              <Router>
                <AnimatedRoutes />
              </Router>
            </CompanyDataProvider>
          </StudentProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
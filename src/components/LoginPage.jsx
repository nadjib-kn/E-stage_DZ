import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from '@react-oauth/google';
import { AnimatePresence, motion } from 'framer-motion';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, forgotPassword } = useAuth();

  const [isSignUpActive, setIsSignUpActive] = useState(
    location.state?.isSignUp || false,
  );
  const [registerRole, setRegisterRole] = useState(
    location.state?.role || "student",
  );

  useEffect(() => {
    if (location.state) {
      if (location.state.isSignUp !== undefined)
        setIsSignUpActive(location.state.isSignUp);
      if (location.state.role) setRegisterRole(location.state.role);
    }
  }, [location.state]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState({
    type: "",
    text: "",
  });

  // ── Forgot Password state ─────────────────────────────────────────────────
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'success'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const openForgotModal = () => {
    setForgotEmail('');
    setForgotError('');
    setForgotStep('email');
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    const result = await forgotPassword(forgotEmail.trim());
    setForgotLoading(false);
    if (result.success) {
      setForgotStep('success');
    } else {
      setForgotError(result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      if (result.role === "student") navigate("/student");
      else if (result.role === "company") navigate("/company");
      else if (result.role === "admin") navigate("/admin");
    } else {
      setLoginError(
        result.message || "Invalid email or password. Please try again.",
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage({ type: "", text: "" });
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }
    const result = await register(
      registerRole,
      registerName,
      registerEmail,
      registerPassword,
    );
    if (result.success) {
      setRegisterMessage({ type: "success", text: result.message });
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      if (registerRole === "student") {
        setTimeout(() => setIsSignUpActive(false), 2000);
      }
    } else {
      setRegisterMessage({ type: "error", text: result.message });
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoginError("");
    setRegisterMessage({ type: "", text: "" });
    const result = await loginWithGoogle({
      access_token: tokenResponse.access_token,
      role: isSignUpActive ? registerRole : undefined
    });
    if (result.success) {
      if (result.role === "student") navigate("/student");
      else if (result.role === "company") navigate("/company");
      else if (result.role === "admin") navigate("/admin");
    } else {
      if (isSignUpActive) {
        setRegisterMessage({ type: "error", text: result.message });
      } else {
        setLoginError(result.message);
      }
    }
  };

  const handleGoogleError = () => {
    const errorMsg = "Google Login failed. Please try again.";
    if (isSignUpActive) setRegisterMessage({ type: "error", text: errorMsg });
    else setLoginError(errorMsg);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  // Shared input classes — light and dark modes
  const inputClass =
    "w-full text-sm rounded-xl px-5 py-3.5 transition-all placeholder:text-slate-400 focus:outline-none " +
    // Light
    "bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 " +
    // Dark
    "dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700/80 dark:placeholder:text-slate-500 " +
    "dark:focus:border-blue-400 dark:focus:ring-blue-400/15 dark:focus:bg-slate-900/80";

  const socialBtnClass =
    "w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-full transition-all " +
    // Light
    "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 " +
    // Dark
    "dark:bg-slate-800/60 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:bg-slate-700/60 dark:text-slate-200";

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-300
      bg-gradient-to-br from-slate-50 to-slate-100
      dark:bg-[#080d1a] dark:[background-image:radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.18)_0%,transparent_70%)]"
    >
      <div className="w-full max-w-[900px] flex flex-col items-start">
        <Link
          to="/"
          className="mb-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        {/* =============================================
            MOBILE LAYOUT: Stacked tab-based card
            Hidden on md+ screens
            ============================================= */}
        <div className="md:hidden w-full bg-white dark:bg-[#0f1629] rounded-[2rem] overflow-hidden shadow-[0_25px_60px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_60px_-12px_rgba(0,0,0,0.7)]">
          {/* Tab switcher */}
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSignUpActive(false)}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${!isSignUpActive
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUpActive(true)}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${isSignUpActive
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Mobile: Sign In */}
            {!isSignUpActive && (
              <form className="flex flex-col w-full" onSubmit={handleLogin}>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Welcome back</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Please enter your details to sign in.</p>

                {loginError && (
                  <div className="text-sm p-3 rounded-lg mb-4 border bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60">
                    {loginError}
                  </div>
                )}

                <div className="flex flex-col gap-4 mb-2">
                  <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className={inputClass} />
                  <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className={inputClass} />
                </div>

                <div className="flex justify-end mb-5 mt-1">
                  <button type="button" onClick={openForgotModal} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]">Sign In</button>

                <div className="relative flex items-center justify-center w-full mt-5 mb-3">
                  <div className="absolute w-full border-t border-slate-200 dark:border-slate-700/70" />
                  <span className="bg-white dark:bg-[#0f1629] px-3 text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">Or continue with</span>
                </div>

                <button type="button" onClick={() => googleLogin()} className={`${socialBtnClass} mt-2`}>
                  <GoogleIcon /> Continue with Google
                </button>
              </form>
            )}

            {/* Mobile: Sign Up */}
            {isSignUpActive && (
              <form className="flex flex-col w-full" onSubmit={handleRegister}>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Create account</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Join E-Stage DZ to unlock opportunities.</p>

                {registerMessage.text && (
                  <div className={`text-sm p-3 rounded-lg mb-4 border ${registerMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60"
                    : "bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60"
                  }`}>
                    {registerMessage.text}
                  </div>
                )}

                {/* Role toggle */}
                <div className="relative flex w-full bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl mb-4">
                  <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-white/[0.08] rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${registerRole === "company" ? "translate-x-full" : "translate-x-0"}`} />
                  <button type="button" onClick={() => setRegisterRole("student")} className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === "student" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>Student</button>
                  <button type="button" onClick={() => setRegisterRole("company")} className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === "company" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>Company</button>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <input type="text" placeholder={registerRole === "student" ? "Full Name" : "Company Name"} value={registerName} onChange={(e) => setRegisterName(e.target.value)} required className={inputClass} />
                  <input type="email" placeholder={registerRole === "student" ? "University Email" : "Work Email"} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required className={inputClass} />
                  <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required className={inputClass} />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]">Sign Up</button>

                <div className="relative flex items-center justify-center w-full mt-5 mb-3">
                  <div className="absolute w-full border-t border-slate-200 dark:border-slate-700/70" />
                  <span className="bg-white dark:bg-[#0f1629] px-3 text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">Or continue with</span>
                </div>

                <button type="button" onClick={() => googleLogin()} className={`${socialBtnClass} mt-2`}>
                  <GoogleIcon /> Continue with Google
                </button>
              </form>
            )}
          </div>
        </div>

        {/* =============================================
            DESKTOP LAYOUT: Classic sliding-panel card
            Hidden on mobile (< md)
            ============================================= */}
        <div className="hidden md:block relative w-full h-[600px] bg-white dark:bg-[#0f1629] rounded-[2rem] overflow-hidden shadow-[0_25px_60px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_60px_-12px_rgba(0,0,0,0.7),0_0_80px_-20px_rgba(37,99,235,0.12)]">
          {/* 1. SIGN UP FORM */}
          <div
            className={`dark-form-panel absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 bg-white dark:bg-[#0f1629] transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"}`}
          >
            <form className="flex flex-col w-full text-center sm:text-left" onSubmit={handleRegister}>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Create account</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Join E-Stage DZ to unlock opportunities.</p>

              {registerMessage.text && (
                <div className={`text-sm p-3 rounded-lg mb-4 border ${registerMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60"
                  : "bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60"
                }`}>
                  {registerMessage.text}
                </div>
              )}

              {/* Role toggle */}
              <div className="dark-role-track relative flex w-full bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl mb-4">
                <div className={`dark-role-pill absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-white/[0.08] rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${registerRole === "company" ? "translate-x-full" : "translate-x-0"}`} />
                <button type="button" onClick={() => setRegisterRole("student")} className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === "student" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>Student</button>
                <button type="button" onClick={() => setRegisterRole("company")} className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === "company" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>Company</button>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <input type="text" placeholder={registerRole === "student" ? "Full Name" : "Company Name"} value={registerName} onChange={(e) => setRegisterName(e.target.value)} required className={inputClass} />
                <input type="email" placeholder={registerRole === "student" ? "University Email" : "Work Email"} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required className={inputClass} />
                <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required className={inputClass} />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)]">Sign Up</button>

              <div className="relative flex items-center justify-center w-full mt-5 mb-3">
                <div className="absolute w-full border-t border-slate-200 dark:border-slate-700/70" />
                <span className="dark-divider-bg bg-white dark:bg-[#0f1629] px-3 text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">Or continue with</span>
              </div>

              <div className="flex justify-center w-full mt-4">
                <button type="button" onClick={() => googleLogin()} className={`${socialBtnClass} w-full`}><GoogleIcon /> Continue with Google</button>
              </div>
            </form>
          </div>

          {/* 2. SIGN IN FORM */}
          <div
            className={`dark-form-panel absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 bg-white dark:bg-[#0f1629] transition-all duration-700 ease-in-out z-20 ${isSignUpActive ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
          >
            <form className="flex flex-col w-full text-center sm:text-left" onSubmit={handleLogin}>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Welcome back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Please enter your details to sign in.</p>

              {loginError && (
                <div className="text-sm p-3 rounded-lg mb-4 border bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60">
                  {loginError}
                </div>
              )}

              <div className="flex flex-col gap-4 mb-2">
                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className={inputClass} />
                <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className={inputClass} />
              </div>

              <div className="flex justify-end mb-6 mt-1">
                <button type="button" onClick={openForgotModal} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Forgot password?</button>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)]">Sign In</button>

              <div className="relative flex items-center justify-center w-full mt-6 mb-4">
                <div className="absolute w-full border-t border-slate-200 dark:border-slate-700/70" />
                <span className="dark-divider-bg bg-white dark:bg-[#0f1629] px-3 text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">Or continue with</span>
              </div>

              <div className="flex justify-center w-full mt-4">
                <button type="button" onClick={() => googleLogin()} className={`${socialBtnClass} w-full`}><GoogleIcon /> Continue with Google</button>
              </div>
            </form>
          </div>

          {/* 3. SLIDING OVERLAY CONTAINER */}
          <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100] ${isSignUpActive ? "-translate-x-full rounded-r-[100px]" : "translate-x-0 rounded-l-[100px]"}`}>
            <div
              className={`absolute top-0 -left-full w-[200%] h-full transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-1/2" : "translate-x-0"}`}
              style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #0ea5e9 80%, #14b8a6 100%)" }}
            >
              {/* Subtle radial glow */}
              <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,179,237,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,1) 28px, rgba(255,255,255,1) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,1) 28px, rgba(255,255,255,1) 29px)", pointerEvents: "none" }} />

              {/* Panel: Already have an account */}
              <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 text-center text-white transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-0 opacity-100" : "-translate-x-[20%] opacity-0"}`}>
                <div className="mb-5 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight drop-shadow-sm">Already have an account?</h2>
                <p className="text-white/80 text-sm leading-relaxed mb-8">Sign in to your dashboard to manage your internship applications and company profile.</p>
                <button onClick={() => setIsSignUpActive(false)} className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-bold py-3 px-12 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-lg">Sign In</button>
              </div>

              {/* Panel: New to E-Stage */}
              <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-14 text-center text-white transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-[20%] opacity-0" : "translate-x-0 opacity-100"}`}>
                <div className="mb-5 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight drop-shadow-sm">New to E-Stage?</h2>
                <p className="text-white/80 text-sm leading-relaxed mb-8">Create an account to start exploring the best internship opportunities across Algeria.</p>
                <button onClick={() => setIsSignUpActive(true)} className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-bold py-3 px-12 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-lg">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =============================================
          FORGOT PASSWORD MODAL
          ============================================= */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            key="forgot-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={(e) => { if (e.target === e.currentTarget) closeForgotModal(); }}
          >
            <motion.div
              key="forgot-card"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden bg-white dark:bg-[#0f1629] shadow-[0_30px_80px_-12px_rgba(0,0,0,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_80px_-12px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(37,99,235,0.18)]"
            >
              {/* Gradient accent bar at the top */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)' }} />

              <div className="p-6 sm:p-8">
                {/* Close button */}
                <button
                  onClick={closeForgotModal}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-all"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>

                <AnimatePresence mode="wait">
                  {forgotStep === 'email' ? (
                    <motion.div key="step-email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                      <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                        <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>

                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Forgot your password?</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">No worries — enter your email address and we'll send you a link to reset your password.</p>

                      <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Email address</label>
                          <input
                            id="forgot-email-input"
                            type="email"
                            placeholder="you@example.com"
                            value={forgotEmail}
                            onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                            required
                            autoFocus
                            className={inputClass}
                          />
                        </div>

                        {forgotError && (
                          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-sm p-3 rounded-xl border bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60">
                            {forgotError}
                          </motion.div>
                        )}

                        <button
                          id="forgot-submit-btn"
                          type="submit"
                          disabled={forgotLoading}
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {forgotLoading ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                              Sending...
                            </>
                          ) : 'Send Reset Link'}
                        </button>

                        <button type="button" onClick={closeForgotModal} className="w-full text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 py-2 transition-colors">Back to Sign In</button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="step-success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex flex-col items-center text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 rounded-full mb-6 flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30"
                      >
                        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </motion.div>

                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Check your inbox!</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2">We've sent a password reset link to</p>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6 break-all">{forgotEmail}</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-8">Didn't receive it? Check your spam folder or wait a few minutes.</p>

                      <button
                        id="forgot-back-to-login-btn"
                        onClick={closeForgotModal}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)]"
                      >
                        Back to Sign In
                      </button>

                      <button type="button" onClick={() => { setForgotStep('email'); setForgotError(''); }} className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Try a different email</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Small icon components
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.108 17.64 11.84 17.64 9.2z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default LoginPage;

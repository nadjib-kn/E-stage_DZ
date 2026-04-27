import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

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

  const [loginEmail, setLoginEmail] = useState("amine@univ-alger.dz");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState({
    type: "",
    text: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    const result = login(loginEmail, loginPassword);
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

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterMessage({ type: "", text: "" });
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }
    const result = register(
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
      className="min-h-screen relative flex items-center justify-center p-4 font-sans transition-colors duration-300
      bg-gradient-to-br from-slate-50 to-slate-100
      dark:bg-[#080d1a] dark:[background-image:radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.18)_0%,transparent_70%)]"
    >
      {/*
        Dark mode page background: deep navy with a faint radial glow behind the card.
        We use an inline style for the dark radial because Tailwind JIT can't purge arbitrary
        dynamic values reliably here. The `dark:` variant on the wrapper handles the solid base.
      */}

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

        <div
          className="relative w-full h-[600px] bg-white dark:bg-[#0f1629] rounded-[2rem] overflow-hidden
          shadow-[0_25px_60px_-12px_rgba(15,23,42,0.12)]
          dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_60px_-12px_rgba(0,0,0,0.7),0_0_80px_-20px_rgba(37,99,235,0.12)]"
        >
          {/* =========================================
              1. SIGN UP FORM
              ========================================= */}
          <div
            className={`dark-form-panel absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 bg-white dark:bg-[#0f1629] transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"}`}
          >
            <form
              className="flex flex-col w-full text-center sm:text-left"
              onSubmit={handleRegister}
            >
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                Create account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Join E-Stage DZ to unlock opportunities.
              </p>

              {registerMessage.text && (
                <div
                  className={`text-sm p-3 rounded-lg mb-4 border ${
                    registerMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60"
                      : "bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60"
                  }`}
                >
                  {registerMessage.text}
                </div>
              )}

              {/* Role toggle */}
              <div className="dark-role-track relative flex w-full bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl mb-4">
                <div
                  className={`dark-role-pill absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-white/[0.08] rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${registerRole === "company" ? "translate-x-full" : "translate-x-0"}`}
                />
                <button
                  type="button"
                  onClick={() => setRegisterRole("student")}
                  className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === "student" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole("company")}
                  className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === "company" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Company
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <input
                  type="text"
                  placeholder={
                    registerRole === "student" ? "Full Name" : "Company Name"
                  }
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder={
                    registerRole === "student"
                      ? "University Email"
                      : "Work Email"
                  }
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)]"
              >
                Sign Up
              </button>

              <div className="relative flex items-center justify-center w-full mt-5 mb-3">
                <div className="absolute w-full border-t border-slate-200 dark:border-slate-700/70" />
                <span className="dark-divider-bg bg-white dark:bg-[#0f1629] px-3 text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">
                  Or continue with
                </span>
              </div>

              <div className="flex gap-3">
                <button type="button" className={socialBtnClass}>
                  <GoogleIcon /> Google
                </button>
                <button type="button" className={socialBtnClass}>
                  <LinkedInIcon /> LinkedIn
                </button>
              </div>
            </form>
          </div>

          {/* =========================================
              2. SIGN IN FORM
              ========================================= */}
          <div
            className={`dark-form-panel absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 bg-white dark:bg-[#0f1629] transition-all duration-700 ease-in-out z-20 ${isSignUpActive ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
          >
            <form
              className="flex flex-col w-full text-center sm:text-left"
              onSubmit={handleLogin}
            >
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Please enter your details to sign in.
              </p>

              {loginError && (
                <div className="text-sm p-3 rounded-lg mb-4 border bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60">
                  {loginError}
                </div>
              )}

              <div className="flex flex-col gap-4 mb-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end mb-6 mt-1">
                <a
                  href="#"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)]"
              >
                Sign In
              </button>

              <div className="relative flex items-center justify-center w-full mt-6 mb-4">
                <div className="absolute w-full border-t border-slate-200 dark:border-slate-700/70" />
                <span className="dark-divider-bg bg-white dark:bg-[#0f1629] px-3 text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">
                  Or continue with
                </span>
              </div>

              <div className="flex gap-3">
                <button type="button" className={socialBtnClass}>
                  <GoogleIcon /> Google
                </button>
                <button type="button" className={socialBtnClass}>
                  <LinkedInIcon /> LinkedIn
                </button>
              </div>
            </form>
          </div>

          {/* =========================================
              3. SLIDING OVERLAY CONTAINER
              ========================================= */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100] ${isSignUpActive ? "-translate-x-full rounded-r-[100px]" : "translate-x-0 rounded-l-[100px]"}`}
          >
            {/*
              Light mode: blue-to-teal gradient (unchanged).
              Dark mode: deeper, richer gradient with a subtle noise overlay for texture,
              plus an inner glow so it doesn't look flat against the dark card.
            */}
            <div
              className={`absolute top-0 -left-full w-[200%] h-full transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-1/2" : "translate-x-0"}`}
              style={{
                background:
                  "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #0ea5e9 80%, #14b8a6 100%)",
              }}
            >
              {/* Subtle radial glow inside the overlay for depth */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,179,237,0.3) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              {/* Very faint grid texture */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,1) 28px, rgba(255,255,255,1) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,1) 28px, rgba(255,255,255,1) 29px)",
                  pointerEvents: "none",
                }}
              />

              {/* Panel: Already have an account (shown when sign-up is active) */}
              <div
                className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 text-center text-white transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-0 opacity-100" : "-translate-x-[20%] opacity-0"}`}
              >
                <div className="mb-5 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight drop-shadow-sm">
                  Already have an account?
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-8">
                  Sign in to your dashboard to manage your internship
                  applications and company profile.
                </p>
                <button
                  onClick={() => setIsSignUpActive(false)}
                  className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-bold py-3 px-12 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-lg"
                >
                  Sign In
                </button>
              </div>

              {/* Panel: New to E-Stage (shown when sign-in is active) */}
              <div
                className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-14 text-center text-white transition-all duration-700 ease-in-out ${isSignUpActive ? "translate-x-[20%] opacity-0" : "translate-x-0 opacity-100"}`}
              >
                <div className="mb-5 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight drop-shadow-sm">
                  New to E-Stage?
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-8">
                  Create an account to start exploring the best internship
                  opportunities across Algeria.
                </p>
                <button
                  onClick={() => setIsSignUpActive(true)}
                  className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-bold py-3 px-12 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small icon components to avoid external deps
const GoogleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.108 17.64 11.84 17.64 9.2z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#0A66C2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default LoginPage;

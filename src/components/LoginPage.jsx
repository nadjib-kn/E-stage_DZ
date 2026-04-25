import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const location = useLocation(); // <-- Added useLocation
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Initialize states with values from navigation (if they exist), otherwise default
  const [isSignUpActive, setIsSignUpActive] = useState(location.state?.isSignUp || false);
  const [registerRole, setRegisterRole] = useState(location.state?.role || 'student');

  // Watch for state changes in case the user navigates directly while already on the page
  useEffect(() => {
    if (location.state) {
      if (location.state.isSignUp !== undefined) setIsSignUpActive(location.state.isSignUp);
      if (location.state.role) setRegisterRole(location.state.role);
    }
  }, [location.state]);

  // Login States
  const [loginEmail, setLoginEmail] = useState('amine@univ-alger.dz'); 
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Register States
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState({ type: '', text: '' });

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const result = login(loginEmail, loginPassword);

    if (result.success) {
      if (result.role === 'student') navigate('/student');
      else if (result.role === 'company') navigate('/company');
      else if (result.role === 'admin') navigate('/admin');
    } else {
      setLoginError(result.message || 'Invalid email or password. Please try again.');
    }
  };

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterMessage({ type: '', text: '' });

    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    const result = register(registerRole, registerName, registerEmail, registerPassword);

    if (result.success) {
      setRegisterMessage({ type: 'success', text: result.message });
      // Clear form
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      // Optionally switch back to login tab after 2 seconds
      if (registerRole === 'student') {
        setTimeout(() => setIsSignUpActive(false), 2000);
      }
    } else {
      setRegisterMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="w-full max-w-[900px] flex flex-col items-start">
        
        <Link to="/" className="mb-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#2563EB] transition-colors font-semibold text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="relative w-full h-[600px] bg-white dark:bg-slate-800 rounded-[2rem] shadow-[0_25px_60px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden">
          
          {/* =========================================
              1. SIGN UP FORM
              ========================================= */}
          <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 bg-white dark:bg-slate-800 transition-all duration-700 ease-in-out ${isSignUpActive ? 'translate-x-full opacity-100 z-50' : 'opacity-0 z-10'}`}>
            <form className="flex flex-col w-full text-center sm:text-left" onSubmit={handleRegister}>
              <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white mb-1">Create account</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Join E-Stage DZ to unlock opportunities.</p>
              
              {registerMessage.text && (
                <div className={`text-sm p-3 rounded-lg mb-4 border ${registerMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                  {registerMessage.text}
                </div>
              )}
              
              <div className="relative flex w-full bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-4">
                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-600 rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${registerRole === 'company' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                <button type="button" onClick={() => setRegisterRole('student')} className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === 'student' ? 'text-[#2563EB]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>Student</button>
                <button type="button" onClick={() => setRegisterRole('company')} className={`relative z-10 flex-1 text-sm font-bold py-2.5 transition-colors duration-300 ${registerRole === 'company' ? 'text-[#2563EB]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>Company</button>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <input type="text" placeholder={registerRole === 'student' ? "Full Name" : "Company Name"} value={registerName} onChange={(e) => setRegisterName(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 text-[#0f172a] dark:text-white text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                <input type="email" placeholder={registerRole === 'student' ? "University Email" : "Work Email"} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 text-[#0f172a] dark:text-white text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 text-[#0f172a] dark:text-white text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
              </div>
              
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]">
                Sign Up
              </button>

              <div className="relative flex items-center justify-center w-full mt-5 mb-3">
                <div className="absolute w-full border-t border-slate-200 dark:border-slate-600"></div>
                <span className="bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-400 relative z-10">Or continue with</span>
              </div>

              <div className="flex gap-3">
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 text-[#0f172a] dark:text-white text-sm font-semibold py-2.5 rounded-full transition-all">Google</button>
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 text-[#0f172a] dark:text-white text-sm font-semibold py-2.5 rounded-full transition-all">LinkedIn</button>
              </div>
            </form>
          </div>

          {/* =========================================
              2. SIGN IN FORM
              ========================================= */}
          <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 bg-white dark:bg-slate-800 transition-all duration-700 ease-in-out z-20 ${isSignUpActive ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
            <form className="flex flex-col w-full text-center sm:text-left" onSubmit={handleLogin}>
              <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white mb-1">Welcome back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Please enter your details to sign in.</p>
              
              {loginError && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
                  {loginError}
                </div>
              )}
              
              <div className="flex flex-col gap-4 mb-2">
                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 text-[#0f172a] dark:text-white text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 text-[#0f172a] dark:text-white text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
              </div>
              
              <div className="flex justify-end mb-6 mt-1">
                <a href="#" className="text-sm font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors">Forgot password?</a>
              </div>
              
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]">
                Sign In
              </button>

              <div className="relative flex items-center justify-center w-full mt-6 mb-4">
                <div className="absolute w-full border-t border-slate-200 dark:border-slate-600"></div>
                <span className="bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-400 relative z-10">Or continue with</span>
              </div>

              <div className="flex gap-3">
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 text-[#0f172a] dark:text-white text-sm font-semibold py-3 rounded-full transition-all">Google</button>
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 text-[#0f172a] dark:text-white text-sm font-semibold py-3 rounded-full transition-all">LinkedIn</button>
              </div>
            </form>
          </div>

          {/* =========================================
              3. SLIDING OVERLAY CONTAINER
              ========================================= */}
          <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100] ${isSignUpActive ? '-translate-x-full rounded-r-[100px]' : 'translate-x-0 rounded-l-[100px]'}`}>
            <div className={`absolute top-0 -left-full w-[200%] h-full bg-gradient-to-br from-[#2563EB] via-[#3b82f6] to-[#14B8A6] transition-all duration-700 ease-in-out ${isSignUpActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
              <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 text-center text-white transition-all duration-700 ease-in-out ${isSignUpActive ? 'translate-x-0 opacity-100' : '-translate-x-[20%] opacity-0'}`}>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Already have an account?</h2>
                <p className="text-white/90 text-sm leading-relaxed mb-8">Sign in to your dashboard to manage your internship applications and company profile.</p>
                <button onClick={() => setIsSignUpActive(false)} className="bg-transparent border-2 border-white/80 text-white text-sm font-bold py-3 px-12 rounded-full hover:bg-white hover:text-[#2563EB] transition-all">Sign In</button>
              </div>
              <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-14 text-center text-white transition-all duration-700 ease-in-out ${isSignUpActive ? 'translate-x-[20%] opacity-0' : 'translate-x-0 opacity-100'}`}>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight">New to E-Stage?</h2>
                <p className="text-white/90 text-sm leading-relaxed mb-8">Create an account to start exploring the best internship opportunities across Algeria.</p>
                <button onClick={() => setIsSignUpActive(true)} className="bg-transparent border-2 border-white/80 text-white text-sm font-bold py-3 px-12 rounded-full hover:bg-white hover:text-[#2563EB] transition-all">Sign Up</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
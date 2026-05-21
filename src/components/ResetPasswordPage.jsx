import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
    }
  };

  const inputClass =
    "w-full text-sm rounded-xl px-5 py-3.5 transition-all placeholder:text-slate-400 focus:outline-none " +
    "bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 " +
    "dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700/80 dark:placeholder:text-slate-500 " +
    "dark:focus:border-blue-400 dark:focus:ring-blue-400/15 dark:focus:bg-slate-900/80";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080d1a]">
        <div className="text-center p-8 bg-white dark:bg-[#0f1629] rounded-3xl shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Link</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The password reset link is missing or invalid. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 font-sans transition-colors duration-300
      bg-gradient-to-br from-slate-50 to-slate-100
      dark:bg-[#080d1a] dark:[background-image:radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.18)_0%,transparent_70%)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-[#0f1629] rounded-[2rem] overflow-hidden shadow-[0_25px_60px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_60px_-12px_rgba(0,0,0,0.7),0_0_80px_-20px_rgba(37,99,235,0.12)]"
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)' }} />

        <div className="p-8 sm:p-10">
          {!success ? (
            <motion.div key="reset-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Set new password
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Your new password must be different to previously used passwords.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    required
                    className={inputClass}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm p-3 rounded-xl border bg-red-50 text-red-500 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/60"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Updating...
                    </>
                  ) : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="reset-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Password Reset!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                Your password has been successfully reset. Redirecting you to login...
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-lg"
              >
                Go to Login
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;

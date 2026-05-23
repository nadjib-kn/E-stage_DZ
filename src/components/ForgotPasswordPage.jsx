import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// E-Stage DZ logo mark (same style used across the app)
const LogoMark = () => (
  <div className="flex items-center justify-center gap-2 mb-8">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0ea5e9 100%)' }}
    >
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
      E-Stage <span className="text-blue-600 dark:text-blue-400">DZ</span>
    </span>
  </div>
);

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [step, setStep] = useState('email'); // 'email' | 'sent'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await forgotPassword(trimmed);
    setLoading(false);
    if (result.success) {
      setStep('sent');
    } else {
      setError(result.message || 'Something went wrong. Please try again.');
    }
  };

  const inputClass =
    'w-full text-sm rounded-xl px-4 py-3.5 transition-all placeholder:text-slate-400 focus:outline-none ' +
    'bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ' +
    'dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700/80 dark:placeholder:text-slate-500 ' +
    'dark:focus:border-blue-400 dark:focus:ring-blue-400/15 dark:focus:bg-slate-900/80';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300
      bg-gradient-to-br from-slate-50 to-slate-100
      dark:bg-[#080d1a] dark:[background-image:radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.18)_0%,transparent_70%)]"
    >
      <AnimatePresence mode="wait">

        {/* ── STEP 1: Find your account ─────────────────────────────────── */}
        {step === 'email' && (
          <motion.div
            key="step-email"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            {/* Card */}
            <div className="bg-white dark:bg-[#0f1629] rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(15,23,42,0.10)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-12px_rgba(0,0,0,0.7),0_0_60px_-20px_rgba(37,99,235,0.12)] border border-slate-100 dark:border-transparent">

              {/* Top gradient accent */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)' }} />

              <div className="p-8">
                <LogoMark />

                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2 tracking-tight">
                  Find your account
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 leading-relaxed">
                  Enter the email associated with your E-Stage DZ account and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Email field */}
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
                    >
                      Email address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className={inputClass}
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        key="err"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-sm text-red-500 dark:text-red-400 flex items-start gap-2 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-800/50 rounded-xl px-3 py-2.5"
                      >
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Action buttons – Google style: Back left, Next right */}
                  <div className="flex items-center justify-between gap-3 mt-2">
                    <Link
                      to="/login"
                      className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      Back to Sign In
                    </Link>

                    <button
                      id="forgot-next-btn"
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold px-7 py-2.5 rounded-full transition-all shadow-[0_6px_16px_-4px_rgba(37,99,235,0.45)] dark:shadow-[0_6px_20px_-4px_rgba(59,130,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Next
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Help link below the card */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
              Don't have an account?{' '}
              <Link
                to="/login"
                state={{ isSignUp: true }}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        )}

        {/* ── STEP 2: Email sent confirmation ──────────────────────────── */}
        {step === 'sent' && (
          <motion.div
            key="step-sent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <div className="bg-white dark:bg-[#0f1629] rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(15,23,42,0.10)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-12px_rgba(0,0,0,0.7),0_0_60px_-20px_rgba(37,99,235,0.12)] border border-slate-100 dark:border-transparent">

              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)' }} />

              <div className="p-8 flex flex-col items-center text-center">
                <LogoMark />

                {/* Animated checkmark circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30"
                >
                  {/* Envelope icon */}
                  <svg className="w-9 h-9 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.div>

                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Check your inbox
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 break-all px-2">
                  {email}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mt-1 mb-8">
                  The link expires in 1 hour. Didn't receive it?{' '}
                  <button
                    onClick={() => { setStep('email'); setError(''); }}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Try again
                  </button>
                  {' '}or check your spam folder.
                </p>

                <button
                  id="forgot-back-login-btn"
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-full transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)]"
                >
                  Back to Sign In
                </button>

                <button
                  onClick={() => { setStep('email'); setError(''); }}
                  className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-1"
                >
                  Try a different email
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordPage;

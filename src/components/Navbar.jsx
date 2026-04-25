import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import assets from '../assets/assets';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95
        ${isDark 
          ? 'bg-slate-700 text-amber-400 hover:bg-slate-600 shadow-[0_0_12px_rgba(251,191,36,0.15)]' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        } ${className}`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 absolute inset-0 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {/* Moon Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 absolute inset-0 transition-all duration-500 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = (e, targetId) => {
    e.preventDefault(); 
    setIsMenuOpen(false); // Closes mobile menu automatically

    // If we are NOT on the home page (e.g., on the Login page), go to Home first, then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Tiny delay to let the home page load before scrolling
      return;
    }

    // If we are already on the home page, just scroll smoothly
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-50 backdrop-blur-xl font-medium bg-white/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800 relative transition-colors duration-300">
      
      {/* 1. LOGO SECTION */}
      <div className="flex-shrink-0 cursor-pointer">
        <a href="#home" onClick={(e) => handleScroll(e, 'home')}>
          <img src={assets.logo} alt="E-Stage DZ Logo" className="h-7 sm:h-8 w-auto dark:brightness-200 dark:contrast-150" />
        </a>
      </div>

      {/* 2. DESKTOP Navigation Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-300">
        <li>
          <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="hover:text-[#2563EB] transition-colors duration-300 font-semibold cursor-pointer">Home</a>
        </li>
        <li>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-[#2563EB] transition-colors duration-300 font-semibold cursor-pointer">Features</a>
        </li>
        <li>
          <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-[#2563EB] transition-colors duration-300 font-semibold cursor-pointer">How it Works</a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-[#2563EB] transition-colors duration-300 font-semibold cursor-pointer">Contact Us</a>
        </li>
      </ul>

      {/* 3. Right Section: Theme Toggle, Action Button & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 z-50">
        
        {/* THEME TOGGLE - Positioned before Login */}
        <ThemeToggle />

        {/* LOGIN BUTTON - Now a React Router Link! */}
        <Link 
          to="/login"
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_8px_16px_-6px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-6px_rgba(37,99,235,0.6)] text-center block"
        >
          Login / Register
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-[#2563EB] focus:outline-none p-1 transition-transform duration-300 active:scale-95" 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 4. MOBILE Navigation Menu (Dropdown) */}
      <div 
        className={`absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-xl flex flex-col items-center py-6 gap-6 md:hidden transition-all duration-400 ease-in-out transform origin-top ${
          isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="text-gray-800 dark:text-gray-200 hover:text-[#2563EB] transition-colors font-medium w-full text-center py-2 cursor-pointer">Home</a>
        <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-gray-800 dark:text-gray-200 hover:text-[#2563EB] transition-colors font-medium w-full text-center py-2 cursor-pointer">Features</a>
        <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="text-gray-800 dark:text-gray-200 hover:text-[#2563EB] transition-colors font-medium w-full text-center py-2 cursor-pointer">How it Works</a>
        <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-gray-800 dark:text-gray-200 hover:text-[#2563EB] transition-colors font-medium w-full text-center py-2 cursor-pointer">Contact Us</a>
      </div>

    </nav>
  );
};

export { ThemeToggle };
export default Navbar;
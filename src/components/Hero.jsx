import React from 'react';
import { useNavigate } from 'react-router-dom';
// Make sure you are importing your assets file at the top!
import assets from '../assets/assets'; 

const Hero = () => {
  const navigate = useNavigate(); // <-- Added useNavigate

  return (
    <section className="relative w-full flex-1 flex items-center bg-white dark:bg-slate-900 overflow-hidden mt-[10px] transition-colors duration-300">
      
      {/* INNER CONTAINER */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 z-10">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex-1 flex flex-col items-start w-full max-w-2xl">
          
          {/* Badge */}
          <div className="bg-[#eff6ff] dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase mb-6">
            Empowering Algerian Talent
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-[#0f172a] dark:text-white leading-[1.1] tracking-tight mb-8">
            Your Bridge to <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-teal-400 bg-clip-text text-transparent">
              Professional 
            </span> <br />
            <span className="text-[#2563EB]">Life</span> in Algeria.
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed mb-10 max-w-[500px]">
            A dedicated platform connecting ambitious university students with real-world internship opportunities across Algeria's top enterprises.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            
            {/* PRIMARY BUTTON - Navigates to Register as Student */}
            <button 
              onClick={() => navigate('/login', { state: { isSignUp: true, role: 'student' } })}
              className="w-full sm:w-auto flex justify-center items-center gap-3 bg-[#2563EB] hover:bg-blue-700 text-white px-9 py-4 rounded-full font-bold text-lg transition-all shadow-[0_12px_24px_-6px_rgba(37,99,235,0.5)] group"
            >
              I am a Student
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 transform group-hover:translate-x-1.5 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* SECONDARY BUTTON - Navigates to Register as Company */}
            <button 
              onClick={() => navigate('/login', { state: { isSignUp: true, role: 'company' } })}
              className="w-full sm:w-auto bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-[#0f172a] dark:text-white px-9 py-4 rounded-full font-bold text-lg transition-all"
            >
              I am a Company
            </button>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Visual / Image Card */}
        <div className="flex-1 w-full relative flex justify-center lg:justify-end mt-12 lg:mt-0">
          
          {/* Background Glow Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none flex justify-center items-center">
            <div className="absolute w-[300px] h-[300px] bg-blue-200/40 dark:bg-blue-500/20 rounded-full blur-[80px] -translate-x-10 translate-y-10"></div>
            <div className="absolute w-[300px] h-[300px] bg-teal-200/30 dark:bg-teal-500/15 rounded-full blur-[80px] translate-x-20 -translate-y-20"></div>
          </div>

          {/* THE IMAGE CARD */}
          <div className="relative w-full max-w-[600px] aspect-[4/3] bg-white dark:bg-slate-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-slate-700 z-10 overflow-hidden group">
            
            <img 
              src={assets.herophoto} 
              alt="Students and professionals connecting" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
          </div>
          
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
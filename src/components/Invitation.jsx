import React from 'react';
import { useNavigate } from 'react-router-dom';

const Invitation = () => {
  const navigate = useNavigate(); // <-- Initialize navigate

  return (
    <section className="relative w-full py-12 md:py-20 px-6 overflow-hidden bg-[#2563EB]">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      
      {/* Animated SVG Watermark - Scaled for smaller height */}
      <div className="absolute -right-12 -bottom-12 md:right-4 md:bottom-[-20px] lg:right-[8%] opacity-20 pointer-events-none select-none w-48 md:w-80 lg:w-[420px] animate-pulse-slow">
        <svg 
          viewBox="0 0 250 250" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-xl"
        >
          <path d="M125 250C107.708 250 91.4583 246.719 76.25 240.156C61.0417 233.594 47.8125 224.688 36.5625 213.438C25.3125 202.188 16.4062 188.958 9.84375 173.75C3.28125 158.542 0 142.292 0 125C0 107.708 3.28125 91.4583 9.84375 76.25C16.4062 61.0417 25.3125 47.8125 36.5625 36.5625C47.8125 25.3125 61.0417 16.4062 76.25 9.84375C91.4583 3.28125 107.708 0 125 0C142.292 0 158.542 3.28125 173.75 9.84375C188.958 16.4062 202.188 25.3125 213.438 36.5625C224.688 47.8125 233.594 61.0417 240.156 76.25C246.719 91.4583 250 107.708 250 125C250 142.292 246.719 158.542 240.156 173.75C233.594 188.958 224.688 202.188 213.438 213.438C202.188 224.688 188.958 233.594 173.75 240.156C158.542 246.719 142.292 250 125 250ZM112.5 224.375V200C105.625 200 99.7396 197.552 94.8438 192.656C89.9479 187.76 87.5 181.875 87.5 175V162.5L27.5 102.5C26.875 106.25 26.3021 110 25.7812 113.75C25.2604 117.5 25 121.25 25 125C25 150.208 33.2812 172.292 49.8438 191.25C66.4062 210.208 87.2917 221.25 112.5 224.375ZM198.75 192.5C207.292 183.125 213.802 172.656 218.281 161.094C222.76 149.531 225 137.5 225 125C225 104.583 219.323 85.9375 207.969 69.0625C196.615 52.1875 181.458 40 162.5 32.5V37.5C162.5 44.375 160.052 50.2604 155.156 55.1562C150.26 60.0521 144.375 62.5 137.5 62.5H112.5V87.5C112.5 91.0417 111.302 94.0104 108.906 96.4062C106.51 98.8021 103.542 100 100 100H75V125H150C153.542 125 156.51 126.198 158.906 128.594C161.302 130.99 162.5 133.958 162.5 137.5V175H175C180.417 175 185.312 176.615 189.688 179.844C194.062 183.073 197.083 187.292 198.75 192.5Z" fill="white"/>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Compact Badge */}
        <div className="mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] md:text-xs font-semibold tracking-wider backdrop-blur-sm uppercase">
          Start Your Future
        </div>

        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          Ready to start your <br className="hidden sm:block"/> professional journey?
        </h2>
        
        <p className="text-sm md:text-lg text-blue-100/90 mb-8 max-w-xl leading-relaxed">
          Join over <span className="text-white font-bold">5,000+ Algerian students</span> and top companies today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center w-full sm:w-auto">
          {/* Main Action - Student Registration */}
          <button 
            onClick={() => navigate('/login', { state: { isSignUp: true, role: 'student' } })}
            className="group relative w-full sm:w-auto overflow-hidden px-8 py-3.5 bg-white text-[#2563EB] font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 text-sm md:text-base"
          >
            <span className="relative z-10">Create Student Account</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          
          {/* Secondary Action - Company Registration */}
          <button 
            onClick={() => navigate('/login', { state: { isSignUp: true, role: 'company' } })}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/20 active:scale-95 text-sm md:text-base"
          >
            Register Your Company
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.1; }
          50% { transform: scale(1.03) translate(-5px, -5px); opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}} />
    </section>
  );
};

export default Invitation;
import React, { useState } from 'react';

const ContactInfoItem = ({ icon, title, details }) => (
  <div className="flex items-center gap-4 sm:gap-5 group/item cursor-pointer p-3 -ml-3 rounded-xl transition-all duration-500 hover:bg-white/10">
    <div 
      className="flex items-center justify-center shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 text-white transition-all duration-500 group-hover/item:bg-white group-hover/item:text-[#2563EB] group-hover/item:shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover/item:scale-110"
    >
      {icon}
    </div>
    <div className="transition-transform duration-300 group-hover/item:translate-x-1 overflow-hidden min-w-0">
      <h4 className="text-[14px] text-blue-200 font-medium mb-0.5">{title}</h4>
      <p className="text-[16px] font-bold text-white tracking-wide break-words">{details}</p>
    </div>
  </div>
);

const ContactUs = ({ title = "Contact Us", subText = "Have questions? Our team is here to help you take the next step." }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isHoveringBtn, setIsHoveringBtn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const supportEmail = "support@internship-platform.dz";
    const subject = encodeURIComponent(`New Contact Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-slate-50/50 dark:bg-slate-900 py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden flex justify-center transition-colors duration-500">
      <div className="w-full max-w-6xl relative z-10 animate-fade-in-up">

        {/* --- Integrated Centered Title Section --- */}
        <div className="flex flex-col items-center justify-center mb-9 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight text-center transition-colors">
            {title}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#2563EB] to-teal-400 rounded-full mt-4 sm:mt-5 md:mt-6 mb-4 sm:mb-5 md:mb-6 opacity-90"></div>
          {subText && (
            <p className="text-[#64748B] dark:text-slate-400 max-w-2xl text-[16px] sm:text-lg leading-relaxed px-2 transition-colors">
              {subText}
            </p>
          )}
        </div>

        {/* --- Unified Contact Card --- */}
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_80px_-15px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_80px_-15px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-700/50 transition-all duration-500 hover:shadow-[0_30px_100px_-15px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_30px_100px_-15px_rgba(0,0,0,0.6)]">
          
          {/* Left Column: Dark Blue Info Panel */}
          <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] p-6 sm:p-8 lg:p-10 md:w-[45%] relative overflow-hidden flex flex-col justify-between group/panel">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover/panel:scale-110"></div>
            <div className="absolute bottom-0 left-0 translate-y-10 -translate-x-10 w-48 sm:w-64 h-48 sm:h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover/panel:scale-110"></div>
            
            <div className="relative z-10 mb-8 md:mb-10 lg:mb-0">
              <h3 className="text-3xl font-bold text-white mb-3 md:mb-4 tracking-tight">Get in touch</h3>
              <p className="text-blue-100/90 text-[16px] leading-relaxed mb-8 md:mb-10 max-w-sm">
                We'd love to hear from you. Fill out the form or contact us directly using the details below.
              </p>

              <div className="flex flex-col gap-4 sm:gap-5">
                <ContactInfoItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  title="Email us at"
                  details="support@internship-platform.dz"
                />
                
                <ContactInfoItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                  title="Call us on"
                  details="+213 000000000"
                />
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="p-6 sm:p-8 lg:p-10 md:w-[55%] bg-white dark:bg-slate-800 relative z-10 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white mb-5 sm:mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                <div className="flex flex-col gap-1.5 group/input">
                  <label htmlFor="name" className="text-[13px] font-bold text-slate-600 dark:text-slate-400 transition-colors group-focus-within/input:text-[#2563EB] dark:group-focus-within/input:text-blue-400">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe" 
                    className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white text-[14px] rounded-xl px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] dark:focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5 group/input">
                  <label htmlFor="email" className="text-[13px] font-bold text-slate-600 dark:text-slate-400 transition-colors group-focus-within/input:text-[#2563EB] dark:group-focus-within/input:text-blue-400">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com" 
                    className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white text-[14px] rounded-xl px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] dark:focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 group/input">
                <label htmlFor="message" className="text-[13px] font-bold text-slate-600 dark:text-slate-400 transition-colors group-focus-within/input:text-[#2563EB] dark:group-focus-within/input:text-blue-400">Message</label>
                <textarea 
                  id="message" 
                  rows="3" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can our team help you?" 
                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white text-[14px] rounded-xl px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] dark:focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                onMouseEnter={() => setIsHoveringBtn(true)}
                onMouseLeave={() => setIsHoveringBtn(false)}
                className="mt-2 w-full sm:w-auto self-end bg-[#2563EB] hover:bg-[#1E40AF] text-white text-[14px] font-bold rounded-xl py-3 px-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] flex justify-center items-center gap-2 overflow-hidden relative"
              >
                <span className="relative z-10">Send Message</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-5 h-5 relative z-10 transition-transform duration-500 ${isHoveringBtn ? 'translate-x-1' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

            </form>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </section>
  );
};

export default ContactUs;
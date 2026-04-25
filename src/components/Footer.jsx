import React from 'react';
import assets from '../assets/assets';

// Reusable micro-component for footer links
const FooterLink = ({ href, text }) => (
  <li>
    <a 
      href={href} 
      className="text-[14px] text-slate-500 dark:text-slate-400 hover:text-[#2563EB] transition-colors duration-200"
    >
      {text}
    </a>
  </li>
);

// Reusable micro-component for social icons
const SocialIcon = ({ href, children }) => (
  <a 
    href={href} 
    className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-[#2563EB] hover:text-white transition-all duration-300"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 pt-10 pb-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <div className="mb-3">
              <img src={assets.logo} alt="" className="dark:brightness-200 dark:contrast-150" />
            </div>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-5 max-w-sm">
              Connecting ambitious talent with top-tier companies. Building the bridge to exceptional career opportunities.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <SocialIcon href="#">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#" text="Browse internships" />
              <FooterLink href="#" text="For Students" />
              <FooterLink href="#" text="For Companies" />
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#" text="About Us" />
              <FooterLink href="#" text="Features" />
              <FooterLink href="#" text="Contact Support" />
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-slate-400">
            © {new Date().getFullYear()} YourCompany. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-[13px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[13px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
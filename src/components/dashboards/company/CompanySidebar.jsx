import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isDark ? 'text-amber-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      {isDark ? (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}; 

const CompanySidebar = () => {
  const navigate = useNavigate();
  // We pull the dynamically updating currentUser from our AuthContext
  const { currentUser, logout } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = (e) => {
    e.stopPropagation(); 
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  // These variables will instantly update when currentUser updates!
  const avatarImage = currentUser?.avatar || "https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp&backgroundColor=ffffff";
  const companyName = currentUser?.companyName || "TechCorp DZ";
  const industry = currentUser?.industry || "Software Development";

  return (
    <div className="w-64 bg-white dark:bg-slate-800 h-full border-r border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0 transition-colors duration-300">
      
      {/* 1. Top Logo Section */}
      <div className="p-6 pb-3">
        <div className="px-2">
          {/* Brand SVG Logo */}
          <svg width="153" height="34" viewBox="0 0 153 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-auto h-10">
            <rect width="38" height="34" rx="16" fill="#2563EB"/>
            <path d="M19 26L12 22.2V16.2L8 14L19 8L30 14V22H28V15.1L26 16.2V22.2L19 26ZM19 17.7L25.85 14L19 10.3L12.15 14L19 17.7ZM19 23.725L24 21.025V17.25L19 20L14 17.25V21.025L19 23.725Z" fill="white"/>
            <path d="M47.3148 24V9.44922H57.0575V11.9231H50.2989V15.4351H56.542V17.8668H50.2989V21.5261H57.0768V24H47.3148ZM65.6365 15.5644V17.9028H59.0178V15.5644H65.6365ZM73.1572 24.2117C71.993 24.2117 70.9795 24.0328 70.1166 23.6749C69.2537 23.317 68.5813 22.7871 68.0994 22.0852C67.6175 21.3833 67.3613 20.5165 67.3308 19.4847H70.2319C70.2699 19.9753 70.4159 20.3849 70.6699 20.7133C70.9238 21.0418 71.2629 21.2879 71.6871 21.4516C72.1113 21.6153 72.5908 21.6972 73.1256 21.6972C73.6566 21.6972 74.12 21.6197 74.5157 21.4646C74.9115 21.3095 75.2193 21.092 75.4391 20.8122C75.659 20.5323 75.7689 20.209 75.7689 19.8424C75.7689 19.5072 75.6705 19.2274 75.4736 19.003C75.2767 18.7786 74.9918 18.5861 74.6189 18.4254C74.246 18.2647 73.7939 18.1216 73.2625 17.9959L71.6629 17.5981C70.4312 17.2977 69.4662 16.8268 68.7677 16.1855C68.0692 15.5441 67.7199 14.6942 67.7199 13.6358C67.7199 12.7592 67.9571 11.9922 68.4314 11.3348C68.9058 10.6774 69.5548 10.1662 70.3786 9.80127C71.2024 9.43636 72.141 9.25391 73.1945 9.25391C74.2711 9.25391 75.2098 9.43812 76.0105 9.80655C76.8112 10.175 77.4353 10.6857 77.8829 11.3387C78.3304 11.9917 78.5619 12.744 78.5774 13.5957H75.6957C75.6392 13.0127 75.3894 12.5609 74.9464 12.2403C74.5033 11.9197 73.9104 11.7594 73.1676 11.7594C72.6621 11.7594 72.2305 11.8321 71.8728 11.9774C71.5151 12.1227 71.2429 12.3227 71.0563 12.5773C70.8697 12.8319 70.7764 13.122 70.7764 13.4477C70.7764 13.8043 70.8851 14.1003 71.1024 14.3357C71.3197 14.5711 71.6062 14.7628 71.9618 14.9107C72.3173 15.0586 72.6991 15.1814 73.1069 15.2791L74.4196 15.6004C75.0317 15.7397 75.6019 15.9269 76.1301 16.1619C76.6584 16.3969 77.1207 16.6851 77.517 17.0266C77.9132 17.368 78.2216 17.7723 78.442 18.2395C78.6625 18.7068 78.7727 19.2456 78.7727 19.8558C78.7727 20.738 78.5502 21.506 78.1051 22.1599C77.6601 22.8137 77.019 23.3191 76.1821 23.6762C75.3451 24.0332 74.3368 24.2117 73.1572 24.2117ZM85.7727 13.082V15.3137H79.2949V13.082H85.7727ZM80.7984 10.4844H83.727V20.8041C83.727 21.1517 83.8043 21.408 83.959 21.5728C84.1136 21.7376 84.3675 21.8201 84.7208 21.8201C84.8349 21.8201 84.9924 21.8062 85.193 21.7784C85.3937 21.7506 85.5463 21.7236 85.6508 21.6976L86.0702 23.8939C85.7437 23.9907 85.4201 24.058 85.0994 24.0958C84.7786 24.1336 84.4709 24.1525 84.1762 24.1525C83.081 24.1525 82.2442 23.8868 81.6659 23.3554C81.0876 22.8239 81.0876 22.0595 80.7984 21.0621V10.4844ZM90.3205 24.2117C89.6269 24.2117 89.0055 24.0894 88.4564 23.8448C87.9073 23.6002 87.4756 23.2361 87.1611 22.7523C86.8467 22.2686 86.6894 21.6669 86.6894 20.9473C86.6894 20.3363 86.8008 19.8268 87.0236 19.4186C87.2464 19.0104 87.5513 18.6816 87.9384 18.4324C88.3254 18.1832 88.7652 17.9936 89.2577 17.8636C89.7502 17.7336 90.2662 17.643 90.8056 17.592C91.4356 17.5284 91.9442 17.4686 92.3315 17.4125C92.7188 17.3564 93.003 17.2686 93.184 17.1491C93.3649 17.0296 93.4554 16.8523 93.4554 16.617V16.5689C93.4554 16.2574 93.3893 15.9938 93.2569 15.7782C93.1245 15.5627 92.9313 15.3975 92.6771 15.2828C92.423 15.168 92.1105 15.1106 91.7398 15.1106C91.3667 15.1106 91.0403 15.1674 90.7606 15.2809C90.4809 15.3944 90.2519 15.546 90.0735 15.7357C89.8951 15.9253 89.7667 16.1383 89.6881 16.3746L87.0019 15.9287C87.187 15.2928 87.4978 14.7534 87.9343 14.3105C88.3709 13.8676 88.9135 13.5293 89.562 13.2957C90.2105 13.0621 90.9395 12.9453 91.749 12.9453C92.3351 12.9453 92.9049 13.0147 93.4582 13.1536C94.0116 13.2925 94.5083 13.5097 94.9483 13.8053C95.3883 14.1009 95.7376 14.4831 95.9961 14.952C96.2547 15.4208 96.384 15.9868 96.384 16.6498V24H93.606V22.484H93.5099C93.3335 22.8223 93.0989 23.1212 92.8061 23.3809C92.5133 23.6405 92.1612 23.8439 91.7496 23.991C91.338 24.1381 90.8616 24.2117 90.3205 24.2117ZM91.1453 22.158C91.6065 22.158 92.0116 22.0662 92.3606 21.8826C92.7096 21.699 92.9829 21.4512 93.1803 21.1392C93.3778 20.8273 93.4765 20.4798 93.4765 20.0969V18.9155C93.3873 18.9755 93.2557 19.0318 93.0816 19.0843C92.9075 19.1368 92.7133 19.1839 92.499 19.2254C92.2847 19.2669 92.0731 19.303 91.8643 19.3335C91.6554 19.364 91.4699 19.3908 91.3076 19.4139C90.9477 19.4625 90.6313 19.5449 90.3584 19.6613C90.0855 19.7778 89.8735 19.9334 89.7225 20.1283C89.5715 20.3232 89.496 20.5675 89.496 20.8611C89.496 21.1438 89.5672 21.3813 89.7098 21.5737C89.8524 21.7661 90.0472 21.9116 90.2944 22.0101C90.5415 22.1087 90.8252 22.158 91.1453 22.158ZM103.231 28.3164C102.322 28.3164 101.53 28.2016 100.855 27.9719C100.179 27.7422 99.6296 27.4255 99.2055 27.022C98.7815 26.6184 98.489 26.1565 98.3279 25.6363L100.845 24.9398C100.938 25.1411 101.08 25.338 101.271 25.5303C101.462 25.7227 101.716 25.8803 102.034 26.0031C102.353 26.1259 102.748 26.1873 103.221 26.1873C103.967 26.1873 104.554 26.0158 104.981 25.673C105.409 25.3302 105.623 24.7974 105.623 24.0748V22.0666H105.394C105.263 22.3593 105.074 22.6419 104.826 22.9143C104.579 23.1867 104.255 23.4099 103.854 23.5841C103.454 23.7582 102.958 23.8453 102.368 23.8453C101.548 23.8453 100.802 23.6527 100.13 23.2674C99.4581 22.8821 98.9229 22.2958 98.5245 21.5086C98.1261 20.7214 97.9269 19.7264 97.9269 18.5238C97.9269 17.2921 98.1299 16.2629 98.5358 15.4363C98.9417 14.6098 99.4815 13.9879 100.155 13.5709C100.828 13.1538 101.568 12.9453 102.375 12.9453C102.99 12.9453 103.505 13.0486 103.92 13.2551C104.334 13.4616 104.671 13.7181 104.928 14.0246C105.186 14.3311 105.382 14.6295 105.516 14.9197H105.635V13.082H108.52V23.9088C108.52 24.892 108.293 25.7104 107.84 26.3641C107.387 27.0179 106.763 27.5067 105.968 27.8306C105.173 28.1545 104.261 28.3164 103.231 28.3164ZM103.283 21.6183C103.785 21.6183 104.211 21.4951 104.559 21.2486C104.908 21.0021 105.174 20.6459 105.357 20.18C105.54 19.714 105.632 19.156 105.632 18.5059C105.632 17.8577 105.541 17.2935 105.359 16.8133C105.177 16.3331 104.912 15.9596 104.564 15.6929C104.215 15.4262 103.788 15.2928 103.283 15.2928C102.772 15.2928 102.342 15.4307 101.992 15.7064C101.642 15.9821 101.378 16.3608 101.2 16.8425C101.021 17.3242 100.932 17.8787 100.932 18.5059C100.932 19.1385 101.022 19.6886 101.202 20.156C101.382 20.6235 101.647 20.984 101.997 21.2378C102.346 21.4915 102.775 21.6183 103.283 21.6183ZM115.455 24.2133C114.341 24.2133 113.38 23.9851 112.573 23.5286C111.765 23.0722 111.146 22.424 110.713 21.5842C110.28 20.7443 110.064 19.7487 110.064 18.5973C110.064 17.474 110.279 16.4885 110.709 15.6409C111.139 14.7933 111.747 14.1322 112.533 13.6574C113.32 13.1827 114.245 12.9453 115.308 12.9453C116.021 12.9453 116.687 13.0589 117.307 13.2861C117.926 13.5134 118.47 13.856 118.937 14.3141C119.405 14.7721 119.771 15.3477 120.033 16.0408C120.296 16.7339 120.428 17.5481 120.428 18.4834V19.3055H111.266V17.4625H119.001L117.632 17.9566C117.632 17.3881 117.545 16.8941 117.371 16.4746C117.198 16.0551 116.941 15.7297 116.6 15.4983C116.259 15.2669 115.835 15.1512 115.329 15.1512C114.823 15.1512 114.393 15.2684 114.04 15.5028C113.688 15.7371 113.419 16.0551 113.235 16.4567C113.051 16.8582 112.959 17.3148 112.959 17.8264V19.1238C112.959 19.7553 113.065 20.2859 113.276 20.7154C113.488 21.145 113.785 21.4677 114.168 21.6836C114.551 21.8994 114.996 22.0074 115.502 22.0074C115.844 22.0074 116.154 21.9587 116.434 21.8614C116.713 21.7641 116.953 21.6199 117.155 21.4291C117.356 21.2382 117.509 21.0029 117.614 20.7232L120.263 21.2131C120.086 21.8162 119.78 22.3428 119.345 22.7929C118.91 23.2429 118.364 23.5922 117.709 23.8406C117.054 24.0891 116.302 24.2133 115.455 24.2133Z" className="fill-slate-900 dark:fill-white"/>
            <path d="M131.851 24H128.082V21.4312H131.712C132.648 21.4312 133.432 21.2656 134.066 20.9344C134.7 20.6032 135.177 20.0892 135.498 19.3923C135.819 18.6953 135.979 17.8034 135.979 16.7164C135.979 15.6319 135.818 14.7434 135.495 14.051C135.172 13.3586 134.696 12.8466 134.067 12.5152C133.438 12.1838 132.659 12.018 131.73 12.018H128.014V9.44922H131.904C133.366 9.44922 134.621 9.73981 135.671 10.321C136.721 10.9022 137.529 11.7356 138.096 12.8214C138.663 13.9071 138.947 15.2055 138.947 16.7164C138.947 18.2298 138.664 19.5309 138.097 20.6196C137.53 21.7084 136.717 22.5439 135.657 23.1264C134.597 23.7088 133.328 24 131.851 24ZM129.719 9.44922V24H126.735V9.44922H129.719ZM140.985 24V22.2168L146.888 13.8786C147.251 13.3721 147.651 12.8639 148.086 12.3541C148.522 11.8444 148.962 11.3377 149.407 10.8342L149.633 11.7983C148.981 11.8585 148.328 11.8943 147.673 11.9058C147.019 11.9173 146.366 11.9231 145.714 11.9231H140.96V9.44922H152.026V11.2414L146.232 19.4286C145.849 19.9612 145.431 20.4938 144.977 21.0263C144.523 21.5589 144.066 22.0884 143.605 22.615L143.378 21.6509C144.062 21.5908 144.743 21.5549 145.424 21.5434C146.104 21.5319 146.784 21.5319 147.463 21.5261H152.052V24H140.985Z" fill="#2563EB"/>
          </svg>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mt-2 ml-1">Company Portal</p>
        </div>
      </div>

      {/* 2. Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <nav className="space-y-1.5">
          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 mt-4">Menu</p>
          
          <NavLink to="/company/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/company/offers" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span>My Offers</span>
          </NavLink>

          <NavLink to="/company/post-offer" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span>Post Offer</span>
          </NavLink>

          <NavLink to="/company/applicants" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span>Applicants</span>
          </NavLink>

          <NavLink to="/company/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span>Company Profile</span>
          </NavLink>

          <NavLink 
              to="/company/support"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Support & Help</span>
          </NavLink>

        </nav>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 pb-2">
        <ThemeToggleButton />
      </div>

      {/* 3. Bottom Profile & Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
  <div 
    onClick={() => navigate('/company/profile')} 
    className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
  >
    
    <div className="flex items-center gap-3 overflow-hidden">
      {/* Changed to rounded-full, removed p-1 and flex alignment to match target design */}
      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden shrink-0">
        <img src={avatarImage} alt={companyName} className="w-full h-full object-cover"/>
      </div>
      <div className="truncate pr-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-[#2563EB] transition-colors">
          {companyName}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5" title={industry}>
          {industry}
        </p>
      </div>
    </div>

    <button 
      onClick={handleLogoutClick}
      title="Logout"
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all shrink-0 z-10"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
    
  </div>
</div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[24px] w-full max-w-sm shadow-2xl relative p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-red-50/50 dark:ring-red-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Log out?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Are you sure you want to log out of your company portal?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                Cancel
              </button>
              <button onClick={confirmLogout} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-red-500/30">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanySidebar;
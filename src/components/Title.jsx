import React from 'react';

const Title = ({ text, subText }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-900 px-4 transition-colors duration-300">
      <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight text-center">
        {text}
      </h2>
      
      {/* The gradient line matching the Contact component */}
      <div className="w-20 h-1.5 bg-gradient-to-r from-[#2563EB] to-teal-400 rounded-full mt-4 mb-5 opacity-90"></div>
      
      {/* Conditionally render the subText if it's provided */}
      {subText && (
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-2xl text-base sm:text-lg leading-relaxed [word-spacing:3px]">
            {subText}
        </p>
      )}
    </div>
  );
};

export default Title;
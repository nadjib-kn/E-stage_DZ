import React from "react";

// Added a "pb" prop that defaults to "pb-12" so it doesn't break your other pages.
const Title = ({ text, subText, pb = "pb-12" }) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center pt-12 ${pb} bg-white dark:bg-slate-900 px-4 transition-colors duration-500 ease-in-out`}
    >
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

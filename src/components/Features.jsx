import React from 'react';

const Features = () => {
  const featuresData = [
    {
      id: 1,
      title: "Verified Companies",
      description: "Work with top-tier Algerian and international firms. Every company is vetted for quality.",
      iconClasses: "text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      watermarkClasses: "-bottom-3 -right-3 w-24 sm:w-28",
      watermark: (
        <svg viewBox="0 0 76 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <g opacity="0.02">
            <path d="M0 90V20H20V0H70V40H90V90H50V70H40V90H0ZM10 80H20V70H10V80ZM10 60H20V50H10V60ZM10 40H20V30H10V40ZM30 60H40V50H30V60ZM30 40H40V30H30V40ZM30 20H40V10H30V20ZM50 60H60V50H50V60ZM50 40H60V30H50V40ZM50 20H60V10H50V20ZM70 80H80V70H70V80ZM70 60H80V50H70V60Z" fill="#0F172A"/>
          </g>
        </svg>
      )
    },
    {
      id: 2,
      title: "Skill Alignment",
      description: "Discover internships perfectly suited to your field of study and technical expertise.",
      iconClasses: "text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      watermarkClasses: "-bottom-5 -right-5 sm:-bottom-6 sm:-right-6 w-[120px] sm:w-[140px]",
      watermark: (
        <svg viewBox="0 0 106 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <g opacity="0.02">
            <path d="M30 115C25.8333 115 22.2917 113.542 19.375 110.625C16.4583 107.708 15 104.167 15 100C15 95.8333 16.4583 92.2917 19.375 89.375C22.2917 86.4583 25.8333 85 30 85C31.1667 85 32.25 85.125 33.25 85.375C34.25 85.625 35.2083 85.9583 36.125 86.375L43.25 77.5C40.9167 74.9167 39.2917 72 38.375 68.75C37.4583 65.5 37.25 62.25 37.75 59L27.625 55.625C26.2083 57.7083 24.4167 59.375 22.25 60.625C20.0833 61.875 17.6667 62.5 15 62.5C10.8333 62.5 7.29167 61.0417 4.375 58.125C1.45833 55.2083 0 51.6667 0 47.5C0 43.3333 1.45833 39.7917 4.375 36.875C7.29167 33.9583 10.8333 32.5 15 32.5C19.1667 32.5 22.7083 33.9583 25.625 36.875C28.5417 39.7917 30 43.3333 30 47.5C30 47.6667 30 47.8333 30 48C30 48.1667 30 48.3333 30 48.5L40.125 52C41.7917 49 44.0208 46.4583 46.8125 44.375C49.6042 42.2917 52.75 40.9583 56.25 40.375V29.5C53 28.5833 50.3125 26.8125 48.1875 24.1875C46.0625 21.5625 45 18.5 45 15C45 10.8333 46.4583 7.29167 49.375 4.375C52.2917 1.45833 55.8333 0 60 0C64.1667 0 67.7083 1.45833 70.625 4.375C73.5417 7.29167 75 10.8333 75 15C75 18.5 73.9167 21.5625 71.75 24.1875C69.5833 26.8125 66.9167 28.5833 63.75 29.5V40.375C67.25 40.9583 70.3958 42.2917 73.1875 44.375C75.9792 46.4583 78.2083 49 79.875 52L90 48.5C90 48.3333 90 48.1667 90 48C90 47.8333 90 47.6667 90 47.5C90 43.3333 91.4583 39.7917 94.375 36.875C97.2917 33.9583 100.833 32.5 105 32.5C109.167 32.5 112.708 33.9583 115.625 36.875C118.542 39.7917 120 43.3333 120 47.5C120 51.6667 118.542 55.2083 115.625 58.125C112.708 61.0417 109.167 62.5 105 62.5C102.333 62.5 99.8958 61.875 97.6875 60.625C95.4792 59.375 93.7083 57.7083 92.375 55.625L82.25 59C82.75 62.25 82.5417 65.4792 81.625 68.6875C80.7083 71.8958 79.0833 74.8333 76.75 77.5L83.875 86.25C84.7917 85.8333 85.75 85.5208 86.75 85.3125C87.75 85.1042 88.8333 85 90 85C94.1667 85 97.7083 86.4583 100.625 89.375C103.542 92.2917 105 95.8333 105 100C105 104.167 103.542 107.708 100.625 110.625C97.7083 113.542 94.1667 115 90 115C85.8333 115 82.2917 113.542 79.375 110.625C76.4583 107.708 75 104.167 75 100C75 98.3333 75.2708 96.7292 75.8125 95.1875C76.3542 93.6458 77.0833 92.25 78 91L70.875 82.125C67.4583 84.0417 63.8125 85 59.9375 85C56.0625 85 52.4167 84.0417 49 82.125L42 91C42.9167 92.25 43.6458 93.6458 44.1875 95.1875C44.7292 96.7292 45 98.3333 45 100C45 104.167 43.5417 107.708 40.625 110.625C37.7083 113.542 34.1667 115 30 115ZM15 52.5C16.4167 52.5 17.6042 52.0208 18.5625 51.0625C19.5208 50.1042 20 48.9167 20 47.5C20 46.0833 19.5208 44.8958 18.5625 43.9375C17.6042 42.9792 16.4167 42.5 15 42.5C13.5833 42.5 12.3958 42.9792 11.4375 43.9375C10.4792 44.8958 10 46.0833 10 47.5C10 48.9167 10.4792 50.1042 11.4375 51.0625C12.3958 52.0208 13.5833 52.5 15 52.5ZM30 105C31.4167 105 32.6042 104.521 33.5625 103.562C34.5208 102.604 35 101.417 35 100C35 98.5833 34.5208 97.3958 33.5625 96.4375C32.6042 95.4792 31.4167 95 30 95C28.5833 95 27.3958 95.4792 26.4375 96.4375C25.4792 97.3958 25 98.5833 25 100C25 101.417 25.4792 102.604 26.4375 103.562C27.3958 104.521 28.5833 105 30 105ZM60 20C61.4167 20 62.6042 19.5208 63.5625 18.5625C64.5208 17.6042 65 16.4167 65 15C65 13.5833 64.5208 12.3958 63.5625 11.4375C62.6042 10.4792 61.4167 10 60 10C58.5833 10 57.3958 10.4792 56.4375 11.4375C55.4792 12.3958 55 13.5833 55 15C55 16.4167 55.4792 17.6042 56.4375 18.5625C57.3958 19.5208 58.5833 20 60 20ZM60 75C63.5 75 66.4583 73.7917 68.875 71.375C71.2917 68.9583 72.5 66 72.5 62.5C72.5 59 71.2917 56.0417 68.875 53.625C66.4583 51.2083 63.5 50 60 50C56.5 50 53.5417 51.2083 51.125 53.625C48.7083 56.0417 47.5 59 47.5 62.5C47.5 66 48.7083 68.9583 51.125 71.375C53.5417 73.7917 56.5 75 60 75ZM90 105C91.4167 105 92.6042 104.521 93.5625 103.562C94.5208 102.604 95 101.417 95 100C95 98.5833 94.5208 97.3958 93.5625 96.4375C92.6042 95.4792 91.4167 95 90 95C88.5833 95 87.3958 95.4792 86.4375 96.4375C85.4792 97.3958 85 98.5833 85 100C85 101.417 85.4792 102.604 86.4375 103.562C87.3958 104.521 88.5833 105 90 105ZM105 52.5C106.417 52.5 107.604 52.0208 108.562 51.0625C109.521 50.1042 110 48.9167 110 47.5C110 46.0833 109.521 44.8958 108.562 43.9375C107.604 42.9792 106.417 42.5 105 42.5C103.583 42.5 102.396 42.9792 101.438 43.9375C100.479 44.8958 100 46.0833 100 47.5C100 48.9167 100.479 50.1042 101.438 51.0625C102.396 52.0208 103.583 52.5 105 52.5Z" fill="#0F172A"/>
          </g>
        </svg>
      )
    },
    {
      id: 3,
      title: "Easy Application",
      description: "Apply with a single click. Track your application status in real-time through your dashboard.",
      iconClasses: "text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      watermarkClasses: "-bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-[110px] sm:w-[130px]",
      watermark: (
        <svg viewBox="0 0 81 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <g opacity="0.02">
            <path d="M0 80V0L95 40L0 80ZM10 65L69.25 40L10 15V32.5L40 40L10 47.5V65ZM10 65V40V15V32.5V47.5V65Z" fill="#0F172A"/>
          </g>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-[#F8FAFC] dark:bg-slate-900 py-12 sm:py-16 md:py-20 lg:py-24 mb-8 sm:mb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

        {/* Cards Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 xl:gap-10">
          
          {featuresData.map((feature) => (
            <div 
              key={feature.id} 
              className="relative bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 sm:p-8 md:p-10 flex flex-col items-start h-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              
              {/* Icon Container */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-700 rounded-xl sm:rounded-2xl shadow-sm border border-slate-50 dark:border-slate-600 flex items-center justify-center mb-5 sm:mb-8 z-10 transition-all duration-300 ${feature.iconClasses}`}>
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-[19px] sm:text-xl md:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight mb-2 sm:mb-3 z-10">
                {feature.title}
              </h3>
              <p className="text-[14px] sm:text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed z-10">
                {feature.description}
              </p>

              {/* Watermark Base */}
              <div className={`absolute pointer-events-none transition-opacity duration-300 group-hover:opacity-70 ${feature.watermarkClasses}`}>
                {feature.watermark}
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;
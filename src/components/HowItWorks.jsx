import React from 'react';

const data = {
  students: {
    title: "For Students",
    cardBg: "bg-white dark:bg-slate-800",
    cardShadow: "shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] border border-gray-100 dark:border-slate-700",
    tagBg: "bg-[#2563EB]", // Bright blue
    textColorTitle: "text-[#0F172A] dark:text-white",
    textColorDesc: "text-[#64748B] dark:text-slate-400",
    stepBg: "bg-[#EFF6FF] dark:bg-blue-500/10", // Soft pastel blue background
    stepTextColor: "text-[#2563EB] dark:text-blue-400", // Primary blue text
    lineColor: "bg-gray-100 dark:bg-slate-700",
    steps: [
      {
        number: 1,
        title: "Create your digital CV",
        description: "Build a professional profile that highlights your academic success and skills."
      },
      {
        number: 2,
        title: "Browse verified internships",
        description: "Access exclusive offers from top-tier Algerian companies across all sectors."
      },
      {
        number: 3,
        title: "Apply and track status",
        description: "Submit applications instantly and get real-time feedback on your progress."
      }
    ]
  },
  companies: {
    title: "For Companies",
    cardBg: "bg-[#0F172A] dark:bg-slate-800", // Deep Navy
    cardShadow: "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-slate-800 dark:border-slate-600", 
    tagBg: "bg-[#2563EB]", // Slightly lighter blue for dark mode contrast
    textColorTitle: "text-white",
    textColorDesc: "text-[#94A3B8]", // Slate gray
    stepBg: "bg-[#1E293B] dark:bg-slate-700", // Subtle dark blue background for the circle
    stepTextColor: "text-[#2563EB] dark:text-blue-400", // Bright blue text
    lineColor: "bg-slate-700/50",
    steps: [
      {
        number: 1,
        title: "Register enterprise",
        description: "Create your business profile and verify your institution's credentials easily."
      },
      {
        number: 2,
        title: "Post internship offers",
        description: "Reach thousands of top-performing students from universities across Algeria."
      },
      {
        number: 3,
        title: "Filter and accept talent",
        description: "Use our smart screening tools to find the perfect match for your team's needs."
      }
    ]
  }
};

const HowItWorksStep = ({ step, textColorTitle, textColorDesc, stepBg, stepTextColor, lineColor, isLast }) => {
  return (
    <div className="relative flex gap-4 sm:gap-6 items-start mb-8 sm:mb-10 last:mb-0 group cursor-default">
      
      {/* Timeline Vertical Line - Resizes left/top alignment based on circle size */}
      {!isLast && (
        <div className={`absolute left-5 sm:left-6 top-10 sm:top-14 w-[2px] h-[calc(100%+0.5rem)] sm:h-[calc(100%+0.5rem)] -ml-[1px] transition-colors duration-300 ${lineColor} group-hover:bg-[#2563EB]/40`}></div>
      )}

      {/* Step Number Circle - Scales down on mobile */}
      <div className={`relative z-10 flex items-center justify-center shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-lg sm:text-xl ${stepBg} ${stepTextColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
        {step.number}
      </div>
      
      {/* Step Text Content */}
      <div className="pt-0.5 sm:pt-1 transition-transform duration-300 group-hover:translate-x-1">
        <h4 className={`text-[17px] sm:text-[19px] md:text-[20px] font-bold mb-1.5 sm:mb-2 ${textColorTitle}`}>
          {step.title}
        </h4>
        <p className={`text-[14px] sm:text-[15px] md:text-base leading-relaxed ${textColorDesc}`}>
          {step.description}
        </p>
      </div>
    </div>
  );
};

const HowItWorksCard = ({ cardData }) => {
  return (
    <div className={`relative flex-1 rounded-[1.5rem] sm:rounded-[2rem] p-6 pt-12 sm:p-10 sm:pt-14 lg:p-12 lg:pt-16 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${cardData.cardBg} ${cardData.cardShadow}`}>
      
      {/* Top Overlapping Badge - Scales padding, text, and position based on viewport */}
      <div className={`absolute top-[-16px] sm:top-[-18px] left-6 sm:left-8 lg:left-10 rounded-lg sm:rounded-xl px-5 sm:px-6 py-2 sm:py-2.5 ${cardData.tagBg} text-white font-semibold text-xs sm:text-sm shadow-lg tracking-wide uppercase transition-transform duration-300 hover:scale-105`}>
        {cardData.title}
      </div>

      {/* Steps List */}
      <div className="relative z-10 mt-2">
        {cardData.steps.map((step, index) => (
          <HowItWorksStep 
            key={step.number} 
            step={step} 
            textColorTitle={cardData.textColorTitle}
            textColorDesc={cardData.textColorDesc}
            stepBg={cardData.stepBg}
            stepTextColor={cardData.stepTextColor}
            lineColor={cardData.lineColor}
            isLast={index === cardData.steps.length - 1}
          />
        ))}
      </div>
      
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="bg-[#F8FAFC] dark:bg-slate-900 pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* Cards Container - Stacks on mobile/tablet, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 xl:gap-12">
          <HowItWorksCard cardData={data.students} />
          <HowItWorksCard cardData={data.companies} />
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;
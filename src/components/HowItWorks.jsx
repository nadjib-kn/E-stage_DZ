import React from 'react';

/* ─────────────────────────────────────────────────────────────
   All dark-mode styles use inline objects — Tailwind purging
   cannot strip these, so gradients are guaranteed to render.
   Color palette: strictly slate + blue (#2563EB / sky-400).
───────────────────────────────────────────────────────────── */
const darkStyles = {
  students: {
    card: {
      background: 'linear-gradient(145deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)',
      border: '1px solid rgba(37,99,235,0.14)',
      boxShadow: '0 1px 0 0 rgba(37,99,235,0.12) inset, 0 24px 64px rgba(0,0,0,0.55)',
    },
    stepCircle: {
      background: 'rgba(37,99,235,0.14)',
      border: '1px solid rgba(37,99,235,0.28)',
    },
    line: {
      background: 'linear-gradient(to bottom, rgba(37,99,235,0.40), transparent)',
    },
    glowTL: 'radial-gradient(ellipse at 0% 0%, rgba(37,99,235,0.13) 0%, transparent 55%)',
    glowBR: 'radial-gradient(ellipse at 100% 100%, rgba(56,189,248,0.06) 0%, transparent 50%)',
  },
  companies: {
    card: {
      background: 'linear-gradient(145deg, #060d1f 0%, #0d1a38 50%, #060d1f 100%)',
      border: '1px solid rgba(37,99,235,0.10)',
      boxShadow: '0 1px 0 0 rgba(56,189,248,0.06) inset, 0 24px 64px rgba(0,0,0,0.70)',
    },
    stepCircle: {
      background: 'rgba(14,165,233,0.10)',
      border: '1px solid rgba(14,165,233,0.22)',
    },
    line: {
      background: 'linear-gradient(to bottom, rgba(14,165,233,0.35), transparent)',
    },
    glowTL: 'radial-gradient(ellipse at 0% 0%, rgba(14,165,233,0.10) 0%, transparent 55%)',
    glowBR: 'radial-gradient(ellipse at 100% 100%, rgba(37,99,235,0.08) 0%, transparent 50%)',
  },
};

const cards = {
  students: {
    title: 'For Students',
    variant: 'students',
    // ── light mode ──
    cardBg: 'bg-white',
    cardBorder: 'border border-slate-100',
    cardShadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.06)]',
    tagBg: 'bg-[#2563EB]',
    titleColor: 'text-[#0F172A] dark:text-white',
    descColor: 'text-[#64748B] dark:text-slate-400',
    stepBgLight: 'bg-[#EFF6FF]',
    stepTextLight: 'text-[#2563EB]',
    stepTextDark: 'text-blue-400',
    lineLight: 'bg-slate-100',
    steps: [
      { number: 1, title: 'Create your digital CV',        description: 'Build a professional profile that highlights your academic success and skills.' },
      { number: 2, title: 'Browse verified internships',   description: 'Access exclusive offers from top-tier Algerian companies across all sectors.' },
      { number: 3, title: 'Apply and track status',        description: 'Submit applications instantly and get real-time feedback on your progress.' },
    ],
  },
  companies: {
    title: 'For Companies',
    variant: 'companies',
    // ── light mode (dark navy card) ──
    cardBg: 'bg-slate-900',
    cardBorder: 'border border-slate-800',
    cardShadow: 'shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]',
    tagBg: 'bg-[#2563EB]',
    titleColor: 'text-white',
    descColor: 'text-slate-400',
    stepBgLight: 'bg-[#1E293B]',
    stepTextLight: 'text-blue-400',
    stepTextDark: 'text-sky-400',
    lineLight: 'bg-slate-700/50',
    steps: [
      { number: 1, title: 'Register enterprise',           description: 'Create your business profile and verify your institution\'s credentials easily.' },
      { number: 2, title: 'Post internship offers',        description: 'Reach thousands of top-performing students from universities across Algeria.' },
      { number: 3, title: 'Filter and accept talent',      description: 'Use our smart screening tools to find the perfect match for your team\'s needs.' },
    ],
  },
};

/* Watches <html class="dark"> so components re-render on theme toggle */
function useDark() {
  const [dark, setDark] = React.useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ── Single step row ── */
const Step = ({ step, card, isLast, isDark }) => {
  const ds = darkStyles[card.variant];
  return (
    <div className="relative flex gap-4 sm:gap-6 items-start mb-8 sm:mb-10 last:mb-0 group cursor-default">

      {/* Connector line */}
      {!isLast && (
        <div
          className={`absolute left-5 sm:left-6 top-10 sm:top-14 w-[2px] h-[calc(100%+0.5rem)] -ml-[1px] ${!isDark ? card.lineLight : ''}`}
          style={isDark ? ds.line : {}}
        />
      )}

      {/* Number circle */}
      <div
        className={`relative z-10 flex items-center justify-center shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-lg sm:text-xl transition-all duration-300 group-hover:scale-110
          ${!isDark ? `${card.stepBgLight} ${card.stepTextLight}` : card.stepTextDark}`}
        style={isDark ? ds.stepCircle : {}}
      >
        {step.number}
      </div>

      {/* Text */}
      <div className="pt-0.5 sm:pt-1 transition-transform duration-300 group-hover:translate-x-1">
        <h4 className={`text-[17px] sm:text-[19px] font-bold mb-1.5 ${card.titleColor}`}>
          {step.title}
        </h4>
        <p className={`text-[14px] sm:text-[15px] leading-relaxed ${card.descColor}`}>
          {step.description}
        </p>
      </div>
    </div>
  );
};

/* ── Card ── */
const Card = ({ card, isDark }) => {
  const ds = darkStyles[card.variant];
  return (
    <div
      className={`relative flex-1 rounded-[1.75rem] sm:rounded-[2rem] p-6 pt-12 sm:p-10 sm:pt-14 lg:p-12 lg:pt-16 transition-all duration-500 hover:-translate-y-2
        ${!isDark ? `${card.cardBg} ${card.cardBorder} ${card.cardShadow}` : ''}`}
      style={isDark ? ds.card : {}}
    >
      {/* Dark mode corner glows */}
      {isDark && (
        <>
          <div className="absolute inset-0 rounded-[1.75rem] sm:rounded-[2rem] pointer-events-none"
               style={{ background: ds.glowTL }} />
          <div className="absolute inset-0 rounded-[1.75rem] sm:rounded-[2rem] pointer-events-none"
               style={{ background: ds.glowBR }} />
        </>
      )}

      {/* Badge */}
      <div
        className={`absolute top-[-16px] sm:top-[-18px] left-6 sm:left-8 lg:left-10 rounded-xl px-5 sm:px-6 py-2 sm:py-2.5 ${card.tagBg} text-white font-semibold text-xs sm:text-sm tracking-widest uppercase`}
        style={{ boxShadow: '0 4px 16px rgba(37,99,235,0.40)' }}
      >
        {card.title}
      </div>

      {/* Steps */}
      <div className="relative z-10 mt-2">
        {card.steps.map((step, i) => (
          <Step
            key={step.number}
            step={step}
            card={card}
            isLast={i === card.steps.length - 1}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Section ── */
const HowItWorks = () => {
  const isDark = useDark();

  return (
    <section
      className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #060d1f 0%, #0a1628 100%)'
          : '#F8FAFC',
      }}
    >
      {/* Dark mode: two soft blue ambient glows, no violet */}
      {isDark && (
        <>
          <div className="absolute pointer-events-none" style={{
            width: 700, height: 700, top: '-15%', left: '-8%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)',
            filter: 'blur(0px)',
          }} />
          <div className="absolute pointer-events-none" style={{
            width: 500, height: 500, bottom: '-10%', right: '-4%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 65%)',
          }} />
        </>
      )}

      <div className="max-w-[1600px] mx-auto relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 xl:gap-12">
          <Card card={cards.students}  isDark={isDark} />
          <Card card={cards.companies} isDark={isDark} />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
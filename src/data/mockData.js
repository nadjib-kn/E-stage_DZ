// src/data/mockData.js

export const mockDatabase = {
  users: [
    // ==========================================
    // 0. ADMIN
    // ==========================================
    {
      id: "admin_001",
      role: "admin",
      email: "admin@estagedz.dz",
      password: "admin123", // Use this to log in to the Admin Dashboard
      firstName: "System",
      lastName: "Admin",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Admin&backgroundColor=2563EB",
    },

    // ==========================================
    // 1. STUDENTS
    // ==========================================
    {
      id: "student_123",
      role: "student",
      email: "amine@univ-alger.dz",
      password: "password123",
      firstName: "Amine",
      lastName: "Dahmane",
      phone: "+213 555 12 34 56",
      university: "USTHB",
      major: "Computer Science",
      graduationYear: "2027",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amine&backgroundColor=e2e8f0",
      skills: ["React.js", "JavaScript", "Tailwind CSS"],
      resumeUrl: "/resumes/amine_dahmane_cv.pdf",
    },
    {
      id: "std_002",
      role: "student",
      email: "s.mansouri@esi.dz",
      password: "password123",
      firstName: "Sarah",
      lastName: "Mansouri",
      phone: "+213 555 98 76 54",
      university: "ESI",
      major: "Software Engineering",
      graduationYear: "2026",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e2e8f0",
      skills: ["Python", "Django", "React"],
      resumeUrl: "/resumes/sarah_mansouri_cv.pdf",
    },
    {
      id: "std_003",
      role: "student",
      email: "fatima.b@epa.dz",
      password: "password123",
      firstName: "Fatima",
      lastName: "Benali",
      phone: "+213 555 11 22 33",
      university: "EPA",
      major: "Design & Architecture",
      graduationYear: "2026",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=e2e8f0",
      skills: ["Figma", "Adobe XD", "Illustrator"],
      resumeUrl: "/resumes/fatima_benali_portfolio.pdf",
    },
    {
      id: "std_004",
      role: "student",
      email: "yacine.b@univ-bejaia.dz",
      password: "password123",
      firstName: "Yacine",
      lastName: "Brahimi",
      phone: "+213 555 44 55 66",
      university: "University of Bejaia",
      major: "Information Systems",
      graduationYear: "2025",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yacine&backgroundColor=e2e8f0",
      skills: ["Vue.js", "PHP", "MySQL"],
      resumeUrl: "/resumes/yacine_brahimi_cv.pdf",
    },

    // ==========================================
    // 2. COMPANIES
    // ==========================================
    {
      id: "comp_yassir",
      role: "company",
      email: "hr@yassir.dz",
      password: "company123", 
      companyName: "Yassir",
      industry: "Technology & Transportation",
      location: "Algiers, Algeria",
      website: "https://yassir.com",
      description: "Yassir is the leading super-app in the Maghreb region.",
      logo: "Y",
      logoColor: "bg-slate-800 text-white",
      verificationStatus: "approved", // <-- NEW FIELD FOR ADMIN
      documents: {
        registreCommerce: "rc_yassir_123.pdf",
        nif: "0000123456789",
      }
    },
    {
      id: "comp_djezzy",
      role: "company",
      email: "recruitment@djezzy.dz",
      password: "company123",
      companyName: "Djezzy",
      industry: "Telecommunications",
      location: "Algiers, Algeria",
      website: "https://djezzy.dz",
      description: "Leading mobile operator in Algeria.",
      logo: "D",
      logoColor: "bg-red-100 text-red-500",
      verificationStatus: "approved",
    },
    {
      id: "comp_techminds",
      role: "company",
      email: "contact@techminds.dz",
      password: "company123",
      companyName: "TechMinds Solutions",
      industry: "Software Development",
      location: "Oran, Algeria",
      website: "https://techminds.dz",
      description: "A growing startup focusing on AI and web solutions.",
      logo: "T",
      logoColor: "bg-blue-100 text-blue-600",
      verificationStatus: "pending", // <-- Needs Admin Approval
      documents: {
        registreCommerce: "rc_techminds_pending.pdf",
        nif: "111122223333",
      }
    },
    {
      id: "comp_scam",
      role: "company",
      email: "fake@crypto-dz-investment.com",
      password: "company123",
      companyName: "CryptoDZ Investment",
      industry: "Finance",
      location: "Unknown",
      website: "",
      description: "Get rich quick with our internships.",
      logo: "C",
      logoColor: "bg-yellow-100 text-yellow-600",
      verificationStatus: "rejected", // <-- Rejected by Admin
    }
  ],

  // ==========================================
  // 3. JOB OFFERS
  // ==========================================
  jobs: [
    { id: "j1", companyId: "comp_yassir", role: "Frontend Developer Intern", company: "Yassir", location: "Algiers", type: "Hybrid", tags: ["React", "Tailwind", "JavaScript"], posted: "2 hours ago", status: "Active", deadline: "2026-04-15", logo: "Y", logoColor: "bg-slate-800 text-white" },
    { id: "j7", companyId: "comp_yassir", role: "Backend Node.js Intern", company: "Yassir", location: "Algiers", type: "On-site", tags: ["Node.js", "Express", "MongoDB"], posted: "3 weeks ago", status: "Closed", deadline: "2026-02-10", logo: "Y", logoColor: "bg-slate-800 text-white" },
    { id: "j8", companyId: "comp_yassir", role: "Data Analyst Intern", company: "Yassir", location: "Algiers", type: "Hybrid", tags: ["Python", "SQL", "Tableau"], posted: "Just now", status: "Draft", deadline: "2026-05-01", logo: "Y", logoColor: "bg-slate-800 text-white" },
    { id: "j2", companyId: "comp_djezzy", role: "UI/UX Design Intern", company: "Djezzy", location: "Remote", type: "Remote", tags: ["Figma", "Prototyping"], posted: "5 hours ago", status: "Active", logo: "D", logoColor: "bg-red-100 text-red-500" },
    { id: "j3", companyId: "comp_sonatrach", role: "Backend Developer Intern", company: "Sonatrach", location: "Algiers", type: "On-site", tags: ["Node.js", "MongoDB"], posted: "1 day ago", status: "Active", logo: "S", logoColor: "bg-green-100 text-green-600" },
  ],

  // ==========================================
  // 4. APPLICATIONS
  // ==========================================
  applications: [
    { id: "app_1", studentId: "student_123", jobId: "j3", status: "Accepted", dateApplied: "Oct 10, 2026", matchScore: 88 },
    { id: "app_101", studentId: "student_123", jobId: "j1", status: "Pending", dateApplied: "Mar 29, 2026", matchScore: 85 },
    { id: "app_102", studentId: "std_002", jobId: "j1", status: "Interview", dateApplied: "Mar 25, 2026", matchScore: 92 },
    { id: "app_103", studentId: "std_003", jobId: "j1", status: "Under Review", dateApplied: "Mar 28, 2026", matchScore: 78 },
    { id: "app_104", studentId: "std_004", jobId: "j1", status: "Accepted", dateApplied: "Mar 16, 2026", matchScore: 95 }
  ],

  // ==========================================
  // 5. TICKETS & CONFLICTS (For Admin Dashboard)
  // ==========================================
  tickets: [
    {
      id: "ticket_001",
      type: "conflict", // conflict, support, bug
      status: "open", // open, resolved, closed
      dateOpened: "Apr 05, 2026",
      reporterId: "student_123", // Amine
      reportedPartyId: "comp_djezzy", // Reporting Djezzy
      subject: "Company not responding after acceptance",
      description: "I was accepted for the UI/UX internship 3 weeks ago, but the HR department is ignoring my emails regarding the internship convention.",
    },
    {
      id: "ticket_002",
      type: "support",
      status: "resolved",
      dateOpened: "Mar 28, 2026",
      reporterId: "comp_yassir",
      reportedPartyId: null,
      subject: "Cannot update company logo",
      description: "I am trying to upload a new PNG logo but the platform keeps throwing a 500 error.",
    },
    {
      id: "ticket_003",
      type: "conflict",
      status: "open",
      dateOpened: "Apr 07, 2026",
      reporterId: "std_002", // Sarah
      reportedPartyId: "comp_scam", // Reporting the scam company
      subject: "Suspicious Interview Request",
      description: "This company asked me to pay a 'training fee' of 5000 DZD before starting the internship. Is this normal?",
    }
  ]
};
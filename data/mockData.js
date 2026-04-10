// Mock database
export const users = [
  {
    id: "user_1",
    email: "demo@applyai.dev",
    password: "demo123",
    name: "Arjun Sharma",
    avatar: null,
    createdAt: "2024-01-15T10:00:00Z"
  }
];

export const profiles = {
  user_1: {
    userId: "user_1",
    personalDetails: {
      name: "Arjun Sharma",
      email: "arjun.sharma@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      linkedin: "linkedin.com/in/arjunsharma",
      github: "github.com/arjunsharma",
      portfolio: "arjunsharma.dev",
      summary: "Full-stack developer with 3+ years of experience building scalable web applications. Passionate about React, Node.js, and cloud infrastructure."
    },
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB", "GraphQL", "Redis"],
    experience: [
      {
        id: "exp_1",
        company: "TechCorp Solutions",
        role: "Senior Frontend Developer",
        duration: "Jan 2022 – Present",
        location: "Bangalore",
        description: "Led frontend development for 3 major product features. Improved performance by 40%. Mentored 2 junior developers.",
        technologies: ["React", "TypeScript", "Redux", "AWS"]
      },
      {
        id: "exp_2",
        company: "StartupX",
        role: "Full Stack Developer",
        duration: "Jun 2020 – Dec 2021",
        location: "Pune",
        description: "Built REST APIs and React dashboards for fintech product. Handled 10k+ daily active users.",
        technologies: ["Node.js", "React", "MongoDB", "Docker"]
      }
    ],
    education: [
      {
        id: "edu_1",
        institution: "IIT Bombay",
        degree: "B.Tech in Computer Science",
        year: "2016–2020",
        grade: "8.7 CGPA"
      }
    ],
    projects: [
      {
        id: "proj_1",
        name: "CloudDeploy",
        description: "Open-source CI/CD tool with 800+ GitHub stars",
        tech: ["Node.js", "Docker", "AWS", "React"],
        link: "github.com/arjunsharma/clouddeploy"
      },
      {
        id: "proj_2",
        name: "FinanceTracker",
        description: "Personal finance app with ML-powered expense categorization",
        tech: ["Python", "FastAPI", "React", "PostgreSQL"],
        link: "github.com/arjunsharma/financetracker"
      }
    ],
    certifications: [
      { id: "cert_1", name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", year: "2023" },
      { id: "cert_2", name: "Google Cloud Professional Developer", issuer: "Google", year: "2022" }
    ],
    atsScore: 74
  }
};

export const mockJobs = [
  {
    id: "job_1",
    title: "Senior React Developer",
    company: "Flipkart",
    location: "Bangalore",
    salary: "₹25-35 LPA",
    platform: "LinkedIn",
    workMode: "Hybrid",
    experience: "3-5 years",
    posted: "2 hours ago",
    description: "Build next-gen e-commerce experiences with React, TypeScript, and GraphQL. Work with a team of 50+ engineers.",
    skills: ["React", "TypeScript", "GraphQL", "Node.js", "AWS"],
    matchScore: 94,
    decision: "Apply",
    decisionReason: "Strong skill match (9/10 required skills). Your AWS cert is a bonus. Salary range aligns with market.",
    successProbability: 82,
    logo: "F",
    color: "#F7931E"
  },
  {
    id: "job_2",
    title: "Full Stack Engineer",
    company: "Razorpay",
    location: "Bangalore",
    salary: "₹30-45 LPA",
    platform: "Naukri",
    workMode: "Remote",
    experience: "3-6 years",
    posted: "5 hours ago",
    description: "Join the payments revolution. Build systems that process millions of transactions daily.",
    skills: ["Node.js", "React", "PostgreSQL", "Redis", "Docker"],
    matchScore: 91,
    decision: "Apply",
    decisionReason: "Excellent technical fit. Fintech experience from StartupX is directly relevant.",
    successProbability: 78,
    logo: "R",
    color: "#3395FF"
  },
  {
    id: "job_3",
    title: "Software Engineer II",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "₹35-55 LPA",
    platform: "LinkedIn",
    workMode: "Hybrid",
    experience: "2-5 years",
    posted: "1 day ago",
    description: "Build cloud-native applications on Azure. Work on products used by millions globally.",
    skills: ["TypeScript", "React", "Azure", "C#", ".NET", "Kubernetes"],
    matchScore: 72,
    decision: "Maybe",
    decisionReason: "Missing C# and .NET experience. Azure experience not listed but AWS is transferable. Worth applying with customized resume.",
    successProbability: 55,
    logo: "M",
    color: "#00A4EF"
  },
  {
    id: "job_4",
    title: "Frontend Lead",
    company: "CRED",
    location: "Bangalore",
    salary: "₹40-60 LPA",
    platform: "Glassdoor",
    workMode: "Office",
    experience: "5-8 years",
    posted: "2 days ago",
    description: "Lead a team of frontend engineers building premium fintech UX. Own the design system.",
    skills: ["React", "TypeScript", "Performance", "Design Systems", "Team Lead"],
    matchScore: 68,
    decision: "Maybe",
    decisionReason: "Requires 5+ years, you have 3. Strong technical fit but leadership experience may be insufficient.",
    successProbability: 42,
    logo: "C",
    color: "#1A1A2E"
  },
  {
    id: "job_5",
    title: "Backend Engineer",
    company: "Swiggy",
    location: "Bangalore",
    salary: "₹20-30 LPA",
    platform: "Indeed",
    workMode: "Hybrid",
    experience: "2-4 years",
    posted: "3 days ago",
    description: "Scale food delivery infrastructure handling millions of orders. Work with Go, Kafka, and microservices.",
    skills: ["Go", "Kafka", "Microservices", "Kubernetes", "gRPC"],
    matchScore: 38,
    decision: "Avoid",
    decisionReason: "Primary stack is Go/Kafka which you don't have. Would require 3-6 months of upskilling. Better opportunities available.",
    successProbability: 18,
    logo: "S",
    color: "#FC8019"
  },
  {
    id: "job_6",
    title: "React Native Developer",
    company: "Meesho",
    location: "Bangalore",
    salary: "₹18-28 LPA",
    platform: "Naukri",
    workMode: "Remote",
    experience: "2-4 years",
    posted: "4 days ago",
    description: "Build mobile-first commerce experiences for Tier 2/3 India. React Native + TypeScript.",
    skills: ["React Native", "TypeScript", "Redux", "iOS", "Android"],
    matchScore: 55,
    decision: "Maybe",
    decisionReason: "React skills transfer well. Need to highlight any mobile or RN experience. Salary below your current range.",
    successProbability: 48,
    logo: "M",
    color: "#9B26AF"
  },
  {
    id: "job_7",
    title: "DevOps Engineer",
    company: "Atlassian",
    location: "Bangalore",
    salary: "₹28-40 LPA",
    platform: "LinkedIn",
    workMode: "Remote",
    experience: "3-5 years",
    posted: "5 days ago",
    description: "Manage cloud infrastructure and CI/CD pipelines for global developer tools.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python"],
    matchScore: 79,
    decision: "Apply",
    decisionReason: "Your CloudDeploy project + AWS cert makes you a strong candidate. Good salary range.",
    successProbability: 65,
    logo: "A",
    color: "#0052CC"
  },
  {
    id: "job_8",
    title: "ML Engineer",
    company: "Google",
    location: "Hyderabad",
    salary: "₹50-80 LPA",
    platform: "LinkedIn",
    workMode: "Hybrid",
    experience: "4-7 years",
    posted: "1 week ago",
    description: "Build ML pipelines at scale. Work on products with 1B+ users.",
    skills: ["Python", "TensorFlow", "MLOps", "Kubernetes", "Scala", "BigQuery"],
    matchScore: 31,
    decision: "Avoid",
    decisionReason: "Requires deep ML expertise and Scala. Your Python skills are entry-level for this role. Focus on ML cert first.",
    successProbability: 12,
    logo: "G",
    color: "#4285F4"
  }
];

export const mockApplications = [
  {
    id: "app_1",
    jobId: "job_1",
    jobTitle: "Senior Frontend Developer",
    company: "Paytm",
    platform: "LinkedIn",
    status: "Interview",
    appliedAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-14T14:30:00Z",
    resumeVersion: "Paytm_Customized_v2",
    matchScore: 88,
    notes: "Interview scheduled for Dec 18"
  },
  {
    id: "app_2",
    jobId: "job_2",
    jobTitle: "Full Stack Engineer",
    company: "Zepto",
    platform: "Naukri",
    status: "Response",
    appliedAt: "2024-12-09T11:00:00Z",
    updatedAt: "2024-12-13T10:00:00Z",
    resumeVersion: "Zepto_Customized_v1",
    matchScore: 82,
    notes: "Received positive response, awaiting next steps"
  },
  {
    id: "app_3",
    jobId: "job_3",
    jobTitle: "React Developer",
    company: "PhonePe",
    platform: "Glassdoor",
    status: "Applied",
    appliedAt: "2024-12-08T14:00:00Z",
    updatedAt: "2024-12-08T14:00:00Z",
    resumeVersion: "PhonePe_Customized_v1",
    matchScore: 79,
    notes: ""
  },
  {
    id: "app_4",
    jobId: "job_4",
    jobTitle: "Software Engineer II",
    company: "Myntra",
    platform: "Indeed",
    status: "Applied",
    appliedAt: "2024-12-07T09:30:00Z",
    updatedAt: "2024-12-07T09:30:00Z",
    resumeVersion: "Myntra_Customized_v1",
    matchScore: 76,
    notes: ""
  },
  {
    id: "app_5",
    jobId: "job_5",
    jobTitle: "Node.js Developer",
    company: "Urban Company",
    platform: "LinkedIn",
    status: "Pending",
    appliedAt: "2024-12-12T16:00:00Z",
    updatedAt: "2024-12-12T16:00:00Z",
    resumeVersion: "General_ATS_v3",
    matchScore: 71,
    notes: "Application queued for auto-apply"
  },
  {
    id: "app_6",
    jobId: "job_6",
    jobTitle: "Frontend Engineer",
    company: "OYO",
    platform: "Naukri",
    status: "Applied",
    appliedAt: "2024-12-06T10:00:00Z",
    updatedAt: "2024-12-06T10:00:00Z",
    resumeVersion: "OYO_Customized_v1",
    matchScore: 69,
    notes: ""
  },
  {
    id: "app_7",
    jobId: "job_7",
    jobTitle: "Senior Developer",
    company: "Ola",
    platform: "LinkedIn",
    status: "Response",
    appliedAt: "2024-12-05T09:00:00Z",
    updatedAt: "2024-12-11T11:00:00Z",
    resumeVersion: "Ola_Customized_v1",
    matchScore: 85,
    notes: "Recruiter reached out for technical assessment"
  },
  {
    id: "app_8",
    jobId: "job_8",
    jobTitle: "TypeScript Engineer",
    company: "Freshworks",
    platform: "Glassdoor",
    status: "Interview",
    appliedAt: "2024-12-03T13:00:00Z",
    updatedAt: "2024-12-12T09:00:00Z",
    resumeVersion: "Freshworks_Customized_v2",
    matchScore: 90,
    notes: "Final round interview on Dec 20"
  }
];

export const mockNotifications = [
  {
    id: "notif_1",
    type: "interview",
    title: "Interview Scheduled! 🎉",
    message: "Freshworks has scheduled your final round interview for Dec 20, 2024 at 2:00 PM",
    timestamp: "2024-12-12T09:00:00Z",
    read: false,
    icon: "calendar"
  },
  {
    id: "notif_2",
    type: "response",
    title: "Response Received",
    message: "Ola's recruiter reached out! They want you to take a technical assessment.",
    timestamp: "2024-12-11T11:00:00Z",
    read: false,
    icon: "mail"
  },
  {
    id: "notif_3",
    type: "applied",
    title: "Application Submitted",
    message: "Successfully applied to Urban Company – Node.js Developer position",
    timestamp: "2024-12-12T16:00:00Z",
    read: true,
    icon: "check"
  },
  {
    id: "notif_4",
    type: "interview",
    title: "Interview Reminder",
    message: "Your Paytm interview is tomorrow at 11 AM. Don't forget to prepare!",
    timestamp: "2024-12-14T14:30:00Z",
    read: false,
    icon: "bell"
  },
  {
    id: "notif_5",
    type: "response",
    title: "Positive Response from Zepto",
    message: "Zepto is moving forward with your application. Expect a call within 2 days.",
    timestamp: "2024-12-13T10:00:00Z",
    read: true,
    icon: "mail"
  },
  {
    id: "notif_6",
    type: "applied",
    title: "Application Submitted",
    message: "Auto-applied to PhonePe – React Developer with customized resume",
    timestamp: "2024-12-08T14:00:00Z",
    read: true,
    icon: "check"
  }
];

export const skillGapData = {
  currentSkills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB"],
  missingSkills: [
    { skill: "Kubernetes", demand: 78, difficulty: "Medium", timeToLearn: "3-4 weeks" },
    { skill: "Go", demand: 65, difficulty: "Hard", timeToLearn: "2-3 months" },
    { skill: "Redis Advanced", demand: 58, difficulty: "Easy", timeToLearn: "1-2 weeks" },
    { skill: "System Design", demand: 92, difficulty: "Hard", timeToLearn: "1-2 months" },
    { skill: "GraphQL", demand: 71, difficulty: "Easy", timeToLearn: "1-2 weeks" },
    { skill: "Next.js", demand: 83, difficulty: "Easy", timeToLearn: "1-2 weeks" }
  ],
  recommendedCerts: [
    { name: "Kubernetes CKA", provider: "CNCF", impact: "High", jobs: 234 },
    { name: "AWS DevOps Professional", provider: "AWS", impact: "High", jobs: 189 },
    { name: "MongoDB Professional", provider: "MongoDB", impact: "Medium", jobs: 142 }
  ],
  marketTrends: [
    { skill: "Next.js", growth: "+34%", demand: "High" },
    { skill: "Kubernetes", growth: "+28%", demand: "High" },
    { skill: "Rust", growth: "+45%", demand: "Medium" },
    { skill: "AI/ML Integration", growth: "+67%", demand: "Very High" }
  ]
};

export const activityLog = [
  { id: "act_1", action: "Resume customized for Flipkart JD", timestamp: "2024-12-14T15:00:00Z", type: "resume" },
  { id: "act_2", action: "Interview scheduled at Freshworks", timestamp: "2024-12-12T09:00:00Z", type: "interview" },
  { id: "act_3", action: "Auto-applied to Urban Company", timestamp: "2024-12-12T16:00:00Z", type: "apply" },
  { id: "act_4", action: "Response received from Ola", timestamp: "2024-12-11T11:00:00Z", type: "response" },
  { id: "act_5", action: "ATS score improved: 68 → 74", timestamp: "2024-12-10T12:00:00Z", type: "ats" },
  { id: "act_6", action: "Applied to Paytm Senior Frontend", timestamp: "2024-12-10T09:00:00Z", type: "apply" },
  { id: "act_7", action: "Skill gap analysis completed", timestamp: "2024-12-09T14:00:00Z", type: "analysis" },
  { id: "act_8", action: "Profile completeness: 85%", timestamp: "2024-12-08T10:00:00Z", type: "profile" }
];

export interface Domain {
  id: string;
  name: string;
  icon: string;
  portal: string;
  color: string;
  suggestedPrompts: string[];
}

export const domains: Domain[] = [
  {
    id: "scholarship",
    name: "Scholarships",
    icon: "🎓",
    portal: "National Scholarship Portal",
    color: "#6c5ce7",
    suggestedPrompts: [
      "Am I eligible for the NSP Pre-Matric Scholarship?",
      "What documents do I need for a merit scholarship?",
      "How do I track my application status?",
      "Is there a scholarship for engineering students?",
    ],
  },
  {
    id: "startup",
    name: "Startup India",
    icon: "🚀",
    portal: "Startup India Portal",
    color: "#00b894",
    suggestedPrompts: [
      "How do I register my company with Startup India?",
      "What are the tax benefits for a DPIIT recognized startup?",
      "Explain the self-certification process.",
      "Is my business eligible for Seed Fund Scheme?",
    ],
  },
  {
    id: "msme",
    name: "MSME Benefits",
    icon: "🏭",
    portal: "Udyam Registration",
    color: "#fdcb6e",
    suggestedPrompts: [
      "What is the process for Udyam Registration?",
      "Are there any collateral-free loans for MSMEs?",
      "What is the definition of a Micro enterprise?",
      "How to apply for the PMEGP scheme?",
    ],
  },
  {
    id: "patent",
    name: "Patents & IP",
    icon: "📜",
    portal: "IP India",
    color: "#e17055",
    suggestedPrompts: [
      "What are the steps to file a patent in India?",
      "How much does it cost to file a trademark?",
      "What is the difference between a patent and copyright?",
      "How do I do a patent search?",
    ],
  },
  {
    id: "certification",
    name: "Certifications",
    icon: "📋",
    portal: "DigiLocker / e-District",
    color: "#74b9ff",
    suggestedPrompts: [
      "How to get a caste certificate online?",
      "What documents are needed for an Income Certificate?",
      "How to download documents from DigiLocker?",
      "Process for CCC certification.",
    ],
  },
  {
    id: "legal",
    name: "Student & Minor Rights",
    icon: "⚖️",
    portal: "NCPCR / NALSA / UGC",
    color: "#d63031",
    suggestedPrompts: [
      "What are my rights if I am detained by police as a minor?",
      "How do I file an anti-ragging complaint?",
      "Explain the Right to Education (RTE) Act.",
      "What is the POCSO Act and how does it protect minors?",
    ],
  },
  {
    id: "career",
    name: "Career Guide",
    icon: "🧭",
    portal: "NCS / AICTE / UGC",
    color: "#a29bfe",
    suggestedPrompts: [
      "I just passed 10th — what career options do I have?",
      "Best courses after 12th Science (PCM) for high salary?",
      "B.Tech vs Diploma — which is better for jobs?",
      "What can I do after graduation in Arts/Commerce?",
    ],
  },
  {
    id: "exam-prep",
    name: "Exam & Competitive Prep",
    icon: "📝",
    portal: "NTA / UPSC / State PSCs",
    color: "#ffeaa7",
    suggestedPrompts: [
      "How should I prepare for JEE Mains in 6 months?",
      "NEET vs AIIMS — what's the difference now?",
      "Best strategy for UPSC CSE preparation?",
      "How to crack GATE for CS/IT branch?",
    ],
  },
  {
    id: "tech-roadmap",
    name: "Tech Roadmap & Jobs",
    icon: "💻",
    portal: "roadmap.sh / LinkedIn / Naukri",
    color: "#55efc4",
    suggestedPrompts: [
      "I want to become a full-stack web developer — give me a complete roadmap.",
      "React vs Angular — which should I learn for jobs in 2026?",
      "I know HTML, CSS, basic JS — what should I learn next?",
      "How to get a job in AI/ML with no experience?",
    ],
  },
];

export const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
];

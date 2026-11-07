import { 
  Experience, 
  Education, 
  SkillCategory, 
  Certificate, 
  QuoteItem, 
  DesignItem, 
  FeaturedProject, 
  BlogItem,
  ResumeProject,
  Responsibility,
  Achievement
} from './types';
import { Linkedin, Github, FileText, Mail } from 'lucide-react';

// Import images so Vite properly handles asset paths with base URL
import courseraImg from '/assets/certificates/Course/Coursera Python for Data Science, AI & Development.jpg';
import courseraSqlImg from '/assets/certificates/Course/Coursera Databases and SQL for Data Science with Python_page.jpg';
import culturalsImg from '/assets/design/Posters/Culturals-poster.jpg';
import blogRadhaKrishnaImg from '/assets/blogs/the-radha-krishna-b8d39f39a632.png';
import cubiverseImg from '/assets/projects/cubiverse.jpeg';
import reszoomImg from '/assets/projects/reszoom_full.png';

// Color Constants specified by user
export const COLOR_RED = '#A90000'; // R-169, G-0, B-0
export const COLOR_GREY = '#262626'; // R-38, G-38, B-38

// Global Defaults
export const DEFAULT_QUOTE_AUTHOR = "tinyDragon";
export const MEDIUM_BASE_URL = "https://medium.com/@gokulkrish0999/";

export const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gokulakrishnan-m/",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    url: "https://github.com/gokulakrishnanM99",
    icon: Github,
  },
  {
    name: "Medium",
    url: "https://medium.com/@gokulkrish0999",
    icon: FileText,
  },
  {
    name: "Email",
    url: "mailto:gokulakrishnan.m0999@gmail.com",
    icon: Mail,
  }
];

// ----------------------------- Resume -----------------------------
export const EDUCATION_DATA: Education[] = [
  {
    id: "mtech",
    degree: "M.Tech, Biomedical Engineering",
    institution: "IIT Bombay",
    year: "2021 – 2023",
    score: "CPI: 9.45"
  },
  {
    id: "be",
    degree: "B.E, Biomedical Engineering",
    institution: "CEG, Anna University",
    year: "2017 – 2021",
    score: "GPA: 7.6"
  }
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    id: "Thisai",
    role: "AI Engineer (Contract)",
    company: "Thisai",
    period: "Jan 2026 – Oct 2026",
    skills: ["Local LLMs", "Llama", "Qwen", "GPT-OSS", "OpenCV", "Vision-LLM", "Django", "Celery", "Gemma 3", "RAG"],
    description: [
      "Local LLM Evaluation: Benchmarked self-hosted Llama, Qwen, and GPT-OSS (3B-20B) with prompt and inference tuning inside an LLM pipeline that verifies 14k+ MCQs and generates pedagogical metadata.",
      "Computer Vision & GenAI: Architected an OpenCV + Vision-LLM OCR pipeline on Django/Celery to grade scanned answer sheets; tuned and integrated a Gemma 3 4B RAG system to auto-generate personalized exams."
    ]
  },
  {
    id: "stepchange-assoc",
    role: "Data Science Associate",
    company: "StepChange Inc",
    period: "May 2024 – Nov 2025",
    skills: ["Azure OpenAI", "LangChain", "RAG", "AWS Lambda", "Java (Spring Boot)", "SQL"],
    description: [
      "GenAI & LLM Development: Engineered a LangChain-driven RAG pipeline using Azure OpenAI APIs to automate policy report generation and predict qualitative outcomes from historical datasets.",
      "AWS Serverless Automation: Developed an event-driven AWS Lambda architecture to trigger data ingestion and real-time metric computation, cutting turnaround from months of manual processing to hours.",
      "SaaS Platform: Optimized high-throughput sustainability metric computation for a B2B carbon accounting platform and designed scalable multi-table data ingestion frameworks built in Java (Spring Boot) and SQL."
    ]
  },
  {
    id: "stepchange-analyst",
    role: "Data Analyst",
    company: "StepChange Inc",
    period: "Jul 2023 – Apr 2024",
    skills: ["Google Maps API", "Geopy", "Microsoft Fabric", "Power BI", "REST APIs", "Azure Storage"],
    description: [
      "Geospatial & Emission Modelling: Developed algorithms integrating Google Maps APIs and Geopy to compute travel distances and emissions in compliance with global Carbon Accounting Financials standards.",
      "Data Engineering & Migration: Migrated 14 TB of enterprise data across a multi-region Microsoft Fabric tenancy; Engineered and deployed APIs to convert NSE XBRL financial filings into structured data.",
      "Analytics Dashboards: Prototyped interactive Power BI dashboards on Azure Storage and Fabric Dataflows."
    ]
  }
];

export const RESUME_PROJECTS_DATA: ResumeProject[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI & LLM Prompting",
    period: "2026",
    description: "AI-integrated job-hunt toolkit featuring ATS resume scoring, AI-driven analysis, Automated JD parsing, and tracking. Story to comic strip generator agent using MCP tools and Gemini LLM.",
    tags: ["Agentic AI", "MCP Tools", "Gemini LLM", "Prompt Engineering"],
    url: "https://reszoom.vercel.app/"
  },
  {
    id: "medical-image-seg",
    title: "Medical Image Segmentation",
    period: "2022",
    description: "Engineered a deep supervised UNet++ architecture to extract liver tumors on medical CT scans with custom Dice-Cross Entropy loss, achieving 94% IoU.",
    tags: ["UNet++", "PyTorch", "CT Scans", "Dice-CE Loss", "Medical AI"]
  },
  {
    id: "deep-learning-class",
    title: "Deep Learning Classification",
    period: "2022",
    description: "Implemented ResNet-18 transfer learning for classification; Built MLPs and Perceptrons from scratch to benchmark activation functions on the MNIST dataset.",
    tags: ["ResNet-18", "Transfer Learning", "MLPs", "PyTorch", "MNIST"]
  },
  {
    id: "ml-hyperparameter",
    title: "ML Hyperparameter Tuning",
    period: "2021",
    description: "Compared and fine-tuned multiple ML models (SVM, Logistic Regression, Random Forest) to evaluate hyperparameter sensitivity; Developed K-Means clustering for thermal image segmentation.",
    tags: ["Hyperparameter Tuning", "SVM", "Random Forest", "K-Means", "Thermal Imaging"]
  }
];

export const RESPONSIBILITIES_DATA: Responsibility[] = [
  {
    id: "student-companion",
    role: "Student Companion",
    period: "2022 – 2023",
    description: "Mentored 5 students on academic and personal development for an academic year."
  },
  {
    id: "social-media-manager",
    role: "Social Media Manager",
    period: "2018 – 2021",
    description: "Handled college official cultural's team digital outreach & 40+ members for 2+ years."
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "gate-distinction",
    title: "GATE Distinction",
    period: "2021",
    description: "Secured AIR 132 in GATE 2021 (Biomedical Engineering) among 1684 candidates."
  },
  {
    id: "cultural-excellence",
    title: "Cultural Excellence",
    period: "2018 – 2020",
    description: "Winner of 7+ inter-cultural competitions & guest performer on National Voters' Day."
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Languages & Frameworks",
    items: ["Python", "PyTorch", "Flask", "Java (Spring Boot)", "SQL", "LangChain", "LangGraph", "TensorFlow"]
  },
  {
    category: "AI & Cloud",
    items: ["Azure OpenAI", "Agentic AI", "MCP", "RAG", "LLM", "AWS (Lambda, S3)", "Microsoft Fabric", "Docker", "Git", "Power BI"]
  },
  {
    category: "Interests & Creative",
    items: ["Vibe Coding", "Blogging", "Quotes & Story Writing", "Graphic Design", "Game Development"]
  }
];

// ----------------------------- Portfolio -----------------------------
export const HIDDEN_REPOS = [
  'portfolio-gk', // Example: hide the portfolio repo itself
  // Add specific repository names you want to hide here
];

export const HIDDEN_REPO_TOPICS = [
  'portfolio',
  'prototype',
  'prototypes',
  'backyard',
  'hide'
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'reszoom',
    title: 'Reszoom',
    description: 'AI-integrated job-hunt toolkit featuring ATS resume scoring, AI-driven analysis, automated JD parsing, and application tracking.',
    url: 'https://reszoom.vercel.app/',
    imageUrl: reszoomImg,
    tags: ['Agentic AI', 'LLM', 'Next.js', 'Productivity']
  },
  {
    id: 'cubiverse',
    title: 'Cubiverse',
    description: 'An immersive 3D web experience built with modern web technologies.',
    url: 'https://cubiverse-pied.vercel.app/',
    imageUrl: cubiverseImg,
    tags: ['Three.js', 'React', 'Vercel']
  }
];

// --- MANUAL OVERRIDES & EXTERNAL LINKS ---
// Note: Local files in src/assets will be loaded automatically. 
// Add entries here only if you want to override metadata (like adding a specific date/issuer) or use external URLs.

// ----------------------------- Certificates -----------------------------

export const MANUAL_CERTIFICATES: Certificate[] = [
  {
    id: 'Coursera Databases and SQL for Data Science with Python_page',
    title: 'Databases and SQL for Data Science with Python',
    issuer: 'IBM | Coursera',
    date: '2024',
    category: 'Cloud & AI',
    imageUrl: courseraSqlImg
  },
  {
    id: 'Coursera Python for Data Science, AI & Development',
    title: 'Python for Data Science, AI & Development',
    issuer: 'IBM | Coursera',
    date: '2024',
    category: 'Cloud & AI',
    imageUrl: courseraImg
  }
];

export const MANUAL_DESIGNS: DesignItem[] = [
  {
    id: 'Culturals-poster',
    title: 'Culturals Poster',
    imageUrl: culturalsImg,
    description: 'Digital art poster for Intra-cultral fest.',
    category: 'Poster',
    link: culturalsImg
  }
];

// ----------------------------- Quotes -----------------------------

export const MANUAL_QUOTES: QuoteItem[] = [
  {
    id: 'q1',
    type: 'text',
    content: "Some people are worth Melting for and my Melting point is You",
    author: "tinyDragon"
  },
  {
    id: 'q2',
    type: 'text',
    content: "Crushed by the Curls",
    author: "tinyDragon"
  },
  {
    id: 'q3',
    type: 'text',
    content: "Her Reply will always be a Haiku",
    author: "tinyDragon"
  },
  {
    id: 'q4',
    type: 'text',
    content: "Did I wound you? asked Big Panda\nNah, the Wound was already made, you were my Healer",
    author: "tinyDragon"
  },
  {
    id: 'q5',
    type: 'text',
    content: "Simple Equation of Life\n x² + x + 1 = 0",
    author: "tinyDragon"
  },
  {
    id: 'q6',
    type: 'text',
    content: "Non-fictional Super Power -\nMemory Loss",
    author: "tinyDragon"
  },
  {
    id: 'q7',
    type: 'text',
    content: "Love Chemistry vs\nFriendship Physics",
    author: "tinyDragon"
  },
  {
    id: 'q8',
    type: 'text',
    content: "Pain - One thing Gained out of Chemistry",
    author: "tinyDragon"
  },
  {
    id: 'q9',
    type: 'text',
    content: "என் நிழலும் என்னுடன் வாராத பொழுதினில்\n உன்னுடன் செல்ல ஏங்கினேன்",
    author: "tinyDragon"
  },
  {
    id: 'q10',
    type: 'text',
    content: "மாற்றங்களின் சிறு முள்ளாய் நானும் பெரு முள்ளாய் நீயும்",
    author: "tinyDragon"
  },
  {
    id: 'q11',
    type: 'text',
    content: "Understanding: Real Curse",
    author: "tinyDragon"
  },
  {
    id: 'q12',
    type: 'text',
    content: "A Journey or Destination feels worthless when no Company to share",
    author: "tinyDragon"
  },
  {
    id: 'q13',
    type: 'text',
    content: "Stronger it becomes, More Brittle it will be",
    author: "tinyDragon"
  },
  {
    id: 'q14',
    type: 'text',
    content: "The Gem Always Shines",
    author: "tinyDragon"
  },
  {
    id: 'q15',
    type: 'text',
    content: "The Real Gem shines even when its Losts",
    author: "tinyDragon"
  },
  {
    id: 'q16',
    type: 'text',
    content: "Found the care in Resentment",
    author: "tinyDragon"
  },
  {
    id: 'q17',
    type: 'text',
    content: "Need a Stand with Holding your hands",
    author: "tinyDragon"
  },
  {
    id: 'q18',
    type: 'text',
    content: "Make a Stand, I will; Standing Alone, I'm used to it",
    author: "tinyDragon"
  },
  {
    id: 'q19',
    type: 'text',
    content: "There's Always been a Reason",
    author: "tinyDragon"
  },
  {
    id: 'q20',
    type: 'text',
    content: "Reason becomes Lies",
    author: "tinyDragon"
  },
  {
    id: 'q21',
    type: 'text',
    content: "The Reason is not Always the reason, the Person is",
    author: "tinyDragon"
  },
  {
    id: 'q22',
    type: 'text',
    content: "One person enough, to make you Feel you have All",
    author: "tinyDragon"
  },
  {
    id: 'q23',
    type: 'text',
    content: "Stop earning Persons, Start earning Memories, it might Last Long",
    author: "tinyDragon"
  },
  {
    id: 'q24',
    type: 'text',
    content: "If you try to go back to your Older version, it will become a New version and the Current version will become your Older version. Changes can't bring back what you used to be",
    author: "tinyDragon"
  },
  {
    id: 'q25',
    type: 'text',
    content: "What we want vs\nWhat we feel is Right",
    author: "tinyDragon"
  },
  {
    id: 'q26',
    type: 'text',
    content: "Wavelenth Matters",
    author: "tinyDragon"
  },
  {
    id: 'q27',
    type: 'text',
    content: "Always an Opposite Charge",
    author: "tinyDragon"
  },
  {
    id: 'q28',
    type: 'text',
    content: "Jealous - Nope \n Possessive - Yep",
    author: "tinyDragon"
  },
  {
    id: 'q29',
    type: 'text',
    content: "Out of Love - Possessive\nOut of Desperate - Jealous",
    author: "tinyDragon"
  },
  {
    id: 'q30',
    type: 'text',
    content: "Heart- Always want More",
    author: "tinyDragon"
  },
  {
    id: 'q31',
    type: 'text',
    content: "Worst day + Listening = Solace",
    author: "tinyDragon"
  },
  {
    id: 'q32',
    type: 'text',
    content: "Views are about Perspective, not about Truth",
    author: "tinyDragon"
  }
];

// ----------------------------- Blogs -----------------------------

export const MANUAL_BLOGS: BlogItem[] = [
  {
    id: 'the-radha-krishna-b8d39f39a632',
    title: "The Radha - Krishns",
    subtitle: "Mythology isn't just a story - sometimes it becomes a mirror",
    date: "Nov 17, 2025",
    readTime: "5 min read",
    url: "https://medium.com/@gokulkrish0999/the-radha-krishna-b8d39f39a632",
    imageUrl: blogRadhaKrishnaImg
  }
];

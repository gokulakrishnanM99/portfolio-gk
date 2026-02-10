
import { Experience, Education, SkillCategory, Certificate, QuoteItem, DesignItem, FeaturedProject, BlogItem } from './types';
import { Linkedin, Github, FileText, Mail } from 'lucide-react';

// Color Constants specified by user
export const COLOR_RED = '#A90000'; // R-169, G-0, B-0
export const COLOR_GREY = '#262626'; // R-38, G-38, B-38

// Global Defaults
export const DEFAULT_QUOTE_AUTHOR = "Gokulakrishnan M";
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
    url: "mailto:gokulkrish0999@gmail.com",
    icon: Mail,
  }
];

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
    id: "ideas-iitb",
    role: "Pre-Incubation Fellow",
    company: "IDEAs IIT Bombay",
    period: "Jan 2026 – Present",
    description: [
      "Leading pre-incubation analysis of sustainability challenges across corporate and urban systems.",
      "Translating stakeholder insights and operational data gaps into actionable, real-world sustainability workflows."
    ]
  },
  {
    id: "stepchange-assoc",
    role: "Data Science Associate",
    company: "StepChange Inc",
    period: "May 2024 - Nov 2025",
    skills: ["Azure OpenAI", "AWS Lambda", "SQL", "Cursor AI"],
    description: [
      "Designed a RAG LLM chaining system using Azure OpenAI APIs for policy report generation.",
      "Developed event-driven serverless architecture (AWS Lambda) for real-time metric computations.",
      "Architected scalable multi-tabular data frameworks integrating advanced SQL optimization.",
      "Optimized high-throughput sustainability metric computations in B2B carbon accounting platform."
    ]
  },
  {
    id: "stepchange-analyst",
    role: "Data Analyst",
    company: "StepChange Inc",
    period: "July 2023 – April 2024",
    skills: ["Google Maps API", "Microsoft Fabric", "Power BI"],
    description: [
      "Developed algorithms integrating Google Maps APIs and Geopy to compute emissions (PCAF standards).",
      "Orchestrated large-scale enterprise data migration within Microsoft Fabric.",
      "Prototyped interactive Power BI dashboards with Azure Storage."
    ]
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Languages & Frameworks",
    items: ["Python", "PyTorch", "Java (Spring Boot)", "SQL", "Flask", "LangChain", "R", "TensorFlow", "Scikit-learn"]
  },
  {
    category: "AI & Cloud",
    items: ["Azure OpenAI", "Deep Learning", "RAG", "LLM", "AWS (Lambda, S3)", "Microsoft Fabric", "Docker", "Git", "Power BI"]
  },
  {
    category: "Creative & Tools",
    items: ["Adobe Photoshop", "Illustrator", "Premiere Pro", "Blogging", "Designing", "Game Development"]
  }
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'cubiverse',
    title: 'Cubiverse',
    description: 'An immersive 3D web experience built with modern web technologies.',
    url: 'https://cubiverse-pied.vercel.app/',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop',
    tags: ['Three.js', 'React', 'Vercel']
  },
  {
    id: 'reszoom',
    title: 'Reszoom',
    description: 'A powerful tool for resuming and optimizing your digital workflow.',
    url: 'https://reszoom.vercel.app/',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
    tags: ['Next.js', 'Productivity', 'Tool']
  }
];

// --- MANUAL OVERRIDES & EXTERNAL LINKS ---
// Note: Local files in src/assets will be loaded automatically. 
// Add entries here only if you want to override metadata (like adding a specific date/issuer) or use external URLs.

export const MANUAL_CERTIFICATES: Certificate[] = [
  // Example: If you have a file "Azure.jpg", you can add details here with id: "Azure" to enrich it.
  {
    id: 'c1',
    title: 'Python for Data Science, AI & Development',
    issuer: 'Coursera (offered by IBM)',
    date: '2024',
    category: 'Cloud & AI',
    imageUrl: 'assets/certificates/Course/Coursera Python for Data Science, AI & Development.jpg' // This will be loaded from src/assets/certificates/azure.jpg
  }
];

export const MANUAL_DESIGNS: DesignItem[] = [
  {
    id: 'd1',
    title: 'Culturals Poster',
    imageUrl: 'assets/design/Posters/Culturals-poster.jpg',
    description: 'Digital art poster for Intra-cultral fest.',
    category: 'Poster'
  }
];

export const MANUAL_QUOTES: QuoteItem[] = [
  { 
    id: 'q1', 
    type: 'text',
    content: "Some people are worth Melting for and my Melting point is You", 
    author: "Gokulakrishnan M" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Love Chemistry vs Friendship Physics", 
    author: "Gokulakrishnan M" 
  }
];

export const MANUAL_BLOGS: BlogItem[] = [
  {
    id: '1',
    title: "The Radha - Krishns",
    subtitle: "Mythology isn't just a story - sometimes it becomes a mirror",
    date: "Nov 17, 2025",
    readTime: "5 min read",
    url: "https://medium.com/@gokulkrish0999/the-radha-krishna-b8d39f39a632",
    imageUrl: "assets/blogs/the-radha-krishna-b8d39f39a632.png"
  }
];

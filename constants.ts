
import { Experience, Education, SkillCategory, Certificate, QuoteItem, DesignItem, FeaturedProject, BlogItem } from './types';
import { Linkedin, Github, FileText, Mail } from 'lucide-react';

// Import images so Vite properly handles asset paths with base URL
import courseraImg from '/assets/certificates/Course/Coursera Python for Data Science, AI & Development.jpg';
import culturalsImg from '/assets/design/Posters/Culturals-poster.jpg';
import blogRadhaKrishnaImg from '/assets/blogs/the-radha-krishna-b8d39f39a632.png';

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
    url: "mailto:gokulkrish0999@gmail.com",
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
    id: "Maasta",
    role: "Contractor - Software Developer",
    company: "Maasta",
    period: "Feb 2026 – Present",
    skills: ["LLM", "OCR", "API Development", "AI", "Supabase"],
    description: [
      "Developing AI integrated career development platform for Schools, Colleges, and Universities.",
      "https://www.thisai.pro/",
    ]
  },
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

// ----------------------------- Portfolio -----------------------------

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

// ----------------------------- Certificates -----------------------------

export const MANUAL_CERTIFICATES: Certificate[] = [
  // Example: If you have a file "Azure.jpg", you can add details here with id: "Azure" to enrich it.
  {
    id: 'Coursera Python for Data Science, AI & Development',
    title: 'Python for Data Science, AI & Development',
    issuer: 'Coursera (offered by IBM)',
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
    id: 'q2', 
    type: 'text',
    content: "Her Reply will always be a Haiku", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Did I wound you? asked Big Panda\nNah, the Wound was already made, you were my Healer", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Simple Equation of Life\n x² + x + 1 = 0", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Non-fictional Super Power -\nMemory Loss", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Love Chemistry vs\nFriendship Physics", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Pain - One thing Gained out of Chemistry", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "என் நிழலும் என்னுடன் வாராத பொழுதினில்\n உன்னுடன் செல்ல ஏங்கினேன்", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "மாற்றங்களின் சிறு முள்ளாய் நானும் பெரு முள்ளாய் நீயும்", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Understanding: Real Curse", 
    author: "tinyDragon" 
  },
   { 
    id: 'q2', 
    type: 'text',
    content: "A Journey or Destination feels worthless when no Company to share", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Stronger it becomes, More Brittle it will be", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "The Gem Always Shines", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "The Real Gem shines even when its Losts", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Found the care in Resentment", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Need a Stand with Holding your hands", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Make a Stand, I will; Standing Alone, I'm used to it", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "There's Always been a Reason", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Reason becomes Lies", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "The Reason is not Always the reason, the Person is", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "One person enough, to make you Feel you have All", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Stop earning Persons, Start earning Memories, it might Last Long", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "If you try to go back to your Older version, it will become a New version and the Current version will become your Older version. Changes can't bring back what you used to be", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "What we want vs\nWhat we feel is Right", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Wavelenth Matters", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Always an Opposite Charge", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Jealous - Nope \n Possessive - Yep", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Out of Love - Possessive\nOut of Desperate - Jealous", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Heart- Always want More", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
    type: 'text',
    content: "Worst day + Listening = Solace", 
    author: "tinyDragon" 
  },
  { 
    id: 'q2', 
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

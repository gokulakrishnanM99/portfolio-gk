/* ============================================================================
   GK.OS — single source of truth for all portfolio content.
   Edit this file to update the site. Media lives in /public/media.
   ========================================================================== */

export const media = (p: string) => `${import.meta.env.BASE_URL}media/${p}`;
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

/* ------------------------------------------------------------------ PROFILE */
export const PROFILE = {
  name: 'Gokulakrishnan M',
  first: 'Gokulakrishnan',
  last: 'M',
  roles: ['AI Engineer', 'ML Engineer', 'Data Scientist'],
  headline: 'I build agentic AI, LLM pipelines and vision systems that turn messy, real-world data into decisions.',
  summary:
    'Specialising in Agentic AI, Generative AI, LLM pipelines and cloud architecture — bridging complex data and frontier models into high-throughput systems, with a love for design and visual storytelling.',
  status: 'Building with LLMs, agents & vision',
  location: 'India',
  email: 'gokulakrishnan.m0999@gmail.com',
  resume: asset('Resume_Gokulakrishnan_M.pdf'),
  classicSite: 'https://gokulakrishnanm99.github.io/portfolio-gk/',
};

export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/gokulakrishnan-m', url: 'https://www.linkedin.com/in/gokulakrishnan-m/' },
  { id: 'github', label: 'GitHub', handle: 'gokulakrishnanM99', url: 'https://github.com/gokulakrishnanM99' },
  { id: 'medium', label: 'Medium', handle: '@gokulkrish0999', url: 'https://medium.com/@gokulkrish0999' },
] as const;

/* Headline telemetry shown around the core on the Identity sector. */
export const TELEMETRY = [
  { value: '3+', unit: 'yrs', label: 'Industry experience', detail: 'Data → GenAI → AI engineering' },
  { value: '14K+', unit: '', label: 'MCQs verified', detail: 'Self-hosted LLM pipeline' },
  { value: '14', unit: 'TB', label: 'Enterprise data migrated', detail: 'Multi-region Microsoft Fabric' },
  { value: 'AIR 132', unit: '', label: 'GATE 2021', detail: 'Biomedical Engineering' },
];

/* ------------------------------------------------------------------ ORIGIN */
export const ORIGIN = {
  title: 'From neurons to neural networks',
  paragraphs: [
    'I trained as a biomedical engineer — first at CEG, Anna University, then at IIT Bombay — learning to read the signals the human body leaves behind: CT scans, thermal images and other medical imaging.',
    'That curiosity led straight into deep learning: a UNet++ that segments liver tumours at 94% IoU, transfer-learned classifiers, and models built from scratch to understand why they work.',
    'Since 2023 I have shipped that thinking into industry — carbon-accounting data platforms, RAG pipelines on Azure OpenAI, and self-hosted LLM + vision systems that grade exams at scale.',
  ],
  education: [
    { id: 'mtech', degree: 'M.Tech, Biomedical Engineering', institution: 'IIT Bombay', period: '2021 – 2023', metric: '9.45', metricLabel: 'CPI' },
    { id: 'be', degree: 'B.E., Biomedical Engineering', institution: 'CEG, Anna University', period: '2017 – 2021', metric: '7.6', metricLabel: 'GPA' },
  ],
  interests: ['Game development', 'Graphic design', 'Story & quote writing', 'Blogging', 'Vibe coding'],
};

/* ---------------------------------------------------------------- MISSIONS */
export interface Mission {
  id: string;
  role: string;
  org: string;
  type?: string;
  start: string; // YYYY-MM
  end: string;   // YYYY-MM
  period: string;
  codename: string;
  brief: string;
  points: { label: string; text: string }[];
  stack: string[];
}

export const MISSIONS: Mission[] = [
  {
    id: 'thisai',
    role: 'AI Engineer',
    org: 'Thisai',
    type: 'Contract',
    start: '2026-01',
    end: '2026-10',
    period: 'Jan 2026 – Oct 2026',
    codename: 'LOCAL INTELLIGENCE',
    brief: 'Self-hosted LLM and vision pipelines for an ed-tech platform — verification, grading and exam generation at scale.',
    points: [
      { label: 'Local LLM evaluation', text: 'Benchmarked self-hosted Llama, Qwen and GPT-OSS (3B–20B) with prompt and inference tuning inside an LLM pipeline that verifies 14k+ MCQs and generates pedagogical metadata.' },
      { label: 'Computer vision & GenAI', text: 'Architected an OpenCV + Vision-LLM OCR pipeline on Django/Celery to grade scanned answer sheets; tuned and integrated a Gemma 3 4B RAG system to auto-generate personalised exams.' },
    ],
    stack: ['Local LLMs', 'Llama', 'Qwen', 'GPT-OSS', 'Gemma 3', 'RAG', 'OpenCV', 'Vision-LLM', 'Django', 'Celery'],
  },
  {
    id: 'stepchange-assoc',
    role: 'Data Science Associate',
    org: 'StepChange Inc',
    start: '2024-05',
    end: '2025-11',
    period: 'May 2024 – Nov 2025',
    codename: 'GENERATIVE POLICY',
    brief: 'GenAI and serverless automation for a B2B carbon-accounting SaaS platform.',
    points: [
      { label: 'GenAI & LLM development', text: 'Engineered a LangChain-driven RAG pipeline on Azure OpenAI to automate policy report generation and predict qualitative outcomes from historical datasets.' },
      { label: 'AWS serverless automation', text: 'Built an event-driven AWS Lambda architecture for data ingestion and real-time metric computation — cutting turnaround from months of manual processing to hours.' },
      { label: 'SaaS platform', text: 'Optimised high-throughput sustainability-metric computation and designed scalable multi-table ingestion frameworks in Java (Spring Boot) and SQL.' },
    ],
    stack: ['Azure OpenAI', 'LangChain', 'RAG', 'AWS Lambda', 'Java (Spring Boot)', 'SQL'],
  },
  {
    id: 'stepchange-analyst',
    role: 'Data Analyst',
    org: 'StepChange Inc',
    start: '2023-07',
    end: '2024-04',
    period: 'Jul 2023 – Apr 2024',
    codename: 'GROUND TRUTH',
    brief: 'Geospatial emission models, enterprise data migration and financial-filing APIs.',
    points: [
      { label: 'Geospatial & emission modelling', text: 'Developed algorithms on Google Maps APIs and Geopy to compute travel distances and emissions in line with global carbon-accounting financial standards.' },
      { label: 'Data engineering & migration', text: 'Migrated 14 TB of enterprise data across a multi-region Microsoft Fabric tenancy; engineered APIs that convert NSE XBRL financial filings into structured data.' },
      { label: 'Analytics dashboards', text: 'Prototyped interactive Power BI dashboards on Azure Storage and Fabric Dataflows.' },
    ],
    stack: ['Google Maps API', 'Geopy', 'Microsoft Fabric', 'Power BI', 'REST APIs', 'Azure Storage'],
  },
];

/* ---------------------------------------------------------------- PROJECTS */
export interface Project {
  id: string;
  code: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  outcome?: { value: string; label: string };
  tags: string[];
  url?: string;
  /** Primary image. If the file does not exist yet the card renders its typographic face. */
  image?: string;
  imageFit?: 'cover' | 'contain';
}

export const PROJECTS: Project[] = [
  {
    id: 'reszoom',
    code: 'P-01',
    title: 'ResZoom',
    kind: 'Agentic AI product',
    year: '2026',
    summary: 'An AI-integrated job-hunt toolkit: ATS resume scoring, AI-driven analysis, automated job-description parsing and application tracking in one workspace.',
    tags: ['Agentic AI', 'LLM', 'Next.js', 'Productivity'],
    url: 'https://reszoom.vercel.app/',
    image: media('projects/reszoom.webp'),
    imageFit: 'cover',
  },
  {
    id: 'comic-agent',
    code: 'P-02',
    title: 'Story → Comic Agent',
    kind: 'Agentic AI',
    year: '2026',
    summary: 'An agent that turns a written story into a multi-panel comic strip — orchestrating MCP tools with Gemini for scene breakdown, panel prompts and layout.',
    tags: ['Agentic AI', 'MCP', 'Gemini', 'Prompt Engineering'],
    image: media('generated/project-comic-agent.webp'),
  },
  {
    id: 'cubiverse',
    code: 'P-03',
    title: 'Cubiverse',
    kind: '3D web experience',
    year: '2026',
    summary: 'An immersive 3D web experience built around an interactive cube universe, rendered in the browser with Three.js and React.',
    tags: ['Three.js', 'React', 'Vercel'],
    url: 'https://cubiverse-pied.vercel.app/',
    image: media('projects/cubiverse.webp'),
  },
  {
    id: 'liver-seg',
    code: 'P-04',
    title: 'Liver Tumour Segmentation',
    kind: 'Medical AI · IIT Bombay',
    year: '2022',
    summary: 'A deeply supervised UNet++ that extracts liver tumours from CT scans, trained with a custom Dice + cross-entropy loss.',
    outcome: { value: '94%', label: 'IoU' },
    tags: ['UNet++', 'PyTorch', 'CT Scans', 'Dice-CE Loss'],
    image: media('generated/project-liver-segmentation.webp'),
  },
  {
    id: 'dl-classification',
    code: 'P-05',
    title: 'Deep Learning Classification',
    kind: 'Research · IIT Bombay',
    year: '2022',
    summary: 'ResNet-18 transfer learning for image classification, plus MLPs and perceptrons built from scratch to benchmark activation functions on MNIST.',
    tags: ['ResNet-18', 'Transfer Learning', 'MLPs', 'PyTorch'],
    image: media('generated/project-dl-classification.webp'),
  },
  {
    id: 'ml-tuning',
    code: 'P-06',
    title: 'Hyperparameter Sensitivity',
    kind: 'Machine learning',
    year: '2021',
    summary: 'Compared and fine-tuned SVM, logistic regression and random-forest models to map hyperparameter sensitivity; K-Means clustering for thermal-image segmentation.',
    tags: ['SVM', 'Random Forest', 'K-Means', 'Thermal Imaging'],
    image: media('generated/project-ml-tuning.webp'),
  },
];

export const GITHUB_USER = 'gokulakrishnanM99';
export const HIDDEN_REPOS = ['portfolio-gk', 'portfolio-jarvis', 'gk-holographic-portfolio'];
export const HIDDEN_REPO_TOPICS = ['portfolio', 'prototype', 'prototypes', 'backyard', 'hide'];

/* ------------------------------------------------------------ CAPABILITIES */
export interface Skill { name: string; refs: string[] }
export interface SkillGroup { id: string; label: string; code: string; skills: Skill[] }

/** refs point at MISSIONS ids or PROJECTS ids — used for live cross-referencing. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'genai', code: 'G-1', label: 'Generative & Agentic AI',
    skills: [
      { name: 'LLM pipelines', refs: ['thisai', 'stepchange-assoc', 'reszoom'] },
      { name: 'RAG', refs: ['thisai', 'stepchange-assoc'] },
      { name: 'Agentic AI', refs: ['reszoom', 'comic-agent'] },
      { name: 'MCP', refs: ['comic-agent'] },
      { name: 'LangChain', refs: ['stepchange-assoc'] },
      { name: 'LangGraph', refs: [] },
      { name: 'Azure OpenAI', refs: ['stepchange-assoc'] },
      { name: 'Local LLMs (Llama · Qwen · Gemma)', refs: ['thisai'] },
      { name: 'Prompt engineering', refs: ['thisai', 'comic-agent', 'reszoom'] },
    ],
  },
  {
    id: 'ml', code: 'M-2', label: 'Machine Learning & Vision',
    skills: [
      { name: 'PyTorch', refs: ['liver-seg', 'dl-classification'] },
      { name: 'TensorFlow', refs: [] },
      { name: 'OpenCV', refs: ['thisai'] },
      { name: 'Vision-LLM OCR', refs: ['thisai'] },
      { name: 'Segmentation (UNet++)', refs: ['liver-seg'] },
      { name: 'Transfer learning', refs: ['dl-classification'] },
      { name: 'Classical ML', refs: ['ml-tuning'] },
    ],
  },
  {
    id: 'data', code: 'D-3', label: 'Data & Cloud',
    skills: [
      { name: 'AWS (Lambda · S3)', refs: ['stepchange-assoc'] },
      { name: 'Microsoft Fabric', refs: ['stepchange-analyst'] },
      { name: 'Azure Storage', refs: ['stepchange-analyst'] },
      { name: 'SQL', refs: ['stepchange-assoc'] },
      { name: 'Power BI', refs: ['stepchange-analyst'] },
      { name: 'Geospatial APIs', refs: ['stepchange-analyst'] },
    ],
  },
  {
    id: 'eng', code: 'E-4', label: 'Engineering',
    skills: [
      { name: 'Python', refs: ['thisai', 'stepchange-assoc', 'stepchange-analyst', 'liver-seg', 'dl-classification', 'ml-tuning'] },
      { name: 'Java (Spring Boot)', refs: ['stepchange-assoc'] },
      { name: 'Django · Celery', refs: ['thisai'] },
      { name: 'Flask', refs: [] },
      { name: 'REST APIs', refs: ['stepchange-analyst'] },
      { name: 'Docker', refs: [] },
      { name: 'Git', refs: [] },
      { name: 'Three.js · React', refs: ['cubiverse'] },
    ],
  },
  {
    id: 'creative', code: 'C-5', label: 'Creative',
    skills: [
      { name: 'Graphic design', refs: [] },
      { name: 'Story & quote writing', refs: [] },
      { name: 'Blogging', refs: [] },
      { name: 'Game development', refs: [] },
      { name: 'Vibe coding', refs: ['reszoom', 'cubiverse'] },
    ],
  },
];

/* ------------------------------------------------------------- CREDENTIALS */
export const DISTINCTIONS = [
  { id: 'gate', value: 'AIR 132', title: 'GATE 2021 — Biomedical Engineering', text: 'All-India rank 132 among 1,684 candidates.', year: '2021' },
  { id: 'intern', value: 'Best', title: 'Best Summer Intern — Medevolve', text: 'Best Summer Intern award at Medevolve ’20.', year: '2020' },
  { id: 'culture', value: '7+', title: 'Cultural excellence', text: 'Winner of 7+ inter-college competitions; guest performer on National Voters’ Day.', year: '2018 – 2020' },
];

export const LEADERSHIP = [
  { id: 'companion', role: 'Student Companion', org: 'IIT Bombay', period: '2022 – 2023', text: 'Mentored 5 students on academic and personal development across an academic year.' },
  { id: 'social', role: 'Social Media Manager', org: 'CEG Culturals', period: '2018 – 2021', text: 'Led the official culturals team’s digital outreach and a 40+ member crew for 2+ years.' },
];

export interface Certificate { id: string; title: string; issuer: string; category: string; w: number; h: number }
const C = (id: string, title: string, issuer: string, category: string, w: number, h: number): Certificate => ({ id, title, issuer, category, w, h });

export const CERTIFICATES: Certificate[] = [
  C('coursera-python-for-data-science-ai-development', 'Python for Data Science, AI & Development', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-databases-and-sql-for-data-science-with-python-page', 'Databases and SQL for Data Science with Python', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-intoduction-to-data-engineering', 'Introduction to Data Engineering', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-introduction-to-relational-databases-rdbms', 'Introduction to Relational Databases (RDBMS)', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-python-project-for-data-engineering', 'Python Project for Data Engineering', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('gokulakrishnan-m-python-certificate', 'Python Programming', 'Certificate', 'Courses', 1600, 1190),
  C('pantech-matlab', 'MATLAB', 'Pantech', 'Courses', 972, 648),
  C('gokulakrishnan-page-001', 'Internship — Collaborative New Product Development', 'Xfinito Biodesigns', 'Internships', 1131, 1600),
  C('3g-irps-intern', 'Internship', '3G IRPS', 'Internships', 1394, 1054),
  C('3g-irps-lor', 'Letter of Recommendation', '3G IRPS', 'Internships', 1126, 1600),
  C('uniq-inplant-training', 'In-plant Training', 'UNIQ', 'Workshops', 1404, 1041),
  C('uniq-fingerprint-recognition-mini-project', 'Fingerprint Recognition — Mini Project', 'UNIQ', 'Workshops', 1431, 1061),
  C('uniq-matlab', 'MATLAB Workshop', 'UNIQ', 'Workshops', 1349, 1005),
  C('mit-app-inventor-workshop', 'MIT App Inventor Workshop', 'Workshop', 'Workshops', 1398, 1004),
  C('best-summer-intern-medevol-20', 'Best Summer Intern', 'Medevolve 2020', 'Achievements', 1380, 962),
  C('k-box-winner', 'K! Box — Winner', 'Competition', 'Achievements', 1410, 1000),
  C('nss-certificate', 'National Service Scheme', 'NSS', 'Achievements', 1007, 696),
  C('covid-safe-shop', 'Covid Safe Shop', 'Initiative', 'Achievements', 960, 540),
  C('biospctra18-bionomics-2nd', 'Bionomics — 2nd place', 'Biospectra 2018', 'Culturals', 1295, 919),
  C('medevolv-19-limbo-3rd', 'Limbo — 3rd place', 'Medevolve 2019', 'Culturals', 1394, 1005),
  C('finun-2018-new-college', 'FINUN 2018', 'The New College', 'Culturals', 1417, 1003),
  C('smc-euphoria-2018', 'Euphoria 2018', 'SMC', 'Culturals', 1452, 992),
  C('mcc-deepwoods-2019', 'Deepwoods 2019', 'MCC', 'Culturals', 1445, 1016),
  C('srm-milan-2020', 'Milan 2020', 'SRM', 'Culturals', 1405, 997),
  C('theaterfest-creasent-2020', 'Theatre Fest 2020', 'Crescent', 'Culturals', 1380, 973),
  C('voters-poster', 'National Voters’ Day — Poster', 'Election Commission', 'Culturals', 1442, 1057),
  C('voters-slogan', 'National Voters’ Day — Slogan', 'Election Commission', 'Culturals', 1369, 1002),
  C('voters-shadow', 'National Voters’ Day — Shadow play', 'Election Commission', 'Culturals', 1376, 1038),
];

/* ---------------------------------------------------------- TRANSMISSIONS */
export const MEDIUM_BASE = 'https://medium.com/@gokulkrish0999/';

export interface Blog { id: string; title: string; subtitle?: string; date?: string; read?: string; w: number; h: number }
export const BLOGS: Blog[] = [
  { id: 'the-radha-krishna-b8d39f39a632', title: 'The Radha – Krishna', subtitle: 'Mythology isn’t just a story — sometimes it becomes a mirror.', date: 'Nov 17, 2025', read: '5 min', w: 1024, h: 1024 },
  { id: 'you-are-never-compared-an-imperfect-story-8d842c0022ab', title: 'You Are Never Compared', subtitle: 'An imperfect story.', w: 800, h: 1200 },
  { id: 'the-trip-that-almost-didnt-happen-part-1-4d526d5398b7', title: 'The Trip That Almost Didn’t Happen', subtitle: 'Part 1.', w: 720, h: 960 },
  { id: 'hearts-desire-the-girl-within-c7195dea5db4', title: 'Heart’s Desire', subtitle: 'The girl within.', w: 900, h: 1200 },
  { id: 'a-day-to-relive-160a0bdccc1e', title: 'A Day to Relive', w: 1200, h: 637 },
  { id: 'girl-in-everyones-life-e837556b9d94', title: 'Girl in Everyone’s Life', w: 1200, h: 513 },
  { id: 'the-best-friend-9aa7a98e4f14', title: 'The Best Friend', w: 1200, h: 808 },
  { id: 'the-friend-dd19a9dc374e', title: 'The Friend', w: 1200, h: 889 },
];

export const QUOTE_AUTHOR = 'tinyDragon';
export const QUOTES: string[] = [
  'Views are about perspective, not about truth.',
  'Some people are worth melting for — and my melting point is you.',
  'Simple equation of life:\nx² + x + 1 = 0',
  'If you try to go back to your older version, it becomes a new version — and the current one becomes your older. Change can’t bring back what you used to be.',
  'Stop earning persons. Start earning memories — they might last longer.',
  'The real gem shines even when it’s lost.',
  'Worst day + Listening = Solace',
  'Love chemistry vs\nfriendship physics',
  'Expectation state ⟶ Ground state',
  'A journey or destination feels worthless with no company to share it.',
  'Stronger it becomes, more brittle it will be.',
  'Make a stand, I will. Standing alone, I’m used to it.',
  'The reason is not always the reason — the person is.',
  'Non-fictional superpower:\nmemory loss',
  'Her reply will always be a haiku.',
  'Wavelength matters.',
  'Did I wound you? asked Big Panda.\nNah, the wound was already made — you were my healer.',
  'One person is enough to make you feel you have it all.',
  'What we want vs\nwhat we feel is right',
  'Heart — always wants more.',
  'Understanding: the real curse.',
  'என் நிழலும் என்னுடன் வாராத பொழுதினில்\nஉன்னுடன் செல்ல ஏங்கினேன்',
  'மாற்றங்களின் சிறு முள்ளாய் நானும் பெரு முள்ளாய் நீயும்',
];

export interface Design { id: string; title: string; caption: string; w: number; h: number; video?: string }
export const DESIGNS: Design[] = [
  { id: 'culturals-poster', title: 'Culturals', caption: 'Digital art poster for an intra-college cultural fest.', w: 1800, h: 1286 },
  { id: 'maari-pochu', title: 'Maari Pochu', caption: 'Title-card artwork for a short film.', w: 1080, h: 720, video: media('designs/mari-pochu-title-card.mp4') },
];

/* ---------------------------------------------------------------- SECTORS */
export const SECTORS = [
  { id: 'identity', code: '01', label: 'Identity', title: 'Profile', hint: 'Who I am' },
  { id: 'origin', code: '02', label: 'Origin', title: 'About', hint: 'Biomedical roots, AI focus' },
  { id: 'missions', code: '03', label: 'Mission Log', title: 'Experience', hint: '3 roles · 2023 – 2026' },
  { id: 'arsenal', code: '04', label: 'Arsenal', title: 'Projects', hint: 'Products & research' },
  { id: 'matrix', code: '05', label: 'Neural Matrix', title: 'Capabilities', hint: 'Skills, cross-referenced' },
  { id: 'credentials', code: '06', label: 'Credentials', title: 'Recognition', hint: 'Distinctions & certificates' },
  { id: 'transmissions', code: '07', label: 'Transmissions', title: 'Writing & Art', hint: 'Blogs, quotes, designs' },
  { id: 'uplink', code: '08', label: 'Uplink', title: 'Contact', hint: 'Open a channel' },
] as const;

export type SectorId = (typeof SECTORS)[number]['id'];

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
  roles: ['AI/ML Engineer', 'Medical AI', 'Data Scientist'],
  headline: 'I build LLM pipelines, agentic AI tools and computer-vision systems, along with the backend services that run them.',
  summary:
    'My work covers agentic and generative AI, LLM pipelines and cloud data platforms on AWS and Azure. Outside work, I write stories and create visual content.',
  status: 'Building with LLMs, agents & vision',
  location: 'Bengaluru, India',
  /** Job-search status shown on the Experience page. */
  availability: { roles: 'Open to AI/ML roles', places: 'Bengaluru / Chennai / Hyderabad / Remote', when: 'Available now' },
  email: 'gokulakrishnan.m0999@gmail.com',
  resume: asset('Resume_Gokulakrishnan_M.pdf'),
  /** the previous site, kept behind ?classic=true */
  classicSite: `${import.meta.env.BASE_URL}?classic=true`,
};

export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/gokulakrishnan-m', url: 'https://www.linkedin.com/in/gokulakrishnan-m/' },
  { id: 'github', label: 'GitHub', handle: 'gokulakrishnanM99', url: 'https://github.com/gokulakrishnanM99' },
  { id: 'medium', label: 'Medium', handle: '@gokulkrish0999', url: 'https://medium.com/@gokulkrish0999' },
] as const;

/* Headline telemetry shown around the core on the Identity sector. */
export const TELEMETRY = [
  { value: '3+', unit: 'yrs', label: 'Industry experience', detail: 'Data → AI engineering' },
  { value: 'IIT Bombay', unit: '', label: 'Graduate', detail: 'CPI 9.45' },
  { value: 'AI', unit: '', label: 'Automation', detail: 'LLMs, RAG, MCP' },
  { value: 'Biomedical', unit: '', label: 'Engineer', detail: 'AI in Medical Imaging, Simulations' },
];

/* ------------------------------------------------------------------ ORIGIN */
export const ORIGIN = {
  title: 'From neurons to neural networks',
  paragraphs: [
    'My path began in biomedical engineering at CEG, Anna University, and deepened during my master’s at IIT Bombay. Somewhere between neurons and code, the question changed from how the brain learns? to how a machine can?',
    'So I learned machine learning from the ground up, building networks from scratch before training and fine-tuning larger ones for medical image segmentation of CT scans and thermal images, using convolutional networks and clustering.',
    'Today I build that knowledge into products: data platforms for carbon accounting, RAG pipelines on Azure OpenAI, and self-hosted LLM benchmarking and vision models that grade answer sheets.',
  ],
  education: [
    { id: 'mtech', degree: 'M.Tech, Biomedical Engineering', institution: 'IIT Bombay', period: '2021 – 2023', metric: '9.45', metricLabel: 'CPI' },
    { id: 'be', degree: 'B.E., Biomedical Engineering', institution: 'CEG, Anna University', period: '2017 – 2021', metric: '7.6', metricLabel: 'GPA' },
  ],
  interests: ['Graphic design', 'Blogging', 'Vibe coding', 'Quote & fiction writing'],
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
    brief: 'Self-hosted LLM and vision pipelines for an ed-tech platform, used to verify questions, grade answer sheets and generate exams.',
    points: [
      { label: 'Local LLM evaluation', text: 'Benchmarked self-hosted Llama, Qwen and GPT-OSS (3B–20B) with prompt and inference tuning in an LLM pipeline verifying 14k+ MCQs and generating metadata.' },
      { label: 'Computer vision & GenAI', text: 'Built an OpenCV + Vision-LLM OCR pipeline to grade answer sheets; integrated Gemma 3 4B RAG to generate personalised exams.' },
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
      { label: 'GenAI & LLM development', text: 'Engineered a LangChain RAG pipeline on Azure OpenAI to automate policy reports and predict qualitative outcomes from historical data.' },
      { label: 'AWS serverless automation', text: 'Built an event-driven AWS Lambda architecture for data ingestion and real-time computation, cutting manual turnaround from months to hours.' },
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
      { label: 'Geospatial & emission modelling', text: 'Developed algorithms integrating Google Maps APIs and Geopy to compute travel distances and emissions per global financial standards.' },
      { label: 'Data engineering & migration', text: 'Migrated 14 TB of enterprise data across multi-region Microsoft Fabric; built APIs converting NSE XBRL filings to structured data.' },
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
  /** CSS object-position, to keep a logo clear of the title overlaid at the bottom of the card. */
  imagePosition?: string;
  /** Fill behind an image shown with imageFit 'contain' (match the image's own background). */
  imageBg?: string;
}

/* Order: ResZoom and Cubiverse lead (they have live links and real images); the rest follow. */
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
    // square logo: show it whole (cover cropped it under the card title) on its own background colour
    imageFit: 'contain',
    imageBg: '#2c2d33',
  },
  {
    id: 'cubiverse',
    code: 'P-02',
    title: 'Cubiverse',
    kind: '3D web experience',
    year: '2026',
    summary: 'An immersive 3D web experience built around an interactive cube universe, rendered in the browser with Three.js and React.',
    tags: ['Three.js', 'React', 'Vercel'],
    url: 'https://cubiverse-pied.vercel.app/',
    image: media('projects/cubiverse.webp'),
  },
  {
    id: 'comic-agent',
    code: 'P-03',
    title: 'Story → Comic Agent',
    kind: 'Agentic AI',
    year: '2026',
    summary: 'An agent that turns a written story into a multi-panel comic strip. It uses MCP tools with Gemini to split the story into scenes, write the panel prompts and lay out the page.',
    tags: ['Agentic AI', 'MCP', 'Gemini', 'Prompt Engineering'],
    // image: media('generated/project-comic-agent.webp'), // add the file to public/media/generated/, then uncomment
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
    // image: media('generated/project-liver-segmentation.webp'), // add the file to public/media/generated/, then uncomment
  },
  {
    id: 'dl-classification',
    code: 'P-05',
    title: 'Deep Learning Classification',
    kind: 'Research · IIT Bombay',
    year: '2022',
    summary: 'ResNet-18 transfer learning for image classification, plus MLPs and perceptrons built from scratch to benchmark activation functions on MNIST.',
    tags: ['ResNet-18', 'Transfer Learning', 'MLPs', 'PyTorch'],
    // image: media('generated/project-dl-classification.webp'), // add the file to public/media/generated/, then uncomment
  },
  {
    id: 'ml-tuning',
    code: 'P-06',
    title: 'Hyperparameter Sensitivity',
    kind: 'Machine learning',
    year: '2021',
    summary: 'Compared and fine-tuned SVM, logistic regression and random-forest models to map hyperparameter sensitivity; K-Means clustering for thermal-image segmentation.',
    tags: ['SVM', 'Random Forest', 'K-Means', 'Thermal Imaging'],
    // image: media('generated/project-ml-tuning.webp'), // add the file to public/media/generated/, then uncomment
  },
];

export const GITHUB_USER = 'gokulakrishnanM99';
export const HIDDEN_REPOS = ['portfolio-gk', 'portfolio-jarvis', 'gk-holographic-portfolio'];
export const HIDDEN_REPO_TOPICS = ['portfolio', 'prototype', 'prototypes', 'backyard', 'hide'];

/* ------------------------------------------------------------ CAPABILITIES */
export interface Skill {
  name: string;
  refs: string[];
  /** Where the skill comes from when it isn't tied to a role or project (a course, the tools behind it). */
  note?: { tag: string; title: string; sub?: string; href?: string };
  /** A page on this site that shows the work (e.g. the blogs on Beyond the code). */
  link?: { page: 'transmissions'; text: string };
}
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
      { name: 'LangGraph', refs: ['comic-agent'] },
      { name: 'Azure OpenAI', refs: ['stepchange-assoc'] },
      { name: 'Local LLMs (Llama · Qwen · Gemma)', refs: ['thisai'] },
      { name: 'Prompt engineering', refs: ['thisai', 'comic-agent', 'reszoom'] },
    ],
  },
  {
    id: 'ml', code: 'M-2', label: 'Machine Learning & Vision',
    skills: [
      { name: 'PyTorch', refs: ['liver-seg', 'dl-classification'] },
      { name: 'TensorFlow', refs: [], note: { tag: 'EDU', title: 'Deep Learning (academic course)', sub: 'IIT Bombay' } },
      { name: 'OpenCV', refs: ['thisai'] },
      { name: 'Vision-LLM OCR', refs: ['thisai'] },
      { name: 'Segmentation (UNet++)', refs: ['liver-seg'] },
      { name: 'Transfer learning', refs: ['dl-classification'] },
      { name: 'Classical ML', refs: ['ml-tuning'] },
    ],
  },
  {
    id: 'bio', code: 'B-3', label: 'Biomedical',
    skills: [
      { name: 'AI in medical imaging', refs: ['liver-seg', 'ml-tuning'] },
      { name: 'MD simulation', refs: [], note: { tag: 'PUB', title: 'MD simulation of drug interaction with a lipid bilayer', sub: 'Published in Toxicology and Applied Pharmacology (2026)', href: 'https://doi.org/10.1016/j.taap.2026.117923' } },
    ],
  },
  {
    id: 'data', code: 'D-4', label: 'Data & Cloud',
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
    id: 'eng', code: 'E-5', label: 'Engineering',
    skills: [
      { name: 'Python', refs: ['thisai', 'stepchange-assoc', 'stepchange-analyst', 'liver-seg', 'dl-classification', 'ml-tuning'] },
      { name: 'Java (Spring Boot)', refs: ['stepchange-assoc'] },
      { name: 'Django · Celery', refs: ['thisai'] },
      { name: 'Flask', refs: ['stepchange-assoc', 'stepchange-analyst'] },
      { name: 'REST APIs', refs: ['stepchange-analyst'] },
      { name: 'Docker', refs: ['thisai', 'stepchange-assoc', 'stepchange-analyst'] },
      { name: 'Git', refs: ['thisai', 'stepchange-assoc', 'stepchange-analyst'] },
      { name: 'Three.js · React', refs: ['cubiverse'] },
    ],
  },
  {
    id: 'creative', code: 'C-6', label: 'Creative',
    skills: [
      { name: 'Graphic design', refs: [], note: { tag: 'TOOLS', title: 'Photoshop, Illustrator, Premiere Pro' } },
      { name: 'Blogging', refs: [], link: { page: 'transmissions', text: 'Visit the Beyond the code page to access the blogs.' } },
      { name: 'Vibe coding', refs: ['reszoom', 'cubiverse'] },
      { name: 'Quote & fiction writing', refs: [], link: { page: 'transmissions', text: 'Visit the Beyond the code page to browse the quotes.' } },
    ],
  },
];

/* ------------------------------------------------------------- CREDENTIALS */
export const DISTINCTIONS = [
  { id: 'gate', value: 'AIR 132', title: 'GATE 2021, Biomedical Engineering', text: 'All-India rank 132 among 1,684 candidates.', year: '2021' },
  { id: 'intern', value: 'Best', title: 'Best Summer Intern, Medevolve', text: 'Best Summer Intern award at Medevolve ’20.', year: '2020' },
  { id: 'culture', value: '7+', title: 'Cultural excellence', text: 'Winner of 7+ inter-college competitions; guest performer on National Voters’ Day.', year: '2018 – 2020' },
];

/* ------------------------------------------------------------ PUBLICATIONS */
export interface Publication {
  id: string; title: string; journal: string; volume?: string; article?: string; date: string;
  role: string; contribution: string; context: string; url: string;
}
export const PUBLICATIONS: Publication[] = [
  {
    id: 'taap-2026',
    title: 'Membrane-mediated mechanisms of NSAID-induced cardiotoxicity independent of cyclooxygenase selectivity: Evidence from rat and zebrafish models',
    journal: 'Toxicology and Applied Pharmacology',
    volume: '514',
    article: '117923',
    date: 'September 2026',
    role: 'Co-author',
    contribution: 'MD simulation and in vitro study of drug–membrane interaction',
    context: 'M.Tech research · IIT Bombay',
    url: 'https://doi.org/10.1016/j.taap.2026.117923',
  },
];

export const LEADERSHIP = [
  { id: 'companion', role: 'Student Companion', org: 'IIT Bombay', period: '2022 – 2023', text: 'Mentored 5 students on academic and personal development across an academic year.' },
  { id: 'social', role: 'Social Media Manager', org: 'CEG Culturals', period: '2018 – 2021', text: 'Led the official culturals team’s digital outreach and a 40+ member crew for 2+ years.' },
];

export interface Certificate { id: string; title: string; issuer: string; category: string; w: number; h: number }
const C = (id: string, title: string, issuer: string, category: string, w: number, h: number): Certificate => ({ id, title, issuer, category, w, h });

const ALL_CERTIFICATES: Certificate[] = [
  C('coursera-python-for-data-science-ai-development', 'Python for Data Science, AI & Development', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-databases-and-sql-for-data-science-with-python-page', 'Databases and SQL for Data Science with Python', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-intoduction-to-data-engineering', 'Introduction to Data Engineering', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-introduction-to-relational-databases-rdbms', 'Introduction to Relational Databases (RDBMS)', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('coursera-python-project-for-data-engineering', 'Python Project for Data Engineering', 'IBM · Coursera', 'Courses', 1600, 1236),
  C('gokulakrishnan-m-python-certificate', 'Python Programming', 'Certificate', 'Courses', 1600, 1190),
  C('pantech-matlab', 'MATLAB', 'Pantech', 'Courses', 972, 648),
  C('gokulakrishnan-page-001', 'Internship: Collaborative New Product Development', 'Xfinito Biodesigns', 'Internships', 1131, 1600),
  C('3g-irps-intern', 'Internship', '3G IRPS', 'Internships', 1394, 1054),
  C('3g-irps-lor', 'Letter of Recommendation', '3G IRPS', 'Internships', 1126, 1600),
  C('uniq-inplant-training', 'In-plant Training', 'UNIQ', 'Workshops', 1404, 1041),
  C('uniq-fingerprint-recognition-mini-project', 'Fingerprint Recognition (mini project)', 'UNIQ', 'Workshops', 1431, 1061),
  C('uniq-matlab', 'MATLAB Workshop', 'UNIQ', 'Workshops', 1349, 1005),
  C('mit-app-inventor-workshop', 'MIT App Inventor Workshop', 'Workshop', 'Workshops', 1398, 1004),
  C('best-summer-intern-medevol-20', 'Best Summer Intern', 'Medevolve 2020', 'Achievements', 1380, 962),
  C('k-box-winner', 'K! Box, Winner', 'Competition', 'Achievements', 1410, 1000),
  C('nss-certificate', 'National Service Scheme', 'NSS', 'Achievements', 1007, 696),
  C('covid-safe-shop', 'Covid Safe Shop', 'Initiative', 'Achievements', 960, 540),
  C('biospctra18-bionomics-2nd', 'Bionomics, 2nd place', 'Biospectra 2018', 'Culturals', 1295, 919),
  C('medevolv-19-limbo-3rd', 'Limbo, 3rd place', 'Medevolve 2019', 'Culturals', 1394, 1005),
  C('finun-2018-new-college', 'FINUN 2018', 'The New College', 'Culturals', 1417, 1003),
  C('smc-euphoria-2018', 'Euphoria 2018', 'SMC', 'Culturals', 1452, 992),
  C('mcc-deepwoods-2019', 'Deepwoods 2019', 'MCC', 'Culturals', 1445, 1016),
  C('srm-milan-2020', 'Milan 2020', 'SRM', 'Culturals', 1405, 997),
  C('theaterfest-creasent-2020', 'Theatre Fest 2020', 'Crescent', 'Culturals', 1380, 973),
  C('voters-poster', 'National Voters’ Day: Poster', 'Election Commission', 'Culturals', 1442, 1057),
  C('voters-slogan', 'National Voters’ Day: Slogan', 'Election Commission', 'Culturals', 1369, 1002),
  C('voters-shadow', 'National Voters’ Day: Shadow play', 'Election Commission', 'Culturals', 1376, 1038),
];

/** Kept in the data (and on the classic site) but not shown in this portfolio's vault. */
const HIDDEN_CERTIFICATES = ['finun-2018-new-college', 'medevolv-19-limbo-3rd', 'smc-euphoria-2018', 'mcc-deepwoods-2019',
  'theaterfest-creasent-2020', 'voters-slogan', 'nss-certificate', 'covid-safe-shop'];
export const CERTIFICATES = ALL_CERTIFICATES.filter((c) => !HIDDEN_CERTIFICATES.includes(c.id));

/* ---------------------------------------------------------- TRANSMISSIONS */
export const MEDIUM_BASE = 'https://medium.com/@gokulkrish0999/';

export interface Blog { id: string; title: string; subtitle?: string; date?: string; read?: string; w: number; h: number }
/* Dates and one-liners come from the Medium feed (each line is the post's own opening sentence;
   The Radha – Krishna keeps its Medium subtitle). Read time is only shown where it is known. */
export const BLOGS: Blog[] = [
  { id: 'the-radha-krishna-b8d39f39a632', title: 'The Radha – Krishna', subtitle: 'Mythology isn’t just a story; sometimes it becomes a mirror.', date: 'Nov 17, 2025', read: '5 min', w: 1024, h: 1024 },
  { id: 'you-are-never-compared-an-imperfect-story-8d842c0022ab', title: 'You Are Never Compared: An Imperfect Story', subtitle: 'One day, a friend asked me to write a story about, literally, “You are never compared.”', date: 'Aug 7, 2025', w: 800, h: 1200 },
  { id: 'the-trip-that-almost-didnt-happen-part-1-4d526d5398b7', title: 'The Trip That Almost Didn’t Happen: Part 1', subtitle: 'The time in life when each day becomes a routine of lifeless events, and it’s another typical, tiring workday.', date: 'Jul 30, 2025', w: 720, h: 960 },
  { id: 'hearts-desire-the-girl-within-c7195dea5db4', title: 'Heart’s Desire: The Girl Within', subtitle: 'The city felt so alive with the vibrant nightlife.', date: 'May 1, 2024', w: 900, h: 1200 },
  { id: 'a-day-to-relive-160a0bdccc1e', title: 'A Day to Relive', subtitle: 'If granted the opportunity to relive a day from the past without altering its course, which day would you choose?', date: 'Jan 27, 2024', w: 1200, h: 637 },
  { id: 'the-best-friend-9aa7a98e4f14', title: 'The Best Friend', subtitle: 'I grew up with a single parent, and without siblings, but my dad kept me away from all the feelings of loneliness and enriched my life with all that he could.', date: 'Feb 6, 2021', w: 1200, h: 808 },
  { id: 'the-friend-dd19a9dc374e', title: 'The Friend', subtitle: 'I love trust; I speak with whom I trust, and I spend time with whom I trust.', date: 'May 9, 2020', w: 1200, h: 889 },
  { id: 'girl-in-everyones-life-e837556b9d94', title: 'Girl in Everyone’s Life', subtitle: 'I met her in class, but that doesn’t make me feel anything about her.', date: 'Apr 15, 2020', w: 1200, h: 513 },
];

export const QUOTES: string[] = [
  'Some people are worth melting for, and my Melting point is you.',
  'Simple equation of Life:\nx² + x + 1 = 0',
  'Her reply will always be a Haiku.',
  'Non-fictional superpower: Memory loss',
  'Did I wound you? asked Big Panda.\nNah, the wound was already made. You were my Healer.',
  'Love chemistry vs Friendship physics',
  'The real Gem shines even when it’s lost.',
  'Expectation state ⟶ Ground state',
  'Pain: one thing gained out of Chemistry.',
  'Stop earning persons; Start earning Memories',
  'என் நிழலும் என்னுடன் வாராத பொழுதினில்\nஉன்னுடன் செல்ல ஏங்கினேன்',
  'Need a stand with holding your Hands.',
  'Crushed by the curls.',
  'மாற்றங்களின் சிறு முள்ளாய் நானும் பெரு முள்ளாய் நீயும்',
  'Understanding: the real Curse.',
  'A journey or destination feels worthless with no Company to share it.',
  'One person is enough to make you feel you have it all.',
  'If you try to go back to your older version, it becomes a new version, and the current one becomes your older. Change can’t bring back what you used to be.',
  'Stronger it becomes, more brittle it will be.',
  'What we want vs What we feel is right',
  'Wavelength Matters.',
  'Heart: Always wants more.',
  'Views are about Perspective, not about truth.',
];

/** English translations of the Tamil quotes (keyed by the original text). A quote with a translation
 *  gets a Translate toggle on the Off-duty page. */
export const QUOTE_TRANSLATIONS: Record<string, string> = {
  'என் நிழலும் என்னுடன் வாராத பொழுதினில்\nஉன்னுடன் செல்ல ஏங்கினேன்':
    'Wishing to Wander with you in lightless places where even my Shadows won’t accompany me.',
  'மாற்றங்களின் சிறு முள்ளாய் நானும் பெரு முள்ளாய் நீயும்':
    'When it comes to Changes, I am the hour hand and you’re the minute hand.',
};

export interface Design { id: string; title: string; caption: string; w: number; h: number; video?: string }
export const DESIGNS: Design[] = [
  { id: 'culturals-poster', title: 'Culturals', caption: 'Digital art poster for an intra-college cultural fest.', w: 1800, h: 1286 },
  { id: 'maari-pochu', title: 'Maari Pochu', caption: 'Title-card artwork for a short film.', w: 1080, h: 720, video: media('designs/mari-pochu-title-card.mp4') },
];

/* ------------------------------------------------------- SECTIONS & PAGES
   A page (sector) is one stop on the orbital ring. Each page stacks one or more
   sections (blocks) that the visitor scrolls through. Every block has its own
   camera pose (index into the 3D scene's waypoints), so the scene re-frames
   itself as you scroll from one section to the next. */
export const BLOCKS = {
  identity: { pose: 0, label: 'Identity', title: 'Profile' },
  origin: { pose: 1, label: 'Origin', title: 'About' },
  uplink: { pose: 7, label: 'Uplink', title: 'Contact' },
  missions: { pose: 2, label: 'Mission Log', title: 'Experience' },
  arsenal: { pose: 3, label: 'Arsenal', title: 'Projects' },
  matrix: { pose: 4, label: 'Neural Matrix', title: 'Capabilities' },
  credentials: { pose: 5, label: 'Credentials', title: 'Recognition' },
  transmissions: { pose: 6, label: 'Beyond the code', title: 'Beyond the code' },
} as const;
export type BlockId = keyof typeof BLOCKS;

export const SECTORS = [
  { id: 'identity', code: '01', label: 'Identity', title: 'Profile', hint: 'About me · education · contact', blocks: ['identity', 'origin', 'uplink'] },
  { id: 'missions', code: '02', label: 'Mission Log', title: 'Experience', hint: '3 roles · 2023 – 2026', blocks: ['missions'] },
  { id: 'arsenal', code: '03', label: 'Arsenal', title: 'Projects', hint: 'Projects & capabilities', blocks: ['arsenal', 'matrix'] },
  { id: 'credentials', code: '04', label: 'Credentials', title: 'Recognition', hint: 'Distinctions & certificates', blocks: ['credentials'] },
  { id: 'transmissions', code: '05', label: 'Beyond the code', title: 'Beyond the code', hint: 'Blogs, quotes, designs', blocks: ['transmissions'] },
] as const satisfies readonly { id: string; code: string; label: string; title: string; hint: string; blocks: readonly BlockId[] }[];

export type SectorId = (typeof SECTORS)[number]['id'];

/** Page that holds a block. */
export const pageOfBlock = (b: BlockId) => SECTORS.findIndex((s) => (s.blocks as readonly BlockId[]).includes(b));

/** "01", "01.2", "01.3" … — the protocol code shown in a block's header. */
export function blockCode(b: BlockId) {
  const p = SECTORS[pageOfBlock(b)];
  const k = (p.blocks as readonly BlockId[]).indexOf(b);
  return k > 0 ? `${p.code}.${k + 1}` : p.code;
}

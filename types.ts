
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  skills?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  score: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

// New Types for Works Section
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string; 
  category: string; 
  link?: string;
}

export interface QuoteItem {
  id: string;
  type: 'text' | 'image';
  content: string; // The quote text OR the image URL
  author: string;
}

export interface DesignItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string; 
  link?: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  tags: string[];
}

export interface BlogItem {
  id: string; // Changed to string to support filename IDs
  title: string;
  subtitle?: string;
  date?: string;
  readTime?: string;
  url: string;
  imageUrl: string; 
}

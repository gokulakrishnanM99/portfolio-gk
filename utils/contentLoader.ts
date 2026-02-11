import { Certificate, DesignItem, BlogItem, QuoteItem } from '../types';
import { 
  MANUAL_CERTIFICATES, 
  MANUAL_DESIGNS, 
  MANUAL_BLOGS, 
  MANUAL_QUOTES, 
  DEFAULT_QUOTE_AUTHOR,
  MEDIUM_BASE_URL 
} from '../constants';

// Helper to clean filenames
const formatTitle = (fileName: string): string => {
  // Remove extension
  const name = fileName.replace(/\.[^/.]+$/, "");
  // Replace dashes/underscores with spaces
  return name.replace(/[-_]/g, " ");
};

const getFileName = (path: string): string => {
  return path.split('/').pop()?.replace(/\.[^/.]+$/, "") || "";
};

// --- CERTIFICATES LOADER ---
export const getCertificates = (): Certificate[] => {
  // Scans assets/certificates/{Category}/{Filename}.jpg
  const modules = import.meta.glob('/assets/certificates/*/*.*', { eager: true, query: '?url', import: 'default' });
  
  const dynamicCerts: Certificate[] = [];

  for (const path in modules) {
    const parts = path.split('/');
    const fileName = parts.pop() || ""; // e.g., Azure-Cert.jpg
    const category = parts.pop() || "General"; // e.g., Cloud
    const id = getFileName(path);
    const imageUrl = modules[path] as unknown as string;

    // Check if manual override exists
    const manualEntry = MANUAL_CERTIFICATES.find(c => c.id === id || c.imageUrl === imageUrl);
    
    if (manualEntry) {
        // If manual entry exists, but using local image, ensure path is updated if needed
        // Here we prioritize the manual entry completely, but we could merge.
    } else {
        dynamicCerts.push({
          id,
          title: formatTitle(fileName),
          issuer: "",
          date: "",
          category: formatTitle(category),
          imageUrl
        });
    }
  }

  return [...MANUAL_CERTIFICATES, ...dynamicCerts];
};

// --- DESIGNS LOADER ---
export const getDesigns = (): DesignItem[] => {
  // Scans assets/designs/{Category}/{Filename}.jpg
  const modules = import.meta.glob('/assets/designs/*/*.*', { eager: true, query: '?url', import: 'default' });
  
  const dynamicDesigns: DesignItem[] = [];

  for (const path in modules) {
    const parts = path.split('/');
    const fileName = parts.pop() || "";
    const category = parts.pop() || "Portfolio";
    const id = getFileName(path);
    const imageUrl = modules[path] as unknown as string;

    const manualEntry = MANUAL_DESIGNS.find(d => d.id === id);

    if (!manualEntry) {
      dynamicDesigns.push({
        id,
        title: formatTitle(fileName),
        category: formatTitle(category),
        imageUrl,
        description: "", // Empty description for dynamic items
        link: imageUrl
      });
    }
  }

  return [...MANUAL_DESIGNS, ...dynamicDesigns];
};

// --- BLOGS LOADER ---
export const getBlogs = (): BlogItem[] => {
  // Scans assets/blogs/{filename}.jpg
  const modules = import.meta.glob('/assets/blogs/*.*', { eager: true, query: '?url', import: 'default' });
  
  const dynamicBlogs: BlogItem[] = [];

  for (const path in modules) {
    const id = getFileName(path);
    const imageUrl = modules[path] as unknown as string;
    const url = `${MEDIUM_BASE_URL}${id}`;

    const manualEntry = MANUAL_BLOGS.find(b => b.id === id);

    if (!manualEntry) {
      dynamicBlogs.push({
        id,
        title: formatTitle(id),
        subtitle: "",
        date: "",
        readTime: "",
        url,
        imageUrl
      });
    }
  }

  return [...MANUAL_BLOGS, ...dynamicBlogs];
};

// --- QUOTES LOADER ---
export const getQuotes = (): QuoteItem[] => {
  // 1. Get Images
  const imageModules = import.meta.glob('/assets/quotes/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
  // 2. Get Text Files
  const textModules = import.meta.glob('/assets/quotes/*.txt', { eager: true, query: '?raw', import: 'default' });

  const dynamicQuotes: QuoteItem[] = [];

  // Process Images
  for (const path in imageModules) {
    const id = getFileName(path);
    if (!MANUAL_QUOTES.find(q => q.id === id)) {
      dynamicQuotes.push({
        id,
        type: 'image',
        content: imageModules[path] as unknown as string,
        author: DEFAULT_QUOTE_AUTHOR
      });
    }
  }

  // Process Text
  for (const path in textModules) {
    const id = getFileName(path);
    const rawText = textModules[path] as unknown as string;
    
    // Remove surrounding quotes if present
    const cleanText = rawText.trim().replace(/^"|"$/g, '');

    if (!MANUAL_QUOTES.find(q => q.id === id)) {
      dynamicQuotes.push({
        id,
        type: 'text',
        content: cleanText,
        author: DEFAULT_QUOTE_AUTHOR
      });
    }
  }

  return [...MANUAL_QUOTES, ...dynamicQuotes];
};
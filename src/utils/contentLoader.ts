import { Certificate, DesignItem, BlogItem, QuoteItem } from '../types';
import { 
  MANUAL_CERTIFICATES, 
  MANUAL_DESIGNS, 
  MANUAL_BLOGS, 
  MANUAL_QUOTES, 
  DEFAULT_QUOTE_AUTHOR,
  MEDIUM_BASE_URL 
} from '../constants';

// --- HELPER FUNCTIONS ---

const getFileNameAndExt = (path: string) => {
  const parts = path.split('/');
  const fullName = parts.pop() || "";
  
  // Handle filenames with multiple dots (e.g., "my.image.v1.jpg")
  const lastDotIndex = fullName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? fullName.substring(0, lastDotIndex) : fullName;
  const ext = lastDotIndex !== -1 ? fullName.substring(lastDotIndex + 1) : "";
  
  return { name, ext, fullName };
};

const getCategoryFromPath = (path: string) => {
  const parts = path.split('/');
  // Expected glob pattern: /src/assets/certificates/{Category}/{Filename}
  // parts array ends with: [..., 'Category', 'Filename.jpg']
  // We take the second to last item
  return parts[parts.length - 2];
};

const formatTitle = (id: string): string => {
  // Replace dashes/underscores with spaces and Capitalize Words
  return id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
};

// --- CERTIFICATES LOADER ---
export const getCertificates = (): Certificate[] => {
  // Scans: src/assets/certificates/{Category}/{Filename}.jpg
  const modules = import.meta.glob('/src/assets/certificates/*/*.*', { eager: true, as: 'url' });
  
  const mergedData = [...MANUAL_CERTIFICATES];
  // Track IDs that we have either matched or added to prevent duplicates
  const processedIds = new Set(mergedData.map(c => c.id));

  for (const path in modules) {
    const { name: id } = getFileNameAndExt(path);
    const imageUrl = modules[path] as unknown as string;
    
    // 1. Check if this file corresponds to a manual entry (Merge Strategy)
    const existingIndex = mergedData.findIndex(c => c.id === id);

    if (existingIndex >= 0) {
      // ENRICH: Found in constants.ts? Use that metadata, but inject the local image URL.
      mergedData[existingIndex] = {
        ...mergedData[existingIndex],
        imageUrl: imageUrl
      };
    } else {
      // 2. CREATE: Not in constants.ts? Create a new dynamic entry.
      const category = getCategoryFromPath(path);
      mergedData.push({
        id,
        title: formatTitle(id),
        issuer: "Self Paced", // Default value for dynamic items
        date: new Date().getFullYear().toString(),
        category: formatTitle(category),
        imageUrl
      });
      processedIds.add(id);
    }
  }

  return mergedData;
};

// --- DESIGNS LOADER ---
export const getDesigns = (): DesignItem[] => {
  // Scans: src/assets/designs/{Category}/{Filename}.jpg
  const modules = import.meta.glob('/src/assets/designs/*/*.*', { eager: true, as: 'url' });
  
  const mergedData = [...MANUAL_DESIGNS];

  for (const path in modules) {
    const { name: id } = getFileNameAndExt(path);
    const imageUrl = modules[path] as unknown as string;
    
    const existingIndex = mergedData.findIndex(d => d.id === id);

    if (existingIndex >= 0) {
      mergedData[existingIndex] = {
        ...mergedData[existingIndex],
        imageUrl: imageUrl
      };
    } else {
      const category = getCategoryFromPath(path);
      mergedData.push({
        id,
        title: formatTitle(id),
        category: formatTitle(category),
        imageUrl,
        description: "" // UI handles empty description
      });
    }
  }

  return mergedData;
};

// --- BLOGS LOADER ---
export const getBlogs = (): BlogItem[] => {
  // Scans: src/assets/blogs/{filename}.jpg
  const modules = import.meta.glob('/src/assets/blogs/*.*', { eager: true, as: 'url' });
  
  const mergedData = [...MANUAL_BLOGS];

  for (const path in modules) {
    const { name: id } = getFileNameAndExt(path);
    const imageUrl = modules[path] as unknown as string;
    
    const existingIndex = mergedData.findIndex(b => b.id === id);

    if (existingIndex >= 0) {
      mergedData[existingIndex] = {
        ...mergedData[existingIndex],
        imageUrl: imageUrl,
        // Ensure URL is set if missing in manual entry
        url: mergedData[existingIndex].url || `${MEDIUM_BASE_URL}${id}`
      };
    } else {
      mergedData.push({
        id,
        title: formatTitle(id),
        subtitle: "", 
        date: "",
        readTime: "",
        url: `${MEDIUM_BASE_URL}${id}`,
        imageUrl
      });
    }
  }

  return mergedData;
};

// --- QUOTES LOADER ---
export const getQuotes = (): QuoteItem[] => {
  const mergedData = [...MANUAL_QUOTES];
  const processedIds = new Set(mergedData.map(q => q.id));

  // 1. Process Images
  const imageModules = import.meta.glob('/src/assets/quotes/*.{png,jpg,jpeg,webp,gif}', { eager: true, as: 'url' });
  
  for (const path in imageModules) {
    const { name: id } = getFileNameAndExt(path);
    if (!processedIds.has(id)) {
      mergedData.push({
        id,
        type: 'image',
        content: imageModules[path] as unknown as string,
        author: DEFAULT_QUOTE_AUTHOR
      });
      processedIds.add(id);
    }
  }

  // 2. Process Text Files
  const textModules = import.meta.glob('/src/assets/quotes/*.txt', { eager: true, as: 'raw' });
  
  for (const path in textModules) {
    const { name: id } = getFileNameAndExt(path);
    
    if (!processedIds.has(id)) {
      const rawText = textModules[path] as unknown as string;
      // Remove double quotes from start/end if present as per requirements
      const cleanText = rawText.trim().replace(/^"|"$/g, '');

      mergedData.push({
        id,
        type: 'text',
        content: cleanText,
        author: DEFAULT_QUOTE_AUTHOR
      });
      processedIds.add(id);
    }
  }

  return mergedData;
};

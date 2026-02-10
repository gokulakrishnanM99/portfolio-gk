
import React, { useState, useMemo } from 'react';
import { getCertificates } from '../utils/contentLoader';
import { Award } from 'lucide-react';

const Certificates: React.FC = () => {
  const allCertificates = useMemo(() => getCertificates(), []);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(allCertificates.map(c => c.category));
    return ['All', ...Array.from(cats)];
  }, [allCertificates]);

  const filteredCertificates = useMemo(() => {
    if (activeCategory === 'All') return allCertificates;
    return allCertificates.filter(c => c.category === activeCategory);
  }, [activeCategory, allCertificates]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-up">
      <div className="mb-12">
        <h2 className="text-3xl font-title font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <Award className="w-8 h-8 text-primary-500" />
          Certifications
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-light">
          Professional certifications reflecting my expertise in Cloud, AI, and Data Science.
        </p>
      </div>

      {/* Horizontal Filter Bar */}
      {categories.length > 1 && (
        <div className="flex overflow-x-auto pb-6 mb-8 gap-3 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-primary-900/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCertificates.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group hover:border-slate-400 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-2 duration-300 flex flex-col h-full">
            <div className="aspect-video bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
              <img 
                src={cert.imageUrl} 
                alt={cert.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-95 hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2 py-1 rounded bg-primary-500/20 backdrop-blur-sm text-primary-100 text-xs font-bold border border-primary-500/30 mb-2 inline-block">
                  {cert.category}
                </span>
                <p className="text-xs text-slate-200 font-bold uppercase tracking-wide">{cert.issuer}</p>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h4 className="text-slate-900 dark:text-white font-bold leading-tight mb-3 text-lg">{cert.title}</h4>
              <p className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-2">
                Issued: <span className="text-slate-700 dark:text-slate-400 font-medium">{cert.date}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCertificates.length === 0 && (
         <div className="py-20 text-center text-slate-500 font-light italic">
           No certifications found. Add images to assets/certificates
         </div>
      )}
    </div>
  );
};

export default Certificates;

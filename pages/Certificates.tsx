
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
                className="object-contain w-full h-full transition-transform duration-700 bg-white"
              />
            </div>

            <div className="px-5 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{cert.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{cert.category}</div>
              </div>

              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                {cert.issuer && <div className="font-medium text-slate-700 dark:text-slate-300">{cert.issuer}</div>}
                {cert.date && <div className="mt-1">Issued: <span className="font-medium text-slate-700 dark:text-slate-300">{cert.date}</span></div>}
              </div>
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


import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { DesignItem } from '../types';
import { getBlogs, getQuotes, getDesigns } from '../utils/contentLoader';
import { COLOR_RED, COLOR_GREY } from '../constants';
import { Quote, Image, ArrowRight, BookOpen, ExternalLink, ArrowLeft } from 'lucide-react';

const getQuoteDensityScore = (content: string): number => {
  const trimmed = content.trim();
  if (!trimmed) return 0;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const lines = trimmed.split(/\r?\n/).length;
  const longWordPenalty = words.reduce((sum, word) => sum + (word.length > 12 ? 3 : 0), 0);

  return trimmed.length + (words.length * 2) + ((lines - 1) * 22) + longWordPenalty;
};

const getGridQuoteTextClass = (content: string): string => {
  const score = getQuoteDensityScore(content);

  if (score <= 125) return 'text-[9px] md:text-2xl leading-tight md:leading-relaxed';
  if (score <= 250) return 'text-[8px] md:text-xl leading-tight md:leading-snug';
  if (score <= 375) return 'text-[7px] md:text-lg leading-tight md:leading-snug';
  return 'text-[6px] md:text-base leading-tight md:leading-snug';
};

const getStackQuoteTextClass = (content: string): string => {
  const score = getQuoteDensityScore(content);

  if (score <= 120) return 'text-lg md:text-4xl lg:text-6xl leading-relaxed';
  if (score <= 180) return 'text-base md:text-3xl lg:text-5xl leading-relaxed';
  if (score <= 250) return 'text-sm md:text-2xl lg:text-4xl leading-relaxed';
  return 'text-sm md:text-xl lg:text-3xl leading-relaxed';
};

const LONG_ARROWS_TOKEN = '[[LONG_ARROWS]]';

const isLongArrowsQuote = (content: string): boolean => content.includes(LONG_ARROWS_TOKEN);

const renderLongArrowsQuote = (
  content: string,
  textClass: string,
  variant: 'grid' | 'stack'
): React.ReactNode => {
  const [top = '', bottom = ''] = content.split(LONG_ARROWS_TOKEN);
  const arrowSvgClass = variant === 'grid' ? 'w-4 h-16 md:w-7 md:h-28' : 'w-6 h-28 md:w-8 md:h-44';
  const gapClass = variant === 'grid' ? 'gap-2 md:gap-9' : 'gap-10 md:gap-20';
  const textSpacingClass = variant === 'grid' ? 'gap-1 md:gap-2' : 'gap-2 md:gap-4';

  return (
    <div className={`w-full flex flex-col items-center justify-center text-center ${textSpacingClass}`}>
      {top.trim() && (
        <p className={`text-white font-quote tracking-wide whitespace-pre-wrap break-words ${textClass}`}>
          {top.trim()}
        </p>
      )}

      <div className={`flex items-stretch justify-center ${gapClass}`}>
        <div className="flex flex-col items-center">
          <svg className={arrowSvgClass} viewBox="0 0 22 110" aria-hidden="true">
            <path d="M12 8 L20 24 H4 Z" fill="white" />
            <path d="M10.4 24 L13.6 24 L12 114 Z" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <svg className={arrowSvgClass} viewBox="0 0 22 110" aria-hidden="true">
            <path d="M12 6 L13.6 96 L10.4 96 Z" fill="white" />
            <path d="M4 96 H20 L12 112 Z" fill="white" />
          </svg>
        </div>
      </div>

      {bottom.trim() && (
        <p className={`text-white font-quote tracking-wide whitespace-pre-wrap break-words ${textClass}`}>
          {bottom.trim()}
        </p>
      )}
    </div>
  );
};

const WorksHub: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-up">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-title font-semibold text-slate-900 dark:text-white mb-6">Creative Works</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
           Beyond code, I explore creativity through design, writing, and continuous learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            title: 'Blogs', 
            path: 'blogs', 
            icon: BookOpen, 
            desc: 'Technical articles and thoughts on Data Science.',
            color: 'bg-orange-500',
            bgClass: 'bg-orange-50 dark:bg-slate-900'
          },
          { 
            title: 'Quotes', 
            path: 'quotes', 
            icon: Quote, 
            desc: 'Thoughts and lyrical writings in visual format.',
            color: 'bg-emerald-500',
            bgClass: 'bg-emerald-50 dark:bg-slate-900'
          },
          { 
            title: 'Designs', 
            path: 'designs', 
            icon: Image, 
            desc: 'Artistic creations in a chessboard gallery.',
            color: 'bg-purple-500',
            bgClass: 'bg-purple-50 dark:bg-slate-900'
          },
        ].map((item, index) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={`group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${item.bgClass} dark:hover:border-slate-700 animate-fade-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
               <item.icon className="w-32 h-32 text-slate-900 dark:text-white" />
            </div>
            
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform`}>
              <item.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-lg md:text-xl font-subnav font-bold text-slate-900 dark:text-white mb-3 leading-relaxed tracking-tight">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-base mb-8">{item.desc}</p>
            
            <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-bold tracking-wide">
              Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const WorksSubNav: React.FC = () => {
  const links = [
    { name: 'Blogs', path: 'blogs' },
    { name: 'Quotes', path: 'quotes' },
    { name: 'Designs', path: 'designs' },
  ];

  return (
    <div className="flex justify-center items-center gap-6 md:gap-12 mb-16 border-b border-slate-200 dark:border-slate-800 pb-8 sticky top-16 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-lg z-40 py-6 transition-all">
      {links.map((link) => (
         <NavLink
           key={link.path}
           to={`/works/${link.path}`}
           className={({ isActive }) => 
             `relative px-2 flex flex-col items-center group transition-all duration-500 ease-out`
           }
         >
           {({ isActive }) => (
             <>
               <span 
                 className={`tracking-tighter transition-all duration-500 ease-in-out font-subnav ${
                   isActive 
                     ? 'text-lg md:text-3xl text-primary-600 dark:text-primary-400 drop-shadow-sm transform scale-100' 
                     : 'text-xs md:text-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                 }`}
               >
                 {link.name}
               </span>
               <span 
                 className={`h-1.5 rounded-full bg-primary-500 mt-3 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                   isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                 }`} 
               />
             </>
           )}
         </NavLink>
      ))}
    </div>
  );
};

const BlogsGallery: React.FC = () => {
  const blogs = useMemo(() => getBlogs(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <WorksSubNav />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-up">
        {blogs.map((blog, idx) => (
          <a 
            key={blog.id} 
            href={blog.url} 
            target="_blank" 
            rel="noreferrer"
            className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {blog.date && (
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-primary-400 shadow-sm border border-white/20 dark:border-slate-800">
                  {blog.date}
                </div>
              )}
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              {blog.readTime && (
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    <BookOpen className="w-3 h-3" />
                    <span>{blog.readTime}</span>
                </div>
              )}
              
              <h3 className="text-xl font-subnav text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-relaxed">
                {blog.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                {blog.subtitle}
              </p>
              
              <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-bold mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                Read Article <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </a>
        ))}
      </div>
      {blogs.length === 0 && <div className="text-center py-10 opacity-50">No blogs found. Add images to assets/blogs</div>}
    </div>
  );
};

const QuotesGallery: React.FC = () => {
  const quotes = useMemo(() => getQuotes(), []);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [stackMode, setStackMode] = useState<boolean>(false);
  const prevScrollY = useRef<number>(0);

  useEffect(() => {
    if (openIndex == null || !stackMode) return;
    const el = document.getElementById(`quote-${openIndex}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [openIndex, stackMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex == null) return;
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowUp') setOpenIndex(i => (i == null ? null : Math.max(0, i - 1)));
      if (e.key === 'ArrowDown') setOpenIndex(i => (i == null ? null : Math.min(quotes.length - 1, i + 1)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, quotes.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <WorksSubNav />

      {!stackMode ? (
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-0 bg-white dark:bg-slate-950 animate-fade-up shadow-2xl rounded-lg overflow-hidden border border-transparent dark:border-slate-800">
        {quotes.map((quote, index) => {
          const bgColor = index % 2 === 0 ? COLOR_RED : COLOR_GREY;
          const gridQuoteTextClass = getGridQuoteTextClass(quote.content);

          return (
            <div
              key={quote.id}
              className="aspect-square relative group overflow-hidden cursor-pointer"
              style={{ backgroundColor: quote.type === 'text' ? bgColor : 'transparent' }}
              onClick={() => { prevScrollY.current = window.scrollY; setOpenIndex(index); setStackMode(true); }}
            >
              {quote.type === 'image' ? (
                <img
                  src={quote.content}
                  alt="Quote"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-1 md:p-4 text-center transition-transform duration-300 overflow-hidden">
                  <div className="transform scale-75 md:scale-100 w-full h-full flex flex-col items-center justify-center">
                    <Quote className="w-2 h-2 md:w-5 md:h-5 text-white/20 mb-2" />
                    {isLongArrowsQuote(quote.content) ? (
                      renderLongArrowsQuote(quote.content, gridQuoteTextClass, 'grid')
                    ) : (
                      <p className={`text-white font-quote tracking-wide whitespace-pre-wrap break-words ${gridQuoteTextClass}`}>
                        {quote.content}
                      </p>
                    )}
                    <div className="mt-3 md:mt-4  w-6 md:w-12 h-0.5 bg-white/30"></div>
                    <p className="text-white/70 text-[5px] md:text-sm font-bold tracking-widest mt-1">
                      {quote.author}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full">
            {/* fixed back button at top so it stays visible while scrolling */}
            {stackMode && (
              <button
                onClick={() => {
                  setStackMode(false);
                  setOpenIndex(null);
                  setTimeout(() => window.scrollTo({ top: prevScrollY.current, behavior: 'auto' }), 0);
                }}
                className="fixed left-7 top-[calc(7rem+0.5rem)] z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 dark:bg-white/20 hover:bg-white/95 dark:hover:bg-slate-800 text-slate-900 dark:text-white backdrop-blur"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>
            )}

            <div className="w-full">
              {quotes.map((quote, i) => {
                const bgColor = i % 2 === 0 ? COLOR_RED : COLOR_GREY;
                const isText = quote.type === 'text';
                const stackQuoteTextClass = getStackQuoteTextClass(quote.content);

                return (
                  <div
                    id={`quote-${i}`}
                    key={quote.id}
                    className="w-full min-h-screen flex items-center justify-center p-0"
                    style={{ backgroundColor: isText ? bgColor : 'transparent' }}
                  >
                    {quote.type === 'image' ? (
                      <img src={quote.content} alt="Quote" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="max-w-4xl w-full bg-transparent flex flex-col items-center justify-center p-8">
                          <Quote className="w-6 h-6 md:w-10 md:h-10 text-white/20 mb-4" />
                          {isLongArrowsQuote(quote.content) ? (
                            renderLongArrowsQuote(quote.content, stackQuoteTextClass, 'stack')
                          ) : (
                            <p className={`text-white font-quote tracking-wide text-center whitespace-pre-wrap break-words ${stackQuoteTextClass}`}>
                              {quote.content}
                            </p>
                          )}
                          <div className="mt-4 md:mt-9 w-20 h-1 bg-white/30"></div>
                          <p className="text-white/80 text-xs md:text-2xl font-bold tracking-widest mt-4">
                            {quote.author}
                          </p>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      

      {quotes.length === 0 && <div className="text-center py-10 opacity-50">No quotes found. Add .txt or images to assets/quotes</div>}
    </div>
  );
};

const DesignsGallery: React.FC = () => {
  const designs = useMemo(() => getDesigns(), []);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(designs.map(d => d.category));
    return ['All', ...Array.from(cats)];
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    if (activeCategory === 'All') return designs;
    return designs.filter(d => d.category === activeCategory);
  }, [activeCategory, designs]);

  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const navigateToIndex = (idx: number) => {
    const len = filteredDesigns.length;
    if (len === 0) return;
    const safe = ((idx % len) + len) % len;
    setSelectedDesign(filteredDesigns[safe]);
  };

  const navigatePrev = () => {
    if (!selectedDesign) return;
    const idx = filteredDesigns.findIndex(d => d.id === selectedDesign.id);
    if (idx === -1) return;
    navigateToIndex(idx - 1);
  };

  const navigateNext = () => {
    if (!selectedDesign) return;
    const idx = filteredDesigns.findIndex(d => d.id === selectedDesign.id);
    if (idx === -1) return;
    navigateToIndex(idx + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedDesign) return;
      if (e.key === 'Escape') setSelectedDesign(null);
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedDesign, filteredDesigns]);

  // Prevent background scrolling when modal is open and restore on close
  useEffect(() => {
    if (selectedDesign) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [selectedDesign]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <WorksSubNav />

      {categories.length > 1 && (
        <div className="flex justify-center overflow-x-auto pb-8 mb-8 gap-3 scrollbar-hide animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-xl shadow-slate-900/20 dark:shadow-primary-900/20 transform scale-105'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-0 animate-fade-up shadow-2xl rounded-lg overflow-hidden border border-transparent dark:border-slate-800" style={{ animationDelay: '0.2s' }}>
        {filteredDesigns.map((design, index) => {
          const bgColor = index % 2 === 0 ? COLOR_RED : COLOR_GREY;

          return (
            <div
              key={design.id}
              className="group relative aspect-square overflow-hidden cursor-zoom-in"
              style={{ backgroundColor: bgColor }}
              onDoubleClick={() => setSelectedDesign(design)}
              onClick={() => setSelectedDesign(design)}
              role="button"
              tabIndex={0}
            >
              <img
                src={design.imageUrl}
                alt={design.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 mix-blend-normal"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <span className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{design.category}</span>
                <h4 className="text-white font-subnav text-xl md:text-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{design.title}</h4>
                {design.description && (
                  <p className="text-gray-300 text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 font-light leading-relaxed">{design.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 md:px-12 py-6 md:py-12">
          <div className="absolute top-6 left-6">
            <button
              onClick={() => setSelectedDesign(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/85 dark:bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white backdrop-blur"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
          </div>

          <div className="absolute left-6 inset-y-0 flex items-center pointer-events-none">
            <button
              onClick={navigatePrev}
              className="pointer-events-auto rounded-full p-2 bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white"
              aria-label="Previous"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute right-6 inset-y-0 flex items-center pointer-events-none">
            <button
              onClick={navigateNext}
              className="pointer-events-auto rounded-full p-2 bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white"
              aria-label="Next"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div
            className="w-full h-full max-w-full max-h-full flex flex-col items-center justify-center overflow-auto rounded-lg"
            onTouchStart={(e) => { touchStartX.current = e.touches?.[0]?.clientX ?? null; }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return;
              const endX = e.changedTouches?.[0]?.clientX ?? null;
              if (endX == null) return;
              const diff = touchStartX.current - endX;
              if (diff > SWIPE_THRESHOLD) navigateNext();
              else if (diff < -SWIPE_THRESHOLD) navigatePrev();
              touchStartX.current = null;
            }}
          >
            <img
              src={selectedDesign.imageUrl}
              alt={selectedDesign.title}
              className="max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-8rem)] max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-9rem)] object-contain"
            />
            {selectedDesign.title && (
              <div className="mt-3 text-center text-white/80">{selectedDesign.title}</div>
            )}
          </div>
        </div>
      )}
      
      {filteredDesigns.length === 0 && (
         <div className="py-20 text-center text-slate-500 font-light italic">
           No designs found. Add images to assets/designs
         </div>
      )}
    </div>
  );
};

export const WorksLayout: React.FC = () => {
  const location = useLocation();
  const isRoot = location.pathname === '/works' || location.pathname === '/works/';

  return (
    <>
      {isRoot ? <WorksHub /> : (
        <div className="min-h-screen">
           <Outlet />
        </div>
      )}
    </>
  );
};

export { BlogsGallery, QuotesGallery, DesignsGallery };

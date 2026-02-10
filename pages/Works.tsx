
import React, { useState, useMemo } from 'react';
import { NavLink, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { getBlogs, getQuotes, getDesigns } from '../utils/contentLoader';
import { COLOR_RED, COLOR_GREY } from '../constants';
import { Quote, Image, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';

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
      {blogs.length === 0 && <div className="text-center py-10 opacity-50">No blogs found. Add images to src/assets/blogs</div>}
    </div>
  );
};

const QuotesGallery: React.FC = () => {
  const quotes = useMemo(() => getQuotes(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <WorksSubNav />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 bg-white dark:bg-slate-950 animate-fade-up shadow-2xl rounded-lg overflow-hidden border border-transparent dark:border-slate-800">
        {quotes.map((quote, index) => {
          const bgColor = index % 2 === 0 ? COLOR_RED : COLOR_GREY;
          
          return (
            <div 
              key={quote.id} 
              className="aspect-square relative group overflow-hidden"
              style={{ backgroundColor: quote.type === 'text' ? bgColor : 'transparent' }}
            >
              {quote.type === 'image' ? (
                <img 
                  src={quote.content} 
                  alt="Quote" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center transition-transform duration-500 group-hover:scale-105">
                  <Quote className="w-10 h-10 text-white/20 mb-6" />
                  <p className="text-white font-quote text-2xl md:text-3xl leading-relaxed tracking-wide">
                    "{quote.content}"
                  </p>
                  <div className="mt-6 w-12 h-1 bg-white/30"></div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-4">
                    {quote.author}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {quotes.length === 0 && <div className="text-center py-10 opacity-50">No quotes found. Add .txt or images to src/assets/quotes</div>}
    </div>
  );
};

const DesignsGallery: React.FC = () => {
  const designs = useMemo(() => getDesigns(), []);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(designs.map(d => d.category));
    return ['All', ...Array.from(cats)];
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    if (activeCategory === 'All') return designs;
    return designs.filter(d => d.category === activeCategory);
  }, [activeCategory, designs]);

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
              className="group relative aspect-square overflow-hidden"
              style={{ backgroundColor: bgColor }}
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
      
      {filteredDesigns.length === 0 && (
         <div className="py-20 text-center text-slate-500 font-light italic">
           No designs found. Add images to src/assets/designs
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

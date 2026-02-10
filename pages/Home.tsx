import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SKILLS_DATA, SOCIAL_LINKS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden min-h-[75vh] flex flex-col justify-center">
        
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 w-full h-full -z-20 transition-colors duration-500">
          {/* Base Gradient Layer with Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 bg-[length:400%_400%] animate-gradient-x opacity-80"></div>
          
          {/* Moving Blobs for dynamic feel */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-screen dark:bg-primary-900/30 dark:opacity-20"></div>
          {/* Changed hardcoded blue-200 to slate-200/primary-300 for theme compatibility */}
          <div className="absolute top-0 -right-4 w-72 h-72 bg-slate-300 dark:bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-screen dark:opacity-20" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-screen dark:bg-primary-800/30 dark:opacity-20" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center animate-fade-up relative z-10">
          <h2 className="text-primary-600 dark:text-primary-300 font-semibold tracking-widest text-sm mb-6 uppercase bg-white/50 dark:bg-slate-900 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary-100 dark:border-primary-500/20 shadow-sm">
            Data Scientist & Creative
          </h2>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-name font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
            Hello, I'm <br />
            {/* Split name to customize the 'i' */}
            <span>
              {/* Using primary gradient so it switches color in Minimal Mode */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-slate-600 dark:from-primary-300 dark:to-primary-500 animate-gradient-x bg-[length:200%_auto]">
                Gokulakr
              </span>
              
              {/* Specialized 'i' with Red Dot and Gradient Stem */}
              <span className="relative inline-block mx-[0.02em]">
                {/* Background Layer: Red 'i' (provides the dot color) */}
                <span className="text-red-600 dark:text-red-500 relative z-0">i</span>
                
                {/* Foreground Layer: Gradient 'i' (provides the stem color) 
                    Clipped to hide the top dot so the red dot shows through */}
                <span 
                  className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-slate-600 dark:from-primary-300 dark:to-primary-500 animate-gradient-x bg-[length:200%_auto] z-10"
                  style={{ clipPath: 'polygon(0% 38%, 100% 38%, 100% 100%, 0% 100%)' }}
                >
                  i
                </span>
              </span>

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-slate-600 dark:from-primary-300 dark:to-primary-500 animate-gradient-x bg-[length:200%_auto]">
                shnan M
              </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed font-light backdrop-blur-sm">
            I bridge the gap between complex data and actionable insights. 
            Specializing in Generative AI, MLOps, and Cloud Architecture, 
            I also have a passion for creative design and visual storytelling.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-slate-900 dark:bg-primary-600 text-white font-medium hover:bg-slate-800 dark:hover:bg-primary-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-primary-900/20 group hover:-translate-y-1"
            >
              View My Work
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="mailto:gokulkrish0999@gmail.com"
              className="inline-flex items-center px-8 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800 backdrop-blur text-slate-700 dark:text-slate-200 font-medium hover:bg-white dark:hover:bg-slate-700 transition-all hover:-translate-y-1"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-16 flex items-center gap-8">
            {SOCIAL_LINKS.map((item) => (
              <a 
                key={item.name} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-primary-400 transition-colors transform hover:scale-110 duration-200"
              >
                <item.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-16">
          {/* Reduced boldness to font-semibold */}
          <h3 className="text-3xl font-title font-semibold text-slate-900 dark:text-white mb-10 flex items-center gap-4">
             <span className="w-12 h-1 bg-primary-500 rounded-full"></span>
             Technical Expertise
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SKILLS_DATA.map((category) => (
              <div key={category.category} className="bg-white/80 dark:bg-slate-900 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/30 transition-all hover:shadow-lg dark:hover:shadow-primary-900/5 group">
                <h4 className="text-xl font-bold text-slate-900 dark:text-primary-400 mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{category.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm rounded-md border border-slate-200 dark:border-slate-800 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
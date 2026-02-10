import React, { useEffect, useState, useMemo } from 'react';
import { fetchGitHubRepos } from '../services/githubService';
import { GitHubRepo } from '../types';
import { Star, GitFork, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { FEATURED_PROJECTS } from '../constants';

const Portfolio: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const loadRepos = async () => {
      const data = await fetchGitHubRepos();
      setRepos(data);
      setLoading(false);
    };
    loadRepos();
  }, []);

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean));
    return ['All', ...Array.from(langs)];
  }, [repos]);

  const filteredRepos = repos.filter(repo => {
    if (filter === 'All') return true;
    return repo.language === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-up">
      {/* Featured Projects Section */}
      <section className="mb-24">
        {/* Reduced boldness to font-semibold */}
        <h2 className="text-3xl md:text-4xl font-title font-semibold text-slate-900 dark:text-white mb-10 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary-500" />
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {FEATURED_PROJECTS.map((project, idx) => (
            <a 
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-900/10 block animate-fade-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="aspect-[2/1] bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    {project.title} <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300" />
                  </h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold text-primary-700 dark:text-primary-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="mb-12">
        {/* Reduced boldness to font-semibold */}
        <h2 className="text-3xl font-title font-semibold text-slate-900 dark:text-white mb-4">Open Source Projects</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg font-light">
          A collection of my public repositories from GitHub. These projects span across data analysis, 
          machine learning models, and web development.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setFilter(lang as string)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === lang
                ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-primary-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {filteredRepos.map((repo) => (
            <div 
              key={repo.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-primary-500/50 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col group h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {repo.name}
                </h3>
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                {repo.description || "No description provided."}
              </p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                  </span>
                </div>
                <span className="text-slate-400 font-mono">
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
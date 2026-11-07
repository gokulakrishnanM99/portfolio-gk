import React from 'react';
import { Download, Building2, GraduationCap, Calendar, Trophy, FolderGit2, Users, ExternalLink } from 'lucide-react';
import { 
  EDUCATION_DATA, 
  EXPERIENCE_DATA, 
  RESUME_PROJECTS_DATA, 
  RESPONSIBILITIES_DATA, 
  ACHIEVEMENTS_DATA 
} from '../constants';

const Resume: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-4xl font-title font-semibold text-slate-900 dark:text-white mb-2">Resume</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-resume-body">
            My professional journey, technical projects, and educational background.
          </p>
        </div>
        <a 
          href="/Resume_Gokulakrishnan_M.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download="Resume_Gokulakrishnan_M.pdf"
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white rounded-full transition-all shadow-md font-resume-head font-medium hover:-translate-y-0.5"
          title="Download Gokulakrishnan's Resume PDF"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>

      <div className="space-y-20">
        {/* Industry Experience Section */}
        <section>
          <h3 className="text-2xl font-resume-head font-bold text-slate-900 dark:text-primary-400 mb-10 flex items-center gap-3">
            <span className="p-2 bg-primary-50 dark:bg-slate-900 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-slate-800">
               <Building2 className="w-6 h-6" />
            </span>
            Industry Experience
          </h3>
          
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-16">
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.id} className="relative pl-8 md:pl-12">
                <span className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-primary-500"></span>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-xl font-resume-head font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                  <span className="text-sm font-resume-body font-medium text-slate-500 dark:text-slate-500 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>
                
                <div className="text-primary-600 dark:text-primary-300 mb-5 font-resume-head font-semibold text-lg">{exp.company}</div>
                
                <ul className="space-y-3 mb-6 font-resume-body">
                  {exp.description.map((desc, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                       <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mt-2.5 flex-shrink-0"></span>
                       {desc}
                    </li>
                  ))}
                </ul>

                {exp.skills && (
                  <div className="flex flex-wrap gap-2 font-resume-body">
                    {exp.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <h3 className="text-2xl font-resume-head font-bold text-slate-900 dark:text-primary-400 mb-10 flex items-center gap-3">
            <span className="p-2 bg-primary-50 dark:bg-slate-900 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-slate-800">
              <FolderGit2 className="w-6 h-6" />
            </span>
            Projects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESUME_PROJECTS_DATA.map((proj) => (
              <div 
                key={proj.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h4 className="text-lg font-resume-head font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                      {proj.title}
                      {proj.url && (
                        <a 
                          href={proj.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center"
                          title="Open project"
                        >
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      )}
                    </h4>
                    <span className="text-xs font-resume-body font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {proj.period}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-resume-body text-sm leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>
                {proj.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    {proj.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h3 className="text-2xl font-resume-head font-bold text-slate-900 dark:text-primary-400 mb-10 flex items-center gap-3">
             <span className="p-2 bg-primary-50 dark:bg-slate-900 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-slate-800">
              <GraduationCap className="w-6 h-6" />
            </span>
            Education
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EDUCATION_DATA.map((edu) => (
              <div key={edu.id} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-resume-head font-bold text-slate-900 dark:text-white leading-tight">{edu.institution}</h4>
                  <span className="text-xs font-resume-body font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">{edu.year}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 mb-4 font-resume-body font-medium">{edu.degree}</div>
                <div className="text-sm text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 inline-block px-3 py-1 rounded-full font-resume-body">{edu.score}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Positions of Responsibility Section */}
        <section>
          <h3 className="text-2xl font-resume-head font-bold text-slate-900 dark:text-primary-400 mb-8 flex items-center gap-3">
            <span className="p-2 bg-primary-50 dark:bg-slate-900 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-slate-800">
              <Users className="w-6 h-6" />
            </span>
            Positions of Responsibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESPONSIBILITIES_DATA.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-resume-head font-bold text-slate-900 dark:text-white leading-tight">{item.role}</h4>
                  <span className="text-xs font-resume-body font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">{item.period}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-resume-body text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards & Achievements Section */}
        <section>
          <h3 className="text-2xl font-resume-head font-bold text-slate-900 dark:text-primary-400 mb-8 flex items-center gap-3">
             <span className="p-2 bg-primary-50 dark:bg-slate-900 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-slate-800">
              <Trophy className="w-6 h-6" />
            </span>
            Awards & Achievements
          </h3>
          <ul className="space-y-4 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 font-resume-body">
            {ACHIEVEMENTS_DATA.map((ach) => (
              <li key={ach.id} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2.5"></span>
                <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  <strong className="text-slate-900 dark:text-white font-bold font-resume-head">{ach.title} ({ach.period}):</strong> {ach.description}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Resume;

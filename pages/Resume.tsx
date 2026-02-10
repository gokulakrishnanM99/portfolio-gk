import React from 'react';
import { Download, Building2, GraduationCap, Calendar, Trophy } from 'lucide-react';
import { EDUCATION_DATA, EXPERIENCE_DATA } from '../constants';

const Resume: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          {/* Reduced boldness to font-semibold */}
          <h2 className="text-4xl font-title font-semibold text-slate-900 dark:text-white mb-2">Resume</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-resume-body">My professional journey and educational background.</p>
        </div>
        <button 
          disabled
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-300 rounded-full transition-colors cursor-not-allowed opacity-80 shadow-md font-resume-head font-medium"
          title="Download disabled for demo"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="space-y-20">
        {/* Experience Section */}
        <section>
          {/* Section Heading - Josefin Sans */}
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
                  {/* Role - Josefin Sans */}
                  <h4 className="text-xl font-resume-head font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                  <span className="text-sm font-resume-body font-medium text-slate-500 dark:text-slate-500 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>
                
                {/* Company - Josefin Sans */}
                <div className="text-primary-600 dark:text-primary-300 mb-5 font-resume-head font-semibold text-lg">{exp.company}</div>
                
                {/* Description - Poppins */}
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

        {/* Education Section */}
        <section>
          {/* Section Heading - Josefin Sans */}
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
                  {/* Institution - Josefin Sans */}
                  <h4 className="text-lg font-resume-head font-bold text-slate-900 dark:text-white leading-tight">{edu.institution}</h4>
                  <span className="text-xs font-resume-body font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">{edu.year}</span>
                </div>
                {/* Degree - Poppins */}
                <div className="text-slate-600 dark:text-slate-300 mb-4 font-resume-body font-medium">{edu.degree}</div>
                <div className="text-sm text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 inline-block px-3 py-1 rounded-full font-resume-body">{edu.score}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Preview */}
        <section>
           {/* Section Heading - Josefin Sans */}
           <h3 className="text-2xl font-resume-head font-bold text-slate-900 dark:text-primary-400 mb-8 flex items-center gap-3">
             <span className="p-2 bg-primary-50 dark:bg-slate-900 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-slate-800">
              <Trophy className="w-6 h-6" />
            </span>
            Key Achievements
          </h3>
          <ul className="space-y-4 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 font-resume-body">
             <li className="flex gap-4 items-start">
               <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2.5"></span>
               <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                 <strong className="text-slate-900 dark:text-white font-bold font-resume-head">GATE Top Ranker:</strong> Secured AIR 132 in GATE 2021 (Biomedical Engineering) among 1684 candidates.
               </span>
             </li>
             <li className="flex gap-4 items-start">
               <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2.5"></span>
               <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                 <strong className="text-slate-900 dark:text-white font-bold font-resume-head">Innovation Winner:</strong> Winner of "K! Box" (Creative Ideas) at Kurukshetra.
               </span>
             </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Resume;
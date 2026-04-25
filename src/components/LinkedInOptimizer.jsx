import React from 'react';
import { Briefcase, Type, AlignLeft, Star, List } from 'lucide-react';

const LinkedInOptimizer = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
        <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-mono uppercase tracking-widest text-text-primary">LinkedIn Optimizer</h4>
      </div>

      {/* Headline */}
      <div className="p-4 bg-background border border-border rounded-lg space-y-2 hover:border-blue-500/30 transition-colors">
        <h5 className="text-xs font-mono uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <Type size={14} /> Headline
        </h5>
        <p className="text-sm font-medium text-text-primary">{data.headline}</p>
      </div>

      {/* About Section */}
      <div className="p-4 bg-background border border-border rounded-lg space-y-2 hover:border-blue-500/30 transition-colors">
        <h5 className="text-xs font-mono uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <AlignLeft size={14} /> About Section
        </h5>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{data.about_section}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Skills */}
        <div className="p-4 bg-background border border-border rounded-lg space-y-3 hover:border-blue-500/30 transition-colors">
          <h5 className="text-xs font-mono uppercase tracking-widest text-text-secondary flex items-center gap-2">
            <Star size={14} /> Featured Skills
          </h5>
          <div className="flex flex-wrap gap-2">
            {(data.featured_skills || []).map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 rounded text-[10px] font-medium uppercase tracking-wider">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Bullets */}
        <div className="p-4 bg-background border border-border rounded-lg space-y-3 hover:border-blue-500/30 transition-colors">
          <h5 className="text-xs font-mono uppercase tracking-widest text-text-secondary flex items-center gap-2">
            <List size={14} /> Top Experience Bullets
          </h5>
          <ul className="space-y-2">
            {(data.experience_bullets || []).map((bullet, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2 items-start">
                <span className="text-blue-500 mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOptimizer;

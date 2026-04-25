import React from 'react';
import { Target, Award, Book, Wrench, UserCircle, Globe, Shield } from 'lucide-react';

const JobMatchBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;

  const categories = [
    { key: 'skills_match', label: 'Skills Match', icon: <Target size={16} /> },
    { key: 'experience_level', label: 'Experience Level', icon: <Award size={16} /> },
    { key: 'education', label: 'Education Alignment', icon: <Book size={16} /> },
    { key: 'tools_technologies', label: 'Tools & Tech', icon: <Wrench size={16} /> },
    { key: 'seniority_alignment', label: 'Seniority Fit', icon: <UserCircle size={16} /> },
    { key: 'domain_knowledge', label: 'Domain Knowledge', icon: <Globe size={16} /> },
    { key: 'certifications', label: 'Certifications', icon: <Shield size={16} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, i) => (
          breakdown[cat.key] ? (
            <div key={i} className="p-4 bg-background border border-border rounded-lg flex gap-4 hover:border-accent/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                {cat.icon}
              </div>
              <div>
                <h5 className="text-xs font-mono uppercase tracking-widest text-text-primary mb-1">{cat.label}</h5>
                <p className="text-sm text-text-secondary leading-relaxed">{breakdown[cat.key]}</p>
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default JobMatchBreakdown;

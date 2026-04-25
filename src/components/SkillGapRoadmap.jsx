import React from 'react';
import { Map, Clock, AlertTriangle, PlayCircle } from 'lucide-react';

const SkillGapRoadmap = ({ plan }) => {
  if (!plan || plan.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        <Map size={18} className="text-purple-500" />
        <h4 className="text-sm font-mono uppercase tracking-widest text-text-primary">Learning Roadmap</h4>
      </div>

      <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
        {plan.map((item, i) => (
          <div key={i} className="relative pl-6">
            {/* Timeline dot */}
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-purple-500 z-10"></div>
            
            <div className="bg-background border border-border p-4 rounded-lg hover:border-purple-500/50 transition-colors">
              <h5 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                {item.skill}
              </h5>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest bg-card px-2 py-1 rounded text-text-secondary">
                  <AlertTriangle size={12} className={
                    item.difficulty.toLowerCase() === 'hard' ? 'text-red-500' : 
                    item.difficulty.toLowerCase() === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  } />
                  {item.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest bg-card px-2 py-1 rounded text-text-secondary">
                  <Clock size={12} className="text-blue-500" />
                  {item.estimated_time}
                </span>
              </div>
              
              <div className="bg-purple-500/5 p-3 rounded border border-purple-500/10">
                <div className="flex gap-2 text-sm text-text-secondary">
                  <PlayCircle size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-text-primary">Suggested Project:</strong> {item.suggested_project}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillGapRoadmap;

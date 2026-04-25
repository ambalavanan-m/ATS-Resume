import React from 'react';
import { Layout, AlertOctagon, AlertTriangle, Info } from 'lucide-react';

const FormatChecker = ({ issues }) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
        <Layout size={18} className="text-blue-500" />
        <h4 className="text-sm font-mono uppercase tracking-widest text-text-primary">Format Checker</h4>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {issues.map((issue, i) => {
          const isHigh = issue.severity.toLowerCase() === 'high';
          const isMedium = issue.severity.toLowerCase() === 'medium';
          
          return (
            <div key={i} className={`p-4 rounded-lg border flex gap-3 items-start ${
              isHigh ? 'bg-red-500/5 border-red-500/20' : 
              isMedium ? 'bg-yellow-500/5 border-yellow-500/20' : 
              'bg-blue-500/5 border-blue-500/20'
            }`}>
              <div className="mt-0.5 flex-shrink-0">
                {isHigh ? <AlertOctagon size={16} className="text-red-500" /> : 
                 isMedium ? <AlertTriangle size={16} className="text-yellow-500" /> : 
                 <Info size={16} className="text-blue-500" />}
              </div>
              <div>
                <p className="text-sm text-text-primary">{issue.issue}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormatChecker;

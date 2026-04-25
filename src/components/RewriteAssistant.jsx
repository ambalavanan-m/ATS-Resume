import React from 'react';
import { PenTool, ArrowRight, CheckCircle2 } from 'lucide-react';

const RewriteAssistant = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-6 bg-background border border-border rounded-xl text-center">
        <p className="text-sm text-text-secondary">No rewrite suggestions available. Your bullets look solid!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <PenTool size={16} className="text-accent" />
        <h4 className="text-xs font-mono uppercase tracking-widest text-text-primary">Rewrite Assistant</h4>
      </div>
      
      <div className="space-y-6">
        {suggestions.map((item, index) => (
          <div key={index} className="p-5 bg-background border border-border rounded-xl space-y-4 hover:border-accent/30 transition-colors">
            
            {/* Reason */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 text-[10px] font-mono rounded font-bold uppercase tracking-widest">
              Issue: {item.reason}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Original */}
              <div className="p-4 bg-card rounded-lg border border-red-500/20 relative">
                <span className="absolute -top-2 left-3 bg-card px-1 text-[10px] text-text-secondary font-mono">Original</span>
                <p className="text-sm text-text-primary opacity-70 line-through decoration-red-500/50">{item.original}</p>
              </div>

              {/* Arrow (hidden on mobile, shown on md) */}
              <div className="hidden md:flex items-center justify-center -mx-6 z-10">
                <div className="w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center">
                  <ArrowRight size={14} className="text-text-secondary" />
                </div>
              </div>

              {/* Improved */}
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20 relative">
                <span className="absolute -top-2 left-3 bg-background px-1 text-[10px] text-green-500 font-mono flex items-center gap-1">
                  <CheckCircle2 size={10} /> Improved
                </span>
                <p className="text-sm text-text-primary font-medium">{item.improved}</p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewriteAssistant;

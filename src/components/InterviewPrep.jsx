import React from 'react';
import { MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';

const InterviewPrep = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
        <MessageSquare size={18} className="text-purple-500" />
        <h4 className="text-sm font-mono uppercase tracking-widest text-text-primary">Interview Prep Mode</h4>
      </div>

      <div className="space-y-8">
        {questions.map((q, i) => (
          <div key={i} className="p-6 bg-background border border-purple-500/20 rounded-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-mono uppercase tracking-widest font-bold rounded">
                {q.type || 'Behavioral'}
              </span>
            </div>
            
            <h5 className="text-lg font-serif text-text-primary mb-6 flex gap-3">
              <span className="text-purple-500 font-bold">Q{i+1}.</span>
              {q.question}
            </h5>

            {q.star_framework && (
              <div className="bg-card border border-border rounded-lg p-5 mb-4">
                <h6 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-4 border-b border-border pb-2">Suggested STAR Framework Answer</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase">Situation</span>
                    <p className="text-sm text-text-secondary">{q.star_framework.situation}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase">Task</span>
                    <p className="text-sm text-text-secondary">{q.star_framework.task}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase">Action</span>
                    <p className="text-sm text-text-secondary">{q.star_framework.action}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase">Result</span>
                    <p className="text-sm text-text-secondary">{q.star_framework.result}</p>
                  </div>
                </div>
              </div>
            )}

            {q.follow_up && (
              <div className="flex items-start gap-2 text-sm text-text-secondary mt-4 bg-purple-500/5 p-3 rounded border border-purple-500/10">
                <HelpCircle size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <p><strong className="text-text-primary">Potential Follow-up:</strong> {q.follow_up}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;

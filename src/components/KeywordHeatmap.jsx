import React, { useState } from 'react';
import { FileText, Briefcase } from 'lucide-react';

const HighlightedText = ({ text, matched, missing, isJd }) => {
  if (!text) return null;
  
  // Sort keywords by length descending so longer phrases match first
  const allKeywords = [...(matched || []), ...(missing || [])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (allKeywords.length === 0) return <p className="whitespace-pre-wrap text-sm text-text-secondary">{text}</p>;

  // Escape regex specials
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const pattern = new RegExp(`(${allKeywords.map(escapeRegExp).join('|')})`, 'gi');
  
  const parts = text.split(pattern);

  return (
    <div className="whitespace-pre-wrap text-sm text-text-secondary leading-relaxed font-serif">
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const isMatched = matched.some(k => k.toLowerCase() === lowerPart);
        const isMissing = missing.some(k => k.toLowerCase() === lowerPart);

        if (isMatched) {
          return <mark key={i} className="bg-green-500/20 text-green-500 font-bold px-1 rounded">{part}</mark>;
        } else if (isMissing && isJd) {
          return <mark key={i} className="bg-red-500/20 text-red-500 font-bold px-1 rounded">{part}</mark>;
        }
        
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

const KeywordHeatmap = ({ resumeText, jdText, skills }) => {
  const [view, setView] = useState('resume'); // 'resume' or 'jd'
  
  const matchedKeywords = [...(skills?.matched_hard || []), ...(skills?.matched_soft || [])];
  const missingKeywords = [...(skills?.missing_hard || []), ...(skills?.missing_soft || [])];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setView('resume')}
          className={`pb-2 px-1 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${view === 'resume' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <FileText size={14} /> Resume Heatmap
        </button>
        <button
          onClick={() => setView('jd')}
          className={`pb-2 px-1 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${view === 'jd' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Briefcase size={14} /> JD Heatmap
        </button>
      </div>

      <div className="p-6 bg-background border border-border rounded-xl h-96 overflow-y-auto">
        {view === 'resume' ? (
          <HighlightedText 
            text={resumeText} 
            matched={matchedKeywords} 
            missing={missingKeywords} 
            isJd={false} 
          />
        ) : (
          <HighlightedText 
            text={jdText} 
            matched={matchedKeywords} 
            missing={missingKeywords} 
            isJd={true} 
          />
        )}
      </div>
      
      <div className="flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <span className="w-3 h-3 bg-green-500/20 rounded inline-block"></span> Matched Keyword
        </div>
        {view === 'jd' && (
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span className="w-3 h-3 bg-red-500/20 rounded inline-block"></span> Missing Keyword
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordHeatmap;

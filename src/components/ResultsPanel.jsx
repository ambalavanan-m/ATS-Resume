import React from 'react';
import ScoreRing from './ScoreRing';
import ProgressBar from './ProgressBar';
import KeywordChips from './KeywordChips';
import SuggestionsList from './SuggestionsList';
import { CheckCircle2, TrendingUp, Layout, BookOpen, Search } from 'lucide-react';

const ResultsPanel = ({ results }) => {
  if (!results) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center text-center h-full border-dashed">
        <div className="p-4 bg-accent/10 rounded-full mb-6 text-accent">
          <Search size={48} />
        </div>
        <h3 className="text-xl font-serif mb-2">Ready for Analysis</h3>
        <p className="text-[#8b949e] text-sm max-w-xs">Upload your resume and a job description to see your ATS score and optimization tips.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 h-full overflow-y-auto space-y-10 animate-fade-in custom-scrollbar">
      {/* Top Section: Score & Summary */}
      <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#30363d] pb-8">
        <ScoreRing score={results.ats_score} />
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl font-serif text-accent flex items-center gap-2">
            Analysis Report
          </h3>
          <p className="text-[#8b949e] text-sm leading-relaxed">{results.summary}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-green-400">
              <TrendingUp size={14} />
              Optimization Score: {results.ats_score}%
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Layout size={14} />
              Formatting: {results.format_score}%
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <BookOpen size={14} />
              Readability: {results.readability_score}%
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#8b949e] mb-4">Core Metrics</h4>
          <ProgressBar label="Keyword Match" score={results.keyword_match_score} />
          <ProgressBar label="Visual Formatting" score={results.format_score} />
          <ProgressBar label="Content Readability" score={results.readability_score} />
          
          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#8b949e]">Detected Strengths</h4>
            <div className="space-y-2">
              {results.strengths.map((str, i) => (
                <div key={i} className="flex gap-2 items-start text-sm text-green-400">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#8b949e]">Keyword Analysis</h4>
          <KeywordChips 
            matched={results.matched_keywords} 
            missing={results.missing_keywords} 
          />
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="border-t border-[#30363d] pt-8">
        <h4 className="text-xs font-mono uppercase tracking-widest text-[#8b949e] mb-6">Optimization Checklist</h4>
        <SuggestionsList suggestions={results.suggestions} />
      </div>
    </div>
  );
};

export default ResultsPanel;

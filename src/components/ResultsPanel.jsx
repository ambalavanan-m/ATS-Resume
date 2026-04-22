import React from 'react';
import ScoreRing from './ScoreRing';
import ProgressBar from './ProgressBar';
import SuggestionsList from './SuggestionsList';
import { CheckCircle2, TrendingUp, Layout, BookOpen, Search, ShieldCheck, FileText, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsPanel = ({ results }) => {
  if (!results) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center text-center border-dashed border-border transition-colors duration-300">
        <div className="p-4 bg-accent/10 rounded-full mb-6 text-accent">
          <Search size={48} />
        </div>
        <h3 className="text-xl font-serif mb-2 text-text-primary">Ready for Analysis</h3>
        <p className="text-text-secondary text-sm max-w-xs">Upload your resume and a job description to see your industry-benchmarked ATS score.</p>
      </div>
    );
  }

  const skills = results?.skills_categorized || {
    matched_soft: [],
    matched_hard: [],
    missing_soft: [],
    missing_hard: []
  };
  
  const sectionScores = results?.section_scores || {
    experience: 0,
    education: 0,
    skills: 0
  };

  return (
    <div className="glass-card p-8 animate-fade-in bg-card space-y-10 transition-colors duration-300">
      {/* Top Section: Score & Summary */}
      <div className="flex flex-col md:flex-row gap-8 items-center border-b border-border pb-8">
        <ScoreRing score={results.ats_score} />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-serif text-accent">Report: {results.industry}</h3>
            <ShieldCheck size={16} className="text-accent/60" />
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{results.summary}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-green-500 font-bold">
              <TrendingUp size={14} />
              Overall: {results.ats_score}%
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-500 font-bold">
              <Layout size={14} />
              Format: {results.format_score}%
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-500 font-bold">
              <BookOpen size={14} />
              Readability: {results.readability_score}%
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Section Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-4 border-b border-border pb-2">Section Scores</h4>
          <ProgressBar label="Work Experience" score={sectionScores.experience} />
          <ProgressBar label="Education History" score={sectionScores.education} />
          <ProgressBar label="Skills Relevance" score={sectionScores.skills} />
          
          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-text-secondary border-b border-border pb-2">Strengths</h4>
            <div className="space-y-2">
              {(results?.strengths || []).map((str, i) => (
                <div key={i} className="flex gap-2 items-start text-sm text-green-500 font-medium">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary opacity-90">{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-4 border-b border-border pb-2">Skill Categorization</h4>
          
          {/* Hard Skills */}
          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-accent uppercase tracking-tighter font-bold">Hard Skills</span>
                <span className="text-[10px] text-text-secondary">{skills.matched_hard.length} matched / {skills.missing_hard.length} missing</span>
             </div>
             <div className="flex flex-wrap gap-1.5">
                {skills.matched_hard.map(kw => (
                    <span key={kw} className="px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded text-[10px] font-medium">{kw}</span>
                ))}
                {skills.missing_hard.map(kw => (
                    <span key={kw} className="px-2 py-0.5 bg-red-500/5 text-red-500/60 border border-red-500/10 rounded text-[10px]">{kw}</span>
                ))}
             </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-purple-500 uppercase tracking-tighter font-bold">Soft Skills</span>
                <span className="text-[10px] text-text-secondary">{skills.matched_soft.length} matched</span>
             </div>
             <div className="flex flex-wrap gap-1.5">
                {skills.matched_soft.map(kw => (
                    <span key={kw} className="px-2 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded text-[10px] font-medium">{kw}</span>
                ))}
                {skills.missing_soft.map(kw => (
                    <span key={kw} className="px-2 py-0.5 bg-gray-500/5 text-text-secondary border border-gray-500/10 rounded text-[10px]">{kw}</span>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="border-t border-border pt-8">
        <h4 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-6">Optimization Checklist</h4>
        <SuggestionsList suggestions={results?.suggestions || []} />
      </div>

      {/* Advanced AI Features */}
      {(results?.cover_letter || (results?.interview_questions && results.interview_questions.length > 0)) && (
        <div className="border-t border-border pt-8 space-y-8">
          
          {/* Cover Letter */}
          {results?.cover_letter && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-accent flex items-center gap-2">
                <FileText size={16} />
                AI-Tailored Cover Letter
              </h4>
              <div className="p-6 bg-background border border-accent/20 rounded-xl whitespace-pre-wrap text-sm text-text-secondary leading-relaxed font-serif relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl opacity-50" />
                {results.cover_letter}
              </div>
            </div>
          )}

          {/* Interview Questions */}
          {results?.interview_questions && results.interview_questions.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-500 flex items-center gap-2">
                <MessageSquare size={16} />
                Targeted Interview Prep
              </h4>
              <div className="space-y-3">
                {results.interview_questions.map((q, i) => (
                  <div key={i} className="p-4 bg-background border border-purple-500/20 rounded-lg text-sm text-text-primary flex gap-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50" />
                    <div className="text-purple-500 font-mono font-bold mt-0.5 flex-shrink-0">Q{i+1}.</div>
                    <div className="opacity-90">{q}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;

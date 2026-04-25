import React, { useState } from 'react';
import ScoreRing from './ScoreRing';
import ProgressBar from './ProgressBar';
import SuggestionsList from './SuggestionsList';
import KeywordHeatmap from './KeywordHeatmap';
import RewriteAssistant from './RewriteAssistant';
import JobMatchBreakdown from './JobMatchBreakdown';
import SkillGapRoadmap from './SkillGapRoadmap';
import FormatChecker from './FormatChecker';
import LinkedInOptimizer from './LinkedInOptimizer';
import InterviewPrep from './InterviewPrep';
import { CheckCircle2, TrendingUp, Layout, BookOpen, Search, ShieldCheck, FileText, LayoutDashboard, Target, Briefcase, Zap } from 'lucide-react';

const ResultsPanel = ({ results, resumeText, jdText }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!results) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center text-center border-dashed border-border transition-colors duration-300 h-full min-h-[400px]">
        <div className="p-4 bg-accent/10 rounded-full mb-6 text-accent animate-pulse">
          <Search size={48} />
        </div>
        <h3 className="text-xl font-serif mb-2 text-text-primary">Ready for Analysis</h3>
        <p className="text-text-secondary text-sm max-w-xs">Upload your resume and a job description to see your industry-benchmarked ATS score.</p>
      </div>
    );
  }

  const skills = results?.skills_categorized || { matched_soft: [], matched_hard: [], missing_soft: [], missing_hard: [] };
  const sectionScores = results?.section_scores || { experience: 0, education: 0, skills: 0 };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'analysis', label: 'Deep Analysis', icon: <Target size={16} /> },
    { id: 'action', label: 'Action Plan', icon: <Zap size={16} /> },
    { id: 'career', label: 'Career Tools', icon: <Briefcase size={16} /> }
  ];

  return (
    <div className="glass-card flex flex-col animate-fade-in bg-card transition-colors duration-300 overflow-hidden h-full">
      {/* Top Header Section (Always Visible) */}
      <div className="p-8 border-b border-border bg-background/50">
        <div className="flex flex-col md:flex-row gap-8 items-center">
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
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-border hide-scrollbar bg-background">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8 overflow-y-auto flex-1">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
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
                 <FormatChecker issues={results?.format_issues || []} />
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h4 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-6">Optimization Checklist</h4>
              <SuggestionsList suggestions={results?.suggestions || []} />
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div className="space-y-10 animate-fade-in">
            <JobMatchBreakdown breakdown={results?.job_match_breakdown} />
            
            <div className="border-t border-border pt-8">
              <h4 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-4 border-b border-border pb-2">Skill Categorization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-mono text-accent uppercase tracking-tighter font-bold">Hard Skills</span>
                      <span className="text-[10px] text-text-secondary">{skills.matched_hard.length} matched / {skills.missing_hard.length} missing</span>
                   </div>
                   <div className="flex flex-wrap gap-1.5">
                      {skills.matched_hard.map(kw => <span key={kw} className="px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded text-[10px] font-medium">{kw}</span>)}
                      {skills.missing_hard.map(kw => <span key={kw} className="px-2 py-0.5 bg-red-500/5 text-red-500/60 border border-red-500/10 rounded text-[10px]">{kw}</span>)}
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-mono text-purple-500 uppercase tracking-tighter font-bold">Soft Skills</span>
                      <span className="text-[10px] text-text-secondary">{skills.matched_soft.length} matched</span>
                   </div>
                   <div className="flex flex-wrap gap-1.5">
                      {skills.matched_soft.map(kw => <span key={kw} className="px-2 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded text-[10px] font-medium">{kw}</span>)}
                      {skills.missing_soft.map(kw => <span key={kw} className="px-2 py-0.5 bg-gray-500/5 text-text-secondary border border-gray-500/10 rounded text-[10px]">{kw}</span>)}
                   </div>
                </div>
              </div>

              <KeywordHeatmap resumeText={resumeText} jdText={jdText} skills={skills} />
            </div>
          </div>
        )}

        {/* ACTION PLAN TAB */}
        {activeTab === 'action' && (
          <div className="space-y-10 animate-fade-in">
            <RewriteAssistant suggestions={results?.rewrite_suggestions || []} />
            <div className="border-t border-border pt-8">
              <SkillGapRoadmap plan={results?.skill_gap_plan || []} />
            </div>
          </div>
        )}

        {/* CAREER TOOLS TAB */}
        {activeTab === 'career' && (
          <div className="space-y-10 animate-fade-in">
            {results?.cover_letter && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-accent flex items-center gap-2">
                  <FileText size={16} /> AI-Tailored Cover Letter
                </h4>
                <div className="p-6 bg-background border border-accent/20 rounded-xl whitespace-pre-wrap text-sm text-text-secondary leading-relaxed font-serif relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl opacity-50" />
                  {results.cover_letter}
                </div>
              </div>
            )}
            
            <div className="border-t border-border pt-8">
              <LinkedInOptimizer data={results?.linkedin_optimization} />
            </div>

            <div className="border-t border-border pt-8">
              <InterviewPrep questions={results?.interview_prep || results?.interview_questions || []} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultsPanel;

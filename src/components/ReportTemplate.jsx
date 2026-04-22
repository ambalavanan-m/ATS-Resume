import React from 'react';
import { CheckCircle2, AlertCircle, Target, TrendingUp, Layout, BookOpen, ShieldCheck, Award } from 'lucide-react';

const ReportTemplate = ({ results, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#0d1117]' : 'bg-[#f8fafc]'; // Slightly softer light bg
  const textColor = isDark ? 'text-white' : 'text-[#0f172a]';
  const subTextColor = isDark ? 'text-[#8b949e]' : 'text-[#64748b]';
  const borderColor = isDark ? 'border-[#30363d]' : 'border-[#e2e8f0]';
  const cardBg = isDark ? 'bg-[#161b22]' : 'bg-white';
  const accentColor = "#00d4ff";

  if (!results) return null;

  const skills = results?.skills_categorized || {
    matched_hard: [], matched_soft: [], missing_hard: [], missing_soft: []
  };
  const sectionScores = results?.section_scores || {
    experience: 0, education: 0, skills: 0
  };
  const strengths = results?.strengths || [];
  const suggestions = results?.suggestions || [];

  const HealthBar = ({ label, score, colorClass }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end border-b border-transparent">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${subTextColor}`}>{label}</span>
        <span className={`text-xs font-bold ${colorClass}`}>{score}%</span>
      </div>
      <div className={`w-full h-1.5 ${isDark ? 'bg-[#30363d]' : 'bg-[#e2e8f0]'} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${colorClass} rounded-full`} 
          style={{ width: `${score}%`, backgroundColor: score > 70 ? '#22c55e' : score > 40 ? '#f59e0b' : '#ef4444' }} 
        />
      </div>
    </div>
  );

  return (
    <div className={`p-12 ${bgColor} ${textColor} w-[800px] min-h-[1100px] font-sans relative overflow-hidden`} id={`pdf-template-${theme}`}>
      {/* Decorative Branding Element */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
          <Award size={128} className="text-accent" />
      </div>

      {/* Hero Header Segment */}
      <div className={`flex flex-col md:flex-row justify-between items-end border-b-2 ${borderColor} pb-10 mb-10`}>
        <div className="flex items-center gap-5">
          <div className={`p-4 ${isDark ? 'bg-accent/20' : 'bg-accent/10'} rounded-2xl shadow-xl`}>
            <Target className="text-accent" size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-serif tracking-tight">Professional Career Audit</h1>
                <ShieldCheck size={16} className="text-accent/60" />
            </div>
            <div className="flex items-center gap-4">
               <span className={`text-xs font-mono uppercase tracking-widest ${subTextColor}`}>Industry Benchmarking: <span className="text-accent font-bold">{results.industry}</span></span>
               <span className={`text-[10px] ${isDark ? 'bg-white/5' : 'bg-black/5'} px-2 py-0.5 rounded-full ${subTextColor}`}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <div className="text-5xl font-bold font-mono text-accent leading-none">{results.ats_score}%</div>
            <div className={`text-[10px] uppercase font-mono tracking-tighter ${subTextColor} mt-1`}>ATS Compatibility Score</div>
        </div>
      </div>

      {/* Executive Overview Container */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className={`col-span-8 p-8 ${cardBg} rounded-2xl border ${borderColor} shadow-sm relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-50" />
            <h2 className="text-sm font-mono uppercase tracking-widest mb-4 flex items-center gap-2 text-accent">
                <TrendingUp size={16} />
                Analysis Summary
            </h2>
            <p className="text-sm leading-relaxed opacity-90 italic">
                "{results.summary}"
            </p>
        </div>
        <div className="col-span-4 flex flex-col justify-center space-y-6">
            <div className="text-center">
                <div className={`text-xl font-bold ${results.ats_score > 70 ? 'text-green-500' : 'text-amber-500'}`}>
                    {results.ats_score > 70 ? 'Recommended' : 'Requires Tuning'}
                </div>
                <div className={`text-[9px] uppercase font-mono ${subTextColor}`}>Evaluation Status</div>
            </div>
            <div className={`border-t ${borderColor} pt-4 text-center`}>
                <div className="text-lg font-bold">{results.suggestions.length}</div>
                <div className={`text-[9px] uppercase font-mono ${subTextColor}`}>Optimization Points</div>
            </div>
        </div>
      </div>

      {/* Performance Audit Matrix */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="col-span-1 space-y-6">
            <h3 className={`text-xs font-mono uppercase tracking-widest ${subTextColor} border-b ${borderColor} pb-2`}>Section Health</h3>
            <HealthBar label="Professional Experience" score={sectionScores.experience} />
            <HealthBar label="Academic Background" score={sectionScores.education} />
            <HealthBar label="Core Skill Match" score={sectionScores.skills} />
            <HealthBar label="Readability & Tone" score={results?.readability_score || 0} />
            <HealthBar label="ATS Formatting" score={results?.format_score || 0} />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-8">
            <div className={`p-6 ${cardBg} border ${borderColor} rounded-2xl`}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-green-500 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    Audit Strengths
                </h3>
                <ul className="space-y-3">
                    {strengths.slice(0, 4).map((s, i) => (
                        <li key={i} className="text-[11px] leading-tight flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5" />
                            {s}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={`p-6 ${cardBg} border ${borderColor} rounded-2xl`}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                    <AlertCircle size={14} />
                    Required Actions
                </h3>
                <ul className="space-y-3">
                    {suggestions.slice(0, 4).map((s, i) => (
                        <li key={i} className="text-[10px] leading-tight flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5" />
                            {s.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* Skills Evaluation Matrix - THE PROFESSIONAL REVIEW MATRIX */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4 border-b ${borderColor} pb-2">
            <h3 className={`text-xs font-mono uppercase tracking-widest ${subTextColor}`}>Skill Evaluation Matrix</h3>
            <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono text-accent">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Technical (Hard)
                </div>
                <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono text-purple-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Behavioral (Soft)
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-10">
            <div>
                <h4 className="text-[10px] font-bold text-green-500 uppercase mb-3 px-1 border-l-2 border-green-500/30">Matches Found</h4>
                <div className="flex flex-wrap gap-2">
                    {skills.matched_hard.slice(0, 12).map(kw => (
                        <span key={kw} className={`px-2 py-0.5 ${isDark ? 'bg-accent/10' : 'bg-accent/5'} text-accent text-[9px] font-bold border border-accent/20 rounded-md`}>
                            {kw}
                        </span>
                    ))}
                    {skills.matched_soft.slice(0, 8).map(kw => (
                        <span key={kw} className={`px-2 py-0.5 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} text-purple-500 text-[9px] font-bold border border-purple-500/20 rounded-md`}>
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-red-500 uppercase mb-3 px-1 border-l-2 border-red-500/30">Gap Analysis (Missing)</h4>
                <div className="flex flex-wrap gap-2">
                    {skills.missing_hard.slice(0, 10).map(kw => (
                        <span key={kw} className={`px-2 py-0.5 ${isDark ? 'bg-white/5 opacity-60' : 'bg-black/5 opacity-60'} border border-transparent rounded-md text-[9px]`}>
                            {kw}
                        </span>
                    ))}
                    {skills.missing_soft.slice(0, 8).map(kw => (
                        <span key={kw} className={`px-2 py-0.5 ${isDark ? 'bg-white/5 opacity-60' : 'bg-black/5 opacity-60'} border border-transparent rounded-md text-[9px]`}>
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Final Verification Seal Segments */}
      <div className={`mt-auto pt-10 border-t ${borderColor} flex justify-between items-center opacity-70`}>
          <div className="flex items-center gap-3">
              <div className="p-1 px-3 border-2 border-accent/30 rounded-lg text-[9px] font-bold font-mono text-accent">
                  VERIFIED BY ATS-PRO
              </div>
              <p className={`text-[8px] uppercase tracking-[0.2em] ${subTextColor}`}>AI-Powered Audit Engine v2.0</p>
          </div>
          <div className="text-right">
              <p className={`text-[8px] uppercase tracking-[0.2em] ${subTextColor}`}>&copy; 2026 ATS RESUME ANALYZER</p>
              <p className={`text-[7px] italic ${subTextColor}`}>Confidential Professional Career Analysis</p>
          </div>
      </div>
    </div>
  );
};

export default ReportTemplate;

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import IndustrySelector from './components/IndustrySelector';
import ExportButton from './components/ExportButton';
import { analyzeResume } from './utils/analyzer';
import debounce from 'lodash.debounce';

const App = () => {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [isRealTime, setIsRealTime] = useState(true);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Debounced Analysis
  const debouncedAnalysis = useCallback(
    debounce((resume, jd, ind) => {
      if (resume.trim() && jd.trim()) {
        const results = analyzeResume(resume, jd, ind);
        setAnalysisResults(results);
      }
    }, 800),
    []
  );

  useEffect(() => {
    if (isRealTime && resumeText.trim() && jdText.trim()) {
      debouncedAnalysis(resumeText, jdText, industry);
    }
  }, [resumeText, jdText, industry, isRealTime, debouncedAnalysis]);

  const handleManualAnalyze = (resume, jd) => {
    setResumeText(resume);
    setJdText(jd);
    setIsLoading(true);
    setTimeout(() => {
      const results = analyzeResume(resume, jd, industry);
      setAnalysisResults(results);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="flex-1 container mx-auto py-10 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Panel: Inputs */}
        <div className="flex flex-col">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-serif text-text-primary mb-2">Resume <span className="text-accent italic">Assessment</span></h2>
              <p className="text-text-secondary text-sm">Real-time industry-based analysis for modern ATS.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest bg-card px-3 py-1.5 rounded-full border border-border">
              <div className={`w-1.5 h-1.5 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isRealTime ? 'Live Analysis ON' : 'Manual Mode'}
            </div>
          </div>
          
          <div className="mb-6">
            <IndustrySelector selected={industry} onSelect={setIndustry} />
          </div>

          <div className="flex-1">
            <InputPanel 
                onAnalyze={handleManualAnalyze} 
                isLoading={isLoading} 
                externalText={resumeText}
                onTextChange={setResumeText}
                externalJd={jdText}
                onJdChange={setJdText}
            />
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="flex flex-col">
          <div className="mb-6 flex justify-end">
            {analysisResults && <ExportButton results={analysisResults} />}
          </div>
          <div id="report-panel" className="flex-1">
            <ResultsPanel results={analysisResults} />
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-text-secondary text-[10px] font-mono uppercase tracking-widest border-t border-border opacity-50">
        &copy; 2026 ATS Resume Analyzer - Production-Grade Rule-Based Implementation
      </footer>
    </div>
  );
};

export default App;

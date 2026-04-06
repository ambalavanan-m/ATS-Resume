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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Panel: Inputs */}
        <div className="flex flex-col">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Resume <span className="text-accent italic">Assessment</span></h2>
              <p className="text-[#8b949e] text-sm">Real-time industry-based analysis for modern ATS.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8b949e] uppercase tracking-widest bg-[#1c2128] px-3 py-1.5 rounded-full border border-[#30363d]">
              <div className={`w-1.5 h-1.5 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isRealTime ? 'Live Analysis ON' : 'Manual Mode'}
            </div>
          </div>
          
          <div className="mb-6">
            <IndustrySelector selected={industry} onSelect={setIndustry} />
          </div>

          <div className="flex-1 overflow-hidden">
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
            {analysisResults && <ExportButton elementId="report-panel" />}
          </div>
          <div id="report-panel" className="flex-1 overflow-hidden">
            <ResultsPanel results={analysisResults} />
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[#30363d] text-[10px] font-mono uppercase tracking-widest border-t border-[#30363d]/30">
        &copy; 2026 ATS Resume Analyzer - Production-Grade Rule-Based Implementation
      </footer>
    </div>
  );
};

export default App;

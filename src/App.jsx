import React, { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import { analyzeResume } from './utils/analyzer';

const App = () => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (resumeText, jdText) => {
    setIsLoading(true);
    
    // Simulate a brief processing delay for better UX
    setTimeout(() => {
      try {
        const results = analyzeResume(resumeText, jdText);
        setAnalysisResults(results);
      } catch (err) {
        console.error("Analysis Error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 max-h-[calc(100vh-100px)] overflow-hidden">
        {/* Left Panel: Inputs */}
        <div className="h-full overflow-hidden flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-serif text-white mb-2">Resume <span className="text-accent italic">Assessment</span></h2>
            <p className="text-[#8b949e] text-sm">Optimize your career profile for modern applicant tracking systems using our rule-based scoring engine.</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="h-full overflow-hidden flex flex-col">
          <div className="mb-6 opacity-0 lg:opacity-100 pointer-events-none">
             <h2 className="text-3xl font-serif text-white mb-2 invisible">Report</h2>
          </div>
          <div className="flex-1 overflow-hidden">
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

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import IndustrySelector from './components/IndustrySelector';
import ExportButton from './components/ExportButton';
import SavedVersions from './components/SavedVersions';
import { analyzeResume } from './utils/analyzer';

const App = () => {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [savedVersions, setSavedVersions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ats_saved_versions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

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

  const handleManualAnalyze = async (resume, jd) => {
    setResumeText(resume);
    setJdText(jd);
    setIsLoading(true);
    try {
      const results = await analyzeResume(resume, jd, industry);
      setAnalysisResults(results);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze resume. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVersion = () => {
    if (!analysisResults) return;
    const newVersion = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: `${industry.toUpperCase()} - Score: ${analysisResults.ats_score}`,
      resumeText,
      jdText,
      industry,
      results: analysisResults
    };
    const newVersions = [newVersion, ...savedVersions];
    setSavedVersions(newVersions);
    localStorage.setItem('ats_saved_versions', JSON.stringify(newVersions));
    alert('Version saved successfully!');
  };

  const handleLoadVersion = (version) => {
    setResumeText(version.resumeText || '');
    setJdText(version.jdText || '');
    setIndustry(version.industry || 'tech');
    setAnalysisResults(version.results);
  };

  const handleDeleteVersion = (id) => {
    const newVersions = savedVersions.filter(v => v.id !== id);
    setSavedVersions(newVersions);
    localStorage.setItem('ats_saved_versions', JSON.stringify(newVersions));
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
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest bg-card px-3 py-1.5 rounded-full border border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                AI Powered Analysis
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <IndustrySelector selected={industry} onSelect={setIndustry} />
            <SavedVersions 
              versions={savedVersions} 
              onSave={handleSaveVersion}
              onLoad={handleLoadVersion}
              onDelete={handleDeleteVersion}
            />
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
            <ResultsPanel 
              results={analysisResults} 
              resumeText={resumeText} 
              jdText={jdText} 
            />
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-text-secondary text-[10px] font-mono uppercase tracking-widest border-t border-border opacity-50">
        &copy; 2026 ATS Resume Analyzer - Production-Grade AI-Powered Implementation
      </footer>
    </div>
  );
};

export default App;

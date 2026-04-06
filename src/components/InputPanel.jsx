import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { extractTextFromPDF } from '../utils/textUtils';

const InputPanel = ({ 
  onAnalyze, 
  onAnalyzeDebounced,
  isLoading, 
  externalText = "", 
  onTextChange, 
  externalJd = "", 
  onJdChange 
}) => {
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'
  const [resumeText, setResumeText] = useState(externalText);
  const [jdText, setJdText] = useState(externalJd);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setResumeText(externalText);
  }, [externalText]);

  useEffect(() => {
    setJdText(externalJd);
  }, [externalJd]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setFileName(file.name);
    setError('');
    
    try {
      const text = await extractTextFromPDF(file);
      onTextChange(text);
    } catch (err) {
      console.error(err);
      setError('Failed to extract text from PDF. Try pasting text instead.');
    }
  };

  const clearFile = () => {
    setFileName('');
    onTextChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!resumeText.trim()) {
      setError('Please provide a resume.');
      return;
    }
    if (!jdText.trim()) {
      setError('Please provide a job description.');
      return;
    }
    onAnalyze(resumeText, jdText);
  };

  return (
    <div className="glass-card p-6 space-y-6 flex flex-col transition-colors duration-300">
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setMode('upload')}
          className={`pb-2 px-1 text-sm font-mono uppercase tracking-widest transition-colors ${mode === 'upload' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Upload PDF
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`pb-2 px-1 text-sm font-mono uppercase tracking-widest transition-colors ${mode === 'paste' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Paste Text
        </button>
      </div>

      <div className="flex-1 space-y-6 pr-2">
        {mode === 'upload' ? (
          <div className="space-y-4">
            {!fileName ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type === 'application/pdf') {
                        handleFileChange({ target: { files: [file] } });
                    }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="p-4 bg-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-accent" size={32} />
                </div>
                <p className="text-sm font-medium text-text-primary opacity-80">Click to upload or drag & drop</p>
                <p className="text-xs text-text-secondary mt-1 italic">PDF only (extracted locally)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="p-4 bg-background border border-accent/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-accent" size={20} />
                  <span className="text-sm font-medium truncate max-w-[200px] text-text-primary">{fileName}</span>
                </div>
                <button onClick={clearFile} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">Resume Text</label>
            <textarea
              value={resumeText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full h-48 bg-background border border-border rounded-lg p-4 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">Job Description</label>
          <textarea
            value={jdText}
            onChange={(e) => onJdChange(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-48 bg-background border border-border rounded-lg p-4 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-xs text-center border border-red-500/20 bg-red-500/5 p-2 rounded">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
        ) : (
          "Analyze Resume"
        )}
      </button>
    </div>
  );
};

export default InputPanel;

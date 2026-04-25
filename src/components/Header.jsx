import React, { useState, useEffect } from 'react';
import { Sun, Moon, Settings, Key, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ theme, onToggleTheme }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openrouter_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('openrouter_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 bg-card border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="p-1 rounded-lg">
          <img src="/logo.png" alt="ATS Analyzer Logo" className="w-12 h-12 object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-serif tracking-tight leading-none text-text-primary">ATS <span className="text-accent">Analyzer</span></h1>
          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em] mt-1">Rule-Based Resume Optimization</p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-3">
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 rounded-xl bg-background border border-border text-text-secondary hover:text-accent hover:border-accent transition-all group"
                aria-label="Settings"
            >
                <Settings size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
            <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-background border border-border text-text-secondary hover:text-accent hover:border-accent transition-all relative overflow-hidden group"
                aria-label="Toggle Theme"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={theme}
                        initial={{ y: 20, opacity: 0, rotate: 45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.2 }}
                    >
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>

        {/* Settings Dropdown */}
        {showSettings && (
          <div className="absolute top-full right-0 mt-4 w-80 bg-card border border-border rounded-xl shadow-2xl p-5 z-[100] animate-fade-in">
            <h3 className="text-sm font-mono uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2">
              <Key size={16} className="text-accent" /> API Settings
            </h3>
            <div className="space-y-3">
              <label className="text-xs text-text-secondary">OpenRouter API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={handleSaveKey}
                className="w-full flex items-center justify-center gap-2 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors"
              >
                {saved ? <><Check size={16} /> Saved!</> : 'Save Key'}
              </button>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Your API key is stored locally in your browser and never sent to our servers. Required for LLM analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

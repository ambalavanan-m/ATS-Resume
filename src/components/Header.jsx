import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ theme, onToggleTheme }) => {
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

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
            {/* Theme Toggle */}
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
      </div>
    </header>
  );
};

export default Header;

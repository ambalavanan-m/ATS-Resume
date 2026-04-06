import React from 'react';
import { Target } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 bg-[#0d1117] border-b border-[#30363d] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Target className="text-accent" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-serif tracking-tight leading-none">ATS <span className="text-accent">Analyzer</span></h1>
          <p className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] mt-1">Rule-Based Resume Optimization</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <nav className="flex items-center gap-6 text-sm font-medium text-[#8b949e]">
          <a href="#" className="hover:text-accent transition-colors">Analyzer</a>
          <a href="#" className="hover:text-accent transition-colors">Resources</a>
          <a href="#" className="hover:text-accent transition-colors">About</a>
        </nav>
        <button className="px-4 py-2 bg-white/5 border border-[#30363d] rounded-lg text-sm hover:border-accent transition-all">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;

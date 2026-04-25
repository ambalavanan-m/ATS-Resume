import React, { useState } from 'react';
import { Save, Clock, Trash2, ChevronDown } from 'lucide-react';

const SavedVersions = ({ versions, onSave, onLoad, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <div className="flex gap-2 items-center">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 text-xs font-mono bg-accent/10 text-accent px-3 py-1.5 rounded hover:bg-accent/20 transition-colors"
          title="Save current analysis"
        >
          <Save size={14} />
          Save
        </button>
        
        {versions.length > 0 && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-mono bg-card border border-border text-text-primary px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Clock size={14} />
            History ({versions.length})
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isOpen && versions.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {versions.map((v) => (
              <div key={v.id} className="p-3 border-b border-border hover:bg-background transition-colors group flex justify-between items-center">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onLoad(v);
                    setIsOpen(false);
                  }}
                >
                  <div className="text-sm font-medium text-text-primary truncate">{v.title}</div>
                  <div className="text-[10px] text-text-secondary mt-1 flex items-center gap-2">
                    <span>Score: {v.results?.ats_score || 0}</span>
                    <span>•</span>
                    <span>{new Date(v.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(v.id);
                  }}
                  className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedVersions;

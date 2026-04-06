import React from 'react';
import { INDUSTRIES } from '../utils/analyzer';

const IndustrySelector = ({ selected, onSelect }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-widest text-[#8b949e]">Target Industry</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer text-white"
      >
        {Object.entries(INDUSTRIES).map(([key, value]) => (
          <option key={key} value={key}>
            {value.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default IndustrySelector;

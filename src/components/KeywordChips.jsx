import { motion } from 'framer-motion';

const KeywordChips = ({ matched, missing }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-[#8b949e] uppercase font-mono text-xs tracking-wider mb-2">Matched Keywords ({matched.length})</h4>
        <div className="flex flex-wrap gap-2">
          {matched.map((kw, i) => (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={kw}
              className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded text-xs"
            >
              {kw}
            </motion.span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[#8b949e] uppercase font-mono text-xs tracking-wider mb-2">Missing Keywords ({missing.length})</h4>
        <div className="flex flex-wrap gap-2">
          {missing.map((kw, i) => (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={kw}
              className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-xs"
            >
              {kw}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordChips;

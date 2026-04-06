import { motion } from 'framer-motion';

const ProgressBar = ({ label, score }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-mono uppercase tracking-widest text-[#8b949e]">{label}</span>
        <span className="text-sm font-bold text-accent">{score}%</span>
      </div>
      <div className="w-full h-2 bg-[#30363d] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-accent shadow-[0_0_10px_rgba(0,212,255,0.4)]"
        />
      </div>
    </div>
  );
};

export default ProgressBar;

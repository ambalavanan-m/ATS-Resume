import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScoreRing = ({ score }) => {
  const [offset, setOffset] = useState(251.2); // Full circle
  const strokeDasharray = 251.2;

  useEffect(() => {
    const progress = (100 - score) / 100 * strokeDasharray;
    setOffset(progress);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="64"
          cy="64"
        />
        <motion.circle
          className="text-accent"
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: strokeDasharray }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="64"
          cy="64"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold font-mono">{score}</span>
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">ATS Score</span>
      </div>
    </div>
  );
};

export default ScoreRing;

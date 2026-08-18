import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 700);
          }, 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 6;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090B] text-white select-none overflow-hidden"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Central Bold Stacked Headline */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center px-4"
          >
            <span className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#F8F5EE] leading-none mb-3 font-mono drop-shadow-2xl">
              CHACHA <span className="text-red-500">CAFE</span>
            </span>

            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#D4AF37] font-mono mt-2">
              <span>LET'S TASTE</span>
              <span className="text-red-500">•</span>
              <span className="text-red-400 font-extrabold">{progress}%</span>
            </div>
          </motion.div>

          {/* Progress Bar Line */}
          <div className="w-48 sm:w-64 mt-8 h-1 bg-[#18181B] rounded-full overflow-hidden border border-red-500/30">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-[#D4AF37] to-amber-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


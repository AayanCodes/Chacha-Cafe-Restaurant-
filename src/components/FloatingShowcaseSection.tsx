import React from 'react';
import { motion } from 'motion/react';
import { Utensils, ArrowRight } from 'lucide-react';

interface FloatingShowcaseProps {
  onExploreMenuClick: () => void;
  onReserveClick: () => void;
}

export const FloatingShowcaseSection: React.FC<FloatingShowcaseProps> = ({
  onExploreMenuClick,
  onReserveClick,
}) => {
  return (
    <section className="relative py-28 md:py-36 bg-[#09090B] overflow-hidden border-b border-red-500/20 select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Interactive Food Assets Around Section (As in Video 0:05-0:10) */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none overflow-hidden">
        {/* Floating Item 1: French Fries / Loaded Side */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            rotate: [-6, 6, -6],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-6 sm:left-12 w-28 sm:w-40 md:w-52 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
        >
          <img
            src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=300"
            alt="Peri Peri Fries"
            className="w-full h-auto rounded-3xl object-cover border-2 border-red-500/30 transform -rotate-12 hover:scale-105 transition-transform"
          />
        </motion.div>

        {/* Floating Item 2: Sourdough Pizza Slice */}
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [8, -4, 8],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-16 right-6 sm:right-12 w-32 sm:w-44 md:w-56 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
        >
          <img
            src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=300"
            alt="Pizza Slice"
            className="w-full h-auto rounded-3xl object-cover border-2 border-[#D4AF37]/40 transform rotate-12 hover:scale-105 transition-transform"
          />
        </motion.div>

        {/* Floating Item 3: Sizzling Momos */}
        <motion.div
          animate={{
            y: [-18, 18, -18],
            rotate: [-10, 5, -10],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-12 left-8 sm:left-24 w-28 sm:w-36 md:w-48 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] hidden sm:block"
        >
          <img
            src="https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=300"
            alt="Momos"
            className="w-full h-auto rounded-3xl object-cover border-2 border-amber-500/30 transform -rotate-6"
          />
        </motion.div>

        {/* Floating Item 4: Iced Cold Brew */}
        <motion.div
          animate={{
            y: [15, -15, 15],
            rotate: [6, -8, 6],
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-10 right-8 sm:right-24 w-28 sm:w-36 md:w-48 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] hidden sm:block"
        >
          <img
            src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=300"
            alt="Cold Brew"
            className="w-full h-auto rounded-3xl object-cover border-2 border-emerald-500/30 transform rotate-6"
          />
        </motion.div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Top Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs sm:text-sm font-extrabold uppercase font-mono tracking-[0.3em] text-red-500 mb-3"
        >
          HANDCRAFTED • FLAME-GRAILLED • LOADED
        </motion.p>

        {/* Giant Punchy Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-[#F8F5EE] leading-[0.95] font-mono drop-shadow-2xl"
        >
          TOO GOOD TO<br />
          <span className="text-red-500 drop-shadow-[0_10px_25px_rgba(239,68,68,0.4)]">
            SIT STILL.
          </span>
        </motion.h2>

        {/* Body Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-sm sm:text-lg text-[#CBD5E1] max-w-xl mx-auto leading-relaxed font-sans"
        >
          Artisanal coffees, woodfired pizzas, gourmet burgers, sizzling momos — stacked fresh, prepared golden, and served with relentless passion. This is food that refuses to stay safe.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onExploreMenuClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-red-400/30 pointer-events-auto cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>EXPLORE THE MENU</span>
          </button>

          <button
            onClick={onReserveClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent hover:bg-red-600 hover:text-white text-[#F8F5EE] font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 border-2 border-white/30 hover:border-red-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
          >
            <span>RESERVE TABLE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

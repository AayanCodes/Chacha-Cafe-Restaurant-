import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Calendar, Sparkles } from 'lucide-react';
import { MarqueeTicker } from './MarqueeTicker';

interface HeroProps {
  onReserveClick: () => void;
  onExploreMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReserveClick, onExploreMenuClick }) => {
  return (
    <section id="home" className="scroll-mt-16 md:scroll-mt-20 relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#09090B] pt-24">
      {/* Background Video / Image Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover object-center opacity-30 filter saturate-150 brightness-75 scale-105"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-coffee-pouring-from-a-coffee-maker-42864-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Edgy Overlays & Glows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/70 to-[#09090B]/80" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Floating Animated Food/Culinary Cards in Hero Space */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none hidden lg:block overflow-hidden">
        {/* Floating Dish 1 - Pizza */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-8 w-44 p-2 rounded-2xl bg-[#121215]/95 border border-red-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-3"
        >
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200"
            alt="Pizza"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <p className="text-[11px] font-extrabold text-[#F8F5EE] leading-tight">Woodfired Pizza</p>
            <p className="text-[9px] text-red-400 font-bold uppercase mt-0.5">Sourdough Crust</p>
          </div>
        </motion.div>

        {/* Floating Dish 2 - Artisan Coffee */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-44 right-10 w-48 p-2 rounded-2xl bg-[#121215]/95 border border-red-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-3"
        >
          <img
            src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200"
            alt="Coffee"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <p className="text-[11px] font-extrabold text-[#F8F5EE] leading-tight">Gold Dust Brew</p>
            <p className="text-[9px] text-amber-400 font-bold uppercase mt-0.5">100% Arabica</p>
          </div>
        </motion.div>

        {/* Floating Dish 3 - Gourmet Burger */}
        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-28 left-16 w-52 p-2.5 rounded-2xl bg-[#121215]/95 border border-red-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-3"
        >
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200"
            alt="Burger"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <p className="text-[11px] font-extrabold text-[#F8F5EE] leading-tight">Botanical Burger</p>
            <p className="text-[9px] text-red-500 font-extrabold uppercase mt-0.5">🔥 Flame Grilled</p>
          </div>
        </motion.div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 text-center my-auto py-12 flex flex-col items-center">
        
        {/* Top Right EST Badge (Video element replica) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 right-4 sm:right-10 flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white border-2 border-[#D4AF37]/50 shadow-2xl shadow-red-600/30 font-mono text-[10px] sm:text-xs font-black uppercase leading-tight tracking-wider hover:scale-110 transition-transform pointer-events-auto cursor-pointer"
        >
          <span>EST.</span>
          <span className="text-sm sm:text-base font-extrabold">2021</span>
          <span className="text-[8px] text-amber-200">KIRATPUR</span>
        </motion.div>

        {/* Eyebrow Tags */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 sm:gap-3 text-red-500 text-xs sm:text-sm font-extrabold font-mono uppercase tracking-[0.25em] mb-4"
        >
          <span>ORGANIC</span>
          <span>•</span>
          <span>FLAME-GRAILLED</span>
          <span>•</span>
          <span>HANDCRAFTED</span>
        </motion.div>

        {/* Giant Edgy Typography Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-[#F8F5EE] leading-[0.95] font-mono drop-shadow-2xl"
        >
          BIGGER. BOLDER.<br />
          <span className="text-red-500 drop-shadow-[0_10px_20px_rgba(239,68,68,0.3)]">
            BETTER CUISINE.
          </span>
        </motion.h1>

        {/* Sub-headline Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-sm sm:text-lg text-[#CBD5E1] max-w-2xl font-sans leading-relaxed text-center"
        >
          100% organic, botanical-infused recipes, handcrafted daily with passion. 
          This is fine dining & cafe culture that refuses to play it safe.
        </motion.p>

        {/* Red & Gold Pill Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onExploreMenuClick}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group border border-red-400/30"
          >
            <Utensils className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>GET THE MENU</span>
          </button>

          <button
            onClick={onReserveClick}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-transparent hover:bg-red-600 hover:text-white text-[#F8F5EE] font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 border-2 border-white/30 hover:border-red-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>RESERVE A TABLE</span>
          </button>
        </motion.div>

        {/* Floating Sparkle Badge */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold text-[#D4AF37] font-mono uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>LOCATION: MANADWAR ROAD, KIRATPUR, UP</span>
        </motion.div>

      </div>

      {/* Marquee Ticker at bottom of Hero */}
      <div className="relative z-20">
        <MarqueeTicker />
      </div>
    </section>
  );
};


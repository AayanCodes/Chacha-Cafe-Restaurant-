import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, Instagram, ArrowUp, QrCode } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/cafeData';

export const FloatingActions: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Table Order Shortcut */}
      <a
        href="/table/01"
        className="p-3.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 relative group border border-amber-400/50"
        title="Dine-In QR Table Ordering"
        aria-label="Dine-In QR Table Ordering"
      >
        <QrCode className="w-5 h-5 text-white" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#09090B] text-amber-400 text-[11px] font-mono font-bold px-3 py-1 rounded-lg border border-amber-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl uppercase">
          Table QR Ordering
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-500 hover:scale-110 transition-all duration-300 relative group border border-emerald-400/50"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#09090B] text-red-500 text-[11px] font-mono font-bold px-3 py-1 rounded-lg border border-red-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl uppercase">
          WhatsApp Us
        </span>
      </a>

      {/* Phone Call Button */}
      <a
        href={`tel:${RESTAURANT_INFO.phone}`}
        className="p-3.5 rounded-full bg-[#121215] text-red-500 border border-red-500/60 shadow-2xl hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300 relative group"
        title="Call Cafe"
        aria-label="Call Cafe"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#09090B] text-red-500 text-[11px] font-mono font-bold px-3 py-1 rounded-lg border border-red-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl uppercase">
          Call Cafe
        </span>
      </a>

      {/* Instagram Button */}
      <a
        href="https://www.instagram.com/aayanwebhit/?utm_source=chatgpt.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 relative group"
        title="Follow Instagram"
        aria-label="Follow Instagram"
      >
        <Instagram className="w-5 h-5" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#09090B] text-red-500 text-[11px] font-mono font-bold px-3 py-1 rounded-lg border border-red-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl uppercase">
          Instagram
        </span>
      </a>

      {/* Back To Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="p-3.5 rounded-full bg-red-600 text-white font-bold shadow-2xl hover:bg-red-500 hover:scale-110 transition-all duration-300 border border-red-400/30"
            title="Back to Top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

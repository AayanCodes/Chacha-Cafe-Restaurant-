import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Menu,
  X,
  Phone,
  Calendar,
  Search,
  QrCode,
  Home,
  Info,
  UtensilsCrossed,
  Sparkles,
  Image as ImageIcon,
  MessageSquareHeart,
  MapPin,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/cafeData';

interface NavbarProps {
  onReserveClick: () => void;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReserveClick, onSearchClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'about', 'menu', 'specials', 'gallery', 'reviews', 'reservation', 'location'];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home', icon: Home },
    { name: 'About', href: '#about', id: 'about', icon: Info },
    { name: 'Menu', href: '#menu', id: 'menu', icon: UtensilsCrossed },
    { name: 'Special Offers', href: '#specials', id: 'specials', icon: Sparkles },
    { name: 'Gallery', href: '#gallery', id: 'gallery', icon: ImageIcon },
    { name: 'Reviews', href: '#reviews', id: 'reviews', icon: MessageSquareHeart },
    { name: 'Reservation', href: '#reservation', id: 'reservation', icon: Calendar },
    { name: 'Location', href: '#location', id: 'location', icon: MapPin },
  ];

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');

    // Slight delay to allow mobile drawer animation to collapse without distorting scroll offset
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 72;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
      }
    }, 80);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-[#09090B]/95 backdrop-blur-xl border-b border-red-500/20 py-2.5 sm:py-3 shadow-2xl shadow-black/90'
          : 'bg-gradient-to-b from-[#09090B]/90 via-[#09090B]/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#home');
          }}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-600 border border-red-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-[#F8F5EE] group-hover:text-red-500 transition-colors">
              CHACHA <span className="text-red-500">CAFE</span>
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#D4AF37] font-mono -mt-1 font-bold">
              CAFE & FINE DINING
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-[#18181B]/80 border border-red-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium tracking-wide transition-colors duration-300 rounded-full cursor-pointer ${
                  isActive ? 'text-red-500 font-bold' : 'text-[#E2E8F0]/80 hover:text-[#F8F5EE]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-red-600/15 border border-red-500/30 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <a
            href="/table/01"
            className="px-3.5 py-2 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-950 transition-all transform hover:scale-105 cursor-pointer"
            title="Dine-In QR Table Ordering"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>TABLE QR</span>
          </a>

          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Search menu"
            className="p-2.5 rounded-full bg-[#18181B] border border-red-500/30 text-[#E2E8F0] hover:text-red-500 hover:border-red-500 transition-all duration-300 cursor-pointer"
            title="Search Menu"
          >
            <Search className="w-4 h-4" />
          </button>

          <a
            href={`tel:${RESTAURANT_INFO.phone}`}
            className="p-2.5 rounded-full bg-[#18181B] border border-red-500/30 text-[#E2E8F0] hover:text-red-500 hover:border-red-500 transition-all duration-300 cursor-pointer"
            title="Call Cafe"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onReserveClick}
            className="bg-red-600 hover:bg-red-500 text-white font-black font-mono text-xs px-4 py-2 rounded-full uppercase tracking-widest transition-all duration-300 shadow-lg shadow-red-600/30 border border-red-400/40 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>RESERVE</span>
          </button>
        </div>

        {/* Mobile Header Controls (Search, Table QR, Hamburger) */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <a
            href="/table/01"
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
            title="QR Order"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>TABLE</span>
          </a>

          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Search menu"
            className="p-2 rounded-xl bg-[#18181B] border border-red-500/30 text-[#E2E8F0] active:scale-95 transition-transform cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 sm:p-2.5 rounded-xl bg-[#18181B] border border-red-500/40 text-[#F8F5EE] active:scale-95 transition-transform cursor-pointer focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[60px] bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Slide Down Menu */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative z-50 lg:hidden bg-[#09090B]/98 backdrop-blur-2xl border-b border-red-500/30 max-h-[calc(100vh-70px)] overflow-y-auto overscroll-contain shadow-2xl"
            >
              <div className="px-4 py-5 sm:px-6 flex flex-col gap-1">
                {/* Navigation Links Grid / List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = activeSection === link.id;
                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(link.href);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left font-mono text-sm tracking-wide transition-all cursor-pointer ${
                          isActive
                            ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/40 shadow-sm'
                            : 'text-[#E2E8F0]/90 hover:bg-white/5 active:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-neutral-400'}`} />
                        <span>{link.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons inside Mobile Menu */}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                  <a
                    href="/table/01"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold py-3 rounded-xl tracking-wider text-xs sm:text-sm shadow-lg shadow-red-950 font-mono active:scale-98 transition-transform cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    DINE-IN QR TABLE ORDER (TABLE 01)
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onReserveClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl tracking-wider text-xs sm:text-sm shadow-lg shadow-red-600/30 active:scale-98 transition-transform cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    RESERVE A TABLE
                  </button>

                  <div className="flex items-center justify-around pt-2 text-xs font-mono text-[#D4AF37]">
                    <a
                      href={`tel:${RESTAURANT_INFO.phone}`}
                      className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Cafe
                    </a>
                    <span className="text-white/20">|</span>
                    <a
                      href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

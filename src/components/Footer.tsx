import React from 'react';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/cafeData';

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#09090B] text-[#F8F5EE] pt-20 pb-10 border-t border-red-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-red-500/15">
          
          {/* Col 1: About */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#121215] border border-red-500 flex items-center justify-center text-red-500">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xl font-black tracking-wider text-[#F8F5EE]">
                  CHACHA CAFE
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-red-500 uppercase font-mono font-bold">
                  CAFE & FINE DINING
                </span>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E1]/80 leading-relaxed font-sans mb-6">
              {RESTAURANT_INFO.shortDesc}
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <span className="text-xs font-mono font-extrabold uppercase text-red-500">Join VIP Club For Offers</span>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-[#18181B] border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 flex-1 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-red-500 transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-medium font-mono">✨ Subscribed! Welcome to VIP Sol Club.</p>
              )}
            </form>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-500 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-[#CBD5E1]/80 font-sans">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About', href: '#about' },
                { name: 'Menu', href: '#menu' },
                { name: 'Special Offers', href: '#specials' },
                { name: 'Gallery', href: '#gallery' },
                { name: 'Reviews', href: '#reviews' },
                { name: 'Reservation', href: '#reservation' },
                { name: 'Location', href: '#location' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector(item.href);
                      if (target) {
                        const headerOffset = 72;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: Math.max(0, offsetPosition), behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-red-500" /> {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Opening Hours */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-500 mb-4">Opening Hours</h4>
            <div className="p-4 rounded-2xl bg-[#121215] border border-red-500/20 text-xs space-y-3 font-sans">
              <div className="flex items-center gap-2 text-[#F8F5EE]">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="font-bold">Monday – Sunday</span>
              </div>
              <p className="text-red-400 font-bold font-mono pl-6">8:00 AM – 11:00 PM</p>
              <p className="text-[11px] text-[#CBD5E1]/60 pt-2 border-t border-red-500/10">
                Fresh breakfast starting 8 AM daily. Dinner kitchen closes at 10:30 PM.
              </p>
            </div>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-500 mb-4">Connect With Us</h4>
            <ul className="space-y-3 text-xs text-[#CBD5E1] font-sans mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Manadwar Road, Kiratpur, Taqarubpur Israj Kheri, Uttar Pradesh 246731</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-red-500 font-mono">
                  {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-red-500 font-mono">
                  {RESTAURANT_INFO.email}
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/aayanwebhit/?utm_source=chatgpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#121215] border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#121215] border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#121215] border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#CBD5E1]/60 font-sans gap-4">
          <p>© {new Date().getFullYear()} Chacha Cafe. All Rights Reserved.</p>
          <div className="flex items-center gap-6 text-[11px] font-mono">
            <a href="#home" className="hover:text-red-500">Privacy Policy</a>
            <a href="#home" className="hover:text-red-500">Terms of Service</a>
            <a href="#home" className="hover:text-red-500">FSSAI Certified</a>
            <a href="/admin/login" className="text-red-500 hover:text-red-400 font-bold uppercase flex items-center gap-1 border-l border-red-500/20 pl-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Owner CMS Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

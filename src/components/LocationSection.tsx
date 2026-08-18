import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare, Navigation, Clock, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/cafeData';
import { dbService } from '../services/dbService';
import { RestaurantSettings } from '../types/admin';

export const LocationSection: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    dbService
      .getSettings()
      .then(setSettings)
      .catch(() => {
        // Fallback to static info if error
      });
  }, []);

  const phone = settings?.phone || RESTAURANT_INFO.phone;
  const whatsapp = settings?.whatsapp || RESTAURANT_INFO.whatsapp;
  const address = settings?.address || RESTAURANT_INFO.address;
  const openingHours = settings?.opening_hours || RESTAURANT_INFO.openingHours;
  const mapEmbedUrl = settings?.map_embed_url || RESTAURANT_INFO.mapEmbedUrl;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  return (
    <section id="location" className="scroll-mt-16 md:scroll-mt-20 py-24 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
            <span>04. LOCATION</span>
            <span>•</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] font-mono leading-[0.95]">
            PULL UP & <span className="text-red-500">VISIT US.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] font-sans">
            Conveniently located on Manadwar Road, Kiratpur, Uttar Pradesh 246731.
          </p>
        </div>

        {/* Two-Column Grid: Left Details & Right Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Address & Hours Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 bg-[#121215] border-2 border-red-500/40 rounded-3xl p-8 shadow-2xl flex flex-col justify-between backdrop-blur-xl"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-red-600/20 text-red-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-mono font-bold text-[#F8F5EE] uppercase">
                    {settings?.name || RESTAURANT_INFO.name}
                  </h3>
                  <p className="text-xs text-red-500 font-mono font-bold">Kiratpur, Uttar Pradesh</p>
                </div>
              </div>

              {/* Address details */}
              <div className="p-4 rounded-2xl bg-[#18181B] border border-red-500/20 mb-6">
                <p className="text-xs font-mono font-extrabold uppercase tracking-wider text-red-500 mb-1">Address</p>
                <p className="text-sm text-[#F8F5EE] leading-relaxed font-sans whitespace-pre-line">
                  {address}
                </p>
              </div>

              {/* Opening Hours */}
              <div className="p-4 rounded-2xl bg-[#18181B] border border-red-500/20 mb-6 flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-mono font-extrabold uppercase tracking-wider text-red-500">Opening Hours</p>
                  <p className="text-sm font-bold text-[#F8F5EE] mt-0.5 whitespace-pre-line">
                    {openingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-red-500/20">
              <a
                href={`tel:${phone}`}
                className="py-3 px-2 rounded-xl bg-[#18181B] border border-red-500/40 text-red-500 hover:bg-red-600 hover:text-white transition-all text-xs font-mono font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <Phone className="w-4 h-4" /> Call
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-mono font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-transform text-xs font-mono font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 shadow-lg"
              >
                <Navigation className="w-4 h-4" /> Directions
              </a>
            </div>
          </motion.div>

          {/* Interactive Live Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-[#121215] border-2 border-red-500/40 rounded-3xl overflow-hidden shadow-2xl min-h-[420px] relative"
          >
            <iframe
              title="Chacha Cafe Google Maps Live Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '420px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 right-4 bg-[#09090B]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/40 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              📍 Manadwar Road, Kiratpur
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

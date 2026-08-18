import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const stats = [
    { label: 'HAPPY GUESTS', value: '10K+' },
    { label: 'HANDCRAFTED DISHES', value: '150+' },
    { label: 'GOOGLE RATING', value: '4.9★' },
    { label: 'SERVED WITH PASSION', value: '5 YRS' },
  ];

  const highlights = [
    'Organic Botanical Sourdough & Woodfired Pizza',
    'Single-Origin Arabica Gold Dust Coffees',
    'Authentic Himalayan & North Indian Gravies',
    'Serene Indoor Botanical Garden Ambience',
    '100% Fresh Farm-Sourced Ingredients',
    'Family-Friendly Fine Dining Sanctuary'
  ];

  return (
    <section id="about" className="scroll-mt-16 md:scroll-mt-20 py-24 md:py-32 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Bold Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Eyebrow Label */}
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
              <span>01. OUR STORY</span>
              <span>•</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            {/* Giant Bold Headline */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] leading-[0.95] font-mono">
              BORN FROM A PASSION FOR <span className="text-red-500">NATURE.</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-sans max-w-2xl">
              We started with a vision on Manadwar Road, Kiratpur: zero compromises, absolute freshness, and a refusal to serve anything average. Half a decade later, we're still flame-grilling burgers, baking woodfired pizzas, and crafting creamy cold coffees and fresh daily cakes to order — no shortcuts, no excuses.
            </p>

            {/* Highlights Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#F8F5EE]/90 font-bold">{item}</span>
                </div>
              ))}
            </div>

            {/* 4-Box Stats Grid (Replicating video bottom stats) */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-red-500/20">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#121215] border border-red-500/30 text-center">
                  <p className="text-2xl sm:text-3xl font-black font-mono text-red-500">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1]/80 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Sleek Product Card Showcase (Replicating video right image) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Glowing Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-red-500/40 shadow-[0_25px_60px_rgba(239,68,68,0.2)] group bg-[#121215]">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000"
                  alt="Chacha Signature Gourmet Burger"
                  className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />

                {/* Card Overlay Text */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-mono font-extrabold uppercase tracking-widest">
                    CHEF'S SIGNATURE
                  </span>
                  <h3 className="text-2xl font-black font-mono text-[#F8F5EE] uppercase mt-2">
                    SMOKED BOTANICAL BURGER
                  </h3>
                  <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
                    Handcrafted patty, organic aged cheddar, woodfired smoked sauce & microgreens.
                  </p>
                </div>
              </div>

              {/* Floating Award Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 bg-[#121215] border border-[#D4AF37] p-3.5 rounded-2xl shadow-2xl flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-red-600 text-white">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-[#F8F5EE]">BEST IN KIRATPUR</p>
                  <p className="text-[10px] text-[#D4AF37] font-extrabold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#D4AF37]" /> 4.9 GOOGLE RATED
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


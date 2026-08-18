import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { GalleryItemCMS } from '../types/admin';
import { dbService } from '../services/dbService';

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dbService.getPublicGalleryImages();
      setItems(data);
    } catch (err: any) {
      // Fallback gracefully without crashing
      setError(err?.message || 'Unable to load gallery images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryData();
  }, []);

  // Compute available categories dynamically
  const dynamicCategories = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="scroll-mt-16 md:scroll-mt-20 py-24 md:py-32 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
            <span>02. THE VIBE</span>
            <span>•</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] font-mono leading-[0.95]">
            COME FOR <span className="text-red-500">THE VIBE.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] font-sans">
            A glimpse into the serene architecture, culinary moments, and high-energy atmosphere of Chacha Cafe on Manadwar Road.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold font-mono uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-20 text-center text-[#CBD5E1]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
            <p className="font-mono text-xs uppercase">Loading Photo Highlights...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-3xl bg-red-950/80 border-2 border-red-500 text-red-200 mb-8 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <p className="text-xs">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#121215] border border-red-500/30 rounded-3xl p-8">
            <p className="font-mono text-base font-bold text-[#F8F5EE] uppercase">No Photos Found In This Category</p>
            <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
              Add photos via the Admin CMS Gallery tab to showcase dining ambience and dishes.
            </p>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative h-80 rounded-3xl overflow-hidden border border-red-500/30 shadow-xl cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-left">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-[#09090B]/80 backdrop-blur-md border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {item.category}
                      </span>

                      <div className="p-2 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-mono font-bold text-[#F8F5EE] uppercase">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-[#CBD5E1] mt-1 line-clamp-2 font-sans">{item.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/95 backdrop-blur-md">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-[#121215] border border-red-500 text-[#F8F5EE] hover:text-red-500 transition-colors z-10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#121215] border border-red-500 text-[#F8F5EE] hover:text-red-500 transition-colors z-10 hidden sm:block"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#121215] border border-red-500 text-[#F8F5EE] hover:text-red-500 transition-colors z-10 hidden sm:block"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-[#121215] border border-red-500/50 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={activeLightboxItem.image_url}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[70vh] object-contain bg-[#09090B]"
              />
              <div className="p-6 bg-[#121215] border-t border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-red-500 uppercase">
                    {activeLightboxItem.category}
                  </span>
                  <h3 className="text-xl font-mono font-bold text-[#F8F5EE] uppercase mt-0.5">
                    {activeLightboxItem.title}
                  </h3>
                  {activeLightboxItem.description && (
                    <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
                      {activeLightboxItem.description}
                    </p>
                  )}
                </div>
                <div className="text-xs font-mono text-[#CBD5E1]/70 whitespace-nowrap">
                  {lightboxIndex! + 1} of {filteredItems.length}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

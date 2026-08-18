import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Clock, Flame, Tag, Leaf, Calendar, Check } from 'lucide-react';
import { MenuItem } from '../types';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onReserveClick: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose, onReserveClick }) => {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-[#121215] border border-red-500/40 rounded-3xl overflow-hidden shadow-2xl text-[#F8F5EE] my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#09090B]/80 border border-red-500/40 text-[#E2E8F0] hover:text-red-500 hover:scale-110 transition-all duration-300"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Image Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/40 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  item.isVeg ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/50' : 'bg-red-950/90 text-red-400 border border-red-500/50'
                }`}
              >
                {item.isVeg ? '🌱 Pure Veg' : '🍖 Non-Veg'}
              </span>

              {item.isChefSpecial && (
                <span className="px-3 py-1 rounded-full bg-red-600 text-white font-mono font-extrabold text-xs tracking-wider uppercase shadow-lg">
                  Chef's Choice
                </span>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/20 pb-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-500">
                  Category: {item.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-mono font-bold text-[#F8F5EE] mt-1 uppercase">
                  {item.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] font-mono">
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-sm line-through text-[#CBD5E1]/50 ml-2">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="flex items-center gap-6 my-4 text-xs sm:text-sm text-[#CBD5E1]">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{item.rating}</span>
                <span className="text-[#CBD5E1]/60 font-normal">({item.reviewsCount} reviews)</span>
              </div>

              {item.prepTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>{item.prepTime}</span>
                </div>
              )}

              {item.calories && (
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{item.calories}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#CBD5E1] leading-relaxed font-sans mb-6">
              {item.description}
            </p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Tag className="w-4 h-4 text-red-500" />
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#18181B] border border-red-500/20 text-[11px] text-red-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-red-500/20">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-full sm:w-auto px-5 py-3 rounded-xl border transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                  isBookmarked
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-[#18181B] border-red-500/30 text-[#E2E8F0] hover:border-red-500'
                }`}
              >
                <Check className={`w-4 h-4 ${isBookmarked ? 'opacity-100' : 'opacity-40'}`} />
                {isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onReserveClick();
                }}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-red-600/30 hover:scale-102 transition-transform flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Reserve Table to Taste This
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

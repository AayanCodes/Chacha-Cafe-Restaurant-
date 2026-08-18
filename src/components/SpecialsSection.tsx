import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, Star, Gift, Tag, Clock, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { MenuItemCMS, SpecialOffer } from '../types/admin';
import { dbService } from '../services/dbService';

interface SpecialsSectionProps {
  onSelectDish: (item: MenuItem) => void;
  onReserveClick: () => void;
}

export const SpecialsSection: React.FC<SpecialsSectionProps> = ({ onSelectDish, onReserveClick }) => {
  const [activeTab, setActiveTab] = useState<'CHEFS' | 'POPULAR' | 'TODAYS' | 'OFFERS'>('CHEFS');
  const [menuItems, setMenuItems] = useState<MenuItemCMS[]>([]);
  const [dynamicOffers, setDynamicOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [items, offers] = await Promise.all([
        dbService.getPublicMenuItems(),
        dbService.getPublicSpecialOffers(),
      ]);
      setMenuItems(items);
      setDynamicOffers(offers);
    } catch (err: any) {
      // Fallback gracefully without crashing
      setError(err?.message || 'Unable to load specials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialsData();
  }, []);

  const mapToMenuItem = (dish: MenuItemCMS): MenuItem => ({
    id: dish.id,
    name: dish.name,
    category: dish.category_name as any,
    price: dish.price,
    originalPrice: dish.original_price,
    rating: dish.rating || 4.8,
    reviewsCount: dish.reviews_count || 50,
    description: dish.description || '',
    image: dish.image_url,
    isVeg: dish.is_veg,
    isChefSpecial: dish.is_chef_special,
    isPopular: dish.is_popular,
    isTodaysSpecial: dish.is_todays_special,
    isWeekendOffer: dish.is_weekend_offer,
    prepTime: dish.prep_time || '15 mins',
    tags: dish.tags || [],
  });

  // Filter items by flag, with smart fallback to top items if no flag is set yet
  const chefsItems = menuItems.filter((i) => i.is_chef_special);
  const displayChefs = chefsItems.length > 0 ? chefsItems : menuItems.slice(0, 3);

  const popularItems = menuItems.filter((i) => i.is_popular);
  const displayPopular = popularItems.length > 0 ? popularItems : menuItems.slice(3, 6);

  const todaysItems = menuItems.filter((i) => i.is_todays_special);
  const displayTodays = todaysItems.length > 0 ? todaysItems : menuItems.slice(6, 9);

  const currentTabItems =
    activeTab === 'CHEFS'
      ? displayChefs
      : activeTab === 'POPULAR'
      ? displayPopular
      : displayTodays;

  return (
    <section id="specials" className="scroll-mt-16 md:scroll-mt-20 py-24 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>CURATED CULINARY HIGHLIGHTS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] font-mono leading-[0.95]">
            SPECIAL <span className="text-red-500">CREATIONS.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] font-sans">
            Handpicked signature creations, viral favorites, and exclusive weekend dining privileges on Manadwar Road.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab('CHEFS')}
            className={`px-6 py-3 rounded-full text-xs font-extrabold font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
              activeTab === 'CHEFS'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Chef's Recommendation
          </button>

          <button
            onClick={() => setActiveTab('POPULAR')}
            className={`px-6 py-3 rounded-full text-xs font-extrabold font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
              activeTab === 'POPULAR'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" /> Popular Dishes
          </button>

          <button
            onClick={() => setActiveTab('TODAYS')}
            className={`px-6 py-3 rounded-full text-xs font-extrabold font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
              activeTab === 'TODAYS'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" /> Today's Special
          </button>

          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`px-6 py-3 rounded-full text-xs font-extrabold font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
              activeTab === 'OFFERS'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500'
            }`}
          >
            <Gift className="w-4 h-4 text-pink-400" /> Weekend Offers ({dynamicOffers.length})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 text-center text-[#CBD5E1]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
            <p className="font-mono text-xs uppercase">Loading Curated Specials...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-3xl bg-red-950/80 border-2 border-red-500 text-red-200 mb-8 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <p className="text-xs">{error}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab !== 'OFFERS' ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentTabItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectDish(mapToMenuItem(item))}
                    className="group bg-[#121215] border border-red-500/30 rounded-3xl overflow-hidden hover:border-red-500 transition-all duration-500 shadow-xl hover:shadow-red-600/20 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-60 w-full overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-600 text-white font-mono font-extrabold text-[10px] tracking-wider uppercase shadow-lg">
                        {activeTab === 'CHEFS' ? 'Chef Signature' : activeTab === 'POPULAR' ? 'Bestseller' : 'Daily Special'}
                      </div>

                      <div className="absolute bottom-4 right-4 text-2xl font-extrabold text-[#D4AF37] font-mono bg-[#09090B]/90 px-4 py-1.5 rounded-2xl border border-red-500">
                        ₹{item.price}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-red-500 font-mono">{item.category_name}</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{item.rating || 4.8}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-mono font-bold text-[#F8F5EE] group-hover:text-red-500 transition-colors uppercase">
                        {item.name}
                      </h3>

                      <p className="mt-3 text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      <div className="mt-6 pt-4 border-t border-red-500/20 flex items-center justify-between text-xs font-bold text-red-500 group-hover:translate-x-1 transition-transform font-mono">
                        <span>VIEW GOURMET DETAILS</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="OFFERS"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {dynamicOffers.length > 0 ? (
                  dynamicOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-[#121215] border-2 border-red-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row items-center"
                    >
                      <div className="w-full sm:w-1/2 h-64 sm:h-full relative overflow-hidden">
                        <img
                          src={offer.image_url}
                          alt={offer.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121215] hidden sm:block" />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white font-mono font-extrabold text-[10px] uppercase rounded-full shadow-lg">
                          {offer.discount_percentage}% OFF
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-3 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-widest font-mono">
                              Weekend Privilege
                            </span>
                          </div>
                          <h3 className="text-xl font-mono font-bold text-[#F8F5EE] uppercase">{offer.title}</h3>
                          <p className="mt-2 text-xs text-[#CBD5E1] leading-relaxed font-sans">{offer.description}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-red-500/20">
                          <div className="flex items-center justify-between text-xs mb-3 font-mono">
                            {offer.original_price && offer.original_price > offer.offer_price && (
                              <div>
                                <span className="line-through text-[#CBD5E1]/60 mr-2">₹{offer.original_price}</span>
                                <span className="text-lg font-bold text-[#D4AF37]">₹{offer.offer_price}</span>
                              </div>
                            )}
                            {offer.promo_code && (
                              <span className="text-red-500 font-semibold flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" /> Promo: {offer.promo_code}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={onReserveClick}
                            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-102 transition-transform"
                          >
                            <Calendar className="w-4 h-4" /> Claim via Table Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-[#121215] border border-red-500/30 rounded-3xl p-8">
                    <Gift className="w-12 h-12 text-red-500/50 mx-auto mb-3" />
                    <p className="font-mono text-base font-bold text-[#F8F5EE] uppercase">No Weekend Offers Scheduled Today</p>
                    <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
                      Check back this Saturday & Sunday for exclusive discounts, or explore our full gourmet menu above.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Sparkles, Clock, Eye, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import { MenuItemCMS, CategoryCMS } from '../types/admin';
import { dbService } from '../services/dbService';

interface MenuSectionProps {
  onSelectDish: (item: MenuItem) => void;
  searchQueryProp?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectDish, searchQueryProp = '' }) => {
  const [items, setItems] = useState<MenuItemCMS[]>([]);
  const [categories, setCategories] = useState<CategoryCMS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState(searchQueryProp);
  const [vegFilter, setVegFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'>('RECOMMENDED');

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedItems, fetchedCategories] = await Promise.all([
        dbService.getPublicMenuItems(),
        dbService.getPublicCategories(),
      ]);
      setItems(fetchedItems);
      setCategories(fetchedCategories);
    } catch (err: any) {
      // Fallback gracefully without unhandled crashes
      setError(err?.message || 'Unable to fetch menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  // Update internal search state if prop changes
  useEffect(() => {
    if (searchQueryProp) {
      setSearchTerm(searchQueryProp);
    }
  }, [searchQueryProp]);

  // Convert MenuItemCMS to MenuItem interface for modals
  const mapToMenuItem = (dish: MenuItemCMS): MenuItem => ({
    id: dish.id,
    name: dish.name,
    category: dish.category_name as MenuCategory,
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

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category match
        if (selectedCategory !== 'ALL' && item.category_name !== selectedCategory) {
          return false;
        }
        // Search match
        if (
          searchTerm &&
          !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        // Veg / Non-Veg match
        if (vegFilter === 'VEG' && !item.is_veg) return false;
        if (vegFilter === 'NON_VEG' && item.is_veg) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'PRICE_HIGH') return b.price - a.price;
        if (sortBy === 'RATING') return (b.rating || 4.8) - (a.rating || 4.8);
        return (b.reviews_count || 0) - (a.reviews_count || 0);
      });
  }, [items, selectedCategory, searchTerm, vegFilter, sortBy]);

  return (
    <section id="menu" className="scroll-mt-16 md:scroll-mt-20 py-24 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ARTISAN GOURMET SELECTIONS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] font-mono leading-[0.95]">
            OUR EXQUISITE <span className="text-red-500">MENU.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] font-sans">
            Crafted with organic ingredients, mountain herbs, and culinary passion on Manadwar Road.
          </p>
        </div>

        {/* Controls Bar: Search, Dietary Toggle, Sorting */}
        <div className="mb-8 p-4 rounded-2xl bg-[#121215] border border-red-500/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes, shakes, pizzas..."
              className="w-full bg-[#18181B] border border-red-500/30 rounded-xl pl-10 pr-12 py-2.5 text-xs sm:text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/50 focus:outline-none focus:border-red-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3">
            {/* Veg / Non-Veg Toggle */}
            <div className="inline-flex rounded-xl bg-[#18181B] p-1 border border-red-500/20 text-xs">
              <button
                onClick={() => setVegFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-extrabold transition-colors ${
                  vegFilter === 'ALL' ? 'bg-red-600 text-white' : 'text-[#CBD5E1] hover:text-[#F8F5EE]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegFilter('VEG')}
                className={`px-3 py-1.5 rounded-lg font-extrabold transition-colors flex items-center gap-1 ${
                  vegFilter === 'VEG' ? 'bg-emerald-600 text-white' : 'text-[#CBD5E1] hover:text-[#F8F5EE]'
                }`}
              >
                🌱 Veg Only
              </button>
              <button
                onClick={() => setVegFilter('NON_VEG')}
                className={`px-3 py-1.5 rounded-lg font-extrabold transition-colors flex items-center gap-1 ${
                  vegFilter === 'NON_VEG' ? 'bg-red-600 text-white' : 'text-[#CBD5E1] hover:text-[#F8F5EE]'
                }`}
              >
                🍖 Non-Veg
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#18181B] border border-red-500/30 rounded-xl px-3 py-2 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-bold"
              >
                <option value="RECOMMENDED">Popularity</option>
                <option value="RATING">Highest Rated</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="mb-10 overflow-x-auto pb-4 scrollbar-none flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-300 border ${
              selectedCategory === 'ALL'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500 hover:text-[#F8F5EE]'
            }`}
          >
            🌟 All Categories ({items.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = items.filter((i) => i.category_name === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                    : 'bg-[#121215] text-[#CBD5E1] border-red-500/20 hover:border-red-500 hover:text-[#F8F5EE]'
                }`}
              >
                {cat.name} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-3xl bg-red-950/80 border-2 border-red-500 text-red-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <p className="font-mono font-bold uppercase text-sm">Database Connection Notice</p>
                <p className="text-xs text-red-300/90 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={loadMenuData}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 shrink-0 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#CBD5E1]">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-[#F8F5EE]">
              Loading Live Menu from Supabase...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#121215] rounded-3xl border border-red-500/30">
            <p className="text-lg font-mono font-bold text-red-500">No culinary items match your search criteria.</p>
            <p className="text-xs text-[#CBD5E1] mt-2">Try clearing your filters or search terms.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchTerm('');
                setVegFilter('ALL');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSelectDish(mapToMenuItem(dish))}
                  className="group bg-[#121215] border border-red-500/25 rounded-2xl overflow-hidden hover:border-red-500 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/20 cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Header Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#09090B]">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-80" />

                    {/* Veg / Non-Veg Indicator Dot */}
                    <div className="absolute top-3 left-3 p-1 rounded-md bg-[#09090B]/90 backdrop-blur-md border border-white/10 flex items-center gap-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          dish.is_veg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase text-[#F8F5EE]">
                        {dish.is_veg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Price Tag Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#09090B]/90 border border-red-500 backdrop-blur-md text-[#D4AF37] font-extrabold text-sm font-mono shadow-lg">
                      ₹{dish.price}
                    </div>

                    {/* Quick View Floating Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#09090B]/50 backdrop-blur-[2px]">
                      <span className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-3.5 h-3.5" /> Quick View
                      </span>
                    </div>
                  </div>

                  {/* Card Info Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#D4AF37]">
                          {dish.category_name}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{dish.rating || 4.8}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#F8F5EE] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {dish.name}
                      </h3>

                      <p className="mt-2 text-xs text-[#CBD5E1]/80 line-clamp-2 leading-relaxed font-sans">
                        {dish.description}
                      </p>
                    </div>

                    {/* Bottom Footer Info */}
                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] text-[#CBD5E1]/70">
                      {dish.prep_time ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" /> {dish.prep_time}
                        </span>
                      ) : (
                        <span>Freshly Prepared</span>
                      )}

                      {dish.is_chef_special && (
                        <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Chef's Choice
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

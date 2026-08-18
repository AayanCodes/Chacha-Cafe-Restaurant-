import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, MessageSquarePlus, Heart, X, Send } from 'lucide-react';
import { REVIEWS } from '../data/cafeData';
import { Review } from '../types';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    favoriteDish: ''
  });

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Review = {
      id: `r-${Date.now()}`,
      name: newReview.name || 'Valued Guest',
      location: newReview.location || 'Kotdwar, Uttarakhand',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      rating: newReview.rating,
      date: 'Just now',
      comment: newReview.comment,
      favoriteDish: newReview.favoriteDish || 'Chef Special'
    };

    setReviewsList([created, ...reviewsList]);
    setIsModalOpen(false);
    setNewReview({ name: '', location: '', rating: 5, comment: '', favoriteDish: '' });
  };

  const activeReview = reviewsList[currentIndex];

  return (
    <section id="reviews" className="scroll-mt-16 md:scroll-mt-20 py-24 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      {/* Background Ornaments */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>GUEST EXPERIENCES</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] font-mono leading-[0.95]">
            WORDS FROM OUR <span className="text-red-500">DINERS.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] font-sans">
            Hear what food lovers and travelers say about their time at Chacha Cafe.
          </p>
        </div>

        {/* Testimonial Main Slider Card */}
        <div className="relative bg-[#121215] border-2 border-red-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <Quote className="absolute top-6 right-8 w-16 h-16 text-red-500/15 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              {/* Left Avatar & Rating */}
              <div className="flex flex-col items-center shrink-0 text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-red-500 shadow-xl">
                  <img
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-1 mt-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < activeReview.rating ? 'fill-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {activeReview.favoriteDish && (
                  <span className="mt-3 px-3 py-1 rounded-full bg-[#09090B] border border-red-500/30 text-[11px] text-red-400 font-bold font-mono">
                    Loved: {activeReview.favoriteDish}
                  </span>
                )}
              </div>

              {/* Right Review Comment */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-base sm:text-xl font-sans italic text-[#F8F5EE] leading-relaxed">
                  "{activeReview.comment}"
                </p>

                <div className="mt-6 pt-4 border-t border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-extrabold text-red-500 font-mono uppercase">{activeReview.name}</h4>
                    <p className="text-xs text-[#CBD5E1]/70">{activeReview.location}</p>
                  </div>
                  <span className="text-xs text-[#CBD5E1]/50 font-mono">{activeReview.date}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-red-500/20">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#09090B] border border-red-500/40 text-red-500 text-xs font-extrabold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 font-mono"
            >
              <MessageSquarePlus className="w-4 h-4" /> Share Your Experience
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={prevReview}
                aria-label="Previous review"
                className="p-3 rounded-full bg-[#09090B] border border-red-500/40 text-[#F8F5EE] hover:text-red-500 hover:border-red-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-red-500 font-mono font-bold">
                {currentIndex + 1} / {reviewsList.length}
              </span>
              <button
                onClick={nextReview}
                aria-label="Next review"
                className="p-3 rounded-full bg-[#09090B] border border-red-500/40 text-[#F8F5EE] hover:text-red-500 hover:border-red-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#121215] border-2 border-red-500 rounded-3xl p-6 sm:p-8 text-[#F8F5EE] shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#CBD5E1] hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-mono font-bold text-[#F8F5EE] mb-1 uppercase">
                Share Your Dining Experience
              </h3>
              <p className="text-xs text-[#CBD5E1] mb-6 font-sans">
                Your feedback helps us continuously elevate our food, coffee, and service.
              </p>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-red-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="e.g. Priya Rawat"
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-red-500 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    placeholder="e.g. Kotdwar / Dehradun"
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-red-500 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: num })}
                        className={`p-2 rounded-lg border text-sm font-bold ${
                          newReview.rating >= num
                            ? 'bg-red-600 text-white border-red-500'
                            : 'bg-[#18181B] border-red-500/30 text-[#CBD5E1]'
                        }`}
                      >
                        {num} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-red-500 mb-1">Favorite Dish / Coffee</label>
                  <input
                    type="text"
                    value={newReview.favoriteDish}
                    onChange={(e) => setNewReview({ ...newReview, favoriteDish: e.target.value })}
                    placeholder="e.g. Woodfired Pizza / Gold Cappuccino"
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-red-500 mb-1">Review Comments</label>
                  <textarea
                    required
                    rows={3}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Describe your dining experience..."
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

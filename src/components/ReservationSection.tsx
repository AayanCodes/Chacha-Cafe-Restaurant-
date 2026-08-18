import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, CheckCircle, Sparkles, Send, Copy, Share2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/cafeData';
import { ReservationData } from '../types';

export const ReservationSection: React.FC = () => {
  const [formData, setFormData] = useState<ReservationData>({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    occasion: 'Casual Dining',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    ticketNo: string;
    data: ReservationData;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketNo = `SOL-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedBooking({
        ticketNo,
        data: { ...formData }
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const timeSlots = [
    '08:30 AM', '10:00 AM', '12:00 PM', '01:30 PM', '03:00 PM',
    '05:00 PM', '07:00 PM', '08:30 PM', '09:30 PM', '10:15 PM'
  ];

  const occasions = [
    'Casual Dining',
    'Birthday Celebration',
    'Anniversary',
    'Romantic Date Night',
    'Family Get-together',
    'Business Dinner'
  ];

  const shareViaWhatsApp = () => {
    if (!confirmedBooking) return;
    const text = `Hello Chacha Cafe! I would like to confirm my table reservation:\n\nReference: ${confirmedBooking.ticketNo}\nName: ${confirmedBooking.data.name}\nGuests: ${confirmedBooking.data.guests}\nDate: ${confirmedBooking.data.date}\nTime: ${confirmedBooking.data.time}\nOccasion: ${confirmedBooking.data.occasion}\nPhone: ${confirmedBooking.data.phone}`;
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="reservation" className="scroll-mt-16 md:scroll-mt-20 py-24 md:py-32 bg-[#09090B] text-[#F8F5EE] relative overflow-hidden border-b border-red-500/20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-red-500 mb-3">
            <span>03. RESERVATION</span>
            <span>•</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F8F5EE] font-mono leading-[0.95]">
            PULL UP & <span className="text-red-500">GRAB A TABLE.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] font-sans">
            Book your table at Chacha Cafe in seconds. Ideal for family feasts, date nights, and quiet coffee moments.
          </p>
        </div>

        {/* Reservation Card Form Container */}
        <div className="bg-[#121215] border-2 border-red-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 86503 67876"
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. aarav@example.com"
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
            </div>

            {/* Guests Count */}
            <div>
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Number of Guests *
              </label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 transition-colors font-sans"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Reservation Date */}
            <div>
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Preferred Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Preferred Time *
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 transition-colors font-sans"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Occasion
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] focus:outline-none focus:border-red-500 transition-colors font-sans"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Request / Message */}
            <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-xs font-extrabold uppercase font-mono tracking-wider text-red-500 mb-2 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Special Requests
              </label>
              <input
                type="text"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g. Garden seating, candle setup..."
                className="w-full bg-[#18181B] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 lg:col-span-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold font-mono text-sm uppercase tracking-widest shadow-xl shadow-red-600/30 hover:scale-101 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-red-400/30"
              >
                {isSubmitting ? (
                  <span>Securing Your Table...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> CONFIRM RESERVATION
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#121215] border-2 border-red-500 rounded-3xl p-6 sm:p-8 text-[#F8F5EE] shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500 text-red-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-mono font-bold text-[#F8F5EE] uppercase">
                Table Reserved Successfully!
              </h3>
              <p className="text-xs text-red-500 font-mono mt-1">
                Booking Reference: {confirmedBooking.ticketNo}
              </p>

              <div className="my-6 p-4 rounded-2xl bg-[#18181B] border border-red-500/30 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]/70">Name:</span>
                  <span className="font-bold text-[#F8F5EE]">{confirmedBooking.data.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]/70">Guests:</span>
                  <span className="font-bold text-[#F8F5EE]">{confirmedBooking.data.guests} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]/70">Date & Time:</span>
                  <span className="font-bold text-red-500 font-mono">
                    {confirmedBooking.data.date} at {confirmedBooking.data.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]/70">Occasion:</span>
                  <span className="font-bold text-[#F8F5EE]">{confirmedBooking.data.occasion}</span>
                </div>
              </div>

              <p className="text-xs text-[#CBD5E1] mb-6">
                We have logged your table request at Chacha Cafe. You can share this instantly via WhatsApp with our host team.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={shareViaWhatsApp}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg font-mono"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </button>
                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="py-3 px-6 rounded-xl bg-[#18181B] border border-red-500/40 text-[#F8F5EE] font-bold text-xs uppercase tracking-wider font-mono"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

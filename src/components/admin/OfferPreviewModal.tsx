import React from 'react';
import { X, Tag, Calendar, Sparkles, Check, Clock } from 'lucide-react';
import { SpecialOffer } from '../../types/admin';

interface OfferPreviewModalProps {
  offer: Partial<SpecialOffer>;
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
}

export const OfferPreviewModal: React.FC<OfferPreviewModalProps> = ({
  offer,
  isOpen,
  onClose,
  onPublish,
  onSaveDraft,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  const validDaysText =
    offer.saturday_enabled && offer.sunday_enabled
      ? 'Valid Saturday & Sunday'
      : offer.saturday_enabled
      ? 'Valid Saturday Only'
      : offer.sunday_enabled
      ? 'Valid Sunday Only'
      : 'Valid All Week';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="bg-[#121215] border border-red-500/40 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-red-500/20 flex items-center justify-between bg-[#18181B]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Live Public Website Preview
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Actual Card Preview */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-[#CBD5E1]/70 font-mono">
            This is how your offer card will look to customers on the Chacha Cafe website:
          </p>

          <div className="bg-[#18181B] border-2 border-red-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row items-stretch">
            {/* Image section */}
            <div className="w-full sm:w-1/2 h-56 sm:h-auto relative overflow-hidden bg-zinc-900">
              <img
                src={
                  offer.image_url ||
                  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
                }
                alt={offer.title || 'Offer Preview'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {offer.discount_percentage ? (
                <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-black text-xs px-3 py-1 rounded-full shadow-lg">
                  {offer.discount_percentage}% OFF
                </div>
              ) : null}
            </div>

            {/* Offer details */}
            <div className="w-full sm:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-widest font-mono">
                  {validDaysText}
                </span>
                <h3 className="text-lg font-mono font-bold text-[#F8F5EE] mt-3 uppercase leading-tight">
                  {offer.title || 'Untitled Offer'}
                </h3>
                <p className="mt-2 text-xs text-[#CBD5E1] leading-relaxed font-sans line-clamp-3">
                  {offer.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-red-500/20 space-y-3">
                <div className="flex items-center justify-between font-mono">
                  <div>
                    <span className="text-xs text-[#CBD5E1]/60 line-through mr-2">
                      ₹{offer.original_price || 0}
                    </span>
                    <span className="text-xl font-extrabold text-[#D4AF37]">
                      ₹{offer.offer_price || 0}
                    </span>
                  </div>
                  {offer.promo_code && (
                    <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-500/30">
                      <Tag className="w-3 h-3" /> {offer.promo_code}
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-[#CBD5E1]/70 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-500" /> Date Range: {offer.start_date} to {offer.end_date}
                </div>

                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 opacity-90 cursor-not-allowed"
                >
                  <Calendar className="w-3.5 h-3.5" /> Claim via Table Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 sm:p-6 border-t border-red-500/20 bg-[#18181B] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-700 text-[#CBD5E1] hover:text-white font-mono text-xs uppercase font-bold transition-colors"
          >
            Cancel / Edit
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#F8F5EE] border border-zinc-600 font-mono text-xs uppercase font-bold transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-102"
          >
            <Check className="w-4 h-4" /> Save & Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Eye,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Archive,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { OfferPreviewModal } from '../../components/admin/OfferPreviewModal';
import { dbService } from '../../services/dbService';
import { SpecialOffer, OfferType } from '../../types/admin';
import { computeOfferStatus, getTodayDateString } from '../../lib/timezone';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<SpecialOffer> | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<SpecialOffer>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const [data, settings] = await Promise.all([
        dbService.getSpecialOffers(),
        dbService.getSettings(),
      ]);
      setOffers(data);
      if (settings?.timezone) setTimezone(settings.timezone);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();

    // Check query params for quick action e.g. ?action=new
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      handleOpenCreateModal();
    }
  }, []);

  const handleOpenCreateModal = () => {
    const today = getTodayDateString(timezone);
    const in30Days = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    setEditingOffer({
      title: '',
      product_name: '',
      description: '',
      offer_type: 'PERCENTAGE_DISCOUNT',
      original_price: 499,
      offer_price: 349,
      discount_percentage: 30,
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      promo_code: 'WEEKEND30',
      start_date: today,
      end_date: in30Days,
      saturday_enabled: true,
      sunday_enabled: true,
      is_active: true,
      is_featured: false,
      display_order: offers.length + 1,
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (offer: SpecialOffer) => {
    setEditingOffer({ ...offer });
    setFormError(null);
    setIsFormOpen(true);
  };

  // Automated price calculations
  const handlePriceChange = (original: number, offerPrice: number) => {
    let discount = 0;
    if (original > 0 && offerPrice >= 0) {
      discount = Math.round(((original - offerPrice) / original) * 100);
      if (discount < 0) discount = 0;
    }
    setEditingOffer((prev) =>
      prev
        ? {
            ...prev,
            original_price: original,
            offer_price: offerPrice,
            discount_percentage: discount,
          }
        : null
    );
  };

  const handleSaveOffer = async (publishImmediate: boolean = true) => {
    if (!editingOffer) return;
    setFormError(null);

    // Validation checks
    if (!editingOffer.title?.trim()) {
      setFormError('Offer title is required.');
      return;
    }
    if (!editingOffer.product_name?.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (editingOffer.offer_price === undefined || editingOffer.offer_price < 0) {
      setFormError('Offer price must be 0 or greater.');
      return;
    }
    if (editingOffer.original_price === undefined || editingOffer.original_price < 0) {
      setFormError('Original price must be 0 or greater.');
      return;
    }
    if (!editingOffer.start_date || !editingOffer.end_date) {
      setFormError('Start date and End date are required.');
      return;
    }
    if (editingOffer.end_date < editingOffer.start_date) {
      setFormError('End date cannot be earlier than Start date.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...editingOffer,
        is_active: publishImmediate,
      };

      await dbService.saveSpecialOffer(payload as any);
      setSuccessMsg(publishImmediate ? 'Offer published successfully!' : 'Offer saved as draft!');
      setTimeout(() => setSuccessMsg(null), 4000);

      setIsFormOpen(false);
      setIsPreviewOpen(false);
      setEditingOffer(null);
      await loadOffers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save offer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setLoading(true);
      await dbService.duplicateSpecialOffer(id);
      setSuccessMsg('Offer duplicated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate offer');
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await dbService.toggleOfferActive(id, !current);
    await loadOffers();
  };

  const handleArchive = async (id: string) => {
    await dbService.archiveSpecialOffer(id);
    setDeleteId(null);
    setSuccessMsg('Offer archived successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
    await loadOffers();
  };

  // Filtered list
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.promo_code && offer.promo_code.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const st = computeOfferStatus(offer, timezone);
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return st === 'ACTIVE';
    if (statusFilter === 'SCHEDULED') return st === 'SCHEDULED';
    if (statusFilter === 'EXPIRED') return st === 'EXPIRED';
    if (statusFilter === 'PAUSED') return st === 'PAUSED' || !offer.is_active;
    if (statusFilter === 'WEEKEND') return offer.saturday_enabled || offer.sunday_enabled;

    return true;
  });

  return (
    <AdminLayout
      activeTab="offers"
      title="OFFER MANAGEMENT"
      subtitle="Create, schedule, edit, and publish promotional dining offers for Chacha Cafe."
    >
      <div className="space-y-6">
        {/* SUCCESS NOTIFICATION */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TOP CONTROLS & FILTER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#121215] border border-red-500/30 rounded-3xl">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offers, products, or promo codes..."
              className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 font-sans"
            />
          </div>

          {/* Status filters & Create button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#18181B] p-1.5 rounded-2xl border border-red-500/20">
              <Filter className="w-3.5 h-3.5 text-red-500 ml-2" />
              {['ALL', 'ACTIVE', 'SCHEDULED', 'PAUSED', 'EXPIRED', 'WEEKEND'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase transition-all ${
                    statusFilter === f
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> CREATE NEW OFFER
            </button>
          </div>
        </div>

        {/* OFFERS LIST / GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#CBD5E1]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
            <p className="font-mono text-xs uppercase">Loading Special Offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16 bg-[#121215] border border-red-500/20 rounded-3xl p-8 space-y-4">
            <Tag className="w-12 h-12 text-red-500/40 mx-auto" />
            <div>
              <h3 className="text-base font-mono font-bold uppercase text-[#F8F5EE]">No offers found</h3>
              <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
                Try adjusting your search query or create a new weekend offer.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-red-600 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Offer Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const st = computeOfferStatus(offer, timezone);
              let badgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';

              if (st === 'ACTIVE') badgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
              else if (st === 'SCHEDULED') badgeColor = 'bg-sky-950/80 text-sky-300 border-sky-500/50';
              else if (st === 'PAUSED') badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-500/50';
              else if (st === 'INACTIVE_DAY') badgeColor = 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50';

              const validDays =
                offer.saturday_enabled && offer.sunday_enabled
                  ? 'Sat + Sun'
                  : offer.saturday_enabled
                  ? 'Sat Only'
                  : offer.sunday_enabled
                  ? 'Sun Only'
                  : 'All Week';

              return (
                <div
                  key={offer.id}
                  className="bg-[#121215] border border-red-500/30 rounded-3xl overflow-hidden hover:border-red-500 transition-all shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Top image & badge */}
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-mono font-extrabold uppercase shadow-lg ${badgeColor}`}>
                          {st === 'INACTIVE_DAY' ? 'PAUSED TODAY (WEEKEND)' : st}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 text-[#D4AF37] font-mono font-extrabold text-xs border border-red-500/30">
                        {offer.discount_percentage}% OFF
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#CBD5E1]/70">
                        <span className="text-red-400 font-bold uppercase">{offer.offer_type.replace('_', ' ')}</span>
                        <span>{validDays}</span>
                      </div>

                      <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase group-hover:text-red-500 transition-colors line-clamp-1">
                        {offer.title}
                      </h3>

                      <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed font-sans">
                        {offer.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-red-500/20 font-mono">
                        <div>
                          <span className="text-xs line-through text-[#CBD5E1]/60 mr-2">
                            ₹{offer.original_price}
                          </span>
                          <span className="text-lg font-extrabold text-[#D4AF37]">
                            ₹{offer.offer_price}
                          </span>
                        </div>
                        {offer.promo_code && (
                          <span className="text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                            {offer.promo_code}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-[#CBD5E1]/60 flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3 text-red-500" /> {offer.start_date} to {offer.end_date}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-[#18181B] border-t border-red-500/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleActive(offer.id, offer.is_active)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-colors ${
                        offer.is_active
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                      }`}
                    >
                      {offer.is_active ? 'Pause' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDuplicate(offer.id)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sky-400 transition-colors"
                        title="Duplicate Offer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(offer)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#F8F5EE] transition-colors"
                        title="Edit Offer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(offer.id)}
                        className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/80 text-red-400 transition-colors"
                        title="Archive / Delete Offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CREATE / EDIT OFFER FORM MODAL */}
        {isFormOpen && editingOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#121215] border border-red-500/40 rounded-3xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
              {/* Modal header */}
              <div className="p-5 sm:p-6 border-b border-red-500/20 flex items-center justify-between bg-[#18181B]">
                <div className="flex items-center gap-2 font-mono font-extrabold text-sm text-[#F8F5EE] uppercase">
                  <Tag className="w-4 h-4 text-red-500" />
                  <span>{editingOffer.id ? 'Edit Special Offer' : 'Create New Weekend Offer'}</span>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-[#CBD5E1] hover:text-white rounded-xl bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveOffer(editingOffer.is_active ?? true);
                }}
                className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto font-sans"
              >
                {formError && (
                  <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Offer Title & Product Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Offer Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingOffer.title || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                      placeholder="e.g. Weekend Pizza Privilege Deal"
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Featured Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingOffer.product_name || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, product_name: e.target.value })}
                      placeholder="e.g. Cheese & Corn Pizza"
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    />
                  </div>
                </div>

                {/* Offer Type & Promo Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Offer Type
                    </label>
                    <select
                      value={editingOffer.offer_type || 'PERCENTAGE_DISCOUNT'}
                      onChange={(e) =>
                        setEditingOffer({ ...editingOffer, offer_type: e.target.value as OfferType })
                      }
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    >
                      <option value="PERCENTAGE_DISCOUNT">PERCENTAGE DISCOUNT (e.g. 30% OFF)</option>
                      <option value="FIXED_PRICE">FIXED SPECIAL PRICE (e.g. Pizza ₹299)</option>
                      <option value="BUY_ONE_GET_ONE">BUY 1 GET 1 FREE</option>
                      <option value="COMBO">COMBO DEAL (e.g. Burger + Fries + Shake ₹249)</option>
                      <option value="FLAT_DISCOUNT">FLAT DISCOUNT (e.g. Flat ₹100 OFF)</option>
                      <option value="SPECIAL_ITEM">WEEKEND SPECIAL ITEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingOffer.promo_code || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, promo_code: e.target.value })}
                      placeholder="e.g. WEEKEND30"
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    />
                  </div>
                </div>

                {/* Pricing Fields & Automated Calculation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#18181B] rounded-2xl border border-red-500/20">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingOffer.original_price ?? 0}
                      onChange={(e) =>
                        handlePriceChange(
                          parseFloat(e.target.value) || 0,
                          editingOffer.offer_price ?? 0
                        )
                      }
                      className="w-full bg-[#121215] border border-red-500/30 rounded-2xl px-4 py-3 text-sm font-mono text-[#F8F5EE] focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Offer Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingOffer.offer_price ?? 0}
                      onChange={(e) =>
                        handlePriceChange(
                          editingOffer.original_price ?? 0,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-[#121215] border border-red-500/30 rounded-2xl px-4 py-3 text-sm font-mono text-[#D4AF37] font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Calculated Discount (%)
                    </label>
                    <input
                      type="number"
                      disabled
                      value={editingOffer.discount_percentage ?? 0}
                      className="w-full bg-[#09090B] border border-zinc-700 rounded-2xl px-4 py-3 text-sm font-mono text-emerald-400 font-bold opacity-80"
                    />
                  </div>
                </div>

                {/* WEEKEND SCHEDULING CONTROLS */}
                <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase">
                    <Calendar className="w-4 h-4" /> Weekend & Date Scheduling Rules
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={editingOffer.start_date || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, start_date: e.target.value })}
                        className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-2.5 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={editingOffer.end_date || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, end_date: e.target.value })}
                        className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-2.5 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-red-500/20 flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 text-xs font-mono text-[#F8F5EE] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingOffer.saturday_enabled ?? true}
                        onChange={(e) => setEditingOffer({ ...editingOffer, saturday_enabled: e.target.checked })}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      ☑ Enable on Saturday
                    </label>

                    <label className="flex items-center gap-2 text-xs font-mono text-[#F8F5EE] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingOffer.sunday_enabled ?? true}
                        onChange={(e) => setEditingOffer({ ...editingOffer, sunday_enabled: e.target.checked })}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      ☑ Enable on Sunday
                    </label>
                  </div>
                </div>

                {/* Offer Image Upload */}
                <ImageUploader
                  value={editingOffer.image_url || ''}
                  onChange={(url) => setEditingOffer({ ...editingOffer, image_url: url })}
                  folder="offers"
                  label="Offer Display Image"
                />

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                    Offer Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingOffer.description || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    placeholder="Provide delicious details about this offer..."
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl p-4 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewData(editingOffer);
                      setIsPreviewOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#18181B] border border-red-500/30 text-xs font-mono font-bold text-[#F8F5EE] uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-red-500" /> Preview Offer Card
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-zinc-700 text-xs font-mono font-bold text-[#CBD5E1] uppercase hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save & Publish
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LIVE PREVIEW MODAL */}
        <OfferPreviewModal
          offer={previewData}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onPublish={() => {
            setEditingOffer(previewData);
            handleSaveOffer(true);
          }}
          onSaveDraft={() => {
            setEditingOffer(previewData);
            handleSaveOffer(false);
          }}
          isSaving={saving}
        />

        {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#121215] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold uppercase text-[#F8F5EE]">
                  Archive this offer?
                </h3>
                <p className="text-xs text-[#CBD5E1] mt-2 leading-relaxed">
                  The offer will be safely archived from the public website. Historical records will be retained in your database.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-zinc-700 text-xs font-mono font-bold text-[#CBD5E1] uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleArchive(deleteId)}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase shadow-lg shadow-red-600/30"
                >
                  Confirm Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

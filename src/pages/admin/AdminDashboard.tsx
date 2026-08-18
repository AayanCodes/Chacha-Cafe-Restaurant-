import React, { useEffect, useState } from 'react';
import {
  Tag,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Loader2,
  Calendar,
  Sparkles,
  ChefHat,
  QrCode,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { dbService } from '../../services/dbService';
import { DashboardStats, SpecialOffer } from '../../types/admin';
import { computeOfferStatus } from '../../lib/timezone';
import { useNavigation } from '../../context/NavigationContext';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useNavigation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOffers, setRecentOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [s, offers, settings] = await Promise.all([
        dbService.getDashboardStats(),
        dbService.getSpecialOffers(),
        dbService.getSettings(),
      ]);
      setStats(s);
      setRecentOffers(offers.slice(0, 5));
      if (settings?.timezone) setTimezone(settings.timezone);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleOffer = async (id: string, currentActive: boolean) => {
    await dbService.toggleOfferActive(id, !currentActive);
    await loadDashboardData();
  };

  return (
    <AdminLayout
      activeTab="dashboard"
      title="RESTAURANT DASHBOARD"
      subtitle="Overview of your active offers, weekend schedules, and menu catalog availability."
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#CBD5E1]">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
          <p className="font-mono text-xs uppercase">Loading Dashboard Analytics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* QUICK ACTIONS ROW */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#121215] border border-red-500/30 rounded-3xl">
            <div>
              <h3 className="text-lg font-mono font-bold text-[#F8F5EE] uppercase">
                Welcome, Chacha Cafe Owner!
              </h3>
              <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
                Restaurant Timezone: <span className="font-mono text-red-400">{timezone}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/admin/orders"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/orders');
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-950 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <ChefHat className="w-4 h-4" /> LIVE KITCHEN & ORDERS
              </a>
              <a
                href="/admin/tables"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/tables');
                }}
                className="px-5 py-3 rounded-2xl bg-[#18181B] hover:bg-zinc-800 text-[#F8F5EE] border border-amber-500/30 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4 text-amber-400" /> TABLES & QR
              </a>
              <a
                href="/admin/offers?action=new"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/offers?action=new');
                }}
                className="px-4 py-3 rounded-2xl bg-[#18181B] hover:bg-zinc-800 text-[#F8F5EE] border border-red-500/30 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-red-500" /> CREATE OFFER
              </a>
            </div>
          </div>

          {/* METRIC CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Active Offers */}
            <div className="p-5 bg-[#121215] border border-emerald-500/30 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest">ACTIVE OFFERS</span>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-3xl font-mono font-black text-[#F8F5EE]">{stats?.activeOffersCount || 0}</p>
              <p className="text-[11px] text-[#CBD5E1]/70 font-sans">Currently visible on website</p>
            </div>

            {/* Upcoming Offers */}
            <div className="p-5 bg-[#121215] border border-sky-500/30 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-sky-400">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest">UPCOMING OFFERS</span>
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-3xl font-mono font-black text-[#F8F5EE]">{stats?.upcomingOffersCount || 0}</p>
              <p className="text-[11px] text-[#CBD5E1]/70 font-sans">Scheduled for future dates</p>
            </div>

            {/* Expired Offers */}
            <div className="p-5 bg-[#121215] border border-zinc-700 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest">EXPIRED OFFERS</span>
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-3xl font-mono font-black text-[#F8F5EE]">{stats?.expiredOffersCount || 0}</p>
              <p className="text-[11px] text-[#CBD5E1]/70 font-sans">History kept for records</p>
            </div>

            {/* Total Menu Items */}
            <div className="p-5 bg-[#121215] border border-red-500/30 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-red-500">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest">TOTAL DISHES</span>
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <p className="text-3xl font-mono font-black text-[#F8F5EE]">{stats?.totalMenuItemsCount || 0}</p>
              <p className="text-[11px] text-[#CBD5E1]/70 font-sans">In menu catalog</p>
            </div>

            {/* Available Items */}
            <div className="p-5 bg-[#121215] border border-amber-500/30 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest">AVAILABLE DISHES</span>
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-mono font-black text-[#F8F5EE]">{stats?.availableMenuItemsCount || 0}</p>
              <p className="text-[11px] text-[#CBD5E1]/70 font-sans">Ready to serve</p>
            </div>
          </div>

          {/* RECENT OFFERS TABLE */}
          <div className="bg-[#121215] border border-red-500/30 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
              <div>
                <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase">
                  Special Offers Overview
                </h3>
                <p className="text-xs text-[#CBD5E1] mt-0.5">
                  Real-time calculated status based on dates and Saturday/Sunday schedule.
                </p>
              </div>
              <a
                href="/admin/offers"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/offers');
                }}
                className="text-xs font-mono font-bold text-red-500 hover:text-red-400 flex items-center gap-1 uppercase"
              >
                Manage All Offers <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {recentOffers.length === 0 ? (
              <div className="text-center py-12 text-[#CBD5E1]">
                <Tag className="w-10 h-10 text-red-500/40 mx-auto mb-2" />
                <p className="font-mono text-xs uppercase">No offers created yet.</p>
                <a
                  href="/admin/offers?action=new"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/admin/offers?action=new');
                  }}
                  className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-xl font-mono text-xs uppercase font-bold"
                >
                  Create Your First Offer
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-red-500/20 font-mono text-[10px] uppercase text-[#CBD5E1] tracking-widest">
                      <th className="py-3 px-4">Offer Name</th>
                      <th className="py-3 px-4">Original → Offer Price</th>
                      <th className="py-3 px-4">Schedule Days</th>
                      <th className="py-3 px-4">Calculated Status</th>
                      <th className="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-500/10 font-sans text-xs">
                    {recentOffers.map((offer) => {
                      const st = computeOfferStatus(offer, timezone);
                      let badgeBg = 'bg-zinc-800 text-zinc-300 border-zinc-700';

                      if (st === 'ACTIVE') badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
                      else if (st === 'SCHEDULED') badgeBg = 'bg-sky-950/80 text-sky-300 border-sky-500/50';
                      else if (st === 'PAUSED') badgeBg = 'bg-amber-950/80 text-amber-300 border-amber-500/50';
                      else if (st === 'INACTIVE_DAY') badgeBg = 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50';
                      else if (st === 'EXPIRED') badgeBg = 'bg-zinc-900 text-zinc-400 border-zinc-800';

                      const daysText =
                        offer.saturday_enabled && offer.sunday_enabled
                          ? 'Sat + Sun'
                          : offer.saturday_enabled
                          ? 'Sat Only'
                          : offer.sunday_enabled
                          ? 'Sun Only'
                          : 'All Week';

                      return (
                        <tr key={offer.id} className="hover:bg-[#18181B] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#F8F5EE]">
                            <div className="flex items-center gap-3">
                              <img
                                src={offer.image_url}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-red-500/30"
                              />
                              <div>
                                <p className="truncate max-w-xs">{offer.title}</p>
                                <p className="text-[10px] text-[#CBD5E1]/60 font-sans font-normal">{offer.product_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="line-through text-[#CBD5E1]/60 mr-1.5">₹{offer.original_price}</span>
                            <span className="font-extrabold text-[#D4AF37]">₹{offer.offer_price}</span>
                            <span className="text-[10px] text-red-400 ml-1.5">({offer.discount_percentage}% OFF)</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#CBD5E1]">{daysText}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-extrabold uppercase ${badgeBg}`}>
                              {st === 'INACTIVE_DAY' ? 'PAUSED TODAY (WEEKEND OFFER)' : st}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleToggleOffer(offer.id, offer.is_active)}
                              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-extrabold uppercase transition-colors ${
                                offer.is_active
                                  ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40 hover:bg-amber-900/80'
                                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/80'
                              }`}
                            >
                              {offer.is_active ? 'Pause Offer' : 'Publish Offer'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

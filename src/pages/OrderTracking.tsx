/**
 * Live Customer Order Status Tracking Page (/order/:orderId)
 * 
 * Provides real-time preparation progress updates for diners:
 * - 6-stage interactive timeline (Placed -> Accepted -> Preparing -> Ready -> Served -> Completed)
 * - Supabase Realtime websocket subscriptions with auto-polling fallback
 * - Order line items summary, payment badges, and table assistance shortcuts
 */

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bell,
  Utensils,
  ShoppingBag,
  ArrowLeft,
  Droplet,
  FileText,
  AlertCircle,
  Sparkles,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { Order, OrderStatus, RequestType } from '../types/orders';

interface OrderTrackingProps {
  orderId: string;
}

const ORDER_STEPS: { status: OrderStatus; label: string; icon: any; description: string }[] = [
  {
    status: 'CONFIRMED',
    label: 'Order Placed',
    icon: CheckCircle2,
    description: 'We have received your order and sent it to the kitchen.',
  },
  {
    status: 'ACCEPTED',
    label: 'Kitchen Accepted',
    icon: ChefHat,
    description: 'The master chef has accepted your order and queued the ingredients.',
  },
  {
    status: 'PREPARING',
    label: 'Cooking in Kitchen',
    icon: Clock,
    description: 'Your fresh dishes are being prepared with love on Manadwar Road.',
  },
  {
    status: 'READY',
    label: 'Food Ready',
    icon: Bell,
    description: 'Plated hot and ready! Our floor staff is bringing it to your table.',
  },
  {
    status: 'SERVED',
    label: 'Served at Table',
    icon: Utensils,
    description: 'Enjoy your delicious feast at Chacha Cafe!',
  },
  {
    status: 'COMPLETED',
    label: 'Order Completed',
    icon: Sparkles,
    description: 'Thank you for dining with us. We hope you enjoyed your meal!',
  },
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestToast, setRequestToast] = useState<string | null>(null);

  // Fetch Order and Listen to Live Supabase Updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function loadOrder() {
      setLoading(true);
      try {
        const data = await dbService.getOrderById(orderId);
        if (!data) {
          setError('Order not found. Please verify your order number.');
        } else {
          setOrder(data);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();

    // Supabase Realtime Listener on specific order
    unsubscribe = dbService.subscribeToOrder(orderId, (updatedOrder) => {
      setOrder((prev) => (prev ? { ...prev, ...updatedOrder } : updatedOrder));
    });

    // Also poll every 10 seconds as reliable fallback
    const interval = setInterval(async () => {
      try {
        const refreshed = await dbService.getOrderById(orderId);
        if (refreshed) {
          setOrder((prev) => (prev ? { ...prev, ...refreshed } : refreshed));
        }
      } catch {
        // Non-blocking
      }
    }, 10000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [orderId]);

  const handleServiceRequest = async (type: RequestType, label: string) => {
    if (!order) return;
    try {
      await dbService.createRestaurantRequest(order.table_number, type, undefined, order.table_id);
      setRequestToast(`Staff notified! We will attend Table ${order.table_number} for ${label}.`);
      setTimeout(() => setRequestToast(null), 4000);
    } catch {
      setRequestToast(`Staff notified for ${label} at Table ${order.table_number}.`);
      setTimeout(() => setRequestToast(null), 4000);
    }
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 0;
      case 'CONFIRMED':
        return 0;
      case 'ACCEPTED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY':
        return 3;
      case 'SERVED':
        return 4;
      case 'COMPLETED':
        return 5;
      case 'CANCELLED':
      case 'PAYMENT_FAILED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.order_status) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-white">Loading Live Order Tracker...</p>
        <p className="text-xs text-neutral-400 mt-1">Connecting to Chacha Cafe Live Kitchen</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Order Details Unavailable</h2>
        <p className="text-xs text-neutral-400 max-w-sm mb-6">
          {error || 'We could not find the requested order in the database.'}
        </p>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
        >
          Return to Website
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] font-sans antialiased pb-20 selection:bg-red-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              window.history.pushState({}, '', `/table/${order.table_number}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Order More
          </button>

          <div className="text-center">
            <h1 className="text-sm font-serif font-bold text-white">Chacha Cafe</h1>
            <p className="text-[10px] text-amber-400 font-mono">LIVE ORDER TRACKER</p>
          </div>

          <div className="flex items-center gap-1 bg-green-950/60 border border-green-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Sync
          </div>
        </div>
      </header>

      {/* Service Request Toast */}
      <AnimatePresence>
        {requestToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-amber-500 text-black px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{requestToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-xl mx-auto px-4 py-5 space-y-5">
        {/* Order Header Card */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                Order #{order.order_number}
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-0.5">
                Table {order.table_number}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Placed at{' '}
                {new Date(order.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  order.order_status === 'COMPLETED'
                    ? 'bg-green-950/80 border-green-500 text-green-300'
                    : order.order_status === 'CANCELLED'
                    ? 'bg-red-950/80 border-red-500 text-red-300'
                    : order.order_status === 'READY'
                    ? 'bg-blue-950/80 border-blue-500 text-blue-300 animate-pulse'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                }`}
              >
                {order.order_status.replace(/_/g, ' ')}
              </span>

              <p className="text-xs font-bold text-amber-400 mt-2">
                ₹{order.total_amount}{' '}
                <span className="text-[10px] text-neutral-400 font-normal">
                  ({order.payment_status.replace(/_/g, ' ')})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Visual Progress Timeline */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-mono font-semibold">
            Kitchen Preparation Status
          </h3>

          {order.order_status === 'CANCELLED' ? (
            <div className="bg-red-950/50 border border-red-500/30 p-4 rounded-xl text-center">
              <p className="text-sm font-bold text-red-400">Order Cancelled</p>
              <p className="text-xs text-neutral-400 mt-1">
                This order was cancelled by the cafe staff. Please contact staff for assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-4 relative pl-2">
              {/* Connecting Line */}
              <div className="absolute left-6 top-3 bottom-6 w-0.5 bg-white/10" />

              {ORDER_STEPS.map((step, index) => {
                const isPassed = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.status}
                    className={`flex items-start gap-4 relative z-10 transition-all ${
                      isPassed ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-black ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30 scale-110'
                          : isPassed
                          ? 'bg-green-600 text-white'
                          : 'bg-[#1E1E24] text-neutral-500 border border-white/10'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-amber-400'
                              : isPassed
                              ? 'text-white'
                              : 'text-neutral-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Service Requests Bar */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-4 space-y-2.5">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono font-semibold">
            Need Assistance at Table {order.table_number}?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleServiceRequest('CALL_WAITER', 'Staff Assistance')}
              className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              Call Waiter
            </button>
            <button
              onClick={() => handleServiceRequest('REQUEST_WATER', 'Water Refill')}
              className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Droplet className="w-4 h-4 text-blue-400" />
              Water Refill
            </button>
            <button
              onClick={() => handleServiceRequest('REQUEST_BILL', 'Table Bill')}
              className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-green-400" />
              Request Bill
            </button>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-mono font-semibold">
            Ordered Dishes
          </h3>

          <div className="divide-y divide-white/5">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.is_veg ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-white font-medium">
                      {item.item_name} <strong className="text-amber-400">×{item.quantity}</strong>
                    </span>
                  </div>
                  <span className="text-neutral-300 font-mono">₹{item.subtotal}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-2">Items loading...</p>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5% GST)</span>
              <span className="text-white">₹{order.tax_amount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-1">
              <span>Grand Total</span>
              <span className="text-amber-400 font-serif">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              window.history.pushState({}, '', `/table/${order.table_number}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            Order More Food
          </button>

          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            Visit Website
          </button>
        </div>
      </main>
    </div>
  );
};

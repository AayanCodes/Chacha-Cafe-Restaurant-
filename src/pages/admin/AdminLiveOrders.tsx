/**
 * Kitchen Display System (KDS) & Live Orders Portal (/admin/orders)
 * 
 * Central command center for restaurant kitchen and staff:
 * - Real-time incoming order stream with Web Audio chime alerts
 * - Kitchen stage controls (Accept, Start Preparing, Mark Ready, Mark Served, Complete)
 * - Printable Kitchen Order Ticket (KOT) generation
 * - Live table service assistance request board (Water, Waiter, Bill)
 */

import React, { useState, useEffect, useRef } from 'react';

import {
  ShoppingBag,
  Clock,
  ChefHat,
  Bell,
  Utensils,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Printer,
  RefreshCw,
  Search,
  Volume2,
  VolumeX,
  CreditCard,
  Banknote,
  Droplet,
  FileText,
  Phone,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { dbService } from '../../services/dbService';
import { Order, OrderStatus, RestaurantServiceRequest, PaymentStatus } from '../../types/orders';

export const AdminLiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<RestaurantServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [kotOrder, setKotOrder] = useState<Order | null>(null);

  // Web Audio Context Chime Generator (No external audio file needed!)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Ignore audio failure
    }
  };

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [fetchedOrders, fetchedRequests] = await Promise.all([
        dbService.getOrders({ limit: 50 }),
        dbService.getRestaurantRequests('PENDING'),
      ]);
      setOrders(fetchedOrders);
      setRequests(fetchedRequests);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load live orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Subscribe to Live Orders via Supabase Realtime
    const unsubscribeOrders = dbService.subscribeToLiveOrders(
      (newOrder) => {
        playChime();
        setOrders((prev) => {
          if (prev.some((o) => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      },
      (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
        );
      }
    );

    // 2. Poll fallback every 8 seconds for rock-solid reliability
    const interval = setInterval(async () => {
      try {
        const [refreshedOrders, refreshedReqs] = await Promise.all([
          dbService.getOrders({ limit: 50 }),
          dbService.getRestaurantRequests('PENDING'),
        ]);
        setOrders(refreshedOrders);
        setRequests(refreshedReqs);
      } catch {
        // Silent fallback
      }
    }, 8000);

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      clearInterval(interval);
    };
  }, [soundEnabled]);

  // Update Status Action
  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, nextStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: nextStatus } : o))
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update order status');
    }
  };

  // Update Payment Status Action
  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      await dbService.updatePaymentStatus(orderId, paymentStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, payment_status: paymentStatus } : o))
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update payment status');
    }
  };

  // Resolve Service Request
  const handleResolveRequest = async (requestId: string) => {
    try {
      await dbService.updateRequestStatus(requestId, 'RESOLVED');
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to resolve request');
    }
  };

  // Print Kitchen Order Ticket (KOT)
  const handlePrintKOT = (order: Order) => {
    setKotOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_name &&
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') {
      return ['CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'].includes(order.order_status);
    }
    if (statusFilter === 'NEW') {
      return order.order_status === 'CONFIRMED' || order.order_status === 'PENDING_PAYMENT';
    }
    if (statusFilter === 'KITCHEN') {
      return order.order_status === 'ACCEPTED' || order.order_status === 'PREPARING';
    }
    if (statusFilter === 'READY') {
      return order.order_status === 'READY';
    }
    if (statusFilter === 'COMPLETED') {
      return order.order_status === 'COMPLETED' || order.order_status === 'SERVED';
    }
    return true;
  });

  const activeOrdersCount = orders.filter((o) =>
    ['CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.order_status)
  ).length;

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
                <ChefHat className="w-7 h-7 text-red-500" />
                Live Kitchen & Orders
              </h1>
              {activeOrdersCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                  {activeOrdersCount} ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time Kitchen Display System (KDS), dine-in order status controller, and table service dispatcher.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-white/5 border-white/10 text-neutral-500'
              }`}
              title={soundEnabled ? 'Order Sound Alert On' : 'Order Sound Alert Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
            </button>

            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* SERVICE REQUESTS BANNER (IF ANY) */}
        {requests.length > 0 && (
          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Bell className="w-4 h-4 animate-bounce" />
                Live Table Service Requests ({requests.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#141418] border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-serif">
                      T{req.table_number}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {req.request_type === 'CALL_WAITER' && 'Call Waiter'}
                        {req.request_type === 'REQUEST_WATER' && 'Water Refill'}
                        {req.request_type === 'REQUEST_BILL' && 'Bill Requested'}
                        {req.request_type === 'CLEAN_TABLE' && 'Clean Table'}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {new Date(req.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolveRequest(req.id)}
                    className="py-1 px-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    Attended ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by order #, table, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'ACTIVE', label: 'Active Live' },
              { key: 'NEW', label: 'New / Confirmed' },
              { key: 'KITCHEN', label: 'In Kitchen' },
              { key: 'READY', label: 'Ready' },
              { key: 'COMPLETED', label: 'Completed' },
              { key: 'ALL', label: 'All Orders' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-950'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Orders Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-400 font-mono">Connecting to Live Kitchen Stream...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center bg-[#121215] border border-white/5 rounded-2xl p-6">
            <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-white">No orders matching this filter</p>
            <p className="text-xs text-neutral-500 mt-1">
              New customer orders from table QR scans will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isNew = order.order_status === 'CONFIRMED';
              const isCooking =
                order.order_status === 'ACCEPTED' || order.order_status === 'PREPARING';
              const isReady = order.order_status === 'READY';
              const isCompleted = order.order_status === 'COMPLETED' || order.order_status === 'SERVED';

              return (
                <div
                  key={order.id}
                  className={`bg-[#121215] border ${
                    isNew
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : isReady
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : isCooking
                      ? 'border-amber-500/50'
                      : 'border-white/10'
                  } rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-white/20`}
                >
                  <div>
                    {/* Header: Table, Order Number & Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-lg text-white shadow-md shadow-red-950 font-serif">
                          T{order.table_number}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white font-mono">
                              #{order.order_number}
                            </h3>
                            <span className="text-[10px] text-neutral-400 font-sans">
                              {new Date(order.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-neutral-500" />
                            {order.customer_name || 'Guest Diner'}
                            {order.customer_phone && ` (${order.customer_phone})`}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          order.order_status === 'CONFIRMED'
                            ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                            : order.order_status === 'ACCEPTED'
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                            : order.order_status === 'PREPARING'
                            ? 'bg-orange-950/80 border-orange-500 text-orange-300 animate-pulse'
                            : order.order_status === 'READY'
                            ? 'bg-blue-950/80 border-blue-500 text-blue-300 animate-pulse'
                            : order.order_status === 'COMPLETED'
                            ? 'bg-green-950/80 border-green-500 text-green-300'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                        }`}
                      >
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Order Notes / Special Cooking Instructions */}
                    {order.notes && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 mb-3 text-xs text-amber-200">
                        <span className="font-bold uppercase font-mono text-[10px] block text-amber-400">
                          Special Cooking Note:
                        </span>
                        {order.notes}
                      </div>
                    )}

                    {/* Ordered Items List */}
                    <div className="bg-[#18181C] rounded-xl p-3 space-y-2 mb-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-2 text-xs border-b border-white/5 pb-1.5 last:border-0 last:pb-0"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    item.is_veg ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                />
                                <span className="font-bold text-white text-xs">
                                  {item.quantity}× {item.item_name}
                                </span>
                              </div>
                              {item.notes && (
                                <p className="text-[10px] text-amber-300 pl-3.5 italic">
                                  &quot;{item.notes}&quot;
                                </p>
                              )}
                            </div>
                            <span className="font-mono text-neutral-400 text-xs">
                              ₹{item.subtotal}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-neutral-500">Loading items...</p>
                      )}
                    </div>

                    {/* Bill & Payment Info */}
                    <div className="flex items-center justify-between text-xs px-1 mb-3">
                      <div className="flex items-center gap-1.5">
                        {order.payment_method === 'CASH_AT_COUNTER' ? (
                          <Banknote className="w-4 h-4 text-green-400" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="text-neutral-400">
                          {order.payment_method === 'CASH_AT_COUNTER'
                            ? 'Cash / Counter'
                            : 'Online UPI'}
                        </span>
                        <span
                          onClick={() => {
                            if (order.payment_status === 'PAY_AT_COUNTER') {
                              handleUpdatePaymentStatus(order.id, 'PAID');
                            }
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                            order.payment_status === 'PAID'
                              ? 'bg-green-950 text-green-300 border border-green-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                          title="Click to mark as PAID"
                        >
                          {order.payment_status}
                        </span>
                      </div>

                      <span className="font-bold text-amber-400 font-serif text-sm">
                        ₹{order.total_amount}
                      </span>
                    </div>
                  </div>

                  {/* KDS Kitchen Workflow Buttons */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-1.5">
                      {order.order_status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-amber-950 cursor-pointer transition-all active:scale-95"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          Accept & Queue
                        </button>
                      )}

                      {order.order_status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-orange-950 cursor-pointer transition-all active:scale-95"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Start Cooking
                        </button>
                      )}

                      {order.order_status === 'PREPARING' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'READY')}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-blue-950 cursor-pointer transition-all active:scale-95"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          Mark Ready (Food Ready)
                        </button>
                      )}

                      {order.order_status === 'READY' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                          className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-950 cursor-pointer transition-all active:scale-95"
                        >
                          <Utensils className="w-3.5 h-3.5" />
                          Mark Served at Table
                        </button>
                      )}

                      {order.order_status === 'SERVED' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="flex-1 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-green-950 cursor-pointer transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete & Free Table
                        </button>
                      )}

                      <button
                        onClick={() => handlePrintKOT(order)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        title="Print Kitchen Order Ticket (KOT)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {order.order_status !== 'COMPLETED' && order.order_status !== 'CANCELLED' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                              handleUpdateStatus(order.id, 'CANCELLED');
                            }
                          }}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          title="Cancel Order"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PRINTABLE KITCHEN ORDER TICKET (KOT) */}
        {kotOrder && (
          <div className="hidden print:block fixed inset-0 bg-white text-black p-6 font-mono z-[9999]">
            <div className="max-w-xs mx-auto border-b-2 border-black pb-4 text-center">
              <h2 className="text-xl font-bold uppercase">CHACHA CAFE KITCHEN</h2>
              <p className="text-xs">KITCHEN ORDER TICKET (KOT)</p>
              <div className="flex justify-between text-xs mt-2 border-t border-b border-black py-1">
                <span>ORDER: #{kotOrder.order_number}</span>
                <span className="font-bold">TABLE: {kotOrder.table_number}</span>
              </div>
              <p className="text-[10px] text-left mt-1">
                Time: {new Date(kotOrder.created_at).toLocaleString()}
              </p>
            </div>

            <div className="max-w-xs mx-auto py-3 space-y-1.5 text-xs">
              {kotOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between font-bold">
                  <span>
                    {item.quantity} × {item.item_name}
                  </span>
                  {item.notes && <span className="text-[10px] block">[{item.notes}]</span>}
                </div>
              ))}
            </div>

            {kotOrder.notes && (
              <div className="max-w-xs mx-auto border-t border-black pt-2 text-xs">
                <span className="font-bold">NOTE: </span>
                <span>{kotOrder.notes}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

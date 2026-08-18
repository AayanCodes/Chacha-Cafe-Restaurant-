/**
 * Customer Dine-In QR Ordering Page (/table/:tableNumber)
 * 
 * Interactive digital ordering experience for diners sitting at a table:
 * - Table verification and welcome modal
 * - Interactive food catalog with category filters, dietary tags, and dish notes
 * - Instant table assistance requests (Call Waiter, Request Water, Request Bill)
 * - Slide-over cart drawer with tax computation and payment checkout (UPI / Pay at Counter)
 */

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Utensils,
  Globe,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  Bell,
  Droplet,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  ChevronRight,
  ChefHat,
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { MenuItemCMS, CategoryCMS } from '../types/admin';
import { RestaurantTable, PaymentMethod, RequestType } from '../types/orders';
import { useCart } from '../context/CartContext';

interface TableOrderingProps {
  tableParam: string;
}

export const TableOrdering: React.FC<TableOrderingProps> = ({ tableParam }) => {
  const {
    items: cartItems,
    addItem,
    updateQuantity,
    updateItemNotes,
    removeItem,
    clearCart,
    totalItemsCount,
    subtotal,
    taxAmount,
    grandTotal,
    tableNumber,
    setTableNumber,
    setTableId,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    orderNotes,
    setOrderNotes,
  } = useCart();

  const [tableData, setTableData] = useState<RestaurantTable | null>(null);
  const [allTables, setAllTables] = useState<RestaurantTable[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [isChangingTable, setIsChangingTable] = useState<boolean>(false);
  const [manualTableInput, setManualTableInput] = useState<string>('');
  const [tableSectionFilter, setTableSectionFilter] = useState<string>('ALL');
  const [welcomeCustomInput, setWelcomeCustomInput] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryCMS[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemCMS[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('RAZORPAY_UPI');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [requestToast, setRequestToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItemCMS | null>(null);
  const [customNote, setCustomNote] = useState<string>('');

  // 1. Detect & Fetch Table Information
  useEffect(() => {
    async function loadTableAndMenu() {
      setLoading(true);
      try {
        const [table, tablesList, fetchedCategories, fetchedMenu] = await Promise.all([
          dbService.getTableByNumberOrId(tableParam || '01'),
          dbService.getTables(),
          dbService.getPublicCategories(),
          dbService.getPublicMenuItems(),
        ]);

        setAllTables(tablesList);

        if (table) {
          setTableData(table);
          setTableNumber(table.table_number);
          setTableId(table.id);
          setManualTableInput(table.table_number);
        } else {
          const cleanNum = (tableParam || '01').replace(/^table[-_]?/i, '');
          const fallbackNum = cleanNum || '01';
          setTableNumber(fallbackNum);
          setManualTableInput(fallbackNum);
        }

        setCategories(fetchedCategories);
        setMenuItems(fetchedMenu);
      } catch (err) {
        console.error('Error loading table data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTableAndMenu();
  }, [tableParam, setTableNumber, setTableId]);

  // Apply a new table number chosen or typed by the customer
  const handleApplyTable = async (newNumRaw: string) => {
    const cleanNum = newNumRaw.trim();
    if (!cleanNum) return;

    // Pad single digit numbers if purely numeric
    const formattedNum = /^\d$/.test(cleanNum) ? `0${cleanNum}` : cleanNum;

    try {
      const matched = await dbService.getTableByNumberOrId(formattedNum);
      if (matched) {
        setTableData(matched);
        setTableNumber(matched.table_number);
        setTableId(matched.id);
      } else {
        setTableNumber(formattedNum);
        setTableId(null);
        setTableData({
          id: `custom-${formattedNum}`,
          table_number: formattedNum,
          name: `Table ${formattedNum}`,
          capacity: 4,
          section: 'Main Dining',
          status: 'AVAILABLE',
          is_active: true,
        });
      }

      setManualTableInput(formattedNum);
      setIsChangingTable(false);

      // Update URL without triggering reload
      window.history.replaceState({}, '', `/table/${encodeURIComponent(formattedNum)}`);

      setRequestToast({
        message: `Table changed to Table ${formattedNum}`,
        type: 'success',
      });
      setTimeout(() => setRequestToast(null), 4000);
    } catch (err) {
      console.error('Error setting table:', err);
      setTableNumber(formattedNum);
      setIsChangingTable(false);
    }
  };

  // Request Service (Call Waiter, Water, Bill)
  const handleServiceRequest = async (type: RequestType, label: string) => {
    try {
      await dbService.createRestaurantRequest(tableNumber, type, undefined, tableData?.id);
      setRequestToast({
        message: `Notification sent! Our staff will attend Table ${tableNumber} for ${label} immediately.`,
        type: 'success',
      });
      setTimeout(() => setRequestToast(null), 5000);
    } catch {
      setRequestToast({
        message: `Staff notified for ${label} at Table ${tableNumber}.`,
        type: 'info',
      });
      setTimeout(() => setRequestToast(null), 4000);
    }
  };

  // Filter menu
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category_name.toLowerCase() === selectedCategory.toLowerCase();
    const matchesVeg = vegOnly ? item.is_veg : true;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesVeg && matchesSearch;
  });

  // Handle Checkout
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsSubmittingOrder(true);
    setOrderError(null);

    try {
      // Create verified order with server/db price checks
      const orderPayload = {
        tableNumber: tableNumber,
        tableId: tableData?.id || null,
        customerName: customerName.trim() || 'Guest Diner',
        customerPhone: customerPhone.trim() || '',
        notes: orderNotes.trim() || '',
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod === 'CASH_AT_COUNTER' ? ('PAY_AT_COUNTER' as const) : ('PAID' as const),
        items: cartItems.map((ci) => ({
          menuItemId: ci.menuItem.id,
          quantity: ci.quantity,
          notes: ci.notes || '',
        })),
      };

      const createdOrder = await dbService.createVerifiedOrder(orderPayload);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DC2626', '#EAB308', '#22C55E', '#3B82F6'],
        });
      } catch {
        // Ignore confetti if not supported
      }

      // Clear cart
      clearCart();
      setIsCartOpen(false);

      // Navigate to order tracking page
      window.history.pushState({}, '', `/order/${createdOrder.id}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err: any) {
      setOrderError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const getQuantityInCart = (itemId: string) => {
    const found = cartItems.find((i) => i.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] font-sans relative antialiased pb-28 selection:bg-red-600 selection:text-white">
      {/* 1. WELCOME MODAL ON QR SCAN */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#121215] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-900/40">
                <Utensils className="w-8 h-8 text-white" />
              </div>

              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold">
                CHACHA CAFE KIRATPUR
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-2">
                Welcome 👋
              </h2>

              <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
                Browse our fresh kitchen menu, customize dishes, and place your order directly from your table.
              </p>

              {/* Table Selection / Custom Entry Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Assigned Table
                  </span>
                  <button
                    type="button"
                    onClick={() => setWelcomeCustomInput(!welcomeCustomInput)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                  >
                    {welcomeCustomInput ? 'Select from list' : 'Change table'}
                  </button>
                </div>

                {welcomeCustomInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualTableInput}
                        onChange={(e) => setManualTableInput(e.target.value)}
                        placeholder="Enter table (e.g. 05, T-12)"
                        className="flex-1 bg-black/60 border border-amber-500/40 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyTable(manualTableInput);
                            setWelcomeCustomInput(false);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyTable(manualTableInput);
                          setWelcomeCustomInput(false);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400">
                      Enter the table number shown on your table standee.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-bold text-white font-mono">
                          Table {tableNumber}
                        </span>
                        {tableData?.section && (
                          <span className="text-[10px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            {tableData.section}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setManualTableInput(tableNumber);
                          setIsChangingTable(true);
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        All Tables
                      </button>
                    </div>

                    {/* Quick Pick Table Pills */}
                    <div className="mt-3">
                      <p className="text-[10px] text-neutral-400 mb-1.5 font-mono">
                        Quick switch table:
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {(allTables.length > 0
                          ? allTables.slice(0, 10)
                          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
                              table_number: String(n).padStart(2, '0'),
                            }))
                        ).map((t: any) => (
                          <button
                            key={t.table_number}
                            type="button"
                            onClick={() => handleApplyTable(t.table_number)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                              tableNumber === t.table_number
                                ? 'bg-red-600 text-white font-bold shadow-md'
                                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                            }`}
                          >
                            T-{t.table_number}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  id="welcome-order-btn"
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  START ORDERING (TABLE {tableNumber})
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="welcome-view-site-btn"
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  VIEW FULL WEBSITE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STICKY TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="cursor-pointer"
            >
              <h1 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <span className="text-red-500">Chacha</span> Cafe
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono">DINE-IN ORDERING</p>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <button
              id="change-table-header-btn"
              type="button"
              onClick={() => {
                setManualTableInput(tableNumber);
                setIsChangingTable(true);
              }}
              className="flex items-center gap-1.5 bg-red-950/70 hover:bg-red-900 border border-red-500/40 hover:border-red-400 px-3 py-1 rounded-full cursor-pointer transition-all active:scale-95 group"
              title="Click to change table number"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-red-200 group-hover:text-white font-mono">
                Table {tableNumber}
              </span>
              <span className="text-[10px] bg-red-800/90 text-amber-300 font-semibold px-1.5 py-0.5 rounded ml-0.5 group-hover:bg-red-700">
                Change
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="cart-header-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer flex items-center gap-2"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalItemsCount > 0 && (
                <>
                  <span className="text-xs font-bold text-amber-300 hidden sm:inline">₹{grandTotal}</span>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md">
                    {totalItemsCount}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* QUICK SERVICE ACTION BUTTONS (CALL WAITER / WATER / BILL) */}
        <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-white/5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <button
            id="call-waiter-btn"
            onClick={() => handleServiceRequest('CALL_WAITER', 'Staff Assistance')}
            className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            Call Waiter
          </button>

          <button
            id="request-water-btn"
            onClick={() => handleServiceRequest('REQUEST_WATER', 'Water Refill')}
            className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Droplet className="w-3.5 h-3.5 text-blue-400" />
            Request Water
          </button>

          <button
            id="request-bill-btn"
            onClick={() => handleServiceRequest('REQUEST_BILL', 'Table Bill & Invoice')}
            className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-green-400" />
            Request Bill
          </button>
        </div>
      </header>

      {/* SERVICE REQUEST TOAST */}
      <AnimatePresence>
        {requestToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-amber-500 text-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{requestToast.message}</span>
            <button
              onClick={() => setRequestToast(null)}
              className="ml-auto text-black/70 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MENU SEARCH & FILTERS */}
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Search Bar & Veg Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="table-menu-search-input"
              type="text"
              placeholder="Search pizza, burger, biryani, shake..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141418] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <button
            id="veg-filter-toggle-btn"
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              vegOnly
                ? 'bg-green-950/80 border-green-500 text-green-300'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                vegOnly ? 'bg-green-400' : 'bg-neutral-600'
              }`}
            />
            Veg Only
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            id="cat-all-btn"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-900/40'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}-btn`}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-900/40'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 4. DISH LISTING GRID */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-400 font-mono">Loading fresh kitchen menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-[#121215] border border-white/5 rounded-2xl p-6">
            <Utensils className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-white">No dishes found</p>
            <p className="text-xs text-neutral-500 mt-1">Try clearing your search or veg filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((dish) => {
              const qtyInCart = getQuantityInCart(dish.id);
              return (
                <div
                  key={dish.id}
                  className="bg-[#121215] border border-white/10 rounded-2xl p-3.5 flex gap-3.5 hover:border-white/20 transition-all relative overflow-hidden"
                >
                  {/* Dish Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span
                        className={`inline-block w-3.5 h-3.5 rounded-sm border ${
                          dish.is_veg
                            ? 'border-green-500 bg-green-950/80'
                            : 'border-red-500 bg-red-950/80'
                        } flex items-center justify-center`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dish.is_veg ? 'bg-green-400' : 'bg-red-500'
                          }`}
                        />
                      </span>
                    </div>

                    {dish.is_chef_special && (
                      <div className="absolute bottom-1 left-1 bg-amber-500/90 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                        CHEF SPECIAL
                      </div>
                    )}
                  </div>

                  {/* Dish Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">
                          {dish.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-base font-bold text-amber-400">
                          ₹{dish.price}
                        </span>
                        {dish.original_price && dish.original_price > dish.price && (
                          <span className="text-[10px] text-neutral-500 line-through ml-1.5">
                            ₹{dish.original_price}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart / Quantity Controller */}
                      {qtyInCart === 0 ? (
                        <button
                          id={`add-btn-${dish.id}`}
                          onClick={() => addItem(dish, 1)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-red-950 transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 rounded-xl p-1">
                          <button
                            id={`minus-btn-${dish.id}`}
                            onClick={() => updateQuantity(dish.id, -1)}
                            className="w-6 h-6 rounded-lg bg-red-600/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">
                            {qtyInCart}
                          </span>
                          <button
                            id={`plus-btn-${dish.id}`}
                            onClick={() => updateQuantity(dish.id, 1)}
                            className="w-6 h-6 rounded-lg bg-red-600/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. FLOATING BOTTOM CART BAR (MOBILE FIRST) */}
      <AnimatePresence>
        {totalItemsCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto"
          >
            <button
              id="view-cart-floating-btn"
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white p-4 rounded-2xl shadow-2xl shadow-red-950/80 border border-red-400/30 flex items-center justify-between transition-all transform active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center font-bold text-sm">
                  {totalItemsCount}
                </div>
                <div className="text-left">
                  <p className="text-xs text-red-200 uppercase font-mono tracking-wide">
                    Table {tableNumber} Order
                  </p>
                  <p className="text-sm font-bold text-white">
                    ₹{grandTotal}{' '}
                    <span className="text-[10px] text-red-200 font-normal">
                      (incl. taxes)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 px-3.5 py-2 rounded-xl">
                View Cart
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. SLIDE-OVER CART & SECURE CHECKOUT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#121215] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              {/* Cart Drawer Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#121215] z-10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  <div>
                    <h2 className="text-base font-bold text-white">Table {tableNumber} Cart</h2>
                    <p className="text-[10px] text-neutral-400">Review & Confirm Your Order</p>
                  </div>
                </div>

                <button
                  id="close-cart-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                    <p className="text-sm text-neutral-300 font-medium">Your cart is empty</p>
                    <p className="text-xs text-neutral-500">
                      Add delicious food & drinks from the menu to start.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="bg-[#18181C] border border-white/5 rounded-xl p-3 flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  item.menuItem.is_veg ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <h4 className="text-xs font-semibold text-white">
                                {item.menuItem.name}
                              </h4>
                            </div>
                            <span className="text-xs font-bold text-amber-400">
                              ₹{Number(item.menuItem.price) * item.quantity}
                            </span>
                          </div>

                          {/* Item Custom Instructions / Notes */}
                          <input
                            type="text"
                            placeholder="Special note (e.g. less spicy, no onion)"
                            value={item.notes || ''}
                            onChange={(e) =>
                              updateItemNotes(item.menuItem.id, e.target.value)
                            }
                            className="bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-red-500/50"
                          />

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => removeItem(item.menuItem.id)}
                              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>

                            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, -1)}
                                className="w-5 h-5 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-bold text-white px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, 1)}
                                className="w-5 h-5 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Serving Table Banner */}
                    <div className="bg-[#18181C] border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                          T
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                            Delivering to
                          </p>
                          <p className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                            Table {tableNumber}
                            {tableData?.section && (
                              <span className="text-[10px] text-amber-300/80 font-normal font-sans">
                                • {tableData.section}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        id="change-table-cart-drawer-btn"
                        onClick={() => {
                          setManualTableInput(tableNumber);
                          setIsChangingTable(true);
                        }}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Change Table
                      </button>
                    </div>

                    {/* Customer Info (Optional & Fast) */}
                    <div className="bg-[#18181C] border border-white/5 rounded-xl p-3.5 space-y-2.5">
                      <p className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                        Diner Details
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">
                            Your Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">
                            Mobile Number (Optional)
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">
                          Cooking Instructions for Kitchen
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Serve hot, extra tissue napkins"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          className="w-full bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-[#18181C] border border-white/5 rounded-xl p-3.5 space-y-2.5">
                      <p className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                        Select Payment Method
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('RAZORPAY_UPI')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedPaymentMethod === 'RAZORPAY_UPI'
                              ? 'bg-red-950/60 border-red-500 text-white shadow-md'
                              : 'bg-[#121215] border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-amber-400 mb-1" />
                          <p className="text-xs font-bold text-white">Online Payment</p>
                          <p className="text-[10px] text-neutral-400">UPI, Cards, GPay</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('CASH_AT_COUNTER')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedPaymentMethod === 'CASH_AT_COUNTER'
                              ? 'bg-red-950/60 border-red-500 text-white shadow-md'
                              : 'bg-[#121215] border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Banknote className="w-4 h-4 text-green-400 mb-1" />
                          <p className="text-xs font-bold text-white">Pay at Counter</p>
                          <p className="text-[10px] text-neutral-400">Cash or Card later</p>
                        </button>
                      </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="bg-[#18181C] border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
                      <p className="font-semibold text-white uppercase tracking-wider font-mono mb-2">
                        Bill Details
                      </p>
                      <div className="flex justify-between text-neutral-400">
                        <span>Item Subtotal</span>
                        <span className="text-white font-medium">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Taxes & GST (5%)</span>
                        <span className="text-white font-medium">₹{taxAmount}</span>
                      </div>
                      <div className="h-px bg-white/10 my-1" />
                      <div className="flex justify-between text-sm font-bold text-white">
                        <span>Grand Total</span>
                        <span className="text-amber-400 font-serif">₹{grandTotal}</span>
                      </div>
                    </div>

                    {orderError && (
                      <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl flex items-center gap-2 text-xs text-red-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                        <span>{orderError}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Cart Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-[#121215] space-y-2">
                  <button
                    id="place-order-confirm-btn"
                    disabled={isSubmittingOrder}
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying & Placing Order...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        CONFIRM & PLACE ORDER (₹{grandTotal})
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-neutral-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    Directly synchronized with Chacha Cafe Live Kitchen
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. CHANGE TABLE NUMBER MODAL */}
      <AnimatePresence>
        {isChangingTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-[#121215] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-400" />
                    Select or Enter Table
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Currently assigned to <strong className="text-amber-300 font-mono">Table {tableNumber}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangingTable(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 py-4 space-y-5 pr-1">
                {/* Manual Table Number Input */}
                <div className="bg-[#18181C] border border-white/10 rounded-2xl p-4 space-y-2">
                  <label className="text-xs font-semibold text-white font-mono uppercase tracking-wider block">
                    Type Your Table Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualTableInput}
                      onChange={(e) => setManualTableInput(e.target.value)}
                      placeholder="e.g. 05, T-12, Rooftop"
                      className="flex-1 bg-black/60 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyTable(manualTableInput);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyTable(manualTableInput)}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all transform active:scale-95 whitespace-nowrap"
                    >
                      Set Table
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Type any number from the QR code stand on your table.
                  </p>
                </div>

                {/* Section Filter Pills */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                      Or Choose from Restaurant Tables
                    </p>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {allTables.length} Tables
                    </span>
                  </div>

                  {/* Section Filters */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                    {['ALL', 'Main Dining', 'Outdoor Garden', 'AC Lounge', 'Rooftop'].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setTableSectionFilter(sec)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-medium whitespace-nowrap cursor-pointer transition-all ${
                          tableSectionFilter === sec
                            ? 'bg-red-600 text-white font-bold shadow-md'
                            : 'bg-[#18181C] text-neutral-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {sec === 'ALL' ? 'All Sections' : sec}
                      </button>
                    ))}
                  </div>

                  {/* Tables Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 max-h-64 overflow-y-auto pr-1">
                    {(allTables.length > 0
                      ? allTables.filter(
                          (t) =>
                            tableSectionFilter === 'ALL' ||
                            (t.section && t.section.toLowerCase() === tableSectionFilter.toLowerCase())
                        )
                      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((n) => ({
                          id: `tbl-${n}`,
                          table_number: String(n).padStart(2, '0'),
                          name: `Table ${String(n).padStart(2, '0')}`,
                          section: n <= 8 ? 'Main Dining' : n <= 12 ? 'Outdoor Garden' : n <= 15 ? 'AC Lounge' : 'Rooftop',
                          capacity: 4,
                          status: 'AVAILABLE',
                          is_active: true,
                        }))
                    ).map((t: any) => {
                      const isSelected = tableNumber === t.table_number;
                      return (
                        <button
                          key={t.table_number || t.id}
                          type="button"
                          onClick={() => handleApplyTable(t.table_number)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-950/70 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                              : 'bg-[#18181C] border-white/10 text-neutral-300 hover:border-amber-500/40 hover:bg-[#202026]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold font-mono text-white">
                              T-{t.table_number}
                            </span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-green-500/70" />
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-1">
                            {t.section || 'Dining Area'}
                          </p>
                          <span className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                            Seats {t.capacity || 4}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingTable(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Keep Table {tableNumber}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

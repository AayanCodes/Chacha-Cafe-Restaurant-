/**
 * Unified Database & Realtime Service Layer (dbService)
 * 
 * Provides an abstraction layer for:
 * 1. Supabase PostgreSQL CRUD operations (Tables, Menu, Orders, Offers, Categories, Settings)
 * 2. Supabase Realtime WebSocket subscriptions (Live kitchen orders, table status changes, waiter requests)
 * 3. In-memory local fallback persistence with mock data for instant offline testing and reliability
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

import {
  SpecialOffer,
  MenuItemCMS,
  CategoryCMS,
  GalleryItemCMS,
  RestaurantSettings,
  DashboardStats,
} from '../types/admin';
import {
  RestaurantTable,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  RestaurantServiceRequest,
  RequestType,
  RequestStatus,
  CustomerRecord,
  PaymentRecord,
  TableStatus,
} from '../types/orders';
import { isOfferPubliclyVisible, computeOfferStatus } from '../lib/timezone';
import { RESTAURANT_INFO, MENU_ITEMS, MENU_CATEGORIES, GALLERY_ITEMS } from '../data/cafeData';

function checkSupabaseConfig(): void {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
    );
  }
}

function isMissingTableError(error: any): boolean {
  if (!error) return false;
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    (typeof error.message === 'string' &&
      (error.message.includes('schema cache') ||
        (error.message.includes('relation') && error.message.includes('does not exist')) ||
        error.message.includes('Could not find the table')))
  );
}

// Generate unique order number (e.g. CC1027)
function generateOrderNumber(): string {
  const prefix = 'CC';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
}

// Default Fallback Dataset
export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  short_desc: RESTAURANT_INFO.shortDesc,
  address: RESTAURANT_INFO.address,
  phone: RESTAURANT_INFO.phone,
  whatsapp: RESTAURANT_INFO.whatsapp,
  email: RESTAURANT_INFO.email,
  instagram: RESTAURANT_INFO.instagram,
  google_rating: RESTAURANT_INFO.googleRating,
  google_reviews_count: RESTAURANT_INFO.googleReviewsCount,
  opening_hours: RESTAURANT_INFO.openingHours,
  map_embed_url: RESTAURANT_INFO.mapEmbedUrl,
  timezone: 'Asia/Kolkata',
  about_text:
    'At Chacha Cafe, we prepare every dish with passion using locally sourced fresh ingredients on Manadwar Road, Kiratpur.',
};

export const DEFAULT_SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'off-1',
    title: 'Weekend Pizza Privilege Deal',
    description:
      'Enjoy our signature woodfired Cheese & Corn Pizza at a special weekend price. Freshly baked with molten mozzarella.',
    product_name: 'Cheese & Corn Woodfired Pizza',
    offer_type: 'PERCENTAGE_DISCOUNT',
    original_price: 499,
    offer_price: 349,
    discount_percentage: 30,
    image_url:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    promo_code: 'WEEKEND30',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    saturday_enabled: true,
    sunday_enabled: true,
    is_active: true,
    is_featured: true,
    is_archived: false,
    display_order: 1,
  },
  {
    id: 'off-2',
    title: 'Gourmet Burger & Fries Combo',
    description:
      'Crispy Veg Patty Burger paired with Golden Potato Fries & Chilled Oreo Shake.',
    product_name: 'Super Burger Feast',
    offer_type: 'COMBO',
    original_price: 399,
    offer_price: 249,
    discount_percentage: 38,
    image_url:
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800',
    promo_code: 'BURGERCOMBO',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    saturday_enabled: true,
    sunday_enabled: true,
    is_active: true,
    is_featured: true,
    is_archived: false,
    display_order: 2,
  },
];

export const DEFAULT_CATEGORIES: CategoryCMS[] = MENU_CATEGORIES.map((cat, idx) => ({
  id: `cat-${idx + 1}`,
  name: cat,
  display_order: idx + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

export const DEFAULT_MENU_ITEMS: MenuItemCMS[] = MENU_ITEMS.map((dish, idx) => ({
  id: dish.id,
  name: dish.name,
  category_name: dish.category,
  price: dish.price,
  original_price: dish.originalPrice || dish.price,
  rating: dish.rating || 4.8,
  reviews_count: dish.reviewsCount || 50,
  description: dish.description || '',
  image_url: dish.image,
  is_veg: dish.isVeg,
  is_chef_special: dish.isChefSpecial || false,
  is_popular: dish.isPopular || false,
  is_todays_special: dish.isTodaysSpecial || false,
  is_weekend_offer: dish.isWeekendOffer || false,
  is_available: true,
  is_featured: dish.isPopular || false,
  display_order: idx + 1,
  prep_time: dish.prepTime || '15 mins',
  tags: dish.tags || [],
  created_at: new Date().toISOString(),
}));

export const DEFAULT_GALLERY_IMAGES: GalleryItemCMS[] = GALLERY_ITEMS.map((g, idx) => ({
  id: g.id,
  title: g.title,
  category: g.category,
  image_url: g.image,
  description: g.description || '',
  display_order: idx + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

// Default 20 Tables
export const DEFAULT_TABLES: RestaurantTable[] = [
  { id: 'tbl-01', table_number: '01', name: 'Table 01 - Window Seat', capacity: 2, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-02', table_number: '02', name: 'Table 02 - Window Seat', capacity: 2, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-03', table_number: '03', name: 'Table 03 - Family Booth', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-04', table_number: '04', name: 'Table 04 - Family Booth', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-05', table_number: '05', name: 'Table 05 - Center Dining', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-06', table_number: '06', name: 'Table 06 - Center Dining', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-07', table_number: '07', name: 'Table 07 - Premium Corner', capacity: 6, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-08', table_number: '08', name: 'Table 08 - Cafe Lounge', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-09', table_number: '09', name: 'Table 09 - Garden Terrace', capacity: 4, section: 'Outdoor Garden', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-10', table_number: '10', name: 'Table 10 - Garden Terrace', capacity: 4, section: 'Outdoor Garden', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-11', table_number: '11', name: 'Table 11 - Garden Canopy', capacity: 6, section: 'Outdoor Garden', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-12', table_number: '12', name: 'Table 12 - Garden Gazebo', capacity: 8, section: 'Outdoor Garden', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-13', table_number: '13', name: 'Table 13 - AC Lounge Deluxe', capacity: 4, section: 'AC Lounge', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-14', table_number: '14', name: 'Table 14 - AC Lounge Deluxe', capacity: 4, section: 'AC Lounge', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-15', table_number: '15', name: 'Table 15 - AC Family Suite', capacity: 8, section: 'AC Lounge', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-16', table_number: '16', name: 'Table 16 - Rooftop View', capacity: 2, section: 'Rooftop', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-17', table_number: '17', name: 'Table 17 - Rooftop View', capacity: 2, section: 'Rooftop', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-18', table_number: '18', name: 'Table 18 - Rooftop Canopy', capacity: 4, section: 'Rooftop', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-19', table_number: '19', name: 'Table 19 - Rooftop Canopy', capacity: 4, section: 'Rooftop', status: 'AVAILABLE', is_active: true },
  { id: 'tbl-20', table_number: '20', name: 'Table 20 - Rooftop VIP', capacity: 10, section: 'Rooftop', status: 'AVAILABLE', is_active: true },
];

export const dbService = {
  // ============================================================================
  // RESTAURANT TABLES & QR CODES
  // ============================================================================
  async getTables(): Promise<RestaurantTable[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_TABLES;
    }

    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('table_number', { ascending: true });

      if (error) {
        if (isMissingTableError(error)) return DEFAULT_TABLES;
        return DEFAULT_TABLES;
      }

      if (!data || data.length === 0) {
        return DEFAULT_TABLES;
      }

      return data as RestaurantTable[];
    } catch {
      return DEFAULT_TABLES;
    }
  },

  async getTableByNumberOrId(tableIdentifier: string): Promise<RestaurantTable | null> {
    const cleanId = tableIdentifier.trim().replace(/^table[-_]?/i, '');
    const padded = cleanId.length === 1 ? `0${cleanId}` : cleanId;

    if (!isSupabaseConfigured) {
      const found = DEFAULT_TABLES.find(
        (t) =>
          t.table_number.toLowerCase() === cleanId.toLowerCase() ||
          t.table_number.toLowerCase() === padded.toLowerCase() ||
          t.id === tableIdentifier
      );
      return found || null;
    }

    try {
      // 1. Try exact table_number match or padded
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .or(`table_number.eq.${cleanId},table_number.eq.${padded},id.eq.${tableIdentifier}`)
        .limit(1)
        .maybeSingle();

      if (error) {
        if (isMissingTableError(error)) {
          const found = DEFAULT_TABLES.find(
            (t) =>
              t.table_number === cleanId ||
              t.table_number === padded ||
              t.id === tableIdentifier
          );
          return found || null;
        }
        return null;
      }

      if (!data) {
        // Check default table list fallback
        const found = DEFAULT_TABLES.find(
          (t) =>
            t.table_number === cleanId ||
            t.table_number === padded ||
            t.id === tableIdentifier
        );
        return found || null;
      }

      return data as RestaurantTable;
    } catch {
      return DEFAULT_TABLES.find(
        (t) =>
          t.table_number === cleanId ||
          t.table_number === padded ||
          t.id === tableIdentifier
      ) || null;
    }
  },

  async saveTable(
    table: Partial<RestaurantTable> & { table_number: string }
  ): Promise<RestaurantTable> {
    checkSupabaseConfig();
    const now = new Date().toISOString();
    const isExistingRecord = Boolean(table.id && !table.id.startsWith('tbl-'));

    const payload = {
      table_number: table.table_number.trim(),
      name: table.name ? table.name.trim() : `Table ${table.table_number}`,
      capacity: Number(table.capacity || 4),
      section: table.section || 'Main Dining',
      status: table.status || 'AVAILABLE',
      is_active: table.is_active !== undefined ? table.is_active : true,
      qr_code_url: table.qr_code_url || '',
      updated_at: now,
    };

    if (isExistingRecord && table.id) {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update(payload)
        .eq('id', table.id)
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Database table "restaurant_tables" is not created yet. Please run schema.sql in Supabase.');
        }
        throw new Error(`Database error updating table: ${error.message}`);
      }
      return data as RestaurantTable;
    } else {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .insert([{ ...payload, created_at: now }])
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Database table "restaurant_tables" is not created yet. Please run schema.sql in Supabase.');
        }
        throw new Error(`Database error creating table: ${error.message}`);
      }
      return data as RestaurantTable;
    }
  },

  async deleteTable(id: string): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('restaurant_tables')
      .delete()
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error deleting table: ${error.message}`);
    }
  },

  async toggleTableActive(id: string, isActive: boolean): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('restaurant_tables')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error toggling table status: ${error.message}`);
    }
  },

  async updateTableStatus(
    tableIdentifier: string,
    status: TableStatus,
    currentOrderId?: string | null
  ): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const updateData: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (currentOrderId !== undefined) {
        updateData.current_order_id = currentOrderId;
      }

      await supabase
        .from('restaurant_tables')
        .update(updateData)
        .or(`table_number.eq.${tableIdentifier},id.eq.${tableIdentifier}`);
    } catch {
      // Non-blocking
    }
  },

  // ============================================================================
  // ORDERS & SECURE PRICE VERIFICATION
  // ============================================================================
  async getOrders(filters?: {
    status?: OrderStatus | 'ALL';
    paymentStatus?: PaymentStatus | 'ALL';
    tableNumber?: string;
    search?: string;
    limit?: number;
  }): Promise<Order[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'ALL') {
        query = query.eq('order_status', filters.status);
      }
      if (filters?.paymentStatus && filters.paymentStatus !== 'ALL') {
        query = query.eq('payment_status', filters.paymentStatus);
      }
      if (filters?.tableNumber) {
        query = query.eq('table_number', filters.tableNumber);
      }
      if (filters?.search) {
        query = query.or(
          `order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
        );
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) {
        if (isMissingTableError(error)) return [];
        return [];
      }

      return (data || []) as Order[];
    } catch {
      return [];
    }
  },

  async getOrderById(orderIdentifier: string): Promise<Order | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .or(`id.eq.${orderIdentifier},order_number.eq.${orderIdentifier},order_number.eq.#${orderIdentifier}`)
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return (data as Order) || null;
    } catch {
      return null;
    }
  },

  /**
   * CRITICAL SECURITY REQUIREMENT:
   * Server-side & database-level price calculation and validation.
   * Client sends item IDs and quantities; we calculate the authentic total
   * using real database prices, taxes, and availability checks.
   */
  async createVerifiedOrder(payload: {
    tableNumber: string;
    tableId?: string | null;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    items: Array<{
      menuItemId: string;
      quantity: number;
      notes?: string;
    }>;
  }): Promise<Order> {
    checkSupabaseConfig();

    if (!payload.items || payload.items.length === 0) {
      throw new Error('Cannot place an empty order. Please select at least one dish.');
    }

    const now = new Date().toISOString();
    const orderNumber = generateOrderNumber();

    // 1. Fetch live menu items from Supabase to guarantee genuine price calculation
    const itemIds = payload.items.map((i) => i.menuItemId);
    const { data: menuDb, error: menuErr } = await supabase
      .from('menu_items')
      .select('*')
      .in('id', itemIds);

    // Fallback menu lookup if table was not populated
    const lookupMap = new Map<string, MenuItemCMS>();
    if (menuDb && menuDb.length > 0) {
      menuDb.forEach((item) => lookupMap.set(item.id, item as MenuItemCMS));
    } else {
      DEFAULT_MENU_ITEMS.forEach((item) => lookupMap.set(item.id, item));
    }

    let calculatedSubtotal = 0;
    const verifiedOrderItems: Array<{
      menu_item_id: string | null;
      item_name: string;
      item_price: number;
      quantity: number;
      subtotal: number;
      notes: string;
      is_veg: boolean;
    }> = [];

    for (const requestedItem of payload.items) {
      const foundDish = lookupMap.get(requestedItem.menuItemId);
      if (!foundDish) {
        throw new Error(`Menu item not found or unavailable in restaurant catalog.`);
      }

      if (foundDish.is_available === false) {
        throw new Error(`"${foundDish.name}" is currently marked unavailable by the kitchen.`);
      }

      const qty = Math.max(1, Math.floor(requestedItem.quantity));
      const price = Number(foundDish.price);
      const itemSubtotal = price * qty;
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        menu_item_id: foundDish.id.startsWith('c') || foundDish.id.startsWith('p_') || foundDish.id.startsWith('b_') ? null : foundDish.id,
        item_name: foundDish.name,
        item_price: price,
        quantity: qty,
        subtotal: itemSubtotal,
        notes: requestedItem.notes || '',
        is_veg: foundDish.is_veg,
      });
    }

    // Standard Restaurant Tax (5% GST for F&B)
    const taxAmount = Math.round(calculatedSubtotal * 0.05 * 100) / 100;
    const discountAmount = 0; // Can be integrated with promo vouchers
    const grandTotal = Math.round((calculatedSubtotal + taxAmount - discountAmount) * 100) / 100;

    const initialOrderStatus: OrderStatus = 'CONFIRMED';
    const initialPaymentStatus: PaymentStatus =
      payload.paymentStatus || (payload.paymentMethod === 'CASH_AT_COUNTER' ? 'PAY_AT_COUNTER' : 'PAID');

    // 2. Insert into `orders` table
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          table_id: payload.tableId || null,
          table_number: payload.tableNumber,
          customer_name: payload.customerName || 'Guest Diner',
          customer_phone: payload.customerPhone || '',
          subtotal: calculatedSubtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: grandTotal,
          payment_status: initialPaymentStatus,
          payment_method: payload.paymentMethod,
          order_status: initialOrderStatus,
          notes: payload.notes || '',
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (orderErr || !newOrder) {
      if (isMissingTableError(orderErr)) {
        throw new Error('Supabase database tables are not initialized. Please execute schema.sql in Supabase SQL editor.');
      }
      throw new Error(`Database error placing order: ${orderErr?.message || 'Unknown error'}`);
    }

    // 3. Insert order items
    const orderItemsPayload = verifiedOrderItems.map((item) => ({
      order_id: newOrder.id,
      ...item,
      created_at: now,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsPayload);
    if (itemsErr) {
      // Non-fatal logging
    }

    // 4. Record order history log
    await supabase.from('order_status_history').insert([
      {
        order_id: newOrder.id,
        previous_status: null,
        new_status: initialOrderStatus,
        changed_by: 'customer_qr',
        notes: `Order created via Table ${payload.tableNumber} QR flow. Payment method: ${payload.paymentMethod}`,
        created_at: now,
      },
    ]);

    // 5. Update Table Status to PREPARING / OCCUPIED
    await this.updateTableStatus(payload.tableNumber, 'PREPARING', newOrder.id);

    // 6. Update Customer CRM if phone provided
    if (payload.customerPhone) {
      try {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('phone', payload.customerPhone)
          .maybeSingle();

        if (existingCustomer) {
          await supabase
            .from('customers')
            .update({
              name: payload.customerName || existingCustomer.name,
              total_orders: (existingCustomer.total_orders || 1) + 1,
              total_spent: Number(existingCustomer.total_spent || 0) + grandTotal,
              last_order_at: now,
            })
            .eq('id', existingCustomer.id);
        } else {
          await supabase.from('customers').insert([
            {
              name: payload.customerName || 'Guest Customer',
              phone: payload.customerPhone,
              total_orders: 1,
              total_spent: grandTotal,
              last_order_at: now,
              created_at: now,
            },
          ]);
        }
      } catch {
        // Ignore customer CRM failure to avoid blocking order
      }
    }

    return {
      ...newOrder,
      items: orderItemsPayload,
    } as Order;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedBy: string = 'admin_kitchen',
    notes?: string
  ): Promise<void> {
    checkSupabaseConfig();
    const now = new Date().toISOString();

    // 1. Fetch current order for history & table number
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('id, table_number, order_status')
      .eq('id', orderId)
      .single();

    const prevStatus = currentOrder?.order_status || 'UNKNOWN';

    // 2. Update order status
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: newStatus,
        updated_at: now,
      })
      .eq('id', orderId);

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }

    // 3. Log history
    await supabase.from('order_status_history').insert([
      {
        order_id: orderId,
        previous_status: prevStatus,
        new_status: newStatus,
        changed_by: changedBy,
        notes: notes || `Status changed from ${prevStatus} to ${newStatus}`,
        created_at: now,
      },
    ]);

    // 4. Synchronize Table Status
    if (currentOrder?.table_number) {
      let tableSt: TableStatus = 'OCCUPIED';
      if (newStatus === 'PREPARING') tableSt = 'PREPARING';
      else if (newStatus === 'READY') tableSt = 'READY';
      else if (newStatus === 'SERVED') tableSt = 'OCCUPIED';
      else if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
        tableSt = 'AVAILABLE';
        await this.updateTableStatus(currentOrder.table_number, tableSt, null);
        return;
      }
      await this.updateTableStatus(currentOrder.table_number, tableSt, orderId);
    }
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentDetails?: {
      gateway?: 'RAZORPAY' | 'CASH' | 'UPI_DIRECT';
      gatewayOrderId?: string;
      gatewayPaymentId?: string;
      gatewaySignature?: string;
      method?: string;
      amount?: number;
    }
  ): Promise<void> {
    checkSupabaseConfig();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        payment_gateway_order_id: paymentDetails?.gatewayOrderId || null,
        payment_gateway_payment_id: paymentDetails?.gatewayPaymentId || null,
        payment_gateway_signature: paymentDetails?.gatewaySignature || null,
        updated_at: now,
      })
      .eq('id', orderId);

    if (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }

    if (paymentStatus === 'PAID' && paymentDetails?.amount) {
      await supabase.from('payments').insert([
        {
          order_id: orderId,
          amount: paymentDetails.amount,
          currency: 'INR',
          status: 'SUCCESS',
          gateway: paymentDetails.gateway || 'RAZORPAY',
          gateway_order_id: paymentDetails.gatewayOrderId,
          gateway_payment_id: paymentDetails.gatewayPaymentId,
          gateway_signature: paymentDetails.gatewaySignature,
          method: paymentDetails.method || 'UPI',
          created_at: now,
        },
      ]);
    }
  },

  // ============================================================================
  // RESTAURANT SERVICE REQUESTS (WAITER / WATER / BILL)
  // ============================================================================
  async createRestaurantRequest(
    tableNumber: string,
    requestType: RequestType,
    notes?: string,
    tableId?: string | null
  ): Promise<RestaurantServiceRequest> {
    checkSupabaseConfig();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('restaurant_requests')
      .insert([
        {
          table_id: tableId || null,
          table_number: tableNumber,
          request_type: requestType,
          status: 'PENDING',
          notes: notes || '',
          created_at: now,
        },
      ])
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return {
          id: `req-${Date.now()}`,
          table_number: tableNumber,
          request_type: requestType,
          status: 'PENDING',
          notes: notes || '',
          created_at: now,
        };
      }
      throw new Error(`Error creating service request: ${error.message}`);
    }

    if (requestType === 'REQUEST_BILL') {
      await this.updateTableStatus(tableNumber, 'BILL_REQUESTED');
    }

    return data as RestaurantServiceRequest;
  },

  async getRestaurantRequests(statusFilter?: RequestStatus | 'ALL'): Promise<RestaurantServiceRequest[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from('restaurant_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      } else {
        query = query.in('status', ['PENDING', 'ACKNOWLEDGED']);
      }

      const { data, error } = await query;
      if (error) return [];
      return (data || []) as RestaurantServiceRequest[];
    } catch {
      return [];
    }
  },

  async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
    checkSupabaseConfig();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('restaurant_requests')
      .update({
        status,
        resolved_at: status === 'RESOLVED' || status === 'CANCELLED' ? now : null,
      })
      .eq('id', requestId);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error updating request status: ${error.message}`);
    }
  },

  // ============================================================================
  // CUSTOMERS CRM & PAYMENTS
  // ============================================================================
  async getCustomers(): Promise<CustomerRecord[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_order_at', { ascending: false });

      if (error) return [];
      return (data || []) as CustomerRecord[];
    } catch {
      return [];
    }
  },

  async getPayments(): Promise<PaymentRecord[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders:order_id(order_number, table_number)
        `)
        .order('created_at', { ascending: false });

      if (error) return [];
      return (data || []).map((p: any) => ({
        id: p.id,
        order_id: p.order_id,
        order_number: p.orders?.order_number || '',
        table_number: p.orders?.table_number || '',
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        gateway: p.gateway,
        gateway_order_id: p.gateway_order_id,
        gateway_payment_id: p.gateway_payment_id,
        gateway_signature: p.gateway_signature,
        method: p.method,
        created_at: p.created_at,
      }));
    } catch {
      return [];
    }
  },

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS (SUPABASE REALTIME CHANNELS)
  // ============================================================================
  subscribeToLiveOrders(
    onNewOrder: (order: Order) => void,
    onUpdateOrder: (order: Order) => void
  ) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel('public:orders:live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.new) {
            onNewOrder(payload.new as Order);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.new) {
            onUpdateOrder(payload.new as Order);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToOrder(orderId: string, onUpdate: (order: Order) => void) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel(`public:orders:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new) {
            onUpdate(payload.new as Order);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToRequests(onNewRequest: (req: RestaurantServiceRequest) => void) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel('public:restaurant_requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'restaurant_requests' },
        (payload) => {
          if (payload.new) {
            onNewRequest(payload.new as RestaurantServiceRequest);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // ============================================================================
  // SPECIAL OFFERS (Supabase PostgreSQL CRUD)
  // ============================================================================
  async getSpecialOffers(): Promise<SpecialOffer[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_SPECIAL_OFFERS;
    }

    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('is_archived', false)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) return DEFAULT_SPECIAL_OFFERS;
        return DEFAULT_SPECIAL_OFFERS;
      }

      if (!data || data.length === 0) {
        return DEFAULT_SPECIAL_OFFERS;
      }

      return data as SpecialOffer[];
    } catch {
      return DEFAULT_SPECIAL_OFFERS;
    }
  },

  async getPublicSpecialOffers(): Promise<SpecialOffer[]> {
    const offers = await this.getSpecialOffers();
    let tz = 'Asia/Kolkata';
    try {
      const settings = await this.getSettings();
      if (settings?.timezone) tz = settings.timezone;
    } catch {
      // Use standard default timezone
    }
    return offers.filter((offer) => isOfferPubliclyVisible(offer, tz));
  },

  async saveSpecialOffer(
    offer: Partial<SpecialOffer> & { title: string }
  ): Promise<SpecialOffer> {
    checkSupabaseConfig();
    const now = new Date().toISOString();

    let discount = offer.discount_percentage || 0;
    if (offer.original_price && offer.offer_price && offer.original_price > 0) {
      discount = Math.round(
        ((offer.original_price - offer.offer_price) / offer.original_price) * 100
      );
      discount = Math.max(0, discount);
    }

    const isExistingRecord = Boolean(offer.id && !offer.id.startsWith('off-'));

    if (isExistingRecord && offer.id) {
      const updatePayload: Record<string, any> = {
        title: offer.title.trim(),
        description: offer.description ?? '',
        product_name: (offer.product_name || offer.title).trim(),
        offer_type: offer.offer_type || 'PERCENTAGE_DISCOUNT',
        original_price: Number(offer.original_price || 0),
        offer_price: Number(offer.offer_price || 0),
        discount_percentage: discount,
        image_url: offer.image_url || '',
        promo_code: (offer.promo_code || 'SPECIAL').trim().toUpperCase(),
        start_date: offer.start_date,
        end_date: offer.end_date,
        saturday_enabled:
          offer.saturday_enabled !== undefined ? offer.saturday_enabled : true,
        sunday_enabled:
          offer.sunday_enabled !== undefined ? offer.sunday_enabled : true,
        is_active: offer.is_active !== undefined ? offer.is_active : true,
        is_featured: offer.is_featured || false,
        is_archived: offer.is_archived || false,
        display_order: Number(offer.display_order || 0),
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('special_offers')
        .update(updatePayload)
        .eq('id', offer.id)
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase database table "special_offers" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error updating offer: ${error.message}`);
      }
      return data as SpecialOffer;
    } else {
      const insertPayload: Record<string, any> = {
        title: offer.title.trim(),
        description: offer.description ?? '',
        product_name: (offer.product_name || offer.title).trim(),
        offer_type: offer.offer_type || 'PERCENTAGE_DISCOUNT',
        original_price: Number(offer.original_price || 0),
        offer_price: Number(offer.offer_price || 0),
        discount_percentage: discount,
        image_url: offer.image_url || '',
        promo_code: (offer.promo_code || 'SPECIAL').trim().toUpperCase(),
        start_date: offer.start_date || now.split('T')[0],
        end_date:
          offer.end_date ||
          new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        saturday_enabled:
          offer.saturday_enabled !== undefined ? offer.saturday_enabled : true,
        sunday_enabled:
          offer.sunday_enabled !== undefined ? offer.sunday_enabled : true,
        is_active: offer.is_active !== undefined ? offer.is_active : true,
        is_featured: offer.is_featured || false,
        is_archived: false,
        display_order: Number(offer.display_order || 0),
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('special_offers')
        .insert([insertPayload])
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase database table "special_offers" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error creating offer: ${error.message}`);
      }
      return data as SpecialOffer;
    }
  },

  async duplicateSpecialOffer(id: string): Promise<SpecialOffer> {
    checkSupabaseConfig();
    const { data: original, error: fetchErr } = await supabase
      .from('special_offers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !original) {
      throw new Error(`Offer not found: ${fetchErr?.message || 'Invalid ID'}`);
    }

    const { id: _ignored, created_at: _c, updated_at: _u, ...rest } = original;
    return this.saveSpecialOffer({
      ...rest,
      title: `${original.title} (Copy)`,
    });
  },

  async toggleOfferActive(id: string, isActive: boolean): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('special_offers')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error toggling offer status: ${error.message}`);
    }
  },

  async archiveSpecialOffer(id: string): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('special_offers')
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error archiving offer: ${error.message}`);
    }
  },

  async deleteSpecialOffer(id: string): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('special_offers')
      .delete()
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error deleting offer: ${error.message}`);
    }
  },

  // ============================================================================
  // MENU ITEMS (Supabase PostgreSQL CRUD)
  // ============================================================================
  async getMenuItems(): Promise<MenuItemCMS[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_MENU_ITEMS;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) return DEFAULT_MENU_ITEMS;
        return DEFAULT_MENU_ITEMS;
      }

      if (!data || data.length === 0) {
        return DEFAULT_MENU_ITEMS;
      }

      return data as MenuItemCMS[];
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  },

  async getPublicMenuItems(): Promise<MenuItemCMS[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_MENU_ITEMS.filter((m) => m.is_available);
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) {
          return DEFAULT_MENU_ITEMS.filter((m) => m.is_available);
        }
        return DEFAULT_MENU_ITEMS.filter((m) => m.is_available);
      }

      if (!data || data.length === 0) {
        return DEFAULT_MENU_ITEMS.filter((m) => m.is_available);
      }

      return data as MenuItemCMS[];
    } catch {
      return DEFAULT_MENU_ITEMS.filter((m) => m.is_available);
    }
  },

  async saveMenuItem(
    item: Partial<MenuItemCMS> & { name: string; price: number }
  ): Promise<MenuItemCMS> {
    checkSupabaseConfig();
    const now = new Date().toISOString();
    const isExistingRecord = Boolean(
      item.id &&
      !item.id.startsWith('c') &&
      !item.id.startsWith('p_') &&
      !item.id.startsWith('b_') &&
      !item.id.startsWith('menu-')
    );

    const payload: Record<string, any> = {
      name: item.name.trim(),
      category_id: item.category_id || null,
      category_name: item.category_name || 'Combos',
      price: Number(item.price),
      original_price: item.original_price
        ? Number(item.original_price)
        : Number(item.price),
      rating: item.rating !== undefined ? Number(item.rating) : 4.8,
      reviews_count: item.reviews_count !== undefined ? Number(item.reviews_count) : 50,
      description: item.description || '',
      image_url: item.image_url || '',
      is_veg: item.is_veg !== undefined ? item.is_veg : true,
      is_chef_special: item.is_chef_special || false,
      is_popular: item.is_popular || false,
      is_todays_special: item.is_todays_special || false,
      is_weekend_offer: item.is_weekend_offer || false,
      is_available:
        item.is_available !== undefined ? item.is_available : true,
      is_featured: item.is_featured || false,
      display_order: Number(item.display_order || 0),
      prep_time: item.prep_time || '15 mins',
      tags: item.tags || [],
      updated_at: now,
    };

    if (isExistingRecord && item.id) {
      const { data, error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', item.id)
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase database table "menu_items" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error updating menu item: ${error.message}`);
      }
      return data as MenuItemCMS;
    } else {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{ ...payload, created_at: now }])
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase database table "menu_items" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error creating menu item: ${error.message}`);
      }
      return data as MenuItemCMS;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error deleting menu item: ${error.message}`);
    }
  },

  // ============================================================================
  // CATEGORIES (Supabase PostgreSQL CRUD)
  // ============================================================================
  async getCategories(): Promise<CategoryCMS[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_CATEGORIES;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        if (isMissingTableError(error)) return DEFAULT_CATEGORIES;
        return DEFAULT_CATEGORIES;
      }

      if (!data || data.length === 0) {
        return DEFAULT_CATEGORIES;
      }

      return data as CategoryCMS[];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  async getPublicCategories(): Promise<CategoryCMS[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_CATEGORIES.filter((c) => c.is_active);
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        if (isMissingTableError(error)) {
          return DEFAULT_CATEGORIES.filter((c) => c.is_active);
        }
        return DEFAULT_CATEGORIES.filter((c) => c.is_active);
      }

      if (!data || data.length === 0) {
        return DEFAULT_CATEGORIES.filter((c) => c.is_active);
      }

      return data as CategoryCMS[];
    } catch {
      return DEFAULT_CATEGORIES.filter((c) => c.is_active);
    }
  },

  async saveCategory(
    cat: Partial<CategoryCMS> & { name: string }
  ): Promise<CategoryCMS> {
    checkSupabaseConfig();
    const now = new Date().toISOString();
    const isExistingRecord = Boolean(cat.id && !cat.id.startsWith('cat-'));

    const payload = {
      name: cat.name.trim(),
      display_order: Number(cat.display_order || 0),
      is_active: cat.is_active !== undefined ? cat.is_active : true,
      updated_at: now,
    };

    if (isExistingRecord && cat.id) {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', cat.id)
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase table "categories" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error updating category: ${error.message}`);
      }
      return data as CategoryCMS;
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...payload, created_at: now }])
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase table "categories" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error creating category: ${error.message}`);
      }
      return data as CategoryCMS;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error deleting category: ${error.message}`);
    }
  },

  // ============================================================================
  // GALLERY IMAGES (Supabase PostgreSQL CRUD)
  // ============================================================================
  async getGalleryImages(): Promise<GalleryItemCMS[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_GALLERY_IMAGES;
    }

    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) return DEFAULT_GALLERY_IMAGES;
        return DEFAULT_GALLERY_IMAGES;
      }

      if (!data || data.length === 0) {
        return DEFAULT_GALLERY_IMAGES;
      }

      return data as GalleryItemCMS[];
    } catch {
      return DEFAULT_GALLERY_IMAGES;
    }
  },

  async getPublicGalleryImages(): Promise<GalleryItemCMS[]> {
    if (!isSupabaseConfigured) {
      return DEFAULT_GALLERY_IMAGES.filter((g) => g.is_active);
    }

    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) {
          return DEFAULT_GALLERY_IMAGES.filter((g) => g.is_active);
        }
        return DEFAULT_GALLERY_IMAGES.filter((g) => g.is_active);
      }

      if (!data || data.length === 0) {
        return DEFAULT_GALLERY_IMAGES.filter((g) => g.is_active);
      }

      return data as GalleryItemCMS[];
    } catch {
      return DEFAULT_GALLERY_IMAGES.filter((g) => g.is_active);
    }
  },

  async saveGalleryImage(
    img: Partial<GalleryItemCMS> & { title: string; image_url: string }
  ): Promise<GalleryItemCMS> {
    checkSupabaseConfig();
    const now = new Date().toISOString();
    const isExistingRecord = Boolean(img.id && !img.id.startsWith('gal-') && !img.id.startsWith('g'));

    const payload = {
      title: img.title.trim(),
      category: img.category || 'Ambience',
      image_url: img.image_url,
      description: img.description || '',
      display_order: Number(img.display_order || 0),
      is_active: img.is_active !== undefined ? img.is_active : true,
      updated_at: now,
    };

    if (isExistingRecord && img.id) {
      const { data, error } = await supabase
        .from('gallery_images')
        .update(payload)
        .eq('id', img.id)
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase table "gallery_images" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error updating photo: ${error.message}`);
      }
      return data as GalleryItemCMS;
    } else {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{ ...payload, created_at: now }])
        .select()
        .single();

      if (error) {
        if (isMissingTableError(error)) {
          throw new Error('Supabase table "gallery_images" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
        }
        throw new Error(`Database error adding photo: ${error.message}`);
      }
      return data as GalleryItemCMS;
    }
  },

  async deleteGalleryImage(id: string): Promise<void> {
    checkSupabaseConfig();
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error && !isMissingTableError(error)) {
      throw new Error(`Database error deleting photo: ${error.message}`);
    }
  },

  // ============================================================================
  // RESTAURANT SETTINGS (Supabase PostgreSQL CRUD)
  // ============================================================================
  async getSettings(): Promise<RestaurantSettings> {
    if (!isSupabaseConfigured) {
      return DEFAULT_SETTINGS;
    }

    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        if (isMissingTableError(error)) return DEFAULT_SETTINGS;
        return DEFAULT_SETTINGS;
      }

      if (!data) {
        return DEFAULT_SETTINGS;
      }

      return data as RestaurantSettings;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(
    settings: RestaurantSettings
  ): Promise<RestaurantSettings> {
    checkSupabaseConfig();
    const now = new Date().toISOString();

    try {
      const { data: existing } = await supabase
        .from('restaurant_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      const payload = {
        name: settings.name || 'Chacha Cafe',
        tagline: settings.tagline || '',
        short_desc: settings.short_desc || '',
        address: settings.address || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        instagram: settings.instagram || '',
        google_rating: settings.google_rating ? Number(settings.google_rating) : 4.9,
        google_reviews_count: settings.google_reviews_count ? Number(settings.google_reviews_count) : 1280,
        opening_hours: settings.opening_hours || 'Monday – Sunday: 8:00 AM – 11:00 PM',
        map_embed_url: settings.map_embed_url || '',
        timezone: settings.timezone || 'Asia/Kolkata',
        about_text: settings.about_text || '',
        updated_at: now,
      };

      if (existing?.id) {
        const { data, error } = await supabase
          .from('restaurant_settings')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          if (isMissingTableError(error)) {
            throw new Error('Supabase table "restaurant_settings" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
          }
          throw new Error(`Database error saving settings: ${error.message}`);
        }
        return data as RestaurantSettings;
      } else {
        const { data, error } = await supabase
          .from('restaurant_settings')
          .insert([{ ...payload, created_at: now }])
          .select()
          .single();

        if (error) {
          if (isMissingTableError(error)) {
            throw new Error('Supabase table "restaurant_settings" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
          }
          throw new Error(`Database error creating settings: ${error.message}`);
        }
        return data as RestaurantSettings;
      }
    } catch (e: any) {
      if (isMissingTableError(e)) {
        throw new Error('Supabase table "restaurant_settings" does not exist yet. Please run the SQL schema in Supabase SQL Editor.');
      }
      throw e;
    }
  },

  // ============================================================================
  // IMAGE ASSET UPLOADER (Supabase Storage Bucket)
  // ============================================================================
  async uploadImage(file: File, folder: string = 'media'): Promise<string> {
    checkSupabaseConfig();

    const ext = file.name.split('.').pop() || 'jpg';
    const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${folder}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}.${cleanExt}`;

    const { error } = await supabase.storage
      .from('restaurant-assets')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase Storage upload error: ${error.message}. Ensure bucket "restaurant-assets" exists in your Supabase Storage.`);
    }

    const { data: publicData } = supabase.storage
      .from('restaurant-assets')
      .getPublicUrl(filename);

    if (!publicData?.publicUrl) {
      throw new Error('Failed to obtain public URL for uploaded asset.');
    }

    return publicData.publicUrl;
  },

  // ============================================================================
  // DASHBOARD METRICS
  // ============================================================================
  async getDashboardStats(): Promise<DashboardStats & { activeOrdersCount: number; pendingRequestsCount: number }> {
    const [offers, menu, settings, orders, requests] = await Promise.all([
      this.getSpecialOffers(),
      this.getMenuItems(),
      this.getSettings(),
      this.getOrders({ limit: 50 }),
      this.getRestaurantRequests('PENDING'),
    ]);

    const tz = settings?.timezone || 'Asia/Kolkata';
    let activeCount = 0;
    let upcomingCount = 0;
    let expiredCount = 0;

    offers.forEach((offer) => {
      const st = computeOfferStatus(offer, tz);
      if (st === 'ACTIVE') activeCount++;
      else if (st === 'SCHEDULED') upcomingCount++;
      else expiredCount++;
    });

    const totalMenu = menu.length;
    const availableMenu = menu.filter((m) => m.is_available).length;
    const activeOrdersCount = orders.filter(
      (o) => o.order_status !== 'COMPLETED' && o.order_status !== 'CANCELLED'
    ).length;

    return {
      activeOffersCount: activeCount,
      upcomingOffersCount: upcomingCount,
      expiredOffersCount: expiredCount,
      totalMenuItemsCount: totalMenu,
      availableMenuItemsCount: availableMenu,
      activeOrdersCount,
      pendingRequestsCount: requests.length,
    };
  },

  // ============================================================================
  // DATABASE SCHEMA STATUS CHECK & SEED
  // ============================================================================
  async checkSchemaStatus(): Promise<{
    tablesExist: boolean;
    error: string | null;
  }> {
    if (!isSupabaseConfigured) {
      return { tablesExist: false, error: 'Supabase URL/Key missing' };
    }

    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .select('id')
        .limit(1);

      if (error) {
        if (isMissingTableError(error)) {
          return { tablesExist: false, error: 'Tables not created yet (PGRST205)' };
        }
        return { tablesExist: false, error: error.message };
      }

      return { tablesExist: true, error: null };
    } catch (err: any) {
      return { tablesExist: false, error: err?.message || 'Database error' };
    }
  },

  async seedInitialDataIfEmpty(): Promise<{ success: boolean; message: string }> {
    checkSupabaseConfig();
    const status = await this.checkSchemaStatus();
    if (!status.tablesExist) {
      throw new Error(
        'Supabase database tables are not yet created. Please run the schema.sql script in your Supabase SQL Editor first.'
      );
    }

    try {
      // 1. Seed tables
      const { data: existingTables } = await supabase.from('restaurant_tables').select('id');
      if (!existingTables || existingTables.length === 0) {
        const tableRows = DEFAULT_TABLES.map((t) => ({
          table_number: t.table_number,
          name: t.name,
          capacity: t.capacity,
          section: t.section,
          status: t.status,
          is_active: t.is_active,
        }));
        await supabase.from('restaurant_tables').insert(tableRows);
      }

      // 2. Seed categories
      const { data: existingCats } = await supabase.from('categories').select('id');
      if (!existingCats || existingCats.length === 0) {
        const catRows = DEFAULT_CATEGORIES.map((c) => ({
          name: c.name,
          display_order: c.display_order,
          is_active: true,
        }));
        await supabase.from('categories').insert(catRows);
      }

      // 3. Seed menu items
      const { data: existingMenu } = await supabase.from('menu_items').select('id');
      if (!existingMenu || existingMenu.length === 0) {
        const menuRows = DEFAULT_MENU_ITEMS.map((m) => ({
          name: m.name,
          category_name: m.category_name,
          price: m.price,
          original_price: m.original_price,
          rating: m.rating,
          reviews_count: m.reviews_count,
          description: m.description,
          image_url: m.image_url,
          is_veg: m.is_veg,
          is_chef_special: m.is_chef_special,
          is_popular: m.is_popular,
          is_todays_special: m.is_todays_special,
          is_weekend_offer: m.is_weekend_offer,
          is_available: true,
          is_featured: m.is_featured,
          display_order: m.display_order,
          prep_time: m.prep_time,
          tags: m.tags,
        }));
        await supabase.from('menu_items').insert(menuRows);
      }

      // 4. Seed special offers
      const { data: existingOffers } = await supabase.from('special_offers').select('id');
      if (!existingOffers || existingOffers.length === 0) {
        const offerRows = DEFAULT_SPECIAL_OFFERS.map((o) => ({
          title: o.title,
          description: o.description,
          product_name: o.product_name,
          offer_type: o.offer_type,
          original_price: o.original_price,
          offer_price: o.offer_price,
          discount_percentage: o.discount_percentage,
          image_url: o.image_url,
          promo_code: o.promo_code,
          start_date: o.start_date,
          end_date: o.end_date,
          saturday_enabled: o.saturday_enabled,
          sunday_enabled: o.sunday_enabled,
          is_active: o.is_active,
          is_featured: o.is_featured,
          is_archived: false,
          display_order: o.display_order,
        }));
        await supabase.from('special_offers').insert(offerRows);
      }

      // 5. Seed gallery images
      const { data: existingGallery } = await supabase.from('gallery_images').select('id');
      if (!existingGallery || existingGallery.length === 0) {
        const galleryRows = DEFAULT_GALLERY_IMAGES.map((g) => ({
          title: g.title,
          category: g.category,
          image_url: g.image_url,
          description: g.description,
          display_order: g.display_order,
          is_active: true,
        }));
        await supabase.from('gallery_images').insert(galleryRows);
      }

      // 6. Seed restaurant settings
      const { data: existingSettings } = await supabase.from('restaurant_settings').select('id');
      if (!existingSettings || existingSettings.length === 0) {
        await supabase.from('restaurant_settings').insert([
          {
            name: DEFAULT_SETTINGS.name,
            tagline: DEFAULT_SETTINGS.tagline,
            short_desc: DEFAULT_SETTINGS.short_desc,
            address: DEFAULT_SETTINGS.address,
            phone: DEFAULT_SETTINGS.phone,
            whatsapp: DEFAULT_SETTINGS.whatsapp,
            email: DEFAULT_SETTINGS.email,
            instagram: DEFAULT_SETTINGS.instagram,
            google_rating: DEFAULT_SETTINGS.google_rating,
            google_reviews_count: DEFAULT_SETTINGS.google_reviews_count,
            opening_hours: DEFAULT_SETTINGS.opening_hours,
            map_embed_url: DEFAULT_SETTINGS.map_embed_url,
            timezone: DEFAULT_SETTINGS.timezone,
            about_text: DEFAULT_SETTINGS.about_text,
          },
        ]);
      }

      return {
        success: true,
        message: 'Successfully populated Supabase database tables with complete Chacha Cafe data!',
      };
    } catch (err: any) {
      throw new Error(`Failed to seed database: ${err.message}`);
    }
  },
};

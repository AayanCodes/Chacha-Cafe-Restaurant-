/**
 * Dine-In QR Ordering, Table Management, Kitchen Display (KDS), and Service Request Data Types
 * 
 * Defines TypeScript interfaces and enumeration types for tables, orders, line items,
 * real-time service requests, and customer records for Chacha Cafe.
 */

import { MenuItemCMS } from './admin';

/**
 * Operational status states for physical restaurant tables
 */
export type TableStatus =
  | 'AVAILABLE'      // Table is vacant and ready for new diners
  | 'ORDERING'       // Diners are currently browsing and placing order
  | 'PREPARING'      // Food order is being cooked in kitchen
  | 'READY'          // Food order is ready for delivery to table
  | 'OCCUPIED'       // Food served, diners currently dining
  | 'BILL_REQUESTED' // Diner requested final bill
  | 'COMPLETED';     // Dining session completed, ready for table sanitization

/**
 * Physical restaurant table record with QR code link and seating capacity
 */
export interface RestaurantTable {
  id: string;
  table_number: string; // e.g. "01", "07", "T-12"
  name: string; // e.g. "Window Table 01"
  capacity: number;
  section: string; // e.g. "Main Dining", "Outdoor Garden", "AC Lounge", "Rooftop"
  status: TableStatus;
  is_active: boolean;
  current_order_id?: string | null;
  qr_code_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Kitchen Display System (KDS) & Order fulfillment lifecycle states
 */
export type OrderStatus =
  | 'PENDING_PAYMENT' // Awaiting payment confirmation
  | 'PAYMENT_FAILED'  // Payment attempt failed
  | 'CONFIRMED'       // Order placed successfully & payment received / counter selected
  | 'ACCEPTED'        // Kitchen accepted the ticket
  | 'PREPARING'       // Kitchen actively cooking order
  | 'READY'           // Order ready on the pass
  | 'SERVED'          // Delivered to customer table
  | 'COMPLETED'       // Bill settled & order archived
  | 'CANCELLED';      // Order cancelled by staff or user

/**
 * Payment processing statuses
 */
export type PaymentStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PAYMENT_FAILED'
  | 'PAY_AT_COUNTER'
  | 'REFUNDED';

/**
 * Supported payment methods for dine-in orders
 */
export type PaymentMethod =
  | 'RAZORPAY_UPI'
  | 'RAZORPAY_CARD'
  | 'RAZORPAY_NETBANKING'
  | 'UPI_QR'
  | 'CASH_AT_COUNTER';

/**
 * Individual ordered dish line item
 */
export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id?: string | null;
  item_name: string;
  item_price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
  is_veg: boolean;
  created_at?: string;
}

/**
 * Full Dine-In Order model with table reference, items, pricing, and fulfillment state
 */
export interface Order {
  id: string;
  order_number: string; // e.g. "CC1027"
  table_id?: string | null;
  table_number: string; // e.g. "07"
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_gateway_order_id?: string | null;
  payment_gateway_payment_id?: string | null;
  payment_gateway_signature?: string | null;
  order_status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

/**
 * Payment transaction record
 */
export interface PaymentRecord {
  id: string;
  order_id: string;
  order_number?: string;
  table_number?: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  gateway: 'RAZORPAY' | 'CASH' | 'UPI_DIRECT';
  gateway_order_id?: string;
  gateway_payment_id?: string;
  gateway_signature?: string;
  method: string;
  created_at: string;
}

/**
 * Types of instant table service assistance diners can request
 */
export type RequestType =
  | 'CALL_WAITER'
  | 'REQUEST_WATER'
  | 'REQUEST_BILL'
  | 'CLEAN_TABLE'
  | 'CUSTOM';

/**
 * Status of a table assistance request
 */
export type RequestStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CANCELLED';

/**
 * Real-time table service request dispatched to Kitchen / Waitstaff
 */
export interface RestaurantServiceRequest {
  id: string;
  table_id?: string | null;
  table_number: string;
  request_type: RequestType;
  status: RequestStatus;
  notes?: string;
  created_at: string;
  resolved_at?: string | null;
}

/**
 * CRM record of customer visit history & cumulative spend
 */
export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string;
  created_at: string;
}

/**
 * Active shopping cart item for customer table ordering
 */
export interface CartItem {
  menuItem: MenuItemCMS;
  quantity: number;
  notes?: string;
}


/**
 * Content Management System (CMS) Data Types & Models
 * 
 * Defines schemas for special offers, menu items, categories, photo galleries,
 * restaurant profile settings, and analytics metrics for Chacha Cafe.
 */

import { MenuCategory } from '../types';

/**
 * Types of promotional campaigns and discount offers
 */
export type OfferType =
  | 'PERCENTAGE_DISCOUNT'
  | 'FIXED_PRICE'
  | 'BUY_ONE_GET_ONE'
  | 'COMBO'
  | 'FLAT_DISCOUNT'
  | 'SPECIAL_ITEM';

/**
 * Special promotional offer model with date range scheduling and weekend rules
 */
export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  product_name: string;
  offer_type: OfferType;
  original_price: number;
  offer_price: number;
  discount_percentage: number;
  image_url: string;
  promo_code?: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  saturday_enabled: boolean;
  sunday_enabled: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_archived?: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Menu Item model for database storage & CMS administration
 */
export interface MenuItemCMS {
  id: string;
  name: string;
  category_name: MenuCategory | string;
  category_id?: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count: number;
  description: string;
  image_url: string;
  is_veg: boolean;
  is_chef_special?: boolean;
  is_popular?: boolean;
  is_todays_special?: boolean;
  is_weekend_offer?: boolean;
  is_available: boolean;
  is_featured?: boolean;
  display_order: number;
  prep_time?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}


export interface CategoryCMS {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItemCMS {
  id: string;
  title: string;
  category: 'Ambience' | 'Food' | 'Coffee' | 'Outdoor' | 'Events' | string;
  image_url: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RestaurantSettings {
  id?: string;
  name: string;
  tagline: string;
  short_desc: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  google_rating: number;
  google_reviews_count: number;
  opening_hours: string;
  map_embed_url: string;
  timezone: string;
  about_text: string;
  updated_at?: string;
}

export interface DashboardStats {
  activeOffersCount: number;
  upcomingOffersCount: number;
  expiredOffersCount: number;
  totalMenuItemsCount: number;
  availableMenuItemsCount: number;
}

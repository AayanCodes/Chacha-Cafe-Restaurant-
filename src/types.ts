export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  isVeg: boolean;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  isTodaysSpecial?: boolean;
  isWeekendOffer?: boolean;
  originalPrice?: number;
  prepTime?: string;
  calories?: string;
  tags?: string[];
}

export type MenuCategory =
  | 'Combos'
  | 'Pizza'
  | 'Burger'
  | 'Sandwich'
  | 'Chinese'
  | 'Shakes'
  | 'Lassi'
  | 'Cold Coffee'
  | 'Hot Coffee'
  | 'Mojito'
  | 'Fruit Juice'
  | 'Desserts';

export interface SpecialItem extends MenuItem {
  badge: string;
  discountText?: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  favoriteDish?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Ambience' | 'Food' | 'Coffee' | 'Outdoor' | 'Events';
  image: string;
  description: string;
}

export interface ReservationData {
  name: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  occasion?: string;
  message?: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
}

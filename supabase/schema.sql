-- ==============================================================================
-- CHACHA CAFE - SUPABASE DATABASE SCHEMA & RLS SECURITY POLICIES
-- Full Restaurant Ordering, Table Management & Realtime System
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. RESTAURANT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Chacha Cafe',
    tagline VARCHAR(500) DEFAULT 'Delicious Ice Cream & Fresh Cakes Daily Available Here!',
    short_desc TEXT DEFAULT 'Kiratpur premier cafe & dining spot offering delicious ice cream, fresh cakes, woodfired pizzas, gourmet burgers, shakes, cold coffee & Chinese delicacies on Manadwar Road.',
    address TEXT DEFAULT 'Manadwar Road, Kiratpur, Taqarubpur Israj Kheri, Uttar Pradesh 246731, India',
    phone VARCHAR(50) DEFAULT '+91 86503 67876',
    whatsapp VARCHAR(50) DEFAULT '+918650367876',
    email VARCHAR(255) DEFAULT 'reservations@chachacafe.com',
    instagram VARCHAR(100) DEFAULT '@chachacafe_kiratpur',
    google_rating NUMERIC(3,2) DEFAULT 4.90,
    google_reviews_count INT DEFAULT 1280,
    opening_hours VARCHAR(255) DEFAULT 'Monday – Sunday: 8:00 AM – 11:00 PM',
    map_embed_url TEXT DEFAULT 'https://maps.google.com/maps?q=Manadwar+Road,+Kiratpur,+Taqarubpur+Israj+Kheri,+Uttar+Pradesh+246731,+India&t=&z=15&ie=UTF8&iwloc=&output=embed',
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    about_text TEXT DEFAULT 'At Chacha Cafe, we prepare every dish with passion using locally sourced fresh ingredients on Manadwar Road, Kiratpur.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES TABLE FOR ADMIN USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2) CHECK (original_price >= 0),
    rating NUMERIC(3,2) DEFAULT 4.80,
    reviews_count INT DEFAULT 50,
    description TEXT,
    image_url TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_todays_special BOOLEAN DEFAULT FALSE,
    is_weekend_offer BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    prep_time VARCHAR(50) DEFAULT '15 mins',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SPECIAL OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.special_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    offer_type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE_DISCOUNT',
    original_price NUMERIC(10,2) NOT NULL CHECK (original_price >= 0),
    offer_price NUMERIC(10,2) NOT NULL CHECK (offer_price >= 0),
    discount_percentage INT DEFAULT 0,
    image_url TEXT NOT NULL,
    promo_code VARCHAR(50) DEFAULT 'CHACHA30',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    saturday_enabled BOOLEAN DEFAULT TRUE,
    sunday_enabled BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Ambience',
    image_url TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RESTAURANT TABLES & QR CODES
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 4,
    section VARCHAR(100) DEFAULT 'Main Dining',
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT TRUE,
    current_order_id UUID,
    qr_code_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
    table_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY_UPI',
    payment_gateway_order_id VARCHAR(255),
    payment_gateway_payment_id VARCHAR(255),
    payment_gateway_signature VARCHAR(500),
    order_status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    item_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(10,2) NOT NULL,
    notes TEXT,
    is_veg BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,
    gateway VARCHAR(50) DEFAULT 'RAZORPAY',
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),
    gateway_signature VARCHAR(500),
    method VARCHAR(50) DEFAULT 'UPI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'system',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. RESTAURANT SERVICE REQUESTS (WAITER / WATER / BILL)
CREATE TABLE IF NOT EXISTS public.restaurant_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
    table_number VARCHAR(50) NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 14. CUSTOMERS CRM TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    phone VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    total_orders INT DEFAULT 1,
    total_spent NUMERIC(10,2) DEFAULT 0,
    last_order_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_name);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_special_offers_active ON public.special_offers(is_active, is_archived);
CREATE INDEX IF NOT EXISTS idx_special_offers_dates ON public.special_offers(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON public.gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_tables_status ON public.restaurant_tables(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_table ON public.orders(table_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.restaurant_requests(status);

-- 16. ENABLE SUPABASE REALTIME REPLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_requests;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 17. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO PREVENT CONFLICTS
DROP POLICY IF EXISTS "Public Read Settings" ON public.restaurant_settings;
DROP POLICY IF EXISTS "Admin All Settings" ON public.restaurant_settings;
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin All Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Menu Items" ON public.menu_items;
DROP POLICY IF EXISTS "Admin All Menu Items" ON public.menu_items;
DROP POLICY IF EXISTS "Public Read Special Offers" ON public.special_offers;
DROP POLICY IF EXISTS "Admin All Special Offers" ON public.special_offers;
DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admin All Gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Public Read Tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Admin All Tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Create Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Admin All Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Read Order Status History" ON public.order_status_history;
DROP POLICY IF EXISTS "Admin All Order Status History" ON public.order_status_history;
DROP POLICY IF EXISTS "Public Create Requests" ON public.restaurant_requests;
DROP POLICY IF EXISTS "Public Read Requests" ON public.restaurant_requests;
DROP POLICY IF EXISTS "Admin All Requests" ON public.restaurant_requests;
DROP POLICY IF EXISTS "Public Create Customers" ON public.customers;
DROP POLICY IF EXISTS "Admin All Customers" ON public.customers;
DROP POLICY IF EXISTS "Public Create Payments" ON public.payments;
DROP POLICY IF EXISTS "Public Read Payments" ON public.payments;
DROP POLICY IF EXISTS "Admin All Payments" ON public.payments;

-- PUBLIC ACCESS POLICIES
CREATE POLICY "Public Read Settings" ON public.restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Special Offers" ON public.special_offers FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public Read Tables" ON public.restaurant_tables FOR SELECT USING (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Status History" ON public.order_status_history FOR SELECT USING (true);
CREATE POLICY "Public Create Requests" ON public.restaurant_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Requests" ON public.restaurant_requests FOR SELECT USING (true);
CREATE POLICY "Public Create Customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Payments" ON public.payments FOR SELECT USING (true);

-- ADMIN AUTHENTICATED FULL POLICIES
CREATE POLICY "Admin All Settings" ON public.restaurant_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Menu Items" ON public.menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Special Offers" ON public.special_offers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Gallery" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Tables" ON public.restaurant_tables FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Order Items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Order Status History" ON public.order_status_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Requests" ON public.restaurant_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Payments" ON public.payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 18. SUPABASE STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Assets" ON storage.objects;

CREATE POLICY "Public Read Assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'restaurant-assets');

CREATE POLICY "Admin Upload Assets" ON storage.objects 
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'restaurant-assets');

CREATE POLICY "Admin Update Assets" ON storage.objects 
FOR UPDATE TO authenticated USING (bucket_id = 'restaurant-assets');

CREATE POLICY "Admin Delete Assets" ON storage.objects 
FOR DELETE TO authenticated USING (bucket_id = 'restaurant-assets');

-- 19. SEED INITIAL TABLES (Table 01 to Table 20)
INSERT INTO public.restaurant_tables (table_number, name, capacity, section, status, is_active)
VALUES
  ('01', 'Table 01 - Window Seat', 2, 'Main Dining', 'AVAILABLE', true),
  ('02', 'Table 02 - Window Seat', 2, 'Main Dining', 'AVAILABLE', true),
  ('03', 'Table 03 - Family Booth', 4, 'Main Dining', 'AVAILABLE', true),
  ('04', 'Table 04 - Family Booth', 4, 'Main Dining', 'AVAILABLE', true),
  ('05', 'Table 05 - Center Dining', 4, 'Main Dining', 'AVAILABLE', true),
  ('06', 'Table 06 - Center Dining', 4, 'Main Dining', 'AVAILABLE', true),
  ('07', 'Table 07 - Premium Corner', 6, 'Main Dining', 'AVAILABLE', true),
  ('08', 'Table 08 - Cafe Lounge', 4, 'Main Dining', 'AVAILABLE', true),
  ('09', 'Table 09 - Garden Terrace', 4, 'Outdoor Garden', 'AVAILABLE', true),
  ('10', 'Table 10 - Garden Terrace', 4, 'Outdoor Garden', 'AVAILABLE', true),
  ('11', 'Table 11 - Garden Canopy', 6, 'Outdoor Garden', 'AVAILABLE', true),
  ('12', 'Table 12 - Garden Gazebo', 8, 'Outdoor Garden', 'AVAILABLE', true),
  ('13', 'Table 13 - AC Lounge Deluxe', 4, 'AC Lounge', 'AVAILABLE', true),
  ('14', 'Table 14 - AC Lounge Deluxe', 4, 'AC Lounge', 'AVAILABLE', true),
  ('15', 'Table 15 - AC Family Suite', 8, 'AC Lounge', 'AVAILABLE', true),
  ('16', 'Table 16 - Rooftop View', 2, 'Rooftop', 'AVAILABLE', true),
  ('17', 'Table 17 - Rooftop View', 2, 'Rooftop', 'AVAILABLE', true),
  ('18', 'Table 18 - Rooftop Canopy', 4, 'Rooftop', 'AVAILABLE', true),
  ('19', 'Table 19 - Rooftop Canopy', 4, 'Rooftop', 'AVAILABLE', true),
  ('20', 'Table 20 - Rooftop VIP', 10, 'Rooftop', 'AVAILABLE', true)
ON CONFLICT (table_number) DO NOTHING;

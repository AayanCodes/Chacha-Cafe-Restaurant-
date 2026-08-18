# Chacha Cafe - Full-Stack Restaurant, QR Table Ordering & Realtime KDS

A full-stack, enterprise-grade restaurant web platform, QR dine-in ordering system, kitchen display system (KDS), and content management system (CMS) designed for **Chacha Cafe**, Kiratpur (Uttar Pradesh, India).

Built with **React 18**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL & Realtime)**, and **Motion**.

---

## 🌟 Key Capabilities & Architecture

1. **Customer-Facing Restaurant Experience**:
   - Immersive hero section with live booking and interactive menu showcase.
   - Comprehensive menu with category filtering, dietary tags (Veg/Non-Veg, Chef Specials), and dynamic search.
   - Real-time active special offers banner synchronized with Indian Standard Time (IST).
   - Interactive table reservation modal and Google Maps integration on Manadwar Road, Kiratpur.
   - Interactive photo gallery and customer reviews.

2. **Dine-In QR Code Ordering (`/table/:tableNumber`)**:
   - Instant table detection from scanned QR standees with welcome dialog.
   - Live menu ordering with item customization (cooking notes, quantity controls).
   - Fast table service assistance actions: **Call Waiter**, **Request Water**, **Request Bill**.
   - Slide-over cart drawer with GST computation and flexible checkout (Online UPI / Pay at Counter).

3. **Secure Server-Validated Orders & Realtime Sync**:
   - Database-level item price and tax calculations to prevent client-side manipulation.
   - Realtime bi-directional table status synchronization (`AVAILABLE` ➔ `PREPARING` ➔ `READY` ➔ `OCCUPIED` ➔ `COMPLETED`).
   - Customer CRM tracking total lifetime orders and cumulative spend.

4. **Live Order Tracking (`/order/:orderId`)**:
   - 6-stage visual timeline (*Order Placed* ➔ *Kitchen Accepted* ➔ *Cooking in Kitchen* ➔ *Food Ready* ➔ *Served at Table* ➔ *Completed*).
   - Supabase Realtime websocket subscriptions with automated polling fallbacks.

5. **Kitchen Display System & Admin Portal (`/admin/*`)**:
   - **Live Orders & KDS (`/admin/orders`)**: Real-time order stream with Web Audio chime alerts, status workflow buttons, and printable Kitchen Order Tickets (KOT).
   - **Tables & QR Generator (`/admin/tables`)**: High-res QR code generator, PNG export, table status overrides, and printable standee templates.
   - **Offer Management (`/admin/offers`)**: Schedule dynamic discount campaigns with start/expiry dates and IST validation.
   - **Menu Catalog (`/admin/menu`)**: Full CRUD with instant availability toggles and pricing controls.
   - **Categories & Gallery (`/admin/categories`, `/admin/gallery`)**: Organize menu items and photo showcases.
   - **Restaurant Settings (`/admin/settings`)**: Manage contact info, business hours, and social media handles.

---

## 📂 Project Directory Structure

```
├── .env.example              # Sample environment variables for Supabase & Razorpay
├── index.html                # HTML entry point with Google Fonts & metadata
├── package.json              # Project dependencies, scripts, and build targets
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration with Tailwind CSS plugin
├── metadata.json             # AI Studio applet configuration & permissions
├── supabase/
│   └── schema.sql            # Complete Supabase PostgreSQL schema, RLS policies, indexes & seeds
└── src/
    ├── main.tsx              # Application bootstrap & DOM root render
    ├── App.tsx               # Client-side router & route dispatcher
    ├── index.css             # Global Tailwind CSS imports & print media rules
    ├── types/
    │   ├── admin.ts          # CMS TypeScript models (Menu, Offers, Categories, Settings)
    │   └── orders.ts         # Ordering, Table, KDS, and Service Request models
    ├── context/
    │   ├── AuthContext.tsx   # Supabase authentication provider & session listener
    │   └── CartContext.tsx   # Table dine-in shopping cart & state provider
    ├── lib/
    │   ├── supabase.ts       # Supabase client singleton & configuration check
    │   └── timezone.ts       # Indian Standard Time (IST) offer date calculations
    ├── data/
    │   └── cafeData.ts       # Fallback mock dataset (Menu items, categories, reviews, info)
    ├── services/
    │   └── dbService.ts      # Unified database abstraction layer (Supabase CRUD + fallback)
    ├── pages/
    │   ├── TableOrdering.tsx # Customer QR scan & ordering interface (/table/:tableNumber)
    │   ├── OrderTracking.tsx # Live customer order status tracker (/order/:orderId)
    │   └── admin/
    │       ├── AdminLogin.tsx      # Admin authentication page (/admin/login)
    │       ├── AdminDashboard.tsx  # Metrics overview & quick action shortcuts (/admin/dashboard)
    │       ├── AdminLiveOrders.tsx # Kitchen Display System (KDS) & service requests (/admin/orders)
    │       ├── AdminTables.tsx     # Table management & QR code generator (/admin/tables)
    │       ├── AdminOffers.tsx     # Special offers & promotional banner manager (/admin/offers)
    │       ├── AdminMenu.tsx       # Menu catalog CMS with stock toggles (/admin/menu)
    │       ├── AdminCategories.tsx # Menu category management (/admin/categories)
    │       ├── AdminGallery.tsx    # Photo gallery manager (/admin/gallery)
    │       └── AdminSettings.tsx   # Restaurant profile & operational settings (/admin/settings)
    └── components/
        ├── Navbar.tsx                # Customer website navigation & sticky header
        ├── Hero.tsx                  # Landing hero banner with booking triggers
        ├── MenuSection.tsx           # Interactive menu browser with category filters
        ├── SpecialsSection.tsx       # Live special offers & deal highlights
        ├── ReservationSection.tsx    # Table booking & reservation form
        ├── LocationSection.tsx       # Embedded map & directions for Kiratpur location
        ├── ReviewsSection.tsx        # Customer ratings & Google reviews showcase
        ├── GallerySection.tsx        # Photo grid & atmosphere gallery
        ├── StatsSection.tsx          # Key metrics (Happy diners, menu items, rating)
        ├── AboutSection.tsx          # Story and culinary philosophy of Chacha Cafe
        ├── DishModal.tsx             # Detailed dish view with ingredient details
        ├── FloatingActions.tsx       # Floating WhatsApp, Call, and QR order shortcuts
        ├── LoadingScreen.tsx         # Splash screen and transition loading animation
        ├── Footer.tsx                # Footer with contact details and quick links
        └── admin/
            ├── AdminLayout.tsx       # Responsive admin sidebar & navigation wrapper
            └── ProtectedAdminRoute.tsx # Route guard requiring Supabase authentication
```

---

## 🛠️ Environment Variables

Create a `.env` file at the root based on `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Razorpay Configuration (Optional)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 🚀 Setup & Database Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Database**:
   - Open your [Supabase Dashboard](https://supabase.com/dashboard).
   - Navigate to the **SQL Editor**.
   - Copy and paste the contents of `supabase/schema.sql` and run the script.
   - This provisions all required tables, security policies (RLS), realtime subscriptions, and initial seed data.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📄 License & Attribution

Designed and developed for **Chacha Cafe**, Manadwar Road, Kiratpur, Uttar Pradesh 246731, India. All rights reserved.

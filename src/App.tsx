/**
 * Chacha Cafe Web Application & CMS Portal
 * Manadwar Road, Kiratpur, Taqarubpur Israj Kheri, Uttar Pradesh 246731
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { FloatingLeavesCanvas } from './components/FloatingLeavesCanvas';
import { SEOMeta } from './components/SEOMeta';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FloatingShowcaseSection } from './components/FloatingShowcaseSection';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { SpecialsSection } from './components/SpecialsSection';
import { GallerySection } from './components/GallerySection';
import { ReservationSection } from './components/ReservationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { StatsSection } from './components/StatsSection';
import { LocationSection } from './components/LocationSection';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { DishModal } from './components/DishModal';
import { MenuItem } from './types';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOffers } from './pages/admin/AdminOffers';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminTables } from './pages/admin/AdminTables';
import { AdminLiveOrders } from './pages/admin/AdminLiveOrders';

// Dine-In QR Ordering & Tracking Pages
import { TableOrdering } from './pages/TableOrdering';
import { OrderTracking } from './pages/OrderTracking';
import { CartProvider } from './context/CartContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';

// Public Site Component
const PublicWebsite: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    scrollToMenu();
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Search dishes"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] font-sans selection:bg-red-600 selection:text-white relative antialiased">
      <SEOMeta />

      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <>
          <CustomCursor />
          <FloatingLeavesCanvas />

          <Navbar
            onReserveClick={scrollToReservation}
            onSearchClick={handleSearchClick}
          />

          <main>
            {/* 1. Home Section */}
            <Hero
              onReserveClick={scrollToReservation}
              onExploreMenuClick={scrollToMenu}
            />

            <FloatingShowcaseSection
              onExploreMenuClick={scrollToMenu}
              onReserveClick={scrollToReservation}
            />

            {/* 2. About Section */}
            <AboutSection />

            {/* 3. Menu Section */}
            <MenuSection
              onSelectDish={(item) => setSelectedDish(item)}
              searchQueryProp={searchQuery}
            />

            {/* 4. Special Offers Section */}
            <SpecialsSection
              onSelectDish={(item) => setSelectedDish(item)}
              onReserveClick={scrollToReservation}
            />

            {/* 5. Gallery Section */}
            <GallerySection />

            {/* 6. Reservation Section */}
            <ReservationSection />

            {/* 7. Reviews Section */}
            <ReviewsSection />

            {/* 8. Stats Section */}
            <StatsSection />

            {/* 9. Location & Contact Section */}
            <LocationSection />
          </main>

          <FloatingActions />

          <Footer />

          <DishModal
            item={selectedDish}
            onClose={() => setSelectedDish(null)}
            onReserveClick={scrollToReservation}
          />
        </>
      )}
    </div>
  );
};

// Protected Admin Route Handler
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] flex items-center justify-center font-mono text-xs uppercase">
        Verifying Admin Credentials...
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

// Route View Renderer
const AppRoutes: React.FC = () => {
  const { currentPath } = useNavigation();

  // 1. QR Table Ordering Routes (/table/01, /table/tbl-07, /table, /dine-in, /order-online)
  const tableMatch = currentPath.match(/^\/table(?:\/([^/?#]+))?/);
  if (tableMatch) {
    const tableParam = tableMatch[1] ? decodeURIComponent(tableMatch[1]) : '01';
    return <TableOrdering tableParam={tableParam} />;
  }

  if (currentPath === '/dine-in' || currentPath === '/menu-order' || currentPath === '/order-table') {
    return <TableOrdering tableParam="01" />;
  }

  // 2. Live Order Tracking Routes (/order/CC1027, /order/uuid-xyz)
  const orderMatch = currentPath.match(/^\/order\/([^/?#]+)/);
  if (orderMatch) {
    const orderId = decodeURIComponent(orderMatch[1]);
    return <OrderTracking orderId={orderId} />;
  }

  if (currentPath === '/order') {
    return <TableOrdering tableParam="01" />;
  }

  // 3. Admin Routes
  if (currentPath === '/admin' || currentPath === '/admin/login') {
    return <AdminLogin />;
  }
  if (currentPath === '/admin/dashboard') {
    return (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/orders') {
    return (
      <ProtectedAdminRoute>
        <AdminLiveOrders />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/tables') {
    return (
      <ProtectedAdminRoute>
        <AdminTables />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/offers') {
    return (
      <ProtectedAdminRoute>
        <AdminOffers />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/menu') {
    return (
      <ProtectedAdminRoute>
        <AdminMenu />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/categories') {
    return (
      <ProtectedAdminRoute>
        <AdminCategories />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/gallery') {
    return (
      <ProtectedAdminRoute>
        <AdminGallery />
      </ProtectedAdminRoute>
    );
  }
  if (currentPath === '/admin/settings') {
    return (
      <ProtectedAdminRoute>
        <AdminSettings />
      </ProtectedAdminRoute>
    );
  }

  // Default: Customer-facing website
  return <PublicWebsite />;
};

// Main App Router
export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}

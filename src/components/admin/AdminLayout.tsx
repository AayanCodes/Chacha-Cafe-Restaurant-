import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ChefHat,
  QrCode,
  Tag,
  UtensilsCrossed,
  FolderTree,
  Images,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Database,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'orders' | 'tables' | 'offers' | 'menu' | 'categories' | 'gallery' | 'settings';
  title?: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  title,
  subtitle,
}) => {
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'orders', label: 'Live Orders & KDS', icon: ChefHat, path: '/admin/orders' },
    { id: 'tables', label: 'Tables & QR', icon: QrCode, path: '/admin/tables' },
    { id: 'offers', label: 'Offer Management', icon: Tag, path: '/admin/offers' },
    { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed, path: '/admin/menu' },
    { id: 'categories', label: 'Categories', icon: FolderTree, path: '/admin/categories' },
    { id: 'gallery', label: 'Gallery', icon: Images, path: '/admin/gallery' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] font-sans flex flex-col md:flex-row antialiased">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121215] border-r border-red-500/20 p-5 justify-between shrink-0 sticky top-0 h-screen z-30">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-red-500/20 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center border border-red-500/40 shadow-lg shadow-red-600/30">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-mono font-black text-base text-[#F8F5EE] uppercase tracking-wider">
                CHACHA CAFE
              </h1>
              <span className="text-[10px] font-mono font-semibold text-red-500 tracking-widest uppercase">
                RESTAURANT CMS
              </span>
            </div>
          </div>

          {/* Database Mode Status */}
          <div className="mb-6 p-3 rounded-2xl bg-[#18181B] border border-red-500/20 flex items-center gap-2.5 text-xs font-mono">
            <Database className={`w-4 h-4 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-red-400'}`} />
            <div>
              <p className="text-[10px] text-[#CBD5E1]/60 uppercase">DATABASE STATUS</p>
              <p className="text-xs font-bold text-[#F8F5EE]">
                {isSupabaseConfigured ? 'Supabase Live Connected' : 'Supabase Not Configured'}
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500 scale-[1.02]'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#18181B] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-500/80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="pt-6 border-t border-red-500/20 space-y-3">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#18181B] hover:bg-zinc-800 border border-red-500/20 text-xs font-mono text-[#CBD5E1] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> View Live Website
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-red-500" />
          </a>

          <div className="flex items-center justify-between px-2">
            <div className="overflow-hidden">
              <p className="text-xs font-mono font-bold text-[#F8F5EE] truncate">{user?.email || 'Owner'}</p>
              <p className="text-[10px] font-mono text-emerald-400">● Administrator</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-xl text-[#CBD5E1] hover:text-red-400 hover:bg-red-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-[#121215] border-b border-red-500/20 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border border-red-500/40">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-mono font-black text-sm text-[#F8F5EE] uppercase">CHACHA CAFE CMS</h1>
            <span className="text-[9px] font-mono text-red-500 uppercase">{activeTab}</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl bg-[#18181B] border border-red-500/30 text-[#F8F5EE]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5 text-red-500" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-6 space-y-6 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6 text-red-500" />
              <span className="font-mono font-black text-base uppercase">CHACHA CAFE CMS</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-zinc-800 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all ${
                    isActive ? 'bg-red-600 text-white' : 'bg-[#121215] text-[#CBD5E1] border border-red-500/20'
                  }`}
                >
                  <Icon className="w-4 h-4 text-red-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="space-y-3 pt-4 border-t border-red-500/20 font-mono text-xs">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="block text-center py-3 rounded-2xl bg-[#18181B] text-white border border-red-500/30 font-bold uppercase"
            >
              View Live Website
            </a>
            <button
              onClick={() => signOut()}
              className="w-full py-3 rounded-2xl bg-red-950/60 text-red-400 border border-red-500/40 font-bold uppercase flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA WITH SMOOTH MOTION */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {(title || subtitle) && (
            <div className="mb-8 border-b border-red-500/20 pb-6">
              {title && (
                <h2 className="text-2xl sm:text-4xl font-mono font-black text-[#F8F5EE] uppercase tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1.5 text-xs sm:text-sm font-sans text-[#CBD5E1]">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </motion.div>
      </main>
    </div>
  );
};

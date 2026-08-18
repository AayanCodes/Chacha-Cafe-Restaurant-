import React, { useEffect, useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Flame,
  Star,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { dbService } from '../../services/dbService';
import { MenuItemCMS, CategoryCMS } from '../../types/admin';

export const AdminMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItemCMS[]>([]);
  const [categories, setCategories] = useState<CategoryCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItemCMS> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [menuData, catData] = await Promise.all([
        dbService.getMenuItems(),
        dbService.getCategories(),
      ]);
      setItems(menuData);
      setCategories(catData);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();

    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      handleOpenCreateModal();
    }
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem({
      name: '',
      category_name: categories[0]?.name || 'Combos',
      price: 199,
      original_price: 199,
      rating: 4.8,
      reviews_count: 25,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      is_veg: true,
      is_available: true,
      is_featured: false,
      display_order: items.length + 1,
      prep_time: '15 mins',
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item: MenuItemCMS) => {
    setEditingItem({ ...item });
    setError(null);
    setIsFormOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    setError(null);

    if (!editingItem.name?.trim()) {
      setError('Dish name is required.');
      return;
    }
    if (editingItem.price === undefined || editingItem.price < 0) {
      setError('Price must be 0 or greater.');
      return;
    }

    try {
      setSaving(true);
      await dbService.saveMenuItem(editingItem as any);
      setSuccessMsg('Menu item saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);

      setIsFormOpen(false);
      setEditingItem(null);
      await loadMenuData();
    } catch (err: any) {
      setError(err.message || 'Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailable = async (item: MenuItemCMS) => {
    await dbService.saveMenuItem({
      ...item,
      is_available: !item.is_available,
    });
    await loadMenuData();
  };

  const handleToggleFeatured = async (item: MenuItemCMS) => {
    await dbService.saveMenuItem({
      ...item,
      is_featured: !item.is_featured,
    });
    await loadMenuData();
  };

  const handleDelete = async (id: string) => {
    await dbService.deleteMenuItem(id);
    setDeleteId(null);
    setSuccessMsg('Menu item deleted successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
    await loadMenuData();
  };

  // Filtered Items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'ALL' && item.category_name !== selectedCategory) return false;

    return true;
  });

  return (
    <AdminLayout
      activeTab="menu"
      title="MENU CATALOG MANAGEMENT"
      subtitle="Update prices, toggle availability, add new dishes, and organize Chacha Cafe offerings."
    >
      <div className="space-y-6">
        {/* SUCCESS ALERT */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* CONTROLS BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#121215] border border-red-500/30 rounded-3xl">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name or description..."
              className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 font-sans"
            />
          </div>

          {/* Category Dropdown & Add Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#18181B] px-3 py-1.5 rounded-2xl border border-red-500/20">
              <Filter className="w-3.5 h-3.5 text-red-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-[#F8F5EE] focus:outline-none uppercase"
              >
                <option value="ALL" className="bg-[#18181B]">All Categories ({items.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#18181B]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> ADD MENU ITEM
            </button>
          </div>
        </div>

        {/* MENU ITEMS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#CBD5E1]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
            <p className="font-mono text-xs uppercase">Loading Menu Catalog...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#121215] border border-red-500/20 rounded-3xl p-8 space-y-4">
            <UtensilsCrossed className="w-12 h-12 text-red-500/40 mx-auto" />
            <div>
              <h3 className="text-base font-mono font-bold uppercase text-[#F8F5EE]">No dishes found</h3>
              <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
                Try clearing search or category filters.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-red-600 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Dish Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-[#121215] border rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                  item.is_available
                    ? 'border-red-500/30 hover:border-red-500'
                    : 'border-zinc-800 opacity-60'
                }`}
              >
                <div>
                  {/* Dish Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-full border-2 border-white ${
                          item.is_veg ? 'bg-emerald-500' : 'bg-red-600'
                        }`}
                        title={item.is_veg ? 'Vegetarian' : 'Non-Veg'}
                      />
                      <span className="px-2.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono font-bold text-[#CBD5E1] border border-zinc-700 uppercase">
                        {item.category_name}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 text-lg font-extrabold text-[#D4AF37] font-mono bg-[#09090B]/90 px-3 py-1 rounded-xl border border-red-500/40">
                      ₹{item.price}
                    </div>

                    {!item.is_available && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center font-mono text-xs font-bold text-red-400 uppercase tracking-widest">
                        UNAVAILABLE ON MENU
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase truncate pr-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating || 4.8}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {item.prep_time && (
                      <p className="text-[10px] font-mono text-red-400 pt-1">
                        ⏱ Prep Time: {item.prep_time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-[#18181B] border-t border-red-500/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-colors ${
                        item.is_available
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {item.is_available ? 'Available' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`p-1.5 rounded-xl text-[10px] font-mono transition-colors ${
                        item.is_featured
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                      title="Toggle Chef Special / Featured"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#F8F5EE] transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/80 text-red-400 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT DISH MODAL */}
        {isFormOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#121215] border border-red-500/40 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <div className="p-5 sm:p-6 border-b border-red-500/20 flex items-center justify-between bg-[#18181B]">
                <div className="flex items-center gap-2 font-mono font-extrabold text-sm text-[#F8F5EE] uppercase">
                  <UtensilsCrossed className="w-4 h-4 text-red-500" />
                  <span>{editingItem.id ? 'Edit Menu Item' : 'Add New Dish to Menu'}</span>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-[#CBD5E1] hover:text-white rounded-xl bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveItem();
                }}
                className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto font-sans"
              >
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Dish Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      placeholder="e.g. Nacho Blast Cheese Pizza"
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Category
                    </label>
                    <select
                      value={editingItem.category_name || categories[0]?.name || 'Combos'}
                      onChange={(e) => setEditingItem({ ...editingItem, category_name: e.target.value })}
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans uppercase"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name} className="bg-[#18181B]">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingItem.price ?? 0}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-sm font-mono text-[#D4AF37] font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Prep Time
                    </label>
                    <input
                      type="text"
                      value={editingItem.prep_time || '15 mins'}
                      onChange={(e) => setEditingItem({ ...editingItem, prep_time: e.target.value })}
                      placeholder="12-15 mins"
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                      Food Type
                    </label>
                    <select
                      value={editingItem.is_veg ? 'VEG' : 'NON_VEG'}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, is_veg: e.target.value === 'VEG' })
                      }
                      className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                    >
                      <option value="VEG">🟢 Vegetarian</option>
                      <option value="NON_VEG">🔴 Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                <ImageUploader
                  value={editingItem.image_url || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, image_url: url })}
                  folder="menu"
                  label="Dish Photo"
                />

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Brief description of taste, ingredients, crust, or spices..."
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl p-4 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 p-4 bg-[#18181B] rounded-2xl border border-red-500/20">
                  <label className="flex items-center gap-2 text-xs font-mono text-[#F8F5EE] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_available ?? true}
                      onChange={(e) => setEditingItem({ ...editingItem, is_available: e.target.checked })}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    Available to Order
                  </label>

                  <label className="flex items-center gap-2 text-xs font-mono text-[#F8F5EE] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_featured ?? false}
                      onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    Chef's Recommendation / Featured
                  </label>
                </div>

                <div className="pt-4 border-t border-red-500/20 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-3 rounded-2xl border border-zinc-700 text-xs font-mono font-bold text-[#CBD5E1] uppercase hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Dish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#121215] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold uppercase text-[#F8F5EE]">
                  Delete this dish?
                </h3>
                <p className="text-xs text-[#CBD5E1] mt-2 leading-relaxed font-sans">
                  Are you sure you want to remove this dish from the menu catalog?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-zinc-700 font-bold text-[#CBD5E1] uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase shadow-lg shadow-red-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

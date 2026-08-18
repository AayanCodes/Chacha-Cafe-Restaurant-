import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, Check, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { dbService } from '../../services/dbService';
import { CategoryCMS } from '../../types/admin';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<CategoryCMS | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await dbService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setErrorMsg(null);
      await dbService.saveCategory({
        name: newCatName.trim(),
        display_order: categories.length + 1,
        is_active: true,
      });

      setNewCatName('');
      setSuccessMsg('Category inserted into Supabase successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadCategories();
    } catch (err: any) {
      console.error('Error saving category to Supabase:', err);
      setErrorMsg(err?.message || 'Failed to add category');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCat || !editingCat.name.trim()) return;

    try {
      setErrorMsg(null);
      await dbService.saveCategory(editingCat);
      setEditingCat(null);
      setSuccessMsg('Category updated in Supabase successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadCategories();
    } catch (err: any) {
      console.error('Error updating category in Supabase:', err);
      setErrorMsg(err?.message || 'Failed to update category');
    }
  };

  const handleToggleActive = async (cat: CategoryCMS) => {
    try {
      setErrorMsg(null);
      await dbService.saveCategory({
        ...cat,
        is_active: !cat.is_active,
      });
      await loadCategories();
    } catch (err: any) {
      console.error('Error toggling category in Supabase:', err);
      setErrorMsg(err?.message || 'Failed to toggle category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category from database?')) return;
    try {
      setErrorMsg(null);
      await dbService.deleteCategory(id);
      setSuccessMsg('Category deleted from Supabase.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadCategories();
    } catch (err: any) {
      console.error('Error deleting category in Supabase:', err);
      setErrorMsg(err?.message || 'Failed to delete category');
    }
  };

  return (
    <AdminLayout
      activeTab="categories"
      title="CATEGORY MANAGEMENT"
      subtitle="Organize menu sections (Pizza, Burger, Combos, Shakes, Lassi, Desserts)."
    >
      <div className="space-y-6 max-w-4xl">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ADD CATEGORY FORM */}
        <form
          onSubmit={handleAddCategory}
          className="p-5 bg-[#121215] border border-red-500/30 rounded-3xl flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full">
            <FolderTree className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Add new category (e.g. Mocktails, Waffles, Chaat)..."
              className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-11 pr-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </form>

        {/* CATEGORY LIST */}
        <div className="bg-[#121215] border border-red-500/30 rounded-3xl p-6">
          <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase mb-4 border-b border-red-500/20 pb-3">
            Active Menu Categories ({categories.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-[#CBD5E1]">
              <Loader2 className="w-6 h-6 text-red-500 animate-spin mr-2" />
              <span className="font-mono text-xs uppercase">Loading categories from Supabase...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 bg-[#18181B] border border-red-500/20 rounded-2xl transition-colors hover:border-red-500/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>

                    {editingCat?.id === cat.id ? (
                      <input
                        type="text"
                        value={editingCat.name}
                        onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                        className="bg-[#121215] border border-red-500/50 rounded-xl px-3 py-1 text-xs text-[#F8F5EE] font-mono focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono font-bold text-sm text-[#F8F5EE] uppercase">
                        {cat.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingCat?.id === cat.id ? (
                      <>
                        <button
                          onClick={handleUpdateCategory}
                          className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCat(null)}
                          className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleActive(cat)}
                          className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase ${
                            cat.is_active
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {cat.is_active ? 'Active' : 'Hidden'}
                        </button>

                        <button
                          onClick={() => setEditingCat(cat)}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#F8F5EE]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

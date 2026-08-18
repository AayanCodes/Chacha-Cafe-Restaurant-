import React, { useEffect, useState } from 'react';
import { Images, Plus, Trash2, Edit2, Check, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { dbService } from '../../services/dbService';
import { GalleryItemCMS } from '../../types/admin';

export const AdminGallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItemCMS> | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await dbService.getGalleryImages();
      setGallery(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load gallery images from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem({
      title: 'Chacha Cafe Ambience',
      category: 'Ambience',
      image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
      description: 'Warm cinematic lighting and comfortable seating on Manadwar Road.',
      display_order: gallery.length + 1,
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem || !editingItem.title?.trim() || !editingItem.image_url) {
      setErrorMsg('Photo title and image URL are required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);
      await dbService.saveGalleryImage(editingItem as any);
      setSuccessMsg('Gallery photo saved to Supabase successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsFormOpen(false);
      setEditingItem(null);
      await loadGallery();
    } catch (err: any) {
      console.error('Error saving gallery item:', err);
      setErrorMsg(err?.message || 'Failed to save photo to Supabase');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the database gallery?')) return;
    try {
      setErrorMsg(null);
      await dbService.deleteGalleryImage(id);
      setSuccessMsg('Photo deleted from database.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadGallery();
    } catch (err: any) {
      console.error('Error deleting gallery item:', err);
      setErrorMsg(err?.message || 'Failed to delete photo from database');
    }
  };

  return (
    <AdminLayout
      activeTab="gallery"
      title="PHOTO GALLERY MANAGEMENT"
      subtitle="Manage photo highlights of Chacha Cafe dining space, dishes, outdoor seating, and event celebrations."
    >
      <div className="space-y-6">
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

        <div className="flex items-center justify-between p-5 bg-[#121215] border border-red-500/30 rounded-3xl">
          <p className="text-xs font-mono font-bold text-[#F8F5EE] uppercase">
            Total Photos in Database Gallery: <span className="text-red-500">{gallery.length}</span>
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> UPLOAD NEW PHOTO
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#CBD5E1]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mr-2" />
            <span className="font-mono text-xs uppercase">Loading gallery photos from Supabase...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="bg-[#121215] border border-red-500/30 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 text-red-400 font-mono text-[10px] font-bold uppercase border border-red-500/30">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-1">
                    <h3 className="font-mono font-bold text-sm text-[#F8F5EE] uppercase">{item.title}</h3>
                    <p className="text-xs text-[#CBD5E1] line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#18181B] border-t border-red-500/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    ● {item.is_active ? 'Visible on Website' : 'Hidden'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsFormOpen(true);
                      }}
                      className="p-2 rounded-xl bg-zinc-800 text-[#F8F5EE] hover:bg-zinc-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-red-950/50 text-red-400 hover:bg-red-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {isFormOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-md w-full bg-[#121215] border border-red-500/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase">
                {editingItem.id ? 'Edit Photo' : 'Upload New Photo to Supabase'}
              </h3>

              <div>
                <label className="block text-xs font-mono font-bold text-[#CBD5E1] uppercase mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-2.5 text-xs text-[#F8F5EE] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#CBD5E1] uppercase mb-1">
                  Category Tag
                </label>
                <select
                  value={editingItem.category || 'Ambience'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-2.5 text-xs text-[#F8F5EE] font-mono"
                >
                  <option value="Ambience">Ambience</option>
                  <option value="Food">Food</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <ImageUploader
                label="Photo Image (Upload or Cloud URL)"
                currentUrl={editingItem.image_url || ''}
                folder="gallery"
                onImageSelected={(url) => setEditingItem({ ...editingItem, image_url: url })}
              />

              <div>
                <label className="block text-xs font-mono font-bold text-[#CBD5E1] uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-2.5 text-xs text-[#F8F5EE] font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveItem}
                  className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2, Loader2, Globe, Clock, MapPin, Phone, MessageSquare, Mail, Instagram, Star, KeyRound, Lock, ShieldCheck, AlertCircle, Database, RefreshCw, Sparkles } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { dbService } from '../../services/dbService';
import { RestaurantSettings } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings: React.FC = () => {
  const { adminCredentials, updateCredentials } = useAuth();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin credentials local state
  const [adminEmail, setAdminEmail] = useState(adminCredentials.email || 'aayanmalik3114@gmail.com');
  const [adminPassword, setAdminPassword] = useState(adminCredentials.password || 'admin123');
  const [credSaving, setCredSaving] = useState(false);
  const [credMsg, setCredMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Database seed state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await dbService.getSettings();
      setSettings(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Database error reading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    if (adminCredentials.email) {
      setAdminEmail(adminCredentials.email);
    }
    if (adminCredentials.password) {
      setAdminPassword(adminCredentials.password);
    }
  }, [adminCredentials]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setErrorMsg(null);
      await dbService.saveSettings(settings);
      setSuccessMsg('Restaurant settings updated directly in Supabase database!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error saving settings to Supabase:', err);
      setErrorMsg(err?.message || 'Failed to save settings to database');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredMsg(null);
    setCredSaving(true);

    const { error } = await updateCredentials(adminEmail, adminPassword);
    setCredSaving(false);

    if (error) {
      setCredMsg({ type: 'error', text: error });
    } else {
      setCredMsg({ type: 'success', text: 'Admin email and password updated successfully!' });
      setTimeout(() => setCredMsg(null), 5000);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      setSeedResult(null);
      const res = await dbService.seedInitialDataIfEmpty();
      setSeedResult({ success: true, message: res.message });
      await loadSettings();
    } catch (err: any) {
      console.error('Database seed error:', err);
      setSeedResult({
        success: false,
        message: err?.message || 'Failed to populate Supabase tables. Please check your connection.',
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminLayout
      activeTab="settings"
      title="RESTAURANT SETTINGS"
      subtitle="Update contact numbers, address, operating hours, Google map location, and timezone."
    >
      <div className="space-y-8 max-w-4xl font-sans">
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

        {/* SUPABASE CLOUD DATABASE SYNC & SEED UTILITY */}
        <div className="p-6 bg-[#121215] border border-red-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-red-500" /> Supabase Cloud Database Status
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Single Source of Truth
            </span>
          </div>

          <p className="text-xs text-[#CBD5E1]/80 leading-relaxed font-sans">
            All CMS operations directly modify your remote Supabase PostgreSQL database tables (<code className="text-red-400 font-mono">menu_items</code>, <code className="text-red-400 font-mono">categories</code>, <code className="text-red-400 font-mono">special_offers</code>, <code className="text-red-400 font-mono">gallery_images</code>, <code className="text-red-400 font-mono">restaurant_settings</code>).
          </p>

          {seedResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2.5 ${
                seedResult.success
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/80 border-red-500/40 text-red-300'
              }`}
            >
              {seedResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{seedResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#CBD5E1]">
              Need to populate initial cafe menu and gallery if tables are empty?
            </span>
            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#202025] border border-red-500/40 text-[#F8F5EE] font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 text-red-500 animate-spin" /> Seeding Database...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Populate Initial Database
                </>
              )}
            </button>
          </div>
        </div>

        {/* CMS LOGIN & PASSWORD MANAGEMENT SECTION */}
        <div className="p-6 bg-[#121215] border border-red-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-red-500" /> CMS Admin Portal Security Credentials
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase">
              Owner Credentials
            </span>
          </div>

          <p className="text-xs text-[#CBD5E1]/80 leading-relaxed font-sans">
            Update the owner email and password used to sign in to the Chacha Cafe Owner CMS Portal.
          </p>

          {credMsg && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2.5 ${
                credMsg.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/80 border-red-500/40 text-red-300'
              }`}
            >
              {credMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{credMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCreds} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                Owner Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="aayanmalik3114@gmail.com"
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                New Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={credSaving}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all hover:scale-102"
              >
                {credSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating Credentials...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Save Admin Email & Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {loading || !settings ? (
          <div className="flex items-center justify-center py-20 text-[#CBD5E1]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mr-2" />
            <span className="font-mono text-xs uppercase">Loading Settings from Supabase...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* GENERAL & BRANDING */}
            <div className="p-6 bg-[#121215] border border-red-500/30 rounded-3xl space-y-4">
              <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase border-b border-red-500/20 pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500" /> Restaurant Profile & Timezone
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.name || ''}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    Operating Timezone (India Default)
                  </label>
                  <select
                    value={settings.timezone || 'Asia/Kolkata'}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-mono"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST - India Standard Time)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                  About & Philosophy Text
                </label>
                <textarea
                  rows={3}
                  value={settings.about_text || ''}
                  onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl p-4 text-xs text-[#F8F5EE] focus:outline-none focus:border-red-500 font-sans"
                />
              </div>
            </div>

            {/* CONTACT & HOURS */}
            <div className="p-6 bg-[#121215] border border-red-500/30 rounded-3xl space-y-4">
              <h3 className="text-base font-mono font-bold text-[#F8F5EE] uppercase border-b border-red-500/20 pb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" /> Contact Info & Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={settings.instagram || ''}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    Opening Hours Text
                  </label>
                  <input
                    type="text"
                    value={settings.opening_hours || ''}
                    onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-1.5">
                  Google Maps Embed URL (Live Location)
                </label>
                <input
                  type="text"
                  value={settings.map_embed_url || ''}
                  onChange={(e) => setSettings({ ...settings, map_embed_url: e.target.value })}
                  placeholder="https://maps.google.com/maps?q=..."
                  className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-[#F8F5EE] font-sans"
                />
                <p className="text-[11px] text-zinc-400 font-sans mt-1">
                  Default shows Chacha Cafe, Mandawar Road, Kiratpur. You can also paste your Google Maps Embed link here anytime.
                </p>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-widest shadow-xl shadow-red-600/30 flex items-center gap-2 transition-transform hover:scale-102"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save All Settings To Database
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

/**
 * Restaurant Table Management & QR Standee Generator (/admin/tables)
 * 
 * Enables administrators to:
 * - Configure tables across sections (Main Dining, Garden Terrace, AC Lounge, Rooftop)
 * - Generate instant dynamic QR codes pointing to `/table/:tableNumber`
 * - Export high-resolution PNG QR images & printable table tent templates
 * - Monitor and override table occupancy and billing states
 */

import React, { useState, useEffect, useRef } from 'react';

import QRCode from 'qrcode';
import {
  QrCode,
  Plus,
  Trash2,
  Edit2,
  Printer,
  Download,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  RefreshCw,
  Eye,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Utensils,
  Maximize2,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { dbService } from '../../services/dbService';
import { RestaurantTable, TableStatus } from '../../types/orders';

const STATUS_COLORS: Record<TableStatus, { bg: string; border: string; text: string }> = {
  AVAILABLE: { bg: 'bg-emerald-950/60', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  ORDERING: { bg: 'bg-amber-950/60', border: 'border-amber-500/40', text: 'text-amber-400' },
  PREPARING: { bg: 'bg-orange-950/60', border: 'border-orange-500/40', text: 'text-orange-400' },
  READY: { bg: 'bg-blue-950/60', border: 'border-blue-500/40', text: 'text-blue-400' },
  OCCUPIED: { bg: 'bg-purple-950/60', border: 'border-purple-500/40', text: 'text-purple-400' },
  BILL_REQUESTED: { bg: 'bg-rose-950/60', border: 'border-rose-500/40', text: 'text-rose-400' },
  COMPLETED: { bg: 'bg-neutral-900', border: 'border-neutral-700', text: 'text-neutral-400' },
};

export const AdminTables: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [editingTable, setEditingTable] = useState<Partial<RestaurantTable> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qrModalTable, setQrModalTable] = useState<RestaurantTable | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [printableTable, setPrintableTable] = useState<RestaurantTable | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const loadTables = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await dbService.getTables();
      setTables(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load restaurant tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  // Generate QR Code URL
  const generateQR = async (table: RestaurantTable) => {
    const origin = window.location.origin;
    const url = `${origin}/table/${table.table_number}`;
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
      setQrModalTable(table);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  // Download QR Code as PNG image
  const downloadQR = (tableNumber: string) => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `chacha-cafe-table-${tableNumber}-qr.png`;
    link.click();
  };

  // Save Table
  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable?.table_number) return;

    setIsSaving(true);
    setErrorMsg(null);
    try {
      await dbService.saveTable({
        id: editingTable.id,
        table_number: editingTable.table_number,
        name: editingTable.name || `Table ${editingTable.table_number}`,
        capacity: Number(editingTable.capacity || 4),
        section: editingTable.section || 'Main Dining',
        status: editingTable.status || 'AVAILABLE',
        is_active: editingTable.is_active !== undefined ? editingTable.is_active : true,
      });

      setSuccessMsg('Table saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsModalOpen(false);
      setEditingTable(null);
      loadTables();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save table.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Table Active
  const handleToggleActive = async (table: RestaurantTable) => {
    try {
      await dbService.toggleTableActive(table.id, !table.is_active);
      setTables((prev) =>
        prev.map((t) => (t.id === table.id ? { ...t, is_active: !t.is_active } : t))
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update table status');
    }
  };

  // Delete Table
  const handleDeleteTable = async (id: string, num: string) => {
    if (!window.confirm(`Are you sure you want to delete Table ${num}?`)) return;
    try {
      await dbService.deleteTable(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
      setSuccessMsg(`Table ${num} deleted successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete table');
    }
  };

  // Print Table Tent Standee
  const handlePrintTable = async (table: RestaurantTable) => {
    const origin = window.location.origin;
    const url = `${origin}/table/${table.table_number}`;
    const qrUrl = await QRCode.toDataURL(url, {
      width: 500,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
    setQrDataUrl(qrUrl);
    setPrintableTable(table);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Filter tables
  const sections = ['ALL', ...Array.from(new Set(tables.map((t) => t.section || 'Main Dining')))];

  const filteredTables = tables.filter((t) => {
    const matchesSection = sectionFilter === 'ALL' || t.section === sectionFilter;
    const matchesSearch =
      searchQuery === '' ||
      t.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <AdminLayout activeTab="tables">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
              <QrCode className="w-7 h-7 text-amber-400" />
              Tables & QR Codes
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Manage dining tables, generate high-resolution QR codes, print table standees, and view real-time table statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTables}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Tables"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              id="add-table-btn"
              onClick={() => {
                setEditingTable({
                  table_number: `${tables.length + 1}`.padStart(2, '0'),
                  name: `Table ${tables.length + 1}`,
                  capacity: 4,
                  section: 'Main Dining',
                  status: 'AVAILABLE',
                  is_active: true,
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Table
            </button>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-xs text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-950/80 border border-green-500/50 p-4 rounded-2xl flex items-center gap-3 text-xs text-green-200">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by table number, name, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSectionFilter(sec)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  sectionFilter === sec
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Table Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-400 font-mono">Loading restaurant tables...</p>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="py-16 text-center bg-[#121215] border border-white/5 rounded-2xl p-6">
            <QrCode className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-white">No tables found</p>
            <p className="text-xs text-neutral-500 mt-1">
              Click &quot;Add New Table&quot; to create your first restaurant table with QR ordering.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTables.map((table) => {
              const statusStyle =
                STATUS_COLORS[table.status] || STATUS_COLORS.AVAILABLE;

              return (
                <div
                  key={table.id}
                  className={`bg-[#121215] border ${
                    table.is_active ? 'border-white/10' : 'border-neutral-800 opacity-60'
                  } rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all group`}
                >
                  <div>
                    {/* Top Row: Number & Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-base text-white shadow-md shadow-red-950 font-serif">
                          {table.table_number}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {table.name}
                          </h3>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {table.section}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                      >
                        {table.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Capacity & Order Info */}
                    <div className="bg-[#18181C] rounded-xl p-2.5 space-y-1.5 text-xs text-neutral-300 mb-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-neutral-500" />
                          Capacity
                        </span>
                        <span className="font-semibold text-white">{table.capacity} Persons</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">URL Route</span>
                        <span className="font-mono text-amber-400 font-medium">
                          /table/{table.table_number}
                        </span>
                      </div>

                      {table.current_order_id && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                          <span className="text-neutral-400">Current Order</span>
                          <span className="font-mono text-green-400 font-bold">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => generateQR(table)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="View & Download QR"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      QR Code
                    </button>

                    <button
                      onClick={() => handlePrintTable(table)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title="Print Table Tent Standee"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingTable(table);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title="Edit Table"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(table)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title={table.is_active ? 'Disable Table' : 'Enable Table'}
                    >
                      {table.is_active ? (
                        <ToggleRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-neutral-500" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteTable(table.id, table.table_number)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 1. ADD / EDIT TABLE MODAL */}
        {isModalOpen && editingTable && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#141418] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  {editingTable.id ? 'Edit Table' : 'Add New Table'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTable(null);
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTable} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">
                      Table Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 07"
                      value={editingTable.table_number || ''}
                      onChange={(e) =>
                        setEditingTable({ ...editingTable, table_number: e.target.value })
                      }
                      className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">
                      Seating Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={editingTable.capacity || 4}
                      onChange={(e) =>
                        setEditingTable({
                          ...editingTable,
                          capacity: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">
                    Table Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 07 - Premium Corner"
                    value={editingTable.name || ''}
                    onChange={(e) =>
                      setEditingTable({ ...editingTable, name: e.target.value })
                    }
                    className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">
                      Section / Area
                    </label>
                    <select
                      value={editingTable.section || 'Main Dining'}
                      onChange={(e) =>
                        setEditingTable({ ...editingTable, section: e.target.value })
                      }
                      className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Main Dining">Main Dining</option>
                      <option value="Outdoor Garden">Outdoor Garden</option>
                      <option value="AC Lounge">AC Lounge</option>
                      <option value="Rooftop">Rooftop</option>
                      <option value="VIP Suite">VIP Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">
                      Initial Status
                    </label>
                    <select
                      value={editingTable.status || 'AVAILABLE'}
                      onChange={(e) =>
                        setEditingTable({
                          ...editingTable,
                          status: e.target.value as TableStatus,
                        })
                      }
                      className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="READY">Ready</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTable(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-lg shadow-red-950 cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Table'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. QR CODE PREVIEW & DOWNLOAD MODAL */}
        {qrModalTable && qrDataUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#141418] border border-amber-500/30 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-amber-400">
                  QR CODE PREVIEW
                </span>
                <button
                  onClick={() => {
                    setQrModalTable(null);
                    setQrDataUrl('');
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
                <img
                  src={qrDataUrl}
                  alt={`Table ${qrModalTable.table_number} QR Code`}
                  className="w-56 h-56 mx-auto"
                />
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Table {qrModalTable.table_number}
                </h3>
                <p className="text-xs text-neutral-400">
                  {window.location.origin}/table/{qrModalTable.table_number}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQR(qrModalTable.table_number)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>

                <button
                  onClick={() => {
                    setQrModalTable(null);
                    handlePrintTable(qrModalTable);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Standee
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRINTABLE TABLE TENT / STANDEE TEMPLATE (PRINT MEDIA ONLY) */}
        {printableTable && qrDataUrl && (
          <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-[9999]">
            <div className="max-w-md mx-auto border-4 border-black p-8 rounded-3xl text-center flex flex-col items-center justify-between min-h-[500px]">
              <div>
                <h1 className="text-3xl font-serif font-black tracking-tight uppercase">
                  CHACHA CAFE
                </h1>
                <p className="text-xs font-mono tracking-widest text-neutral-600 mt-0.5">
                  KIRATPUR • UTTAR PRADESH
                </p>
                <div className="h-0.5 w-16 bg-black mx-auto my-3" />
                <h2 className="text-4xl font-serif font-black">
                  TABLE {printableTable.table_number}
                </h2>
                <p className="text-xs text-neutral-600">{printableTable.section}</p>
              </div>

              <div className="my-6 p-4 border-2 border-black rounded-2xl bg-white">
                <img
                  src={qrDataUrl}
                  alt={`Table ${printableTable.table_number} QR`}
                  className="w-64 h-64 mx-auto"
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-wide uppercase">
                  📱 SCAN WITH PHONE CAMERA TO ORDER
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  View Full Menu • Customize Dishes • Instant Kitchen Notification
                </p>
                <p className="text-[10px] font-mono text-neutral-500 mt-4">
                  Manadwar Road, Kiratpur • Tel: +91 86503 67876
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

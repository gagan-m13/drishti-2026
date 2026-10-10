'use client';

import React, { useState } from 'react';
import { Trophy, Plus, Edit2, Trash2, MapPin, X, Check, Image as ImageIcon } from 'lucide-react';
import { Prize } from '@/types';

interface AdminPrizesProps {
  prizes: Prize[];
  onRefresh: () => void;
}

export default function AdminPrizes({ prizes = [], onRefresh }: AdminPrizesProps) {
  const [editingPrize, setEditingPrize] = useState<Partial<Prize> | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingPrize({
      id: `prz-${Date.now()}`,
      rank: prizes.length + 1,
      title: `${prizes.length + 1}TH PRIZE`,
      itemName: '',
      description: '',
      features: ['', '', ''],
      imageUrl: '',
      sponsorName: '',
      sponsorCategory: '',
      sponsorMapUrl: '',
      displayOrder: prizes.length + 1,
      isAnnounced: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize || !editingPrize.itemName) return;
    setLoading(true);

    try {
      const cleanFeatures = (editingPrize.features || []).filter(f => f.trim() !== '');
      const payload = {
        ...editingPrize,
        features: cleanFeatures,
        rank: Number(editingPrize.rank || 1),
        displayOrder: Number(editingPrize.displayOrder || editingPrize.rank || 1),
      };

      const res = await fetch('/api/admin/prizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save prize');

      showToast(`Prize "${editingPrize.itemName}" saved successfully!`);
      setEditingPrize(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving prize');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (p: Prize) => {
    if (!confirm(`Are you sure you want to delete prize "${p.itemName}"?`)) return;
    setDeleteLoadingId(p.id);

    try {
      const res = await fetch(`/api/admin/prizes?id=${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete prize');

      showToast(`Prize "${p.itemName}" deleted.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting prize');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold shadow-gold-glow">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Prize Management</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Customize prize titles, item names, photos, feature specifications, and sponsor store links.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Prize</span>
        </button>
      </div>

      {/* Prizes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prizes.map((p) => (
          <div
            key={p.id}
            className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-durgi-gold/60 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold bg-durgi-gold text-black">
                  {p.title}
                </span>
                <span className="text-[11px] text-gray-400">Rank: #{p.rank}</span>
              </div>

              {p.imageUrl && (
                <div className="h-44 w-full bg-[#05070D] rounded-2xl flex items-center justify-center p-3 relative overflow-hidden border border-gray-800">
                  <img src={p.imageUrl} alt={p.itemName} className="h-full object-contain" />
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white font-serif">{p.itemName}</h3>
                <p className="text-xs text-gray-300 pt-1 leading-relaxed">{p.description}</p>
              </div>

              {p.features && p.features.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-gray-800">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                      <span className="text-durgi-gold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <div className="bg-[#080B11] p-2.5 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Sponsor:</span>
                  <strong className="text-amber-200">{p.sponsorName}</strong>
                </div>
                {p.sponsorMapUrl && (
                  <a
                    href={p.sponsorMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-durgi-gold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Map</span>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setEditingPrize({ ...p, features: [...(p.features || ['', '', ''])] })}
                  className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Prize</span>
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={deleteLoadingId === p.id}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Prize Modal */}
      {editingPrize && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white">
                {prizes.some(p => p.id === editingPrize.id) ? `Edit: ${editingPrize.itemName}` : 'Add New Prize'}
              </h3>
              <button
                onClick={() => setEditingPrize(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Rank Number *</label>
                  <input
                    type="number"
                    required
                    value={editingPrize.rank || 1}
                    onChange={(e) => setEditingPrize({ ...editingPrize, rank: Number(e.target.value) })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-gray-300 font-semibold">Prize Title (Header) *</label>
                  <input
                    type="text"
                    required
                    value={editingPrize.title || ''}
                    onChange={(e) => setEditingPrize({ ...editingPrize, title: e.target.value })}
                    placeholder="e.g., FIRST PRIZE"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Prize Item Name *</label>
                <input
                  type="text"
                  required
                  value={editingPrize.itemName || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, itemName: e.target.value })}
                  placeholder="e.g., Galaxy M17e 5G Smartphone"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={editingPrize.description || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, description: e.target.value })}
                  placeholder="Short description of the prize item..."
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              {/* Photo Path */}
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Prize Image URL / Path</label>
                <input
                  type="text"
                  value={editingPrize.imageUrl || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, imageUrl: e.target.value })}
                  placeholder="/images/prizes/first-prize-smartphone.jpg"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
                <div className="flex gap-2 text-[10px] text-gray-400 pt-1">
                  <span>Quick paths:</span>
                  <button type="button" onClick={() => setEditingPrize({ ...editingPrize, imageUrl: '/images/prizes/first-prize-smartphone.jpg' })} className="text-durgi-gold hover:underline">Smartphone</button>
                  <span>•</span>
                  <button type="button" onClick={() => setEditingPrize({ ...editingPrize, imageUrl: '/images/prizes/second-prize-gimbal.jpg' })} className="text-durgi-gold hover:underline">Gimbal</button>
                  <span>•</span>
                  <button type="button" onClick={() => setEditingPrize({ ...editingPrize, imageUrl: '/images/prizes/third-prize-speaker.jpg' })} className="text-durgi-gold hover:underline">Speaker</button>
                </div>
              </div>

              {/* Feature Points */}
              <div className="space-y-2 pt-1 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-semibold">Key Features / Bullets</label>
                  <button
                    type="button"
                    onClick={() => setEditingPrize({
                      ...editingPrize,
                      features: [...(editingPrize.features || []), '']
                    })}
                    className="text-[11px] text-durgi-gold hover:underline font-bold"
                  >
                    + Add Feature
                  </button>
                </div>
                {(editingPrize.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...(editingPrize.features || [])];
                        updated[idx] = e.target.value;
                        setEditingPrize({ ...editingPrize, features: updated });
                      }}
                      placeholder={`Feature #${idx + 1}`}
                      className="flex-1 bg-[#080B11] border border-gray-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-durgi-gold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (editingPrize.features || []).filter((_, i) => i !== idx);
                        setEditingPrize({ ...editingPrize, features: updated });
                      }}
                      className="p-1.5 text-gray-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sponsor Linkings */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-800">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Sponsor Partner Name</label>
                  <input
                    type="text"
                    value={editingPrize.sponsorName || ''}
                    onChange={(e) => setEditingPrize({ ...editingPrize, sponsorName: e.target.value })}
                    placeholder="e.g., Namma Angadi"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Sponsor Category</label>
                  <input
                    type="text"
                    value={editingPrize.sponsorCategory || ''}
                    onChange={(e) => setEditingPrize({ ...editingPrize, sponsorCategory: e.target.value })}
                    placeholder="e.g., Home Appliances Store"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Sponsor Google Maps Link</label>
                <input
                  type="url"
                  value={editingPrize.sponsorMapUrl || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, sponsorMapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/place/..."
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingPrize(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-durgi-gold text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Prize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

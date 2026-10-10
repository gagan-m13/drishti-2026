'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, ExternalLink, X, Check, CheckCircle2 } from 'lucide-react';
import { Sponsor } from '@/types';

interface AdminSponsorsProps {
  sponsors: Sponsor[];
  onRefresh: () => void;
}

export default function AdminSponsors({ sponsors = [], onRefresh }: AdminSponsorsProps) {
  const [editingSponsor, setEditingSponsor] = useState<Partial<Sponsor> | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingSponsor({
      id: `sp-${Date.now()}`,
      name: '',
      tier: 'associate',
      businessCategory: '',
      tagline: '',
      prizeTitle: '',
      promotionalPoints: ['', '', ''],
      mapUrl: '',
      address: '',
      displayOrder: sponsors.length + 1,
      isActive: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor || !editingSponsor.name) return;
    setLoading(true);

    try {
      const cleanPoints = (editingSponsor.promotionalPoints || []).filter(p => p.trim() !== '');
      const payload = {
        ...editingSponsor,
        promotionalPoints: cleanPoints,
      };

      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save sponsor');

      showToast(`Sponsor "${editingSponsor.name}" saved successfully!`);
      setEditingSponsor(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving sponsor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (s: Sponsor) => {
    if (!confirm(`Are you sure you want to delete sponsor "${s.name}"?`)) return;
    setDeleteLoadingId(s.id);

    try {
      const res = await fetch(`/api/admin/sponsors?id=${s.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete sponsor');

      showToast(`Sponsor "${s.name}" deleted.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting sponsor');
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
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Sponsor Management</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Customize sponsors, tier badges, promotional bullet points, and verified Google Maps locations.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sponsor</span>
        </button>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-durgi-gold/60 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold ${
                  s.tier === 'title' ? 'bg-durgi-gold text-black' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {s.tier === 'title' ? '★ Title Sponsor' : 'Associate Sponsor'}
                </span>
                <span className="text-[11px] text-gray-400">Order: {s.displayOrder}</span>
              </div>

              <div>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                  {s.businessCategory || 'Official Business Partner'}
                </span>
                <h3 className="text-2xl font-bold text-white font-serif">{s.name}</h3>
                {s.tagline && <p className="text-xs text-gray-400 italic pt-0.5">&quot;{s.tagline}&quot;</p>}
              </div>

              {s.prizeTitle && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Sponsoring:</span>
                  <strong>{s.prizeTitle}</strong>
                </div>
              )}

              {s.promotionalPoints && s.promotionalPoints.length > 0 && (
                <div className="space-y-1.5 pt-1 text-xs text-gray-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Promotional Highlights:
                  </span>
                  {s.promotionalPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                      <span className="text-durgi-gold mt-0.5">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              {s.mapUrl && (
                <a
                  href={s.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#080B11] border border-gray-700 hover:border-durgi-gold text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-durgi-gold" />
                  <span>📍 Google Maps Link</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setEditingSponsor({ ...s, promotionalPoints: [...(s.promotionalPoints || ['', '', ''])] })}
                  className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Sponsor</span>
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  disabled={deleteLoadingId === s.id}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Sponsor Modal */}
      {editingSponsor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white">
                {sponsors.some(s => s.id === editingSponsor.id) ? `Edit: ${editingSponsor.name}` : 'Add New Sponsor'}
              </h3>
              <button
                onClick={() => setEditingSponsor(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Sponsor Name *</label>
                  <input
                    type="text"
                    required
                    value={editingSponsor.name || ''}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                    placeholder="e.g., Namma Angadi"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Sponsor Tier *</label>
                  <select
                    value={editingSponsor.tier || 'associate'}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, tier: e.target.value as any })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  >
                    <option value="title">Title Sponsor</option>
                    <option value="associate">Associate Sponsor</option>
                    <option value="powered_by">Powered By</option>
                    <option value="supporter">Supporter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Business Category</label>
                  <input
                    type="text"
                    value={editingSponsor.businessCategory || ''}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, businessCategory: e.target.value })}
                    placeholder="e.g., Home Appliances & Electronics Superstore"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Prize Sponsored</label>
                  <input
                    type="text"
                    value={editingSponsor.prizeTitle || ''}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, prizeTitle: e.target.value })}
                    placeholder="e.g., First Prize: Smartphone"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Store Tagline / Slogan</label>
                <input
                  type="text"
                  value={editingSponsor.tagline || ''}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, tagline: e.target.value })}
                  placeholder="e.g., Kadur's Most Trusted Destination for Quality Home Appliances"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              {/* Promotional Highlights */}
              <div className="space-y-2 pt-1 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-semibold">Promotional Highlights (Bullet Points)</label>
                  <button
                    type="button"
                    onClick={() => setEditingSponsor({
                      ...editingSponsor,
                      promotionalPoints: [...(editingSponsor.promotionalPoints || []), '']
                    })}
                    className="text-[11px] text-durgi-gold hover:underline font-bold"
                  >
                    + Add Point
                  </button>
                </div>
                {(editingSponsor.promotionalPoints || []).map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => {
                        const updated = [...(editingSponsor.promotionalPoints || [])];
                        updated[idx] = e.target.value;
                        setEditingSponsor({ ...editingSponsor, promotionalPoints: updated });
                      }}
                      placeholder={`Promotional highlight #${idx + 1}`}
                      className="flex-1 bg-[#080B11] border border-gray-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-durgi-gold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (editingSponsor.promotionalPoints || []).filter((_, i) => i !== idx);
                        setEditingSponsor({ ...editingSponsor, promotionalPoints: updated });
                      }}
                      className="p-1.5 text-gray-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Google Maps URL */}
              <div className="space-y-1 pt-1 border-t border-gray-800">
                <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-durgi-gold" />
                  <span>Google Maps URL</span>
                </label>
                <input
                  type="url"
                  value={editingSponsor.mapUrl || ''}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, mapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/place/..."
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Store Address (Optional)</label>
                  <input
                    type="text"
                    value={editingSponsor.address || ''}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, address: e.target.value })}
                    placeholder="e.g., Main Road, Kadur"
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Display Order</label>
                  <input
                    type="number"
                    value={editingSponsor.displayOrder || 1}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, displayOrder: Number(e.target.value) })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingSponsor(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-durgi-gold text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Sponsor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

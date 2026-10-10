'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, MessageCircle, X } from 'lucide-react';
import { Coordinator } from '@/types';

interface AdminCoordinatorsProps {
  coordinators: Coordinator[];
  onRefresh: () => void;
}

export default function AdminCoordinators({ coordinators = [], onRefresh }: AdminCoordinatorsProps) {
  const [editingCoord, setEditingCoord] = useState<Partial<Coordinator> | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCoord({
      id: `coord-${Date.now()}`,
      name: '',
      role: 'Event Coordinator',
      phone: '',
      whatsappUrl: '',
      instagramUrl: '',
      imageUrl: '/images/durgi/durgi-portrait-crown.jpg',
      displayOrder: coordinators.length + 1,
      isActive: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoord || !editingCoord.name) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/coordinators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCoord),
      });

      if (!res.ok) throw new Error('Failed to save coordinator');
      setEditingCoord(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving coordinator');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (c: Coordinator) => {
    if (!confirm(`Are you sure you want to delete coordinator "${c.name}"?`)) return;
    setDeleteLoadingId(c.id);

    try {
      const res = await fetch(`/api/admin/coordinators?id=${c.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete coordinator');
      onRefresh();
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Event Coordinators</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Edit contact names, helpline numbers, and WhatsApp communication links.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coordinator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {coordinators.map((c) => (
          <div key={c.id} className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 space-y-4 hover:border-durgi-gold/60 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white font-serif">{c.name}</h3>
                <p className="text-xs text-amber-300 font-semibold">{c.role}</p>
                <p className="text-xs text-gray-300 font-mono mt-1">+91 {c.phone}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingCoord({ ...c })}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  disabled={deleteLoadingId === c.id}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-800 text-xs">
              <a
                href={`tel:+91${c.phone}`}
                className="px-3 py-1.5 rounded-xl bg-[#080B11] border border-gray-700 text-gray-300 hover:text-white flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={c.whatsappUrl || `https://wa.me/91${c.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Link
              </a>
            </div>
          </div>
        ))}
      </div>

      {editingCoord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white">
                {coordinators.some(c => c.id === editingCoord.id) ? `Edit: ${editingCoord.name}` : 'Add Coordinator'}
              </h3>
              <button onClick={() => setEditingCoord(null)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingCoord.name || ''}
                  onChange={(e) => setEditingCoord({ ...editingCoord, name: e.target.value })}
                  placeholder="e.g., Gagan"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Role Title *</label>
                <input
                  type="text"
                  required
                  value={editingCoord.role || ''}
                  onChange={(e) => setEditingCoord({ ...editingCoord, role: e.target.value })}
                  placeholder="e.g., Event Coordinator"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={editingCoord.phone || ''}
                  onChange={(e) => setEditingCoord({ ...editingCoord, phone: e.target.value })}
                  placeholder="e.g., 6362320465"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">WhatsApp Message Link (Optional)</label>
                <input
                  type="url"
                  value={editingCoord.whatsappUrl || ''}
                  onChange={(e) => setEditingCoord({ ...editingCoord, whatsappUrl: e.target.value })}
                  placeholder="https://wa.me/91..."
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingCoord(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-durgi-gold text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Coordinator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

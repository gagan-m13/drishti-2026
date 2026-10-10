'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { GalleryImage } from '@/types';

interface AdminGalleryProps {
  gallery: GalleryImage[];
  onRefresh: () => void;
}

export default function AdminGallery({ gallery = [], onRefresh }: AdminGalleryProps) {
  const [editingImg, setEditingImg] = useState<Partial<GalleryImage> | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingImg({
      id: `gal-${Date.now()}`,
      title: '',
      caption: '',
      altText: '',
      imageUrl: '/images/durgi/durgi-hero.jpg',
      category: 'Idol & Rituals',
      displayOrder: gallery.length + 1,
      isFeatured: false,
      isActive: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImg || !editingImg.title || !editingImg.imageUrl) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingImg),
      });

      if (!res.ok) throw new Error('Failed to save gallery image');
      setEditingImg(null);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (g: GalleryImage) => {
    if (!confirm(`Delete "${g.title}" from gallery?`)) return;
    setDeleteLoadingId(g.id);

    try {
      const res = await fetch(`/api/admin/gallery?id=${g.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');
      onRefresh();
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Durgi Sacred Gallery</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Manage sacred festival photos, captions, and altar display order.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((g) => (
          <div key={g.id} className="bg-[#0E1424] border border-gray-800 rounded-2xl overflow-hidden p-3 space-y-2 hover:border-durgi-gold/60 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black">
                <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-bold text-white font-serif truncate">{g.title}</h4>
              <p className="text-[11px] text-gray-400 line-clamp-2">{g.caption}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-[10px] text-amber-400 font-bold uppercase">{g.category}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingImg({ ...g })}
                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(g)}
                  disabled={deleteLoadingId === g.id}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white">
                {gallery.some(g => g.id === editingImg.id) ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
              </h3>
              <button onClick={() => setEditingImg(null)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Title *</label>
                <input
                  type="text"
                  required
                  value={editingImg.title || ''}
                  onChange={(e) => setEditingImg({ ...editingImg, title: e.target.value })}
                  placeholder="e.g., Sri Durga Devi — Kaduru Dasara"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  value={editingImg.imageUrl || ''}
                  onChange={(e) => setEditingImg({ ...editingImg, imageUrl: e.target.value })}
                  placeholder="/images/durgi/durgi-hero.jpg"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Caption</label>
                <textarea
                  rows={2}
                  value={editingImg.caption || ''}
                  onChange={(e) => setEditingImg({ ...editingImg, caption: e.target.value })}
                  placeholder="Short description of the photo..."
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Category</label>
                <input
                  type="text"
                  value={editingImg.category || 'Idol & Rituals'}
                  onChange={(e) => setEditingImg({ ...editingImg, category: e.target.value })}
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingImg(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-durgi-gold text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

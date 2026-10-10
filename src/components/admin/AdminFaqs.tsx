'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { FAQ } from '@/types';

interface AdminFaqsProps {
  faqs: FAQ[];
  onRefresh: () => void;
}

export default function AdminFaqs({ faqs = [], onRefresh }: AdminFaqsProps) {
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      category: 'General',
      displayOrder: faqs.length + 1,
      isPublished: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      if (!res.ok) throw new Error('Failed to save FAQ');
      setEditingFaq(null);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (f: FAQ) => {
    if (!confirm(`Delete FAQ: "${f.question}"?`)) return;
    setDeleteLoadingId(f.id);

    try {
      const res = await fetch(`/api/admin/faqs?id=${f.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      onRefresh();
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Contest Rules & FAQs</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Edit competition guidelines, criteria answers, and frequently asked questions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      <div className="space-y-4 max-w-4xl">
        {faqs.map((f) => (
          <div key={f.id} className="bg-[#0E1424] border border-gray-800 rounded-2xl p-5 space-y-2 hover:border-durgi-gold/60 transition-all flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{f.category}</span>
              <h4 className="text-base font-bold text-white font-serif">{f.question}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{f.answer}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 pt-1">
              <button
                onClick={() => setEditingFaq({ ...f })}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(f)}
                disabled={deleteLoadingId === f.id}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white">
                {faqs.some(f => f.id === editingFaq.id) ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setEditingFaq(null)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g., Can I submit more than 2 reels?"
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Enter clear, informative answer..."
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Category</label>
                <input
                  type="text"
                  value={editingFaq.category || 'General'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-durgi-gold text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Search, Download, CheckCircle2, Clock, Edit2, Trash2, Copy, Check, X, Phone, MessageCircle } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { Registration } from '@/types';
import { formatDate } from '@/lib/date-format';

interface AdminRegistrationsProps {
  registrations: Registration[];
  onRefresh?: () => void;
}

export default function AdminRegistrations({ registrations = [], onRefresh }: AdminRegistrationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingReg, setEditingReg] = useState<Registration | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const filtered = (registrations || []).filter((r) => {
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (r.registrationCode || '').toLowerCase().includes(q) ||
      (r.fullName || '').toLowerCase().includes(q) ||
      (r.normalizedPhone || '').includes(q) ||
      (r.instagramUsername || '').toLowerCase().includes(q) ||
      (r.city || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    const subs = r.submissions || [];
    if (statusFilter === 'both') return subs.length === 2;
    if (statusFilter === 'single') return subs.length === 1;
    if (statusFilter === 'zero') return subs.length === 0;

    return true;
  });

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;
    setEditLoading(true);

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReg),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update registration');

      showToast(`Participant ${editingReg.registrationCode} updated successfully!`);
      setEditingReg(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (reg: Registration) => {
    if (!confirm(`Are you sure you want to permanently delete registration ${reg.registrationCode} (${reg.fullName})? All associated video submissions will also be deleted.`)) {
      return;
    }

    setDeleteLoadingId(reg.id);
    try {
      const res = await fetch(`/api/admin/registrations?id=${reg.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete registration');

      showToast(`Registration ${reg.registrationCode} deleted.`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleCopyLink = (reg: Registration) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/submit?token=${reg.accessToken}`;
    navigator.clipboard.writeText(link);
    setCopiedTokenId(reg.id);
    showToast(`Submission portal link copied for ${reg.fullName}!`);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {msg && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-gold-glow text-xs font-semibold flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-950 border border-emerald-500 text-emerald-200' : 'bg-rose-950 border border-rose-500 text-rose-200'
        }`}>
          <span>{msg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Registrations Directory</h1>
          <p className="text-xs sm:text-sm text-gray-400">Search, edit participant details, remove test entries, and export the full database.</p>
        </div>
        <a
          href="/api/admin/export-csv"
          className="px-4 py-2 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 shadow-gold-glow shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV ({filtered.length})</span>
        </a>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0E1424] p-4 rounded-2xl border border-gray-800">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-500 absolute top-3 left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Registration ID, Full Name, Phone, Instagram Handle, City..."
            className="w-full bg-[#080B11] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-durgi-gold"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">All Registrations</option>
          <option value="both">Both Reels Submitted (2/2)</option>
          <option value="single">Single Reel Submitted (1/2)</option>
          <option value="zero">Awaiting Submission (0/2)</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0E1424] border border-gray-800 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D16] border-b border-gray-800 text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Reg Code</th>
                <th className="p-4">Participant</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Instagram</th>
                <th className="p-4">Reels Status</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {filtered.length > 0 ? (
                filtered.map((r) => {
                  const subs = r.submissions || [];
                  return (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-serif font-bold text-gold-gradient">{r.registrationCode}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{r.fullName}</div>
                        <div className="text-[11px] text-gray-400">{r.city} {r.college ? `• ${r.college}` : ''}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <div>+91 {r.normalizedPhone}</div>
                        <div className="text-gray-400">{r.email}</div>
                      </td>
                      <td className="p-4 font-medium text-pink-300">@{r.instagramUsername}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          subs.length === 2 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          subs.length === 1 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {subs.length} / 2 Submitted
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">{formatDate(r.createdAt)}</td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleCopyLink(r)}
                            title="Copy Submission Link"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                          >
                            {copiedTokenId === r.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => setEditingReg({ ...r })}
                            title="Edit Participant"
                            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            disabled={deleteLoadingId === r.id}
                            title="Delete Registration"
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="text-sm font-semibold text-gray-300">No Registrations Yet</div>
                      <p className="text-xs text-gray-500">
                        {search || statusFilter !== 'all' 
                          ? 'No participants matched your current search filters.'
                          : 'The free registration portal is live at /register. When participants submit the form, their details will appear here immediately.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Registration Modal */}
      {editingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Edit Participant Entry</span>
                <h3 className="text-lg font-serif font-bold text-white">{editingReg.registrationCode}</h3>
              </div>
              <button
                onClick={() => setEditingReg(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingReg.fullName || ''}
                  onChange={(e) => setEditingReg({ ...editingReg, fullName: e.target.value })}
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={editingReg.normalizedPhone || ''}
                    onChange={(e) => setEditingReg({ ...editingReg, normalizedPhone: e.target.value })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Instagram Username</label>
                  <input
                    type="text"
                    required
                    value={editingReg.instagramUsername || ''}
                    onChange={(e) => setEditingReg({ ...editingReg, instagramUsername: e.target.value })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingReg.email || ''}
                    onChange={(e) => setEditingReg({ ...editingReg, email: e.target.value })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">City / Town / Village</label>
                  <input
                    type="text"
                    required
                    value={editingReg.city || ''}
                    onChange={(e) => setEditingReg({ ...editingReg, city: e.target.value })}
                    className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">College / Organization (Optional)</label>
                <input
                  type="text"
                  value={editingReg.college || ''}
                  onChange={(e) => setEditingReg({ ...editingReg, college: e.target.value })}
                  className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-durgi-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingReg(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 rounded-xl bg-durgi-gold text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

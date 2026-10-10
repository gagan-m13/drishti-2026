'use client';

import React from 'react';
import { Download, RefreshCw, Users, Film, Award, Clock } from 'lucide-react';
import { Registration, SiteSettings } from '@/types';

interface AdminOverviewProps {
  metrics: any;
  registrations: Registration[];
  siteSettings: SiteSettings | null;
  onRefresh: () => void;
  onNavigateTab: (tab: any) => void;
}

export default function AdminOverview({
  metrics,
  registrations,
  siteSettings,
  onRefresh,
  onNavigateTab,
}: AdminOverviewProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-gray-400">Real-time contest registrations, video submission progress, and recent activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export-csv"
            className="px-4 py-2 rounded-xl bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 shadow-gold-glow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-[#0F1424] border border-gray-700 text-gray-300 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#0E1424] border border-durgi-gold/30 rounded-2xl p-5 space-y-1 shadow-gold-glow-sm">
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Total Registrations</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif">{metrics.total || 0}</div>
          <div className="text-[11px] text-gray-400">Verified participant entries</div>
        </div>

        <div className="bg-[#0E1424] border border-emerald-500/30 rounded-2xl p-5 space-y-1">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Both Reels Done</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-serif">{metrics.bothSubmitted || 0}</div>
          <div className="text-[11px] text-gray-400">100% submission complete</div>
        </div>

        <div className="bg-[#0E1424] border border-amber-500/30 rounded-2xl p-5 space-y-1">
          <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Single Reel Done</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-200 font-serif">{metrics.singleSubmitted || 0}</div>
          <div className="text-[11px] text-gray-400">1 reel awaiting link</div>
        </div>

        <div className="bg-[#0E1424] border border-blue-500/30 rounded-2xl p-5 space-y-1">
          <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Eligible Entries</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-300 font-serif">{metrics.eligible || 0}</div>
          <div className="text-[11px] text-gray-400">Approved by jury</div>
        </div>
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-white">Recent Registrations</h3>
            <button onClick={() => onNavigateTab('registrations')} className="text-xs font-bold text-durgi-gold hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {registrations.slice(0, 5).map((r) => (
              <div key={r.id} className="p-3 bg-[#080B11] rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-serif">{r.fullName}</div>
                  <div className="text-gray-400">ID: {r.registrationCode} • @{r.instagramUsername}</div>
                </div>
                <span className="text-amber-300 font-semibold">{(r.submissions || []).length} / 2 Reels</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-white">Contest Quick Status</h3>
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center justify-between p-3 bg-[#080B11] rounded-xl">
              <span>Contest Window:</span>
              <strong className="text-amber-200">11 Oct 2026 – 20 Oct 2026</strong>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#080B11] rounded-xl">
              <span>Registration Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                {siteSettings?.registrationsOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#080B11] rounded-xl">
              <span>Title Sponsor:</span>
              <strong className="text-amber-200">Namma Angadi (Smartphone)</strong>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#080B11] rounded-xl">
              <span>Coordinators:</span>
              <span>Gagan (6362320465), Tarun K (9353903861)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

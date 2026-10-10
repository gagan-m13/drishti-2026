'use client';

import React from 'react';
import { HeroContent } from '@/types';

interface AdminHeroEditorProps {
  heroDraft: HeroContent;
  setHeroDraft: (content: HeroContent) => void;
  hasDraft: boolean;
  actionLoading: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onDiscard: () => void;
}

export default function AdminHeroEditor({
  heroDraft,
  setHeroDraft,
  hasDraft,
  actionLoading,
  onSaveDraft,
  onPublish,
  onDiscard,
}: AdminHeroEditorProps) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Hero Section & Live Content Editor</h1>
          <p className="text-xs sm:text-sm text-gray-400">Edit main titles, taglines, dates, and hero image with instant Draft/Publish workflow.</p>
        </div>

        <div className="flex items-center gap-3">
          {hasDraft && (
            <button onClick={onDiscard} disabled={actionLoading} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold">Discard Draft</button>
          )}
          <button onClick={onSaveDraft} disabled={actionLoading} className="px-4 py-2 rounded-xl bg-[#131A2D] hover:bg-[#1A243D] border border-durgi-gold/50 text-amber-200 text-xs font-bold">Save Draft</button>
          <button onClick={onPublish} disabled={actionLoading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black text-xs font-extrabold uppercase tracking-wider shadow-gold-glow">Publish Live</button>
        </div>
      </div>

      {hasDraft && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl text-xs text-amber-300">
          <span>⚠️ You have unpublished draft changes. Visitors will not see them until you click <strong>Publish Live</strong>.</span>
        </div>
      )}

      <div className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Eyebrow Sponsor Heading</label>
            <input type="text" value={heroDraft.eyebrow} onChange={(e) => setHeroDraft({ ...heroDraft, eyebrow: e.target.value })} className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Main Event Title</label>
            <input type="text" value={heroDraft.title} onChange={(e) => setHeroDraft({ ...heroDraft, title: e.target.value })} className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white font-serif font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Subtitle</label>
            <input type="text" value={heroDraft.subtitle} onChange={(e) => setHeroDraft({ ...heroDraft, subtitle: e.target.value })} className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Contest Dates Text</label>
            <input type="text" value={heroDraft.datesText} onChange={(e) => setHeroDraft({ ...heroDraft, datesText: e.target.value })} className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Tagline</label>
            <input type="text" value={heroDraft.tagline} onChange={(e) => setHeroDraft({ ...heroDraft, tagline: e.target.value })} className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white italic font-serif" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Hero Image URL</label>
            <input type="text" value={heroDraft.heroImageUrl} onChange={(e) => setHeroDraft({ ...heroDraft, heroImageUrl: e.target.value })} className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono" />
          </div>
        </div>
      </div>
    </div>
  );
}

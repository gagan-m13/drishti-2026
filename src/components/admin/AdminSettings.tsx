'use client';

import React from 'react';
import { SiteSettings } from '@/types';

interface AdminSettingsProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  onSave: () => void;
}

export default function AdminSettings({
  siteSettings,
  setSiteSettings,
  onSave,
}: AdminSettingsProps) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <h1 className="text-2xl font-bold font-serif text-white">Contest & Registration Settings</h1>
      <div className="bg-[#0E1424] border border-gray-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-[#080B11] rounded-2xl border border-gray-800">
          <div>
            <div className="text-sm font-bold text-white">Open Registrations</div>
            <div className="text-xs text-gray-400">Allow public visitors to register for DRISHTI 2K26</div>
          </div>
          <input
            type="checkbox"
            checked={siteSettings.registrationsOpen}
            onChange={(e) => setSiteSettings({ ...siteSettings, registrationsOpen: e.target.checked })}
            className="w-5 h-5 rounded text-durgi-gold focus:ring-durgi-gold cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-[#080B11] rounded-2xl border border-gray-800">
          <div>
            <div className="text-sm font-bold text-white">Open Video Submissions</div>
            <div className="text-xs text-gray-400">Allow participants to submit & update their Instagram Reel URLs</div>
          </div>
          <input
            type="checkbox"
            checked={siteSettings.submissionsOpen}
            onChange={(e) => setSiteSettings({ ...siteSettings, submissionsOpen: e.target.checked })}
            className="w-5 h-5 rounded text-durgi-gold focus:ring-durgi-gold cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Required Instagram Hashtags</label>
          <input
            type="text"
            value={siteSettings.officialHashtag}
            onChange={(e) => setSiteSettings({ ...siteSettings, officialHashtag: e.target.value })}
            className="w-full bg-[#080B11] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white"
          />
        </div>

        <button
          onClick={onSave}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black text-xs font-bold uppercase tracking-wider shadow-gold-glow"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

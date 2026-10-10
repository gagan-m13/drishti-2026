'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Film, 
  Users, 
  Filter, 
  Search, 
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { Registration, VideoSubmission } from '@/types';
import { formatDate } from '@/lib/date-format';

interface AdminSubmissionsProps {
  registrations: Registration[];
  onUpdateStatus: (submissionId: string, status: 'eligible' | 'disqualified' | 'under_review') => void;
}

export default function AdminSubmissions({ registrations = [], onUpdateStatus }: AdminSubmissionsProps) {
  const [filterType, setFilterType] = useState<'all' | 'submitted_only' | 'pending_only'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const safeRegistrations = Array.isArray(registrations) ? registrations : [];

  // Flatten submissions with participant info
  const allSubmissions: {
    participant: Registration;
    submission: VideoSubmission;
  }[] = [];

  safeRegistrations.forEach((r) => {
    (r?.submissions || []).forEach((sub) => {
      allSubmissions.push({ participant: r, submission: sub });
    });
  });

  const totalSubmittedReels = allSubmissions.length;
  const eligibleReels = allSubmissions.filter(s => s.submission.status === 'eligible').length;
  const underReviewReels = allSubmissions.filter(s => s.submission.status === 'under_review').length;
  const disqualifiedReels = allSubmissions.filter(s => s.submission.status === 'disqualified').length;

  // Filtered submissions
  const filteredSubmissions = allSubmissions.filter(({ participant, submission }) => {
    const query = (search || '').toLowerCase();
    const fullName = (participant?.fullName || '').toLowerCase();
    const regCode = (participant?.registrationCode || '').toLowerCase();
    const insta = (participant?.instagramUsername || '').toLowerCase();
    const phone = participant?.normalizedPhone || '';

    const matchesSearch = 
      fullName.includes(query) ||
      regCode.includes(query) ||
      insta.includes(query) ||
      phone.includes(query);

    if (!matchesSearch) return false;

    if (statusFilter !== 'all' && submission?.status !== statusFilter) return false;

    return true;
  });

  // Filtered participants list for pending follow-ups
  const filteredParticipants = safeRegistrations.filter((r) => {
    const query = (search || '').toLowerCase();
    const fullName = (r?.fullName || '').toLowerCase();
    const regCode = (r?.registrationCode || '').toLowerCase();
    const insta = (r?.instagramUsername || '').toLowerCase();

    const matchesSearch = 
      fullName.includes(query) ||
      regCode.includes(query) ||
      insta.includes(query);

    if (!matchesSearch) return false;

    const subsCount = (r?.submissions || []).length;
    if (filterType === 'submitted_only') return subsCount > 0;
    if (filterType === 'pending_only') return subsCount < 2;

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Video Submissions & Jury Review
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Inspect submitted Instagram Reel links, verify authenticity, and record judging decisions.
          </p>
        </div>

        {/* Quick summary pill */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0E1424] border border-gray-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
            <Film className="w-4 h-4 text-durgi-gold" />
            <span className="text-gray-300">Reels Received:</span>
            <strong className="text-white font-serif">{totalSubmittedReels}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E1424] border border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-gray-400">Total Submitted</div>
          <div className="text-2xl font-bold text-white font-serif">{totalSubmittedReels}</div>
        </div>
        <div className="bg-[#0E1424] border border-emerald-900/40 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400">Approved Eligible</div>
          <div className="text-2xl font-bold text-emerald-300 font-serif">{eligibleReels}</div>
        </div>
        <div className="bg-[#0E1424] border border-amber-900/40 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-amber-400">Under Review</div>
          <div className="text-2xl font-bold text-amber-200 font-serif">{underReviewReels}</div>
        </div>
        <div className="bg-[#0E1424] border border-rose-900/40 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-rose-400">Disqualified</div>
          <div className="text-2xl font-bold text-rose-300 font-serif">{disqualifiedReels}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0E1424] p-4 rounded-2xl border border-gray-800">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-500 absolute top-3 left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant name, reg ID, Instagram handle..."
            className="w-full bg-[#080B11] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-durgi-gold"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#080B11] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">All Jury Statuses</option>
          <option value="submitted">Submitted (New)</option>
          <option value="under_review">Under Review</option>
          <option value="eligible">Approved Eligible</option>
          <option value="disqualified">Disqualified</option>
        </select>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'all' ? 'bg-durgi-gold text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          Submitted Reels ({filteredSubmissions.length})
        </button>
        <button
          onClick={() => setFilterType('pending_only')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'pending_only' ? 'bg-durgi-gold text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          All Participants & Progress ({filteredParticipants.length})
        </button>
      </div>

      {/* VIEW 1: SUBMITTED REELS GRID */}
      {filterType !== 'pending_only' && (
        <>
          {filteredSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSubmissions.map(({ participant, submission }) => (
                <div
                  key={submission.id}
                  className="bg-[#0E1424] border border-durgi-gold/30 rounded-3xl p-6 space-y-4 shadow-gold-glow-sm hover:border-durgi-gold transition-all"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-gray-800 pb-3">
                    <div>
                      <span className="font-serif font-bold text-white text-base block">
                        {participant.fullName}
                      </span>
                      <span className="text-xs text-amber-300 font-mono">
                        {participant.registrationCode} • @{participant.instagramUsername}
                      </span>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {participant.city} • +91 {participant.normalizedPhone}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold shrink-0 ${
                        submission.status === 'eligible'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : submission.status === 'disqualified'
                          ? 'bg-rose-950 text-rose-300 border border-rose-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}
                    >
                      {submission.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Submission Body */}
                  <div className="p-4 bg-[#080B11] rounded-2xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5" />
                        {submission.videoType === 'main_story' ? '1. Main Story Reel' : '2. Durgi Reel'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </span>
                    </div>

                    {/* Instagram URL with 1-click preview link */}
                    <div className="flex items-center justify-between gap-2 bg-[#0E1424] p-3 rounded-xl border border-gray-800">
                      <a
                        href={submission.normalizedUrl || submission.submittedUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-durgi-gold hover:underline font-mono truncate flex-1"
                      >
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="truncate">{submission.normalizedUrl || submission.submittedUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1" />
                      </a>
                    </div>

                    {/* Jury Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => onUpdateStatus(submission.id, 'eligible')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          submission.status === 'eligible'
                            ? 'bg-emerald-500 text-black'
                            : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700'
                        }`}
                      >
                        Approve Eligible
                      </button>
                      <button
                        onClick={() => onUpdateStatus(submission.id, 'under_review')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          submission.status === 'under_review'
                            ? 'bg-amber-500 text-black'
                            : 'bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700'
                        }`}
                      >
                        Under Review
                      </button>
                      <button
                        onClick={() => onUpdateStatus(submission.id, 'disqualified')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          submission.status === 'disqualified'
                            ? 'bg-rose-500 text-white'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700'
                        }`}
                      >
                        Disqualify
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Helpful Empty State */
            <div className="bg-[#0E1424] border border-gray-800 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mx-auto">
                <Film className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-white">
                  No Video Submissions Yet
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  Participants who complete their free registration will submit their Instagram Reel URLs via <strong>/submit</strong>. As soon as reels are submitted, they will appear here with instant review controls.
                </p>
              </div>

              {safeRegistrations.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setFilterType('pending_only')}
                    className="px-4 py-2 rounded-xl bg-durgi-gold/20 hover:bg-durgi-gold/30 text-amber-200 border border-durgi-gold/40 text-xs font-bold"
                  >
                    View {safeRegistrations.length} Registered Participants Awaiting Links →
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: ALL REGISTERED PARTICIPANTS & REEL PROGRESS */}
      {filterType === 'pending_only' && (
        <div className="bg-[#0E1424] border border-gray-800 rounded-3xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090D16] border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Reg Code</th>
                  <th className="p-4">Participant</th>
                  <th className="p-4">Contact & Follow-up</th>
                  <th className="p-4">Reels Progress</th>
                  <th className="p-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                {filteredParticipants.map((r) => {
                  const subs = r.submissions || [];
                  const storySub = subs.find(s => s.videoType === 'main_story');
                  const durgiSub = subs.find(s => s.videoType === 'durgi_reel');

                  return (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-serif font-bold text-gold-gradient">
                        {r.registrationCode}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{r.fullName}</div>
                        <div className="text-[11px] text-gray-400">@{r.instagramUsername} • {r.city}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/91${r.normalizedPhone}?text=Hi%20${encodeURIComponent(r.fullName)},%20this%20is%20from%20DRISHTI%202K26%20Sri%20Durga%20Seva%20Samithi.%20Please%20submit%20your%20reels%20via%20your%20link:%20/submit?token=${r.accessToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] flex items-center gap-1 hover:bg-emerald-900"
                          >
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </a>
                          <a
                            href={`tel:+91${r.normalizedPhone}`}
                            className="px-2.5 py-1 rounded-lg bg-[#080B11] text-gray-300 border border-gray-700 text-[11px] flex items-center gap-1 hover:bg-white/5"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${storySub ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                          <span className="text-[11px]">
                            Story Video: {storySub ? <strong className="text-emerald-300">Done</strong> : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${durgiSub ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                          <span className="text-[11px]">
                            Durgi Reel: {durgiSub ? <strong className="text-emerald-300">Done</strong> : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

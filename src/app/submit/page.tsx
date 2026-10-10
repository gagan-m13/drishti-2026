'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Film, Sparkles, Check, CheckCircle2, AlertCircle, ExternalLink, Lock, ArrowRight, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Registration, VideoSubmission } from '@/types';
import { formatDate } from '@/lib/date-format';

function SubmissionContent() {
  const searchParams = useSearchParams();
  const initialToken = searchParams ? searchParams.get('token') || '' : '';

  const [token, setToken] = useState(initialToken);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Recovery / Access verification form
  const [regCodeInput, setRegCodeInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Input states for the 2 reels
  const [storyUrl, setStoryUrl] = useState('');
  const [durgiUrl, setDurgiUrl] = useState('');
  const [savingStory, setSavingStory] = useState(false);
  const [savingDurgi, setSavingDurgi] = useState(false);

  const fetchRegistrationData = async (currentToken: string) => {
    if (!currentToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions?token=${encodeURIComponent(currentToken)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load registration details.');
      }
      setRegistration(data.registration);

      // Pre-fill existing submission URLs
      const storySub = data.registration.submissions?.find((s: VideoSubmission) => s.videoType === 'main_story');
      const durgiSub = data.registration.submissions?.find((s: VideoSubmission) => s.videoType === 'durgi_reel');

      if (storySub) setStoryUrl(storySub.submittedUrl);
      if (durgiSub) setDurgiUrl(durgiSub.submittedUrl);

    } catch (err: any) {
      setError(err.message);
      setRegistration(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      fetchRegistrationData(initialToken);
    }
  }, [initialToken]);

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationCode: regCodeInput, phone: phoneInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      setToken(data.token);
      await fetchRegistrationData(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveVideo = async (videoType: 'main_story' | 'durgi_reel') => {
    const url = videoType === 'main_story' ? storyUrl : durgiUrl;
    if (!url || !url.includes('instagram.com')) {
      setError('Please provide a valid Instagram Reel URL.');
      return;
    }

    if (videoType === 'main_story') setSavingStory(true);
    else setSavingDurgi(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          videoType,
          reelUrl: url,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save submission');
      }

      setRegistration(data.registration);
      setSuccessMsg(
        videoType === 'main_story'
          ? 'Main Story Reel URL saved successfully!'
          : 'Durgi Reel URL saved successfully!'
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (videoType === 'main_story') setSavingStory(false);
      else setSavingDurgi(false);
    }
  };

  const getOverallStatus = () => {
    if (!registration) return 'Registered';
    const subs = registration.submissions || [];
    if (subs.length === 2) return 'Both videos submitted';
    if (subs.length === 1) return 'One video submitted';
    return 'Registered (Awaiting links)';
  };

  const storySubmission = registration?.submissions?.find(s => s.videoType === 'main_story');
  const durgiSubmission = registration?.submissions?.find(s => s.videoType === 'durgi_reel');

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
          Instagram Reel Submission Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif text-gold-gradient">
          Submit Your Reel URLs
        </h1>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          Submit both mandatory Instagram Reel links for DRISHTI 2K26 evaluation.
        </p>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-6 bg-rose-950/60 border border-rose-800 text-rose-200 rounded-2xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-2xl p-4 text-sm flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Authenticated Participant Submission Box */}
      {registration ? (
        <div className="space-y-8">
          
          {/* Participant Header Info Card */}
          <div className="bg-[#0E1424] border-2 border-durgi-gold/40 rounded-3xl p-6 sm:p-8 shadow-gold-glow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Participant Profile
              </span>
              <h2 className="text-2xl font-bold text-white font-serif">
                {registration.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 pt-1">
                <span>Reg ID: <strong className="text-gold-gradient font-serif">{registration.registrationCode}</strong></span>
                <span>•</span>
                <span>Insta: <strong className="text-pink-300">@{registration.instagramUsername}</strong></span>
                <span>•</span>
                <span>City: {registration.city}</span>
              </div>
            </div>

            {/* Submission Status Pill */}
            <div className="bg-[#080B11] border border-gray-700 px-4 py-2.5 rounded-2xl text-right">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Submission Status</div>
              <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5 justify-end">
                <Clock className="w-3.5 h-3.5 text-durgi-gold" />
                <span>{getOverallStatus()}</span>
              </div>
            </div>
          </div>

          {/* Submission Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Field 1: Main Story Reel */}
            <div className="bg-[#0E1424] border border-durgi-gold/30 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Category 1 (Mandatory)
                  </span>
                  {storySubmission ? (
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800">
                      Pending
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white font-serif">
                  1. Main Story Reel
                </h3>
                <p className="text-xs text-gray-400">
                  Original story connected to Kaduru Dasara traditions, devotion, or festival emotions.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-300">
                    Instagram Reel / Post URL:
                  </label>
                  <input
                    type="url"
                    value={storyUrl}
                    onChange={(e) => setStoryUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                {storySubmission && (
                  <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                    <span>Submitted: {formatDate(storySubmission.submittedAt)}</span>
                    <a
                      href={storySubmission.normalizedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-durgi-gold hover:underline flex items-center gap-1"
                    >
                      <span>Open Reel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={savingStory}
                onClick={() => handleSaveVideo('main_story')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {savingStory ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{storySubmission ? 'Update Story Link' : 'Save Story Video Link'}</span>
              </button>
            </div>

            {/* Field 2: Durgi Reel */}
            <div className="bg-[#0E1424] border border-durgi-gold/30 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Category 2 (Mandatory)
                  </span>
                  {durgiSubmission ? (
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800">
                      Pending
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white font-serif">
                  2. Durgi Reel
                </h3>
                <p className="text-xs text-gray-400">
                  Creative reel showcasing Devi and authentic festive atmosphere of Kaduru Dasara.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-300">
                    Instagram Reel / Post URL:
                  </label>
                  <input
                    type="url"
                    value={durgiUrl}
                    onChange={(e) => setDurgiUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                {durgiSubmission && (
                  <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                    <span>Submitted: {formatDate(durgiSubmission.submittedAt)}</span>
                    <a
                      href={durgiSubmission.normalizedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-durgi-gold hover:underline flex items-center gap-1"
                    >
                      <span>Open Reel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={savingDurgi}
                onClick={() => handleSaveVideo('durgi_reel')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {savingDurgi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{durgiSubmission ? 'Update Durgi Link' : 'Save Durgi Reel Link'}</span>
              </button>
            </div>

          </div>

          {/* Submission Guidelines & Disclaimer */}
          <div className="bg-[#101524] rounded-2xl p-6 border border-gray-800 text-xs text-gray-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-durgi-gold" />
              <span>Important Submission Rules:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Both reels must remain publicly accessible on your Instagram account until judging completes.</li>
              <li>You can update or correct your links any time before the deadline (20 October 2026, 11:59 PM IST).</li>
              <li>No Instagram login password will ever be requested.</li>
            </ul>
          </div>

        </div>
      ) : (
        /* Access Verification Box (if token not provided or invalid) */
        <div className="bg-[#0E1424] border border-durgi-gold/30 rounded-3xl p-6 sm:p-10 shadow-gold-glow-sm max-w-md mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 flex items-center justify-center text-durgi-gold mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white font-serif">
              Access Your Submission
            </h2>
            <p className="text-xs text-gray-400">
              Enter your Registration ID and registered WhatsApp number to view or submit your reel links.
            </p>
          </div>

          <form onSubmit={handleVerifyAccess} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Registration ID (e.g., DR26-XXXXXX)
              </label>
              <input
                type="text"
                required
                value={regCodeInput}
                onChange={(e) => setRegCodeInput(e.target.value.toUpperCase())}
                placeholder="DR26-123456"
                className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              {verifying ? (
                <span>Verifying Access...</span>
              ) : (
                <>
                  <span>Open Submission Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
            Haven’t registered yet?{' '}
            <Link href="/register" className="text-durgi-gold font-bold underline">
              Register Free Now →
            </Link>
          </div>

        </div>
      )}

    </main>
  );
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-between">
      <Header />
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading submission portal...</div>}>
        <SubmissionContent />
      </Suspense>
      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, ArrowRight, Copy, Check, AlertCircle, ShieldCheck, User, Phone, Mail, MapPin, Building, HelpCircle, Film } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    instagramUsername: '',
    college: '',
    ageRange: '18-25',
    individualConsent: true,
    rulesConsent: true,
    websiteHp: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    code: string;
    token: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration.');
      }

      setSuccessData({
        code: data.registration.registrationCode,
        token: data.registration.accessToken,
        name: data.registration.fullName,
      });

      // Fire festive celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FF9933', '#C81D25', '#FFFFFF'],
        });
      } catch (err) {}

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (successData?.code) {
      navigator.clipboard.writeText(successData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* If Registration is Successful */}
        {successData ? (
          <div className="bg-[#0E1424] border-2 border-durgi-gold rounded-3xl p-8 sm:p-12 shadow-gold-glow-lg text-center space-y-8 animate-fadeIn">
            
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Registration Confirmed
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                Welcome, {successData.name}!
              </h1>
              <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
                You are officially registered for <strong>DRISHTI 2K26</strong>. Please save your unique Registration ID below.
              </p>
            </div>

            {/* Registration Code Showcase Box */}
            <div className="bg-[#080B11] border-2 border-durgi-gold/60 rounded-2xl p-6 max-w-md mx-auto relative group">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                Your Unique Registration ID
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-serif tracking-widest py-1">
                {successData.code}
              </div>
              <button
                onClick={copyCode}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-durgi-gold/20 hover:bg-durgi-gold/30 text-amber-200 border border-durgi-gold/40 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Registration Code'}</span>
              </button>
            </div>

            {/* Next Steps for Submission */}
            <div className="bg-[#12182A] rounded-2xl p-6 text-left space-y-4 text-sm text-gray-300 border border-gray-800">
              <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <Film className="w-5 h-5 text-durgi-gold" />
                Next Steps to Submit Your Reels:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
                <li>Create and edit both: <strong>Main Story Reel</strong> & <strong>Durgi Reel</strong>.</li>
                <li>Post them publicly on Instagram tagging <strong>@sri_durga_seva_samithi_kadur</strong> with hashtag <strong>#Drishti2K26</strong>.</li>
                <li>Submit your Instagram Reel URLs on our submission portal before <strong>20 October 2026</strong>.</li>
              </ol>
            </div>

            {/* Direct Proceed Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/submit?token=${successData.token}`}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-durgi-gold to-amber-600 text-black font-extrabold text-base uppercase tracking-wider shadow-gold-glow hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <span>Proceed to Submit Reel Links</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#111728] text-gray-300 hover:text-white border border-gray-700 text-sm font-semibold transition-colors"
              >
                Back to Home
              </Link>
            </div>

          </div>
        ) : (
          /* Registration Form */
          <div className="bg-[#0E1424] border border-durgi-gold/30 rounded-3xl p-6 sm:p-10 shadow-gold-glow-sm space-y-8">
            
            {/* Form Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-durgi-gold" />
                100% Free Registration
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif text-gold-gradient">
                Participant Registration
              </h1>
              <p className="text-gray-300 text-sm max-w-lg mx-auto">
                Individual entry for DRISHTI 2K26 reel-making competition during Kaduru Dasara.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-rose-950/50 border border-rose-800 text-rose-200 rounded-2xl p-4 text-sm flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{error}</p>
                  {error.includes('already registered') && (
                    <Link href="/submit" className="underline font-bold text-amber-300 mt-1 inline-block">
                      Go to Submission Portal to access your entry →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="websiteHp"
                value={formData.websiteHp}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-durgi-gold" />
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your legal name"
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-durgi-gold" />
                    WhatsApp Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number (e.g. 9876543210)"
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-durgi-gold" />
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* City / Town */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-durgi-gold" />
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kadur, Chikkamagaluru, etc."
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Instagram Username */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                    Instagram Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 text-sm">@</span>
                    <input
                      type="text"
                      name="instagramUsername"
                      required
                      value={formData.instagramUsername}
                      onChange={handleChange}
                      placeholder="your_handle"
                      className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* College / Organization (Optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-durgi-gold" />
                    College / Organization <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="College or company name"
                    className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

              </div>

              {/* Checkbox Agreements */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-gray-300">
                  <input
                    type="checkbox"
                    name="individualConsent"
                    required
                    checked={formData.individualConsent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-gray-700 text-durgi-gold focus:ring-durgi-gold"
                  />
                  <span>
                    I confirm that this registration is for <strong>individual participation</strong> and that I will create and submit both mandatory reels.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-gray-300">
                  <input
                    type="checkbox"
                    name="rulesConsent"
                    required
                    checked={formData.rulesConsent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-gray-700 text-durgi-gold focus:ring-durgi-gold"
                  />
                  <span>
                    I agree to the <Link href="/rules" className="text-durgi-gold underline" target="_blank">Competition Rules</Link> and agree not to alter or replace Durgi’s sacred appearance with AI avatars.
                  </span>
                </label>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-durgi-gold via-amber-500 to-amber-600 text-black font-extrabold text-base uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Complete Free Registration</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-gray-400">
                Already registered? <Link href="/submit" className="text-durgi-gold font-bold underline">Submit your Instagram Reel URLs here →</Link>
              </div>

            </form>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

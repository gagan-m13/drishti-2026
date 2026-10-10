import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-durgi-gold" />
            Data Protection Notice
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gold-gradient">
            Privacy & Participant Notice
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Sri Durga Seva Samithi, Kadur is committed to protecting your personal information.
          </p>
        </div>

        <div className="bg-[#0E1424] border border-durgi-gold/30 rounded-3xl p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <Lock className="w-5 h-5 text-durgi-gold" />
              1. Information Collected
            </h2>
            <p>
              We collect your Name, WhatsApp Mobile Number, Email Address, City/Town, Instagram Handle, and optional College/Organization strictly for contest coordination, identity verification, and prize distribution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-durgi-gold" />
              2. No Public Exposure of Personal Data
            </h2>
            <p>
              Your phone number and email address will NEVER be made public, sold, or shared with third parties. Only authorized organizers of Sri Durga Seva Samithi have access to registration records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-durgi-gold" />
              3. Video Submissions & Instagram Rights
            </h2>
            <p>
              Participants retain full copyright over their video reels. By participating, you grant Sri Durga Seva Samithi permission to feature, reshare, or showcase your submitted reels across festival social handles with creator credits.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

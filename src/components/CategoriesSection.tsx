'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Film, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Video, Music, Camera } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-[#090D16] relative overflow-hidden border-t border-durgi-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            Mandatory Submission Guidelines
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gold-gradient">
            Two Mandatory Video Categories
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Every participant must create and submit both Instagram Reel links. Each entry tells a unique chapter of Kaduru Dasara.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Category 1: Main Story Reel */}
          <div className="bg-[#0E1424] border-2 border-durgi-gold/30 rounded-3xl p-6 sm:p-8 relative shadow-gold-glow-sm hover:border-durgi-gold transition-all group">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-gradient-to-r from-durgi-gold to-amber-600 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Category 01
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-durgi-gold">
                <Film className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-serif mb-2">
                  1. MAIN STORY REEL
                </h3>
                <p className="text-amber-200/90 text-sm font-medium">
                  An original story connected to Durgi, Navaratri, Kaduru Dasara, local traditions, devotion, people or festival emotions.
                </p>
              </div>

              {/* Requirements List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Heartfelt Storytelling:</strong> Explore rituals, devotee emotions, community bonding, or the cultural legacy of Kadur.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>No Fixed Duration:</strong> Craft your story freely without strict second limits.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Creative Expression:</strong> Voiceovers, local music, folklore, and cinematic transitions are welcome.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="bg-[#090C14] rounded-xl p-3.5 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
                  <span>Format: Instagram Reel / Post</span>
                  <span className="text-amber-300 font-semibold">Mandatory</span>
                </div>
              </div>

            </div>
          </div>

          {/* Category 2: Durgi Reel */}
          <div className="bg-[#0E1424] border-2 border-durgi-gold/30 rounded-3xl p-6 sm:p-8 relative shadow-gold-glow-sm hover:border-durgi-gold transition-all group">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-gradient-to-r from-durgi-gold to-amber-600 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Category 02
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-durgi-gold">
                <Sparkles className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-serif mb-2">
                  2. DURGI REEL
                </h3>
                <p className="text-amber-200/90 text-sm font-medium">
                  A creative reel showcasing Durgi and the authentic festival atmosphere of Kaduru Dasara.
                </p>
              </div>

              {/* Requirements List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Idol Authenticity:</strong> Sri Durga Devi's sacred face, crown, pose and divine proportions must remain authentic.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Festive Grandeur:</strong> Capture the lighting, flower alankara, processions, music, and vibrant atmosphere.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Cinematic Quality:</strong> Fast-paced edits, beat-synced visuals, and creative angles.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="bg-[#090C14] rounded-xl p-3.5 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
                  <span>Format: Instagram Reel / Post</span>
                  <span className="text-amber-300 font-semibold">Mandatory</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Important AI & Camera Notice */}
        <div className="mt-12 bg-[#12192B] border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-200">
          <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-1">
            <span className="font-bold text-amber-200 block">
              Important Camera & AI Guidelines:
            </span>
            <span className="text-gray-300">
              Mobile phones, DSLRs, mirrorless, and action cameras are allowed. AI-generated audio and visual enhancement elements are permitted, but the <strong>original identity and appearance of Durgi must never be altered or replaced</strong>.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Award, Gift, ArrowRight, Sparkles, Smartphone, Camera, Volume2, MapPin } from 'lucide-react';
import { Prize } from '@/types';

interface PrizeShowcaseProps {
  prizes: Prize[];
}

export default function PrizeShowcase({ prizes }: PrizeShowcaseProps) {
  // Map icons for fallback
  const getIconForRank = (rank: number) => {
    switch (rank) {
      case 1:
        return <Smartphone className="w-8 h-8 text-amber-300" />;
      case 2:
        return <Camera className="w-8 h-8 text-amber-300" />;
      case 3:
        return <Volume2 className="w-8 h-8 text-amber-300" />;
      default:
        return <Trophy className="w-8 h-8 text-amber-300" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 via-amber-300 to-yellow-600 text-black shadow-gold-glow';
      case 2:
        return 'from-slate-200 via-gray-300 to-slate-400 text-black shadow-md';
      case 3:
        return 'from-amber-700 via-amber-600 to-orange-800 text-white shadow-md';
      default:
        return 'from-durgi-gold to-amber-600 text-black';
    }
  };

  return (
    <section id="prizes" className="py-24 bg-[#080B11] relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-durgi-gold/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-durgi-gold" />
            Rewarding Cultural Excellence
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-festive text-gold-gradient">
            Exciting Prize Showcase
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Create your masterpiece and take home premium gadgets sponsored by our esteemed festival partners.
          </p>
        </div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className={`relative rounded-3xl overflow-hidden bg-[#0D121F] border-2 transition-all duration-300 flex flex-col justify-between ${
                prize.rank === 1
                  ? 'border-durgi-gold shadow-gold-glow-lg md:-translate-y-3'
                  : 'border-durgi-gold/30 hover:border-durgi-gold/70 shadow-gold-glow-sm hover:shadow-gold-glow'
              }`}
            >
              {/* Rank Floating Pill */}
              <div className="absolute top-4 left-4 z-20">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${getRankBadgeColor(
                    prize.rank
                  )}`}
                >
                  {prize.title}
                </span>
              </div>

              {/* Card Image Area */}
              <div className="relative h-64 sm:h-72 w-full bg-[#05070D] flex items-center justify-center p-6 overflow-hidden group">
                <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-60" />
                {prize.imageUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={prize.imageUrl}
                      alt={prize.itemName}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain object-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
                    {getIconForRank(prize.rank)}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0D121F] to-transparent pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-durgi-gold shrink-0" />
                      <span>{prize.sponsorCategory || 'Official Sponsor'}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    {prize.itemName}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {prize.description}
                  </p>

                  {/* Feature Highlights */}
                  {prize.features && prize.features.length > 0 && (
                    <div className="pt-2 space-y-1.5 border-t border-gray-800/80">
                      {prize.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-durgi-gold shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sponsor Bar & Google Map Link */}
                <div className="pt-4 border-t border-gray-800/80 space-y-3">
                  <div className="bg-[#070A12] border border-gray-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Sponsor Store</span>
                      <strong className="text-xs text-amber-200 font-semibold block truncate">{prize.sponsorName}</strong>
                    </div>

                    {prize.sponsorMapUrl && (
                      <a
                        href={prize.sponsorMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-durgi-gold/15 hover:bg-durgi-gold/25 border border-durgi-gold/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-durgi-gold" />
                        <span>View Map</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400 font-medium">Free Entry Competition</span>
                    <Link
                      href="/register"
                      className="text-xs font-bold text-durgi-gold hover:text-amber-200 flex items-center gap-1 group"
                    >
                      <span>Win This Prize</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-durgi-gold via-amber-500 to-amber-600 text-black font-extrabold text-base uppercase tracking-wider shadow-gold-glow hover:scale-105 transition-transform"
          >
            <span>Register Now for Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

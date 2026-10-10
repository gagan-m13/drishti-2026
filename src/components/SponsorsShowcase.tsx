'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Sparkles, HeartHandshake, MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { Sponsor } from '@/types';

interface SponsorsShowcaseProps {
  sponsors: Sponsor[];
}

export default function SponsorsShowcase({ sponsors }: SponsorsShowcaseProps) {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'title':
        return 'bg-gradient-to-r from-yellow-400 via-amber-300 to-amber-600 text-black font-extrabold shadow-gold-glow-sm';
      case 'associate':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <section id="sponsors" className="py-24 bg-[#0A0E18] relative overflow-hidden border-t border-durgi-gold/15">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-durgi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-durgi-gold" />
            Our Esteemed Festival Patrons
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gold-gradient">
            Meet Our Generous Sponsors
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Supporting local business excellence in Kadur while empowering creative youth filmmakers at DRISHTI 2K26.
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className={`bg-[#0F1424] rounded-3xl p-7 sm:p-8 transition-all flex flex-col justify-between space-y-6 group border-2 ${
                sponsor.tier === 'title'
                  ? 'border-durgi-gold shadow-gold-glow-sm hover:shadow-gold-glow md:-translate-y-2'
                  : 'border-durgi-gold/30 hover:border-durgi-gold/70 hover:shadow-gold-glow-sm'
              }`}
            >
              <div className="space-y-5">
                
                {/* Header: Tier + Icon */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${getTierBadge(sponsor.tier)}`}>
                    {sponsor.tier === 'title' ? '★ Title Sponsor' : 'Associate Sponsor'}
                  </span>
                  <Award className="w-5 h-5 text-durgi-gold group-hover:rotate-12 transition-transform" />
                </div>

                {/* Brand Name & Category */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    {sponsor.businessCategory || 'Official Business Partner'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif group-hover:text-amber-200 transition-colors">
                    {sponsor.name}
                  </h3>
                  {sponsor.tagline && (
                    <p className="text-xs text-gray-400 italic">
                      &quot;{sponsor.tagline}&quot;
                    </p>
                  )}
                </div>

                {/* Sponsored Prize Banner */}
                {sponsor.prizeTitle && (
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-transparent border border-amber-500/30 rounded-2xl p-3.5">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300/90 font-bold block">
                      Official Prize Sponsoring:
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {sponsor.prizeTitle}
                    </span>
                  </div>
                )}

                {/* Promotional Points */}
                {sponsor.promotionalPoints && sponsor.promotionalPoints.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-gray-800">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                      Why Visit {sponsor.name}:
                    </span>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {sponsor.promotionalPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-durgi-gold shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Bottom Actions: Google Maps Link */}
              <div className="pt-5 border-t border-gray-800/80 space-y-3">
                {sponsor.mapUrl ? (
                  <a
                    href={sponsor.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-durgi-gold/20 via-amber-500/20 to-durgi-gold/10 hover:from-durgi-gold hover:to-amber-500 hover:text-black text-amber-200 border border-durgi-gold/40 text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                  >
                    <MapPin className="w-4 h-4 text-durgi-gold group-hover/btn:text-black transition-colors" />
                    <span>View Store on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover/btn:opacity-100" />
                  </a>
                ) : (
                  <div className="text-center text-xs text-gray-400">
                    Kadur, Karnataka
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>Kaduru Dasara 2026</span>
                  <span className="text-amber-300 font-medium">Verified Partner</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

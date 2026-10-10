'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ShieldAlert, HelpCircle, Sparkles, Scale, ArrowRight, BookOpen } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function RulesSection() {
  const rules = [
    {
      title: '100% Free & Individual Entry',
      description: 'Registration is free of charge. Participation is strictly individual. Each creator must hold their own unique registration ID.',
      type: 'rule',
    },
    {
      title: 'Two Mandatory Reels',
      description: 'Every participant must submit both: (1) Main Story Reel and (2) Durgi Reel. Incomplete entries will not be eligible for final prize ranking.',
      type: 'rule',
    },
    {
      title: 'Contest Period: 11 – 20 October 2026',
      description: 'Submissions open on 11 October 2026 and close sharply on 20 October 2026 at 11:59 PM IST.',
      type: 'rule',
    },
    {
      title: 'Authenticity of Sri Durga Idol',
      description: 'The sacred idol of Durgi (face, ornaments, crown, posture, proportions) must NOT be altered or replaced with AI avatars or deepfakes. Authentic darshana must be preserved.',
      type: 'important',
    },
    {
      title: 'Originality & Copyright',
      description: 'All video footage must be captured originally by the participant. Plagiarism or copying other creators’ clips will result in immediate disqualification.',
      type: 'important',
    },
    {
      title: 'Respectful Coverage',
      description: 'Filming must be done respectfully without disrupting temple rituals, poojas, devotees, or festival proceedings.',
      type: 'rule',
    },
    {
      title: 'Instagram Posting & Tagging',
      description: 'Reels must be published publicly on Instagram with tag @sri_durga_seva_samithi_kadur and hashtags #Drishti2K26 #KaduruDasara.',
      type: 'rule',
    },
    {
      title: 'Judges Decision is Final',
      description: 'Entries will be evaluated on storytelling, cinematography, cultural relevance, editing rhythm, and audience resonance. The panel decision is final.',
      type: 'rule',
    },
  ];

  return (
    <section id="rules" className="py-24 bg-[#090D16] relative overflow-hidden border-t border-durgi-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-durgi-gold" />
            Official Guidelines
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gold-gradient">
            Rules of the Competition
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Ensure fair, creative, and respectful participation by adhering to the official guidelines established by Sri Durga Seva Samithi, Kadur.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, index) => (
            <div
              key={index}
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                rule.type === 'important'
                  ? 'bg-[#150F18] border-amber-500/40 shadow-gold-glow-sm'
                  : 'bg-[#0E1424] border-gray-800/90 hover:border-durgi-gold/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  rule.type === 'important'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-durgi-gold/10 text-durgi-gold border border-durgi-gold/20'
                }`}>
                  {rule.type === 'important' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white font-serif">
                    {rule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Trophy, Calendar, MapPin, ArrowRight, ShieldCheck, Flame, Video } from 'lucide-react';
import { HeroContent, SiteSettings } from '@/types';

interface HeroSectionProps {
  content: HeroContent;
  settings: SiteSettings;
}

export default function HeroSection({ content, settings }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(content.startDate || '2026-10-11T00:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [content.startDate]);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#07090E] pt-8 pb-16">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-durgi-crimson/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-durgi-gold/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Decorative Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af3710_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Content */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Eyebrow / Sponsor Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-durgi-gold/15 to-transparent border border-durgi-gold/30 shadow-gold-glow-sm">
              <Sparkles className="w-4 h-4 text-durgi-gold animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-200">
                {content.eyebrow || 'Namma Angadi Presents'}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-300 font-medium">Kaduru Dasara</span>
            </div>

            {/* Main Title & Festival Subtitle */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-festive">
                <span className="text-gold-gradient block drop-shadow-md">
                  {content.title || 'DRISHTI 2K26'}
                </span>
              </h1>
              <p className="text-lg sm:text-2xl text-gray-200 font-serif font-medium tracking-wide">
                {content.subtitle || 'Kaduru Dasara Reel Making Competition'}
              </p>
            </div>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-amber-100/90 italic max-w-2xl mx-auto lg:mx-0 font-serif">
              “{content.tagline || 'One Celebration… Many Stories… Memories That Last Forever!'}”
            </p>

            {/* Event Key Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-2 bg-[#121826] px-4 py-2 rounded-lg border border-gray-800">
                <Calendar className="w-4 h-4 text-durgi-gold" />
                <span>{content.datesText || '11 Oct 2026 – 20 Oct 2026'}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121826] px-4 py-2 rounded-lg border border-gray-800">
                <MapPin className="w-4 h-4 text-durgi-crimson-light" />
                <span>Sri Durga Seva Samithi, Kadur</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-300 px-4 py-2 rounded-lg border border-emerald-800/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Registration: FREE (Individual)</span>
              </div>
            </div>

            {/* Live Countdown Clock */}
            {content.showCountdown && (
              <div className="pt-2">
                <p className="text-xs uppercase tracking-widest text-amber-300/80 mb-2 font-medium">
                  Contest Begins In
                </p>
                <div className="grid grid-cols-4 gap-2.5 max-w-md mx-auto lg:mx-0">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds },
                  ].map((unit, i) => (
                    <div
                      key={i}
                      className="bg-[#0F1422] border border-durgi-gold/25 rounded-xl p-2.5 text-center shadow-md relative overflow-hidden"
                    >
                      <div className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-serif">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mt-0.5">
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href={content.primaryCtaLink || '/register'}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-durgi-gold via-amber-500 to-amber-600 text-black font-extrabold text-base uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{content.primaryCtaText || 'Register Free'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={content.secondaryCtaLink || '/#prizes'}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111728] hover:bg-[#182138] border border-durgi-gold/40 text-amber-200 font-bold text-base hover:border-durgi-gold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5 text-durgi-gold" />
                <span>{content.secondaryCtaText || 'View Prizes'}</span>
              </Link>
            </div>

            {/* Title Sponsor Badge */}
            <div className="pt-2 text-xs text-gray-400 flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-durgi-gold animate-ping" />
              <span>
                Title Sponsor: <strong className="text-amber-200">Namma Angadi</strong> (Smartphone) • Laxmi Traders (DJI Gimbal) • DK Mobiles (Party Speaker)
              </span>
            </div>

          </div>

          {/* Right Column: Authentic Durgi Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Golden Aura Ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-durgi-gold via-amber-500 to-durgi-crimson rounded-3xl opacity-40 blur-xl animate-pulse-slow" />
              
              {/* Image Frame with Authentic Durgi Photo */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-durgi-gold/60 bg-[#0A0E18] shadow-gold-glow-lg">
                
                <div className="relative h-[480px] sm:h-[540px] w-full">
                  <Image
                    src={content.heroImageUrl || '/images/durgi/durgi-portrait-hd.jpg'}
                    alt="Sri Durga Devi of Kaduru Dasara"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center"
                    priority
                  />
                  {/* Subtle Gradient Overlay on Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-black/20" />
                </div>

                {/* Overlaid Badge */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-[#080B11]/90 backdrop-blur-md border border-durgi-gold/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      Authentic Darshana
                    </div>
                    <div className="text-sm font-semibold text-gray-100 font-serif">
                      Sri Durga Seva Samithi, Kadur
                    </div>
                  </div>
                  <Link
                    href="/#gallery"
                    className="text-xs bg-durgi-gold/20 hover:bg-durgi-gold/30 text-amber-200 border border-durgi-gold/40 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Gallery
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, MessageCircle, MapPin, Sparkles, Heart, Shield } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { Coordinator } from '@/types';

interface CommitteeSectionProps {
  coordinators: Coordinator[];
}

export default function CommitteeSection({ coordinators }: CommitteeSectionProps) {
  return (
    <section id="contact" className="py-24 bg-[#080B11] relative overflow-hidden border-t border-durgi-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-durgi-gold" />
            Organizing Committee
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gold-gradient">
            Sri Durga Seva Samithi, Kadur
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Preserving the sacred traditions of Kaduru Dasara and fostering cultural storytelling through youth cinema and arts.
          </p>
        </div>

        {/* Committee Story & Details Card */}
        <div className="bg-[#0E1321] border border-durgi-gold/30 rounded-3xl p-8 sm:p-12 mb-16 shadow-gold-glow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                About Kaduru Dasara & Drishti 2K26
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                A Legacy of Devotion, Grandeur & Togetherness
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Kaduru Dasara is one of Chikkamagaluru district’s most vibrant and sacred Navaratri celebrations. Sri Durga Seva Samithi brings together thousands of devotees, cultural artisans, and young creators to honor Sri Durga Devi. DRISHTI 2K26 is our heartfelt initiative to document this divine energy through your lenses and creative storytelling.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-2 bg-[#080B11] px-4 py-2 rounded-lg border border-gray-800">
                  <MapPin className="w-4 h-4 text-durgi-crimson-light" />
                  <span>Kadur, Chikkamagaluru Dist, Karnataka</span>
                </div>
                <div className="flex items-center gap-2 bg-[#080B11] px-4 py-2 rounded-lg border border-gray-800">
                  <Sparkles className="w-4 h-4 text-durgi-gold" />
                  <span>Annual Cultural & Film Initiative</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-durgi-gold shadow-gold-glow-lg">
                <Image
                  src="/images/durgi/durgi-portrait-hd.jpg"
                  alt="Sri Durga Seva Samithi Kadur"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Coordinator Contact Cards */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white font-serif">
              Event Coordinators & Helpline
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Have questions regarding registration, guidelines, or festival events? Reach out to our coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coordinators.map((coord) => (
              <div
                key={coord.id}
                className="bg-[#0F1424] border border-durgi-gold/30 rounded-3xl p-6 sm:p-8 hover:border-durgi-gold hover:shadow-gold-glow transition-all flex flex-col justify-between space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-durgi-gold bg-[#080B11] shrink-0">
                    <Image
                      src={coord.imageUrl || '/images/durgi/durgi-portrait-crown.jpg'}
                      alt={coord.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white font-serif">
                      {coord.name}
                    </h4>
                    <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                      {coord.role}
                    </p>
                    <p className="text-sm text-gray-300 font-medium mt-0.5">
                      +91 {coord.phone}
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:+91${coord.phone}`}
                    className="px-4 py-2.5 rounded-xl bg-[#0A0E18] hover:bg-white/5 border border-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-durgi-gold" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={coord.whatsappUrl || `https://wa.me/91${coord.phone}?text=Hi%20${coord.name},%20I%20have%20a%20query%20about%20DRISHTI%202K26`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Official Social Banner */}
        <div className="mt-12 max-w-xl mx-auto bg-[#101728] border border-durgi-gold/30 rounded-2xl p-4 text-center flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Official Instagram Page</div>
              <div className="text-sm font-bold text-white">@sri_durga_seva_samithi_kadur</div>
            </div>
          </div>
          <a
            href="https://www.instagram.com/sri_durga_seva_samithi_kadur?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Follow
          </a>
        </div>

      </div>
    </section>
  );
}

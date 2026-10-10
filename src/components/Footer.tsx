'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070B] border-t border-durgi-gold/20 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-durgi-gold p-0.5">
                <Image
                  src="/images/durgi/durgi-hero.jpg"
                  alt="Sri Durga Kadur"
                  fill
                  sizes="48px"
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-wider text-gold-gradient font-serif block">
                  DRISHTI 2K26
                </span>
                <span className="text-xs text-amber-200/70 tracking-widest uppercase block">
                  Kaduru Dasara Reel Contest
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Organized by <strong>Sri Durga Seva Samithi, Kadur</strong>. Celebrating the sacred traditions, cultural grandeur, and timeless memories of Kaduru Dasara through creative filmmaking.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/sri_durga_seva_samithi_kadur?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-transparent border border-durgi-gold/30 text-amber-300 text-xs font-semibold hover:border-durgi-gold transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>@sri_durga_seva_samithi_kadur</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-durgi-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-durgi-gold transition-colors">Free Registration</Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-durgi-gold transition-colors">Submit Reel Links</Link>
              </li>
              <li>
                <Link href="/#prizes" className="hover:text-durgi-gold transition-colors">Prizes & Sponsors</Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-durgi-gold transition-colors">Rules & FAQ</Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-durgi-gold transition-colors">Durgi Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sponsors */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">
              Proud Sponsors
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-durgi-gold" />
                <span><strong>Namma Angadi</strong> (1st: Smartphone)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-durgi-gold" />
                <span><strong>Laxmi Traders</strong> (2nd: DJI Gimbal)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-durgi-gold" />
                <span><strong>DK Mobiles</strong> (3rd: Party Speaker)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">
              Festival Office
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-durgi-gold shrink-0 mt-0.5" />
                <span>Sri Durga Seva Samithi, Kadur, Chikkamagaluru Dist, Karnataka</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-durgi-gold shrink-0" />
                <span>Gagan: 6362320465</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-durgi-gold shrink-0" />
                <span>Tarun K: 9353903861</span>
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-durgi-gold transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Admin CMS Portal</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © 2026 DRISHTI 2K26 — Sri Durga Seva Samithi, Kadur. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link href="/rules" className="hover:text-white transition-colors">Terms & Rules</Link>
            <span className="text-amber-300/80 font-medium">Kaduru Dasara Navaratri</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

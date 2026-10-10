'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Sparkles, Trophy, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/#categories' },
    { name: 'Prizes', href: '/#prizes' },
    { name: 'Sponsors', href: '/#sponsors' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Rules & FAQ', href: '/rules' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080B11]/85 border-b border-durgi-gold/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-durgi-gold p-0.5 shadow-gold-glow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/images/durgi/durgi-hero.jpg"
                alt="Sri Durga Kadur"
                fill
                sizes="48px"
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-gold-gradient font-serif block">
                DRISHTI 2K26
              </span>
              <span className="text-xs text-amber-200/70 tracking-widest uppercase block font-sans">
                Kaduru Dasara Reel Contest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-durgi-gold transition-colors tracking-wide relative py-1 hover:border-b-2 hover:border-durgi-gold"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/submit"
              className="text-xs font-semibold px-4 py-2.5 rounded-full border border-durgi-gold/40 text-amber-200 hover:bg-durgi-gold/10 transition-colors"
            >
              Submit Reel Links
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-gradient-to-r from-durgi-gold to-amber-600 text-black hover:opacity-95 shadow-gold-glow-sm hover:shadow-gold-glow transition-all flex items-center gap-1.5"
            >
              <span>Register Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-durgi-gold" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C101A] border-b border-durgi-gold/20 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-durgi-gold hover:bg-white/5 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-800 space-y-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block font-bold text-sm uppercase px-5 py-3 rounded-lg bg-gradient-to-r from-durgi-gold to-amber-600 text-black shadow-gold-glow"
            >
              Register Free
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block text-sm font-semibold px-4 py-2.5 rounded-lg border border-durgi-gold/40 text-amber-200 hover:bg-white/5"
            >
              Submit Reel Links
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

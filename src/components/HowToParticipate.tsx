'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Video, Share2, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function HowToParticipate() {
  const steps = [
    {
      number: '01',
      title: 'Free Registration',
      description: 'Fill the quick registration form with your name, phone, and Instagram username. Get your unique Registration ID (DR26-XXXXXX).',
      icon: <UserCheck className="w-6 h-6 text-durgi-gold" />,
      cta: 'Register Now',
      link: '/register',
    },
    {
      number: '02',
      title: 'Create Both Reels',
      description: 'Produce two reels: (1) Main Story Reel connected to Kaduru Dasara traditions, and (2) Durgi Reel featuring Devi & the festive aura.',
      icon: <Video className="w-6 h-6 text-durgi-gold" />,
      cta: 'View Categories',
      link: '/#categories',
    },
    {
      number: '03',
      title: 'Post on Instagram',
      description: 'Post both reels publicly on your Instagram account. Tag @sri_durga_seva_samithi_kadur and use #Drishti2K26 #KaduruDasara.',
      icon: <InstagramIcon className="w-6 h-6 text-durgi-gold" />,
      cta: 'Follow Us',
      link: 'https://www.instagram.com/sri_durga_seva_samithi_kadur',
      external: true,
    },
    {
      number: '04',
      title: 'Submit Reel Links',
      description: 'Enter your Instagram Reel URLs on our submission portal. You can submit one link first and add the second link before 20 Oct 2026.',
      icon: <Share2 className="w-6 h-6 text-durgi-gold" />,
      cta: 'Submit Links',
      link: '/submit',
    },
  ];

  return (
    <section className="py-24 bg-[#090D16] relative overflow-hidden border-t border-durgi-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4 text-durgi-gold" />
            Simple 4-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gold-gradient">
            How to Participate
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Follow these 4 simple steps to showcase your storytelling talent and celebrate Kaduru Dasara.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#0E1424] border border-durgi-gold/25 rounded-3xl p-6 relative hover:border-durgi-gold hover:shadow-gold-glow transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-durgi-gold/10 border border-durgi-gold/30 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-gray-700 font-serif group-hover:text-durgi-gold/50 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-serif mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                {step.external ? (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-durgi-gold hover:text-amber-200 flex items-center gap-1.5 group-hover:underline"
                  >
                    <span>{step.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    href={step.link}
                    className="text-xs font-bold text-durgi-gold hover:text-amber-200 flex items-center gap-1.5 group-hover:underline"
                  >
                    <span>{step.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

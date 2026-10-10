import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import PrizeShowcase from '@/components/PrizeShowcase';
import SponsorsShowcase from '@/components/SponsorsShowcase';
import HowToParticipate from '@/components/HowToParticipate';
import GallerySection from '@/components/GallerySection';
import CommitteeSection from '@/components/CommitteeSection';
import RulesSection from '@/components/RulesSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import { 
  getHeroContent, 
  getSiteSettings, 
  getSponsors, 
  getPrizes, 
  getCoordinators, 
  getGalleryImages, 
  getFaqs 
} from '@/lib/store';
import { Megaphone, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Always serve latest published content

export default async function HomePage() {
  const [
    heroContent,
    siteSettings,
    sponsors,
    prizes,
    coordinators,
    gallery,
    faqs
  ] = await Promise.all([
    getHeroContent(false),
    getSiteSettings(),
    getSponsors(),
    getPrizes(),
    getCoordinators(),
    getGalleryImages(),
    getFaqs()
  ]);

  if (siteSettings.maintenanceMode) {
    return (
      <main className="min-h-screen bg-[#080B11] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#0E1424] border border-durgi-gold/40 rounded-3xl p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-durgi-gold mx-auto" />
          <h1 className="text-2xl font-bold font-serif text-white">DRISHTI 2K26</h1>
          <p className="text-gray-300 text-sm">
            Website is undergoing brief scheduled maintenance. Please check back shortly or reach out to our coordinators.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-between">
      
      {/* Announcement Banner */}
      {siteSettings.announcementBanner?.enabled && (
        <div className="bg-gradient-to-r from-amber-600 via-durgi-gold to-amber-700 text-black py-2.5 px-4 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-md">
          <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
          <span>{siteSettings.announcementBanner.text}</span>
          {siteSettings.announcementBanner.link && (
            <Link
              href={siteSettings.announcementBanner.link}
              className="underline ml-2 hover:opacity-80"
            >
              Learn More →
            </Link>
          )}
        </div>
      )}

      {/* Navigation Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection content={heroContent} settings={siteSettings} />

      {/* Categories */}
      <CategoriesSection />

      {/* Prizes */}
      <PrizeShowcase prizes={prizes} />

      {/* How to Participate */}
      <HowToParticipate />

      {/* Sponsors */}
      <SponsorsShowcase sponsors={sponsors} />

      {/* Sacred Durgi Gallery */}
      <GallerySection images={gallery} />

      {/* Committee & Coordinators */}
      <CommitteeSection coordinators={coordinators} />

      {/* Rules Section */}
      <RulesSection />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Footer */}
      <Footer />

    </main>
  );
}

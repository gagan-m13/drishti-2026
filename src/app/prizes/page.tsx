import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrizeShowcase from '@/components/PrizeShowcase';
import SponsorsShowcase from '@/components/SponsorsShowcase';
import { getPrizes, getSponsors } from '@/lib/store';

export const revalidate = 0;

export default async function PrizesPage() {
  const [prizes, sponsors] = await Promise.all([
    getPrizes(),
    getSponsors()
  ]);

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <PrizeShowcase prizes={prizes} />
        <SponsorsShowcase sponsors={sponsors} />
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RulesSection from '@/components/RulesSection';
import FaqSection from '@/components/FaqSection';
import { getFaqs } from '@/lib/store';

export const revalidate = 0;

export default async function RulesPage() {
  const faqs = await getFaqs();

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-8">
        <RulesSection />
        <FaqSection faqs={faqs} />
      </main>
      <Footer />
    </div>
  );
}

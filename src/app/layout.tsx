import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'DRISHTI 2K26 | Kaduru Dasara Reel Making Competition',
  description: 'Join DRISHTI 2K26 organized by Sri Durga Seva Samithi, Kadur. Register free, share your Main Story Reel and Durgi Reel, and win exciting prizes sponsored by Namma Angadi, Laxmi Traders & DK Mobiles.',
  keywords: [
    'DRISHTI 2K26',
    'Kaduru Dasara',
    'Sri Durga Seva Samithi',
    'Kadur Durgi',
    'Reel Making Competition',
    'Navaratri 2026',
    'Kadur',
    'Chikkamagaluru',
    'Karnataka Festival Reels'
  ],
  authors: [{ name: 'Sri Durga Seva Samithi, Kadur' }],
  openGraph: {
    title: 'DRISHTI 2K26 | Kaduru Dasara Reel Making Competition',
    description: 'One Celebration… Many Stories… Memories That Last Forever! Free Registration for Kaduru Dasara Reel Making Competition.',
    url: 'https://drishti2k26.com',
    siteName: 'DRISHTI 2K26',
    images: [
      {
        url: '/images/durgi/durgi-portrait-hd.jpg',
        width: 1200,
        height: 630,
        alt: 'Sri Durga Devi — Kaduru Dasara',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRISHTI 2K26 | Kaduru Dasara Reel Making Competition',
    description: 'One Celebration… Many Stories… Memories That Last Forever! Free Registration.',
    images: ['/images/durgi/durgi-portrait-hd.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/images/durgi/durgi-hero.jpg" />
      </head>
      <body className="min-h-screen bg-[#080B11] text-gray-100 antialiased selection:bg-durgi-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}

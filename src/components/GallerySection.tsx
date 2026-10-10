'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Maximize2, X, Eye, Flame, ShieldCheck } from 'lucide-react';
import { GalleryImage } from '@/types';

interface GallerySectionProps {
  images: GalleryImage[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(images.map((img) => img.category)))];

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="gallery" className="py-24 bg-[#07090E] relative overflow-hidden border-t border-durgi-gold/15">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-durgi-gold/10 border border-durgi-gold/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-500" />
            Authentic Darshana
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gold-gradient">
            Kaduru Dasara Sacred Gallery
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Real festival photography of Sri Durga Devi of Kadur. Preserve Devi’s divine countenance and grace in your cinematic stories.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-durgi-gold text-black shadow-gold-glow'
                  : 'bg-[#101524] text-gray-400 hover:text-white hover:bg-[#182035] border border-gray-800'
              }`}
            >
              {cat === 'all' ? 'All Darshana' : cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid of Authentic Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative rounded-2xl overflow-hidden bg-[#0D121F] border border-durgi-gold/25 hover:border-durgi-gold shadow-gold-glow-sm hover:shadow-gold-glow cursor-pointer transition-all duration-300"
            >
              <div className="relative h-80 sm:h-96 w-full">
                <Image
                  src={image.imageUrl}
                  alt={image.altText || image.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              </div>

              {/* Card Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                  {image.category}
                </div>
                <h3 className="text-lg font-bold text-white font-serif group-hover:text-amber-200 transition-colors">
                  {image.title}
                </h3>
                {image.caption && (
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {image.caption}
                  </p>
                )}
              </div>

              {/* Zoom Action Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-durgi-gold" />
              </div>
            </div>
          ))}
        </div>

        {/* Authenticity Guarantee Callout */}
        <div className="mt-12 text-center text-xs text-amber-200/80 max-w-xl mx-auto flex items-center justify-center gap-2 bg-[#0F1424] py-3 px-6 rounded-full border border-durgi-gold/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Strict Rule: The authentic idol's divine face and features must never be altered with AI avatars.</span>
        </div>

      </div>

      {/* Fullscreen Image Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-[#0D121F] border border-durgi-gold/50 rounded-3xl overflow-hidden shadow-gold-glow-lg flex flex-col">
            <div className="relative h-[65vh] w-full bg-black">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.altText || selectedImage.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="p-6 bg-[#0B0F19] border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-bold text-white font-serif">
                  {selectedImage.title}
                </h3>
                {selectedImage.caption && (
                  <p className="text-sm text-gray-300 mt-1">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
              <a
                href={selectedImage.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-durgi-gold text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0"
              >
                View High-Res Source
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';
import { MediaAsset } from '@/types';

interface AdminMediaLibraryProps {
  mediaAssets: MediaAsset[];
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopyPath: (path: string) => void;
}

export default function AdminMediaLibrary({
  mediaAssets,
  uploading,
  onUpload,
  onCopyPath,
}: AdminMediaLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Media & Asset Library</h1>
          <p className="text-xs sm:text-sm text-gray-400">Upload festival photos, replace assets, and copy image links for website sections.</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={onUpload} accept="image/jpeg,image/png,image/webp" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold-glow">
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaAssets.map((asset) => (
          <div key={asset.id} className="bg-[#0E1424] border border-gray-800 rounded-2xl overflow-hidden group space-y-2 p-3">
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black">
              <Image src={asset.filePath} alt={asset.altText || asset.filename} fill sizes="250px" className="object-cover" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-white truncate">{asset.filename}</div>
              <div className="text-[10px] text-gray-400 flex items-center justify-between">
                <span>{(asset.fileSize / 1024).toFixed(0)} KB</span>
                <button onClick={() => onCopyPath(asset.filePath)} className="text-durgi-gold hover:underline">Copy URL</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  FileEdit, 
  Image as ImageIcon, 
  Trophy, 
  Users, 
  Settings, 
  BookOpen, 
  LogOut, 
  ExternalLink,
  Flame,
  Award,
  HelpCircle,
  Eye,
  Film
} from 'lucide-react';

export type AdminTab = 
  | 'overview' 
  | 'registrations' 
  | 'submissions' 
  | 'hero' 
  | 'media' 
  | 'sponsors' 
  | 'prizes' 
  | 'coordinators' 
  | 'gallery' 
  | 'faqs' 
  | 'settings' 
  | 'preview';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const navTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'registrations', label: 'Registrations', icon: <Users className="w-4 h-4" /> },
    { id: 'submissions', label: 'Video Submissions', icon: <Film className="w-4 h-4" /> },
    { id: 'hero', label: 'Hero & Content', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'sponsors', label: 'Sponsors', icon: <Award className="w-4 h-4" /> },
    { id: 'prizes', label: 'Prizes', icon: <Trophy className="w-4 h-4" /> },
    { id: 'coordinators', label: 'Coordinators', icon: <Users className="w-4 h-4" /> },
    { id: 'gallery', label: 'Durgi Gallery', icon: <Flame className="w-4 h-4" /> },
    { id: 'faqs', label: 'Rules & FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'settings', label: 'Event Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'preview', label: 'Live Preview', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <aside className={`w-64 bg-[#090D16] border-r border-durgi-gold/20 flex flex-col justify-between p-4 shrink-0 fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="space-y-6">
        <div className="p-3 bg-[#0E1424] rounded-2xl border border-durgi-gold/30 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-durgi-gold shrink-0">
            <Image src="/images/durgi/durgi-hero.jpg" alt="Durgi" fill sizes="40px" className="object-cover" />
          </div>
          <div className="overflow-hidden">
            <span className="font-serif font-bold text-sm text-gold-gradient block truncate">DRISHTI 2K26</span>
            <span className="text-[10px] text-amber-200/70 block uppercase tracking-wider truncate">Admin Control</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === tab.id
                  ? 'bg-durgi-gold text-black shadow-gold-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-durgi-gold" />
            <span>View Live Website</span>
          </span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

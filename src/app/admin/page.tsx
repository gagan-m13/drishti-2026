'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, 
  Lock, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Monitor, 
  Smartphone 
} from 'lucide-react';
import AdminSidebar, { AdminTab } from '../../components/admin/AdminSidebar';
import AdminOverview from '../../components/admin/AdminOverview';
import AdminRegistrations from '../../components/admin/AdminRegistrations';
import AdminSubmissions from '../../components/admin/AdminSubmissions';
import AdminHeroEditor from '../../components/admin/AdminHeroEditor';
import AdminMediaLibrary from '../../components/admin/AdminMediaLibrary';
import AdminSettings from '../../components/admin/AdminSettings';
import AdminSponsors from '../../components/admin/AdminSponsors';
import AdminPrizes from '../../components/admin/AdminPrizes';
import AdminCoordinators from '../../components/admin/AdminCoordinators';
import AdminGallery from '../../components/admin/AdminGallery';
import AdminFaqs from '../../components/admin/AdminFaqs';
import { 
  Registration, 
  HeroContent, 
  SiteSettings, 
  Sponsor, 
  Prize, 
  Coordinator, 
  GalleryImage, 
  FAQ, 
  MediaAsset 
} from '@/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [heroDraft, setHeroDraft] = useState<HeroContent | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

  const [actionLoading, setActionLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.ok) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setIsAuthenticated(true);
      showToast('Admin logged in successfully!');
      loadAllData();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  const loadAllData = async () => {
    try {
      const [
        regRes,
        contentRes,
        settingsRes,
        sponsorsRes,
        prizesRes,
        coordsRes,
        galleryRes,
        faqsRes,
        mediaRes
      ] = await Promise.all([
        fetch('/api/admin/registrations'),
        fetch('/api/admin/content'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/sponsors'),
        fetch('/api/admin/prizes'),
        fetch('/api/admin/coordinators'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/faqs'),
        fetch('/api/admin/media')
      ]);

      if (regRes.ok) {
        const d = await regRes.json();
        setRegistrations(d.registrations || []);
        setMetrics(d.metrics || {});
      }
      if (contentRes.ok) {
        const d = await contentRes.json();
        setHeroContent(d.published);
        setHeroDraft(d.draft || d.published);
        setHasDraft(d.hasDraft);
      }
      if (settingsRes.ok) {
        const d = await settingsRes.json();
        setSiteSettings(d.settings);
      }
      if (sponsorsRes.ok) {
        const d = await sponsorsRes.json();
        setSponsors(d.sponsors || []);
      }
      if (prizesRes.ok) {
        const d = await prizesRes.json();
        setPrizes(d.prizes || []);
      }
      if (coordsRes.ok) {
        const d = await coordsRes.json();
        setCoordinators(d.coordinators || []);
      }
      if (galleryRes.ok) {
        const d = await galleryRes.json();
        setGallery(d.gallery || []);
      }
      if (faqsRes.ok) {
        const d = await faqsRes.json();
        setFaqs(d.faqs || []);
      }
      if (mediaRes.ok) {
        const d = await mediaRes.json();
        setMediaAssets(d.assets || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handleUpdateStatus = async (
    submissionId: string, 
    status: 'eligible' | 'disqualified' | 'under_review'
  ) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, status }),
      });
      if (res.ok) {
        showToast(`Status updated to ${status}`);
        loadAllData();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveHeroDraft = async () => {
    if (!heroDraft) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_draft', content: heroDraft }),
      });
      const d = await res.json();
      if (res.ok) {
        setHasDraft(true);
        showToast(d.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishHero = async () => {
    if (!heroDraft) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', content: heroDraft }),
      });
      const d = await res.json();
      if (res.ok) {
        setHeroContent({ ...heroDraft });
        setHasDraft(false);
        showToast(d.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDiscardHeroDraft = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'discard_draft' }),
      });
      if (res.ok) {
        setHeroDraft(heroContent ? { ...heroContent } : null);
        setHasDraft(false);
        showToast('Draft discarded.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const d = await res.json();
      if (res.ok) {
        showToast('Image uploaded successfully!');
        loadAllData();
      } else {
        showToast(d.error || 'Upload failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07090E] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0E1321] border-2 border-durgi-gold/40 rounded-3xl p-8 shadow-gold-glow-lg space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-durgi-gold mx-auto shadow-gold-glow-sm">
              <Image src="/images/durgi/durgi-hero.jpg" alt="Sri Durga Kadur" fill sizes="64px" className="object-cover" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-white text-gold-gradient">
              DRISHTI 2K26 CMS
            </h1>
            <p className="text-xs text-amber-200/80">
              Sri Durga Seva Samithi, Kadur • Authorized Access Only
            </p>
          </div>

          {authError && (
            <div className="bg-rose-950/60 border border-rose-800 text-rose-200 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Administrator Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-[#080B11] border border-gray-700 focus:border-durgi-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-durgi-gold to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{authLoading ? 'Verifying...' : 'Access Admin Dashboard'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-500 hover:text-amber-200 transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col md:flex-row">
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-gold-glow text-sm font-semibold flex items-center gap-2.5 animate-fadeIn ${
          toastMsg.type === 'success' ? 'bg-emerald-950 border border-emerald-500 text-emerald-200' : 'bg-rose-950 border border-rose-500 text-rose-200'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div className="md:hidden bg-[#0C101A] border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg text-gold-gradient">DRISHTI 2K26 CMS</span>
        </div>
        <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="p-2 text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'overview' && (
          <AdminOverview
            metrics={metrics}
            registrations={registrations}
            siteSettings={siteSettings}
            onRefresh={loadAllData}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'registrations' && (
          <AdminRegistrations registrations={registrations} onRefresh={loadAllData} />
        )}

        {activeTab === 'submissions' && (
          <AdminSubmissions
            registrations={registrations}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'hero' && heroDraft && (
          <AdminHeroEditor
            heroDraft={heroDraft}
            setHeroDraft={setHeroDraft}
            hasDraft={hasDraft}
            actionLoading={actionLoading}
            onSaveDraft={handleSaveHeroDraft}
            onPublish={handlePublishHero}
            onDiscard={handleDiscardHeroDraft}
          />
        )}

        {activeTab === 'media' && (
          <AdminMediaLibrary
            mediaAssets={mediaAssets}
            uploading={uploading}
            onUpload={handleFileUpload}
            onCopyPath={(p) => {
              navigator.clipboard.writeText(p);
              showToast('Image path copied!');
            }}
          />
        )}

        {activeTab === 'sponsors' && (
          <AdminSponsors sponsors={sponsors} onRefresh={loadAllData} />
        )}

        {activeTab === 'prizes' && (
          <AdminPrizes prizes={prizes} onRefresh={loadAllData} />
        )}

        {activeTab === 'coordinators' && (
          <AdminCoordinators coordinators={coordinators} onRefresh={loadAllData} />
        )}

        {activeTab === 'gallery' && (
          <AdminGallery gallery={gallery} onRefresh={loadAllData} />
        )}

        {activeTab === 'faqs' && (
          <AdminFaqs faqs={faqs} onRefresh={loadAllData} />
        )}

        {activeTab === 'settings' && siteSettings && (
          <AdminSettings
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            onSave={async () => {
              await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteSettings),
              });
              showToast('Settings saved successfully!');
            }}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-serif text-white">Live Website Preview</h1>
              <div className="flex items-center gap-2 bg-[#0E1424] p-1.5 rounded-xl border border-gray-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1 ${previewDevice === 'desktop' ? 'bg-durgi-gold text-black font-bold' : 'text-gray-400'}`}
                >
                  <Monitor className="w-4 h-4" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1 ${previewDevice === 'mobile' ? 'bg-durgi-gold text-black font-bold' : 'text-gray-400'}`}
                >
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-black/40 p-4 rounded-3xl border border-gray-800">
              <div className={`transition-all duration-300 rounded-2xl overflow-hidden border-2 border-durgi-gold/50 shadow-gold-glow ${
                previewDevice === 'mobile' ? 'w-[375px] h-[720px]' : 'w-full h-[750px]'
              }`}>
                <iframe src="/" className="w-full h-full bg-[#080B11]" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

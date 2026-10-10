import fs from 'fs';
import path from 'path';
import { 
  Registration, 
  VideoSubmission, 
  SubmissionAuditLog, 
  Sponsor, 
  Prize, 
  Coordinator, 
  GalleryImage, 
  FAQ, 
  HeroContent, 
  SiteSettings, 
  MediaAsset,
  ContentRevision,
  SubmissionStatus
} from '@/types';
import { 
  initialHeroContent, 
  initialSiteSettings, 
  initialSponsors, 
  initialPrizes, 
  initialCoordinators, 
  initialGallery, 
  initialFaqs 
} from './initial-data';

interface DatabaseSchema {
  registrations: Registration[];
  videoSubmissions: VideoSubmission[];
  auditLogs: SubmissionAuditLog[];
  heroContent: HeroContent;
  heroContentDraft?: HeroContent;
  siteSettings: SiteSettings;
  sponsors: Sponsor[];
  prizes: Prize[];
  coordinators: Coordinator[];
  gallery: GalleryImage[];
  faqs: FAQ[];
  mediaAssets: MediaAsset[];
  revisions: ContentRevision[];
}

function getDbPath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpPath = path.join('/tmp', 'durgi_db.json');
    if (!fs.existsSync(tmpPath)) {
      try {
        const rootPath = path.join(process.cwd(), 'data', 'db.json');
        if (fs.existsSync(rootPath)) {
          fs.copyFileSync(rootPath, tmpPath);
        } else {
          fs.writeFileSync(tmpPath, JSON.stringify(getDefaultDb(), null, 2), 'utf-8');
        }
      } catch (e) {
        console.error('Error seeding /tmp/durgi_db.json:', e);
      }
    }
    return tmpPath;
  }
  return path.join(process.cwd(), 'data', 'db.json');
}

function getDefaultDb(): DatabaseSchema {
  return {
    registrations: [],
    videoSubmissions: [],
    auditLogs: [],
    heroContent: { ...initialHeroContent },
    heroContentDraft: undefined,
    siteSettings: { ...initialSiteSettings },
    sponsors: [...initialSponsors],
    prizes: [...initialPrizes],
    coordinators: [...initialCoordinators],
    gallery: [...initialGallery],
    faqs: [...initialFaqs],
    mediaAssets: [
      {
        id: 'med-1',
        filename: 'durgi-hero.jpg',
        filePath: '/images/durgi/durgi-hero.jpg',
        fileSize: 179384,
        mimeType: 'image/jpeg',
        altText: 'Sri Durga Devi Kaduru Dasara Hero Portrait',
        caption: 'Kaduru Dasara divine portrait of Durgi',
        createdAt: new Date().toISOString()
      },
      {
        id: 'med-2',
        filename: 'durgi-full-standing.jpg',
        filePath: '/images/durgi/durgi-full-standing.jpg',
        fileSize: 181510,
        mimeType: 'image/jpeg',
        altText: 'Full standing idol with lion and trishul',
        caption: 'Complete view of Sri Durga idol on Simha vahana',
        createdAt: new Date().toISOString()
      },
      {
        id: 'med-3',
        filename: 'durgi-abhaya-mudra.jpg',
        filePath: '/images/durgi/durgi-abhaya-mudra.jpg',
        fileSize: 161011,
        mimeType: 'image/jpeg',
        altText: 'Abhaya Hasta showing sacred Om',
        caption: 'Divine blessing hand of Devi with Om',
        createdAt: new Date().toISOString()
      }
    ],
    revisions: [
      {
        id: 'rev-init',
        sectionKey: 'all',
        draftData: {},
        publishedData: { hero: initialHeroContent, settings: initialSiteSettings },
        status: 'published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };
}

function readDb(): DatabaseSchema {
  try {
    const dbPath = getDbPath();
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
      const defaultDb = getDefaultDb();
      try {
        fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
      } catch (e) {}
      return defaultDb;
    }
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultDb(),
      ...parsed
    };
  } catch (err) {
    console.error('Error reading local db:', err);
    return getDefaultDb();
  }
}

function writeDb(db: DatabaseSchema): void {
  try {
    const dbPath = getDbPath();
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db:', err);
  }
}

// Normalizer utility functions
export function normalizePhoneNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function normalizeInstagram(username: string): string {
  let cleaned = username.trim().toLowerCase();
  cleaned = cleaned.replace(/^@+/, '');
  if (cleaned.includes('instagram.com/')) {
    cleaned = cleaned.split('instagram.com/')[1].split('/')[0].split('?')[0];
  }
  return cleaned;
}

export function normalizeInstagramReelUrl(url: string): string {
  try {
    const trimmed = url.trim();
    if (!trimmed.includes('instagram.com')) {
      return '';
    }
    const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const pathname = urlObj.pathname.replace(/\/+$/, '');
    return `https://www.instagram.com${pathname}`;
  } catch (err) {
    return '';
  }
}

// Registration functions
export async function createRegistration(data: {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  instagramUsername: string;
  college?: string;
  ageRange?: string;
}): Promise<{ success: boolean; error?: string; registration?: Registration }> {
  const db = readDb();
  const normalizedPhone = normalizePhoneNumber(data.phone);
  const normalizedInsta = normalizeInstagram(data.instagramUsername);

  if (!normalizedPhone || normalizedPhone.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  if (!normalizedInsta) {
    return { success: false, error: 'Please provide a valid Instagram username.' };
  }

  // Check duplicate phone or instagram
  const existingByPhone = db.registrations.find(r => r.normalizedPhone === normalizedPhone);
  if (existingByPhone) {
    return { 
      success: false, 
      error: `A participant is already registered with mobile numberending in ...${normalizedPhone.slice(-4)}. Registration ID: ${existingByPhone.registrationCode}`,
      registration: existingByPhone
    };
  }

  const existingByInsta = db.registrations.find(r => r.instagramUsername.toLowerCase() === normalizedInsta);
  if (existingByInsta) {
    return { 
      success: false, 
      error: `An entry for Instagram @${normalizedInsta} already exists with Registration ID: ${existingByInsta.registrationCode}`,
      registration: existingByInsta
    };
  }

  // Generate unique Registration Code: DR26-XXXXXX
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const registrationCode = `DR26-${randomSuffix}`;
  const accessToken = `tok_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  const now = new Date().toISOString();

  const newRegistration: Registration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    registrationCode,
    fullName: data.fullName.trim(),
    normalizedPhone,
    email: data.email.trim().toLowerCase(),
    city: data.city.trim(),
    instagramUsername: normalizedInsta,
    college: data.college?.trim(),
    ageRange: data.ageRange?.trim(),
    accessToken,
    consentTimestamp: now,
    createdAt: now,
    updatedAt: now,
    submissions: []
  };

  db.registrations.unshift(newRegistration);
  
  // Add audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    registrationId: newRegistration.id,
    actor: 'participant',
    action: 'REGISTER_COMPLETED',
    details: { code: registrationCode, phone: `***${normalizedPhone.slice(-4)}` },
    createdAt: now
  });

  writeDb(db);
  return { success: true, registration: newRegistration };
}

export async function getRegistrations(): Promise<Registration[]> {
  const db = readDb();
  return db.registrations.map(r => {
    const subs = db.videoSubmissions.filter(s => s.registrationId === r.id);
    return { ...r, submissions: subs };
  });
}

export async function getRegistrationByCode(code: string): Promise<Registration | null> {
  const db = readDb();
  const reg = db.registrations.find(r => r.registrationCode.toUpperCase() === code.trim().toUpperCase());
  if (!reg) return null;
  const subs = db.videoSubmissions.filter(s => s.registrationId === reg.id);
  return { ...reg, submissions: subs };
}

export async function getRegistrationByToken(token: string): Promise<Registration | null> {
  const db = readDb();
  const reg = db.registrations.find(r => r.accessToken === token.trim());
  if (!reg) return null;
  const subs = db.videoSubmissions.filter(s => s.registrationId === reg.id);
  return { ...reg, submissions: subs };
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  const db = readDb();
  const reg = db.registrations.find(r => r.id === id);
  if (!reg) return null;
  const subs = db.videoSubmissions.filter(s => s.registrationId === reg.id);
  return { ...reg, submissions: subs };
}

export async function verifyParticipantAccess(code: string, phone: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const db = readDb();
  const normalizedPhone = normalizePhoneNumber(phone);
  const cleanCode = (code || '').trim().toUpperCase();
  const reg = db.registrations.find(
    r => r.registrationCode.toUpperCase() === cleanCode && 
         (r.normalizedPhone === normalizedPhone || r.normalizedPhone.endsWith(normalizedPhone))
  );

  if (!reg) {
    return { 
      success: false, 
      error: 'Registration ID and Mobile number do not match. Please ensure you have registered first at /register.' 
    };
  }

  return { success: true, token: reg.accessToken };
}

export async function updateRegistration(
  id: string, 
  updates: Partial<Registration>
): Promise<{ success: boolean; error?: string; registration?: Registration }> {
  const db = readDb();
  const index = db.registrations.findIndex(r => r.id === id);
  if (index < 0) {
    return { success: false, error: 'Registration not found' };
  }

  const existing = db.registrations[index];
  const now = new Date().toISOString();

  // If phone was changed, normalize it
  let normalizedPhone = existing.normalizedPhone;
  if (updates.normalizedPhone) {
    normalizedPhone = normalizePhoneNumber(updates.normalizedPhone);
  }

  // If instagram was changed, normalize it
  let instagramUsername = existing.instagramUsername;
  if (updates.instagramUsername) {
    instagramUsername = normalizeInstagram(updates.instagramUsername);
  }

  db.registrations[index] = {
    ...existing,
    ...updates,
    id: existing.id,
    registrationCode: existing.registrationCode,
    normalizedPhone,
    instagramUsername,
    updatedAt: now,
  };

  writeDb(db);
  const subs = db.videoSubmissions.filter(s => s.registrationId === id);
  return { success: true, registration: { ...db.registrations[index], submissions: subs } };
}

export async function deleteRegistration(id: string): Promise<{ success: boolean }> {
  const db = readDb();
  db.registrations = db.registrations.filter(r => r.id !== id);
  db.videoSubmissions = db.videoSubmissions.filter(s => s.registrationId !== id);
  db.auditLogs = db.auditLogs.filter(l => l.registrationId !== id);
  writeDb(db);
  return { success: true };
}

// Video Submissions functions
export async function saveVideoSubmission(
  registrationId: string, 
  videoType: 'main_story' | 'durgi_reel', 
  submittedUrl: string
): Promise<{ success: boolean; error?: string; submission?: VideoSubmission }> {
  const db = readDb();
  const reg = db.registrations.find(r => r.id === registrationId);
  if (!reg) {
    return { success: false, error: 'Registration record not found.' };
  }

  const normalized = normalizeInstagramReelUrl(submittedUrl);
  if (!normalized || (!normalized.includes('/reel/') && !normalized.includes('/p/'))) {
    return { success: false, error: 'Please enter a valid Instagram Reel URL (e.g., https://www.instagram.com/reel/...)' };
  }

  const now = new Date().toISOString();
  let existingIndex = db.videoSubmissions.findIndex(
    s => s.registrationId === registrationId && s.videoType === videoType
  );

  let sub: VideoSubmission;

  if (existingIndex >= 0) {
    sub = {
      ...db.videoSubmissions[existingIndex],
      submittedUrl: submittedUrl.trim(),
      normalizedUrl: normalized,
      status: 'submitted',
      updatedAt: now
    };
    db.videoSubmissions[existingIndex] = sub;
  } else {
    sub = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      registrationId,
      videoType,
      submittedUrl: submittedUrl.trim(),
      normalizedUrl: normalized,
      status: 'submitted',
      submittedAt: now,
      updatedAt: now
    };
    db.videoSubmissions.push(sub);
  }

  // Update registration updated_at
  const regIndex = db.registrations.findIndex(r => r.id === registrationId);
  if (regIndex >= 0) {
    db.registrations[regIndex].updatedAt = now;
  }

  // Audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    registrationId,
    actor: 'participant',
    action: `VIDEO_SUBMITTED_${videoType.toUpperCase()}`,
    details: { url: normalized },
    createdAt: now
  });

  writeDb(db);
  return { success: true, submission: sub };
}

export async function updateSubmissionReview(
  submissionId: string,
  status: SubmissionStatus,
  reviewNotes?: string,
  reviewedBy: string = 'Admin'
): Promise<{ success: boolean; error?: string }> {
  const db = readDb();
  const subIndex = db.videoSubmissions.findIndex(s => s.id === submissionId);
  if (subIndex === 0 && !db.videoSubmissions[subIndex]) {
    return { success: false, error: 'Submission not found' };
  }
  if (subIndex < 0) {
    return { success: false, error: 'Submission not found' };
  }

  const now = new Date().toISOString();
  db.videoSubmissions[subIndex].status = status;
  if (reviewNotes !== undefined) {
    db.videoSubmissions[subIndex].reviewNotes = reviewNotes;
  }
  db.videoSubmissions[subIndex].reviewedBy = reviewedBy;
  db.videoSubmissions[subIndex].updatedAt = now;

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    registrationId: db.videoSubmissions[subIndex].registrationId,
    actor: 'admin',
    action: 'STATUS_UPDATED',
    details: { status, reviewNotes, reviewedBy },
    createdAt: now
  });

  writeDb(db);
  return { success: true };
}

// Content, CMS & Settings functions
export async function getHeroContent(includeDraft: boolean = false): Promise<HeroContent> {
  const db = readDb();
  if (includeDraft && db.heroContentDraft) {
    return db.heroContentDraft;
  }
  return db.heroContent;
}

export async function saveHeroContent(content: HeroContent, asDraft: boolean = false): Promise<void> {
  const db = readDb();
  if (asDraft) {
    db.heroContentDraft = content;
  } else {
    db.heroContent = content;
    db.heroContentDraft = undefined;
    db.revisions.unshift({
      id: `rev-${Date.now()}`,
      sectionKey: 'hero',
      draftData: content,
      publishedData: content,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  writeDb(db);
}

export async function publishHeroDraft(): Promise<void> {
  const db = readDb();
  if (db.heroContentDraft) {
    db.heroContent = { ...db.heroContentDraft };
    db.heroContentDraft = undefined;
    db.revisions.unshift({
      id: `rev-${Date.now()}`,
      sectionKey: 'hero',
      draftData: db.heroContent,
      publishedData: db.heroContent,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    writeDb(db);
  }
}

export async function discardHeroDraft(): Promise<void> {
  const db = readDb();
  db.heroContentDraft = undefined;
  writeDb(db);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = readDb();
  return db.siteSettings;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const db = readDb();
  db.siteSettings = settings;
  db.revisions.unshift({
    id: `rev-${Date.now()}`,
    sectionKey: 'settings',
    draftData: settings,
    publishedData: settings,
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  writeDb(db);
}

// Sponsors
export async function getSponsors(): Promise<Sponsor[]> {
  const db = readDb();
  return db.sponsors.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveSponsor(sponsor: Sponsor): Promise<void> {
  const db = readDb();
  const index = db.sponsors.findIndex(s => s.id === sponsor.id);
  if (index >= 0) {
    db.sponsors[index] = sponsor;
  } else {
    db.sponsors.push(sponsor);
  }
  writeDb(db);
}

export async function deleteSponsor(id: string): Promise<void> {
  const db = readDb();
  db.sponsors = db.sponsors.filter(s => s.id !== id);
  writeDb(db);
}

// Prizes
export async function getPrizes(): Promise<Prize[]> {
  const db = readDb();
  return db.prizes.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function savePrize(prize: Prize): Promise<void> {
  const db = readDb();
  const index = db.prizes.findIndex(p => p.id === prize.id);
  if (index >= 0) {
    db.prizes[index] = prize;
  } else {
    db.prizes.push(prize);
  }
  writeDb(db);
}

export async function deletePrize(id: string): Promise<void> {
  const db = readDb();
  db.prizes = db.prizes.filter(p => p.id !== id);
  writeDb(db);
}

// Coordinators
export async function getCoordinators(): Promise<Coordinator[]> {
  const db = readDb();
  return db.coordinators.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveCoordinator(coord: Coordinator): Promise<void> {
  const db = readDb();
  const index = db.coordinators.findIndex(c => c.id === coord.id);
  if (index >= 0) {
    db.coordinators[index] = coord;
  } else {
    db.coordinators.push(coord);
  }
  writeDb(db);
}

export async function deleteCoordinator(id: string): Promise<void> {
  const db = readDb();
  db.coordinators = db.coordinators.filter(c => c.id !== id);
  writeDb(db);
}

// Gallery
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const db = readDb();
  return db.gallery.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveGalleryImage(img: GalleryImage): Promise<void> {
  const db = readDb();
  const index = db.gallery.findIndex(g => g.id === img.id);
  if (index >= 0) {
    db.gallery[index] = img;
  } else {
    db.gallery.push(img);
  }
  writeDb(db);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const db = readDb();
  db.gallery = db.gallery.filter(g => g.id !== id);
  writeDb(db);
}

// FAQs
export async function getFaqs(): Promise<FAQ[]> {
  const db = readDb();
  return db.faqs.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveFaq(faq: FAQ): Promise<void> {
  const db = readDb();
  const index = db.faqs.findIndex(f => f.id === faq.id);
  if (index >= 0) {
    db.faqs[index] = faq;
  } else {
    db.faqs.push(faq);
  }
  writeDb(db);
}

export async function deleteFaq(id: string): Promise<void> {
  const db = readDb();
  db.faqs = db.faqs.filter(f => f.id !== id);
  writeDb(db);
}

// Audit Logs
export async function getAuditLogs(): Promise<SubmissionAuditLog[]> {
  const db = readDb();
  return db.auditLogs.slice(0, 100);
}

// Media Assets
export async function getMediaAssets(): Promise<MediaAsset[]> {
  const db = readDb();
  return db.mediaAssets;
}

export async function addMediaAsset(asset: MediaAsset): Promise<void> {
  const db = readDb();
  db.mediaAssets.unshift(asset);
  writeDb(db);
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const db = readDb();
  db.mediaAssets = db.mediaAssets.filter(m => m.id !== id);
  writeDb(db);
}

// Content Revisions
export async function getContentRevisions(): Promise<ContentRevision[]> {
  const db = readDb();
  return db.revisions.slice(0, 20);
}

export interface Registration {
  id: string;
  registrationCode: string;
  fullName: string;
  normalizedPhone: string;
  email: string;
  city: string;
  instagramUsername: string;
  college?: string;
  ageRange?: string;
  accessToken: string;
  consentTimestamp: string;
  createdAt: string;
  updatedAt: string;
  submissions?: VideoSubmission[];
}

export type VideoType = 'main_story' | 'durgi_reel';
export type SubmissionStatus = 'submitted' | 'under_review' | 'eligible' | 'disqualified';

export interface VideoSubmission {
  id: string;
  registrationId: string;
  videoType: VideoType;
  submittedUrl: string;
  normalizedUrl: string;
  status: SubmissionStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface SubmissionAuditLog {
  id: string;
  registrationId?: string;
  actor: 'participant' | 'admin' | 'system';
  action: string;
  details: Record<string, any>;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'title' | 'associate' | 'powered_by' | 'supporter';
  prizeTitle?: string;
  businessCategory?: string;
  tagline?: string;
  promotionalPoints?: string[];
  mapUrl?: string;
  address?: string;
  logoUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Prize {
  id: string;
  rank: number;
  title: string;
  itemName: string;
  description: string;
  features?: string[];
  imageUrl?: string;
  sponsorId?: string;
  sponsorName: string;
  sponsorCategory?: string;
  sponsorMapUrl?: string;
  displayOrder: number;
  isAnnounced: boolean;
}

export interface Coordinator {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsappUrl?: string;
  instagramUrl?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption?: string;
  altText?: string;
  imageUrl: string;
  category: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline: string;
  datesText: string;
  startDate: string;
  endDate: string;
  heroImageUrl: string;
  bgGlowUrl?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  showCountdown: boolean;
  showPrizesBadge: boolean;
}

export interface SiteSettings {
  eventName: string;
  tagline: string;
  contestDates: string;
  registrationFee: string;
  participationType: string;
  organizerName: string;
  organizerLocation: string;
  officialInstagramUrl: string;
  officialHashtag: string;
  registrationsOpen: boolean;
  submissionsOpen: boolean;
  registrationDeadline: string;
  announcementBanner?: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  maintenanceMode: boolean;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  altText?: string;
  caption?: string;
  createdAt: string;
}

export interface ContentRevision {
  id: string;
  sectionKey: string;
  draftData: any;
  publishedData: any;
  status: 'draft' | 'published';
  lastModifiedBy?: string;
  publishedAt?: string;
  updatedAt: string;
}

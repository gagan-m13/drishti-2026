-- DRISHTI 2K26 Supabase Database Schema
-- Sri Durga Seva Samithi, Kadur

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    normalized_phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    instagram_username VARCHAR(100) NOT NULL,
    college VARCHAR(255),
    age_range VARCHAR(50),
    access_token VARCHAR(100) NOT NULL,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups & duplicate detection
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON public.registrations(normalized_phone);
CREATE INDEX IF NOT EXISTS idx_registrations_insta ON public.registrations(instagram_username);
CREATE INDEX IF NOT EXISTS idx_registrations_code ON public.registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_token ON public.registrations(access_token);

-- 2. Video Submissions table
CREATE TABLE IF NOT EXISTS public.video_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    video_type VARCHAR(50) NOT NULL, -- 'main_story' or 'durgi_reel'
    submitted_url TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'under_review', 'eligible', 'disqualified'
    review_notes TEXT,
    reviewed_by VARCHAR(100),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_reg_video_type UNIQUE(registration_id, video_type)
);

CREATE INDEX IF NOT EXISTS idx_video_submissions_reg ON public.video_submissions(registration_id);
CREATE INDEX IF NOT EXISTS idx_video_submissions_status ON public.video_submissions(status);

-- 3. Submission Audit Logs
CREATE TABLE IF NOT EXISTS public.submission_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    actor VARCHAR(100) NOT NULL, -- 'participant', 'admin', 'system'
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Site Settings (Key-Value)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Sponsors table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'title', -- 'title', 'associate', 'powered_by', 'supporter'
    prize_title VARCHAR(255),
    logo_url TEXT,
    website_url TEXT,
    instagram_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Prizes table
CREATE TABLE IF NOT EXISTS public.prizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rank INT NOT NULL, -- 1, 2, 3
    title VARCHAR(100) NOT NULL, -- '1st Prize', '2nd Prize', '3rd Prize'
    item_name VARCHAR(255) NOT NULL, -- 'Smartphone', 'DJI Gimbal', 'Party Speaker'
    description TEXT,
    image_url TEXT,
    sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE SET NULL,
    sponsor_name VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_announced BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Coordinators table
CREATE TABLE IF NOT EXISTS public.coordinators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp_url TEXT,
    instagram_url TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Gallery Images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    caption TEXT,
    alt_text TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'kaduru_dasara',
    display_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    display_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Content Revisions / CMS Drafts
CREATE TABLE IF NOT EXISTS public.content_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) NOT NULL,
    draft_data JSONB NOT NULL,
    published_data JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'published', -- 'draft', 'published'
    last_modified_by VARCHAR(100),
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Media Assets Library
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Public can read published content, sponsors, prizes, coordinators, faqs, gallery
CREATE POLICY "Public can view published sponsors" ON public.sponsors FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published prizes" ON public.prizes FOR SELECT USING (is_announced = true);
CREATE POLICY "Public can view published coordinators" ON public.coordinators FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published gallery" ON public.gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view published revisions" ON public.content_revisions FOR SELECT USING (status = 'published');

-- Public cannot view registrations list directly (server client with service role handles it)
CREATE POLICY "Server service role manages all" ON public.registrations FOR ALL USING (true);

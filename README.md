# DRISHTI 2K26 — Kaduru Dasara Reel Making Competition
**Official Event Website & CMS Administration System**  
*Organized by Sri Durga Seva Samithi, Kadur*

---

## 🔱 Event Highlights & Official Details

- **Event Name**: DRISHTI 2K26
- **Event Type**: Reel Making Competition
- **Festival**: Kaduru Dasara (Navaratri 2026)
- **Organizer**: Sri Durga Seva Samithi, Kadur (Chikkamagaluru Dist, Karnataka)
- **Tagline**: *"One Celebration… Many Stories… Memories That Last Forever!"*
- **Contest Dates**: 11 October 2026 – 20 October 2026
- **Registration Fee**: **100% FREE**
- **Participation**: Individual Only
- **Official Instagram**: [@sri_durga_seva_samithi_kadur](https://www.instagram.com/sri_durga_seva_samithi_kadur)
- **Official Hashtags**: `#Drishti2K26` `#KaduruDasara` `#SriDurgaSevaSamithi`

### 🏆 Prizes & Sponsors
1. **FIRST PRIZE**: **Smartphone** — Sponsored by **Namma Angadi** (Title Sponsor)
2. **SECOND PRIZE**: **DJI Gimbal** — Sponsored by **Laxmi Traders**
3. **THIRD PRIZE**: **Party Speaker** — Sponsored by **DK Mobiles**

### 📞 Event Coordinators & Helplines
- **Gagan** (Event Coordinator): `+91 6362320465` (1-Click Call & WhatsApp)
- **Tarun K** (Event Coordinator): `+91 9353903861` (1-Click Call & WhatsApp)

### 📹 Two Mandatory Video Categories
1. **MAIN STORY VIDEO**: An original story connected to Durgi, Navaratri, Kaduru Dasara, local traditions, devotion, people or festival emotions.
2. **DURGI REEL**: A creative reel showcasing Sri Durga Devi and the festival atmosphere.
> *Strict Authenticity Rule: Durgi's actual idol face, ornaments, crown, and divine appearance must remain authentic and unedited. AI avatars of Devi are strictly prohibited.*

---

## 🚀 Key Features

### 1. Cinematic Festival Public Experience
- **Authentic Durgi Imagery**: Built using the authentic uploaded photographs of Sri Durga Devi from Kaduru Dasara.
- **Festival Theme**: Dark charcoal (`#080B11`), midnight blue, antique gold accents, and crimson festive glows.
- **Dynamic Countdown**: Live countdown clock ticking down to 11 October 2026.
- **Interactive Sacred Gallery**: High-resolution showcase of Devi with category filters and modal photo inspection.

### 2. Participant Registration & Duplicate Prevention
- **Unique Registration ID**: Automatic generation of IDs like `DR26-XXXXXX`.
- **Duplicate Prevention**: Normalized 10-digit mobile number and Instagram handle checks with clear messaging.
- **Honeypot Spam Protection**: Silent rejection of bot submissions.
- **Celebratory Confetti**: Instant festive confetti burst on registration confirmation.

### 3. Instagram Reel Submission Portal (`/submit`)
- **Verified Access Recovery**: Participants can access their entry anytime using their `Registration ID + Mobile Number`.
- **URL Normalization & Validation**: Validates `instagram.com/reel/...` links and strips tracking params.
- **Split Submission**: Submit one reel first and the second reel later before 20 October 2026.
- **Jury Status Badges**: `Registered`, `One video submitted`, `Both videos submitted`, `Under review`, `Eligible`, `Disqualified`.

### 4. Comprehensive CMS Admin Panel (`/admin`)
- **Protected Route**: Secured with cryptographic HMAC tokens and session verification.
- **Default Master Admin Password**: `Durgi2026Admin!` *(configurable via `ADMIN_PASSWORD` in `.env`)*.
- **Live Content & Hero Editor**: Change headings, subtitle, dates, and hero image with instant Draft / Publish workflow.
- **Draft, Preview & Publish Engine**: Save drafts, simulate on Desktop/Mobile preview frames, and publish with one click.
- **Media & Asset Library**: Drag-and-drop file upload (up to 8MB), metadata tagging, copy direct URL.
- **Participant Directory**: Search by Registration ID, Name, Phone, Instagram; filter by submission state.
- **One-Click CSV Export**: Download complete participant and reel link database.
- **Jury Video Review**: Direct links to open submitted reels in a safe tab and mark eligibility with internal notes.
- **Event Controls**: Toggle registrations open/closed, enable/disable submissions, and edit announcements.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 App Router (React 18)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS + Custom Festival Theme Palette
- **Icons**: Lucide Icons & Custom SVG components
- **Motion**: Framer Motion & CSS keyframe shimmer
- **Validation**: Zod schema validation
- **Database / Storage**: Dual-mode engine:
  - Universal Supabase PostgreSQL schema with Row Level Security (RLS) policies.
  - Self-contained persistent atomic storage engine for zero-dependency local development and preview deployments.

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
git clone <repo-url>
cd durgi
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Key variables:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=Durgi2026Admin!
ADMIN_SECRET_KEY=drishti_secret_jwt_admin_key_2026_super_secure_auth

# Optional: Cloud Supabase PostgreSQL and Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Load Verification

### Run Automated Unit & Integration Tests
Executes 25 comprehensive tests validating normalization, duplicate prevention, registration codes, video link parsing, admin authentication, draft-publish lifecycle, and rate limits:
```bash
npm test
```
Result: **25 Passed | 0 Failed**

### Run 100-Concurrent-User Load Test
Simulates 100 concurrent transactions (registrations, queries, and content reads):
```bash
npm run load-test
```
Load Test Metrics:
- **Total Concurrent Users**: 100
- **Success Rate**: 100.0% (0 errors)
- **Throughput**: ~107.6 transactions/second
- **Median Latency (p50)**: 726 ms
- **95th Percentile Latency (p95)**: 915 ms

---

## 🌐 Vercel Deployment Guide

1. Push your code to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`
   - `ADMIN_PASSWORD` = `[Choose a strong master password]`
   - `ADMIN_SECRET_KEY` = `[Random 32-character string]`
   - *(Optional)* Supabase keys if connecting cloud database.
4. Click **Deploy**. Vercel will run `next build` and deploy the application worldwide on edge serverless infrastructure.

---

## 🔐 Logging into the Admin Panel

1. Go to `/admin` on your website.
2. Enter the password: `Durgi2026Admin!` *(or the password set in your `.env.local`)*.
3. Access the full suite of website controls, registrations, video submissions, media uploads, and live settings.

---

## 📋 Real-World Information Checklist

| Item | Status | Details |
| :--- | :---: | :--- |
| **Authentic Durgi Photographs** | ✅ Configured | High-res Kaduru Dasara photos in `/public/images/durgi/` |
| **Coordinator 1** | ✅ Configured | Gagan (`6362320465`) |
| **Coordinator 2** | ✅ Configured | Tarun K (`9353903861`) |
| **Official Instagram** | ✅ Configured | `@sri_durga_seva_samithi_kadur` |
| **Title Sponsor** | ✅ Configured | Namma Angadi (1st Prize: Smartphone) |
| **Associate Sponsor 1** | ✅ Configured | Laxmi Traders (2nd Prize: DJI Gimbal) |
| **Associate Sponsor 2** | ✅ Configured | DK Mobiles (3rd Prize: Party Speaker) |
| **Contest Dates** | ✅ Configured | 11 October 2026 – 20 October 2026 |
| **Admin Password** | ✅ Configured | `Durgi2026Admin!` (Editable in `.env`) |

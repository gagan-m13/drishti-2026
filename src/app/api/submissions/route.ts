export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  getRegistrationByToken, 
  getRegistrationByCode, 
  saveVideoSubmission, 
  getSiteSettings 
} from '@/lib/store';
import { checkRateLimit } from '@/lib/rate-limit';

const submissionSchema = z.object({
  token: z.string().min(5, 'Access token is required'),
  videoType: z.enum(['main_story', 'durgi_reel']),
  reelUrl: z.string().url('Must be a valid URL'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`sub_${ip}`, 30, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submission requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const settings = await getSiteSettings();
    if (!settings.submissionsOpen) {
      return NextResponse.json(
        { error: 'Video submissions are currently closed.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = submissionSchema.safeParse(body);

    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || 'Invalid submission payload.';
      return NextResponse.json(
        { error: msg },
        { status: 400 }
      );
    }

    const { token, videoType, reelUrl } = validation.data;

    const registration = await getRegistrationByToken(token);
    if (!registration) {
      return NextResponse.json(
        { error: 'Invalid or expired access token. Please verify your Registration ID.' },
        { status: 401 }
      );
    }

    // Save submission
    const result = await saveVideoSubmission(registration.id, videoType, reelUrl);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Fetch updated registration with all submissions
    const updatedReg = await getRegistrationByToken(token);

    return NextResponse.json({
      success: true,
      submission: result.submission,
      registration: updatedReg,
    });

  } catch (err: any) {
    console.error('Submission API error:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred while saving video link.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const code = searchParams.get('code');

    if (!token && !code) {
      return NextResponse.json(
        { error: 'Provide a valid access token or registration code.' },
        { status: 400 }
      );
    }

    const reg = token 
      ? await getRegistrationByToken(token)
      : await getRegistrationByCode(code || '');

    if (!reg) {
      return NextResponse.json(
        { error: 'Registration record not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: reg,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch submission data.' }, { status: 500 });
  }
}

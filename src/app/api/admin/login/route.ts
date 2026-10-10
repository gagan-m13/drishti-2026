import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, generateAdminToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`admin_login_${ip}`, 10, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many admin login attempts. Please wait 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = body.password || '';

    const validation = validateAdminCredentials(password);
    if (!validation.success || !validation.session) {
      return NextResponse.json(
        { error: validation.error || 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const token = generateAdminToken(validation.session);

    const response = NextResponse.json({
      success: true,
      token,
      session: validation.session,
    });

    response.cookies.set('drishti_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
  }
}

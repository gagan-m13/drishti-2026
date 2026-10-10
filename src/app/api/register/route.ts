import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRegistration, getSiteSettings } from '@/lib/store';
import { checkRateLimit } from '@/lib/rate-limit';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Mobile number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(2, 'City/Town is required').max(100),
  instagramUsername: z.string().min(2, 'Instagram username is required').max(100),
  college: z.string().max(200).optional(),
  ageRange: z.string().max(50).optional(),
  individualConsent: z.boolean().refine(val => val === true, 'You must confirm individual participation'),
  rulesConsent: z.boolean().refine(val => val === true, 'You must agree to the contest rules'),
  websiteHp: z.string().optional(), // Honeypot field for bot spam prevention
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`reg_${ip}`, 15, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const settings = await getSiteSettings();
    if (!settings.registrationsOpen) {
      return NextResponse.json(
        { error: 'Registrations are currently closed by the event organizers.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Honeypot spam protection: bots fill invisible fields
    if (body.websiteHp && body.websiteHp.trim() !== '') {
      return NextResponse.json({ error: 'Spam submission rejected.' }, { status: 400 });
    }

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || 'Invalid form data';
      return NextResponse.json(
        { error: msg },
        { status: 400 }
      );
    }

    const result = await createRegistration({
      fullName: validation.data.fullName,
      phone: validation.data.phone,
      email: validation.data.email,
      city: validation.data.city,
      instagramUsername: validation.data.instagramUsername,
      college: validation.data.college,
      ageRange: validation.data.ageRange,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error, 
          existingRegistration: result.registration ? {
            code: result.registration.registrationCode,
            name: result.registration.fullName,
            token: result.registration.accessToken,
          } : undefined
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: result.registration,
    });

  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred during registration.' },
      { status: 500 }
    );
  }
}

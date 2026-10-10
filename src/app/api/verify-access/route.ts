import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyParticipantAccess } from '@/lib/store';
import { checkRateLimit } from '@/lib/rate-limit';

const verifySchema = z.object({
  registrationCode: z.string().min(4, 'Registration ID is required'),
  phone: z.string().min(10, 'Mobile number is required'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`verify_${ip}`, 10, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || 'Invalid input data.';
      return NextResponse.json(
        { error: msg },
        { status: 400 }
      );
    }

    const result = await verifyParticipantAccess(
      validation.data.registrationCode,
      validation.data.phone
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      token: result.token,
    });

  } catch (err: any) {
    console.error('Verify access API error:', err);
    return NextResponse.json(
      { error: 'Failed to verify participant access.' },
      { status: 500 }
    );
  }
}

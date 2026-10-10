import { NextRequest, NextResponse } from 'next/server';
import { updateSubmissionReview, getRegistrations } from '@/lib/store';
import { getAdminSession, verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
    }

    const registrations = await getRegistrations();
    const submissions: any[] = [];

    registrations.forEach(r => {
      (r.submissions || []).forEach(sub => {
        submissions.push({
          participant: {
            id: r.id,
            registrationCode: r.registrationCode,
            fullName: r.fullName,
            instagramUsername: r.instagramUsername,
            normalizedPhone: r.normalizedPhone,
            city: r.city,
            accessToken: r.accessToken,
            createdAt: r.createdAt
          },
          submission: sub
        });
      });
    });

    const metrics = {
      totalSubmissions: submissions.length,
      eligible: submissions.filter(s => s.submission.status === 'eligible').length,
      underReview: submissions.filter(s => s.submission.status === 'under_review').length,
      disqualified: submissions.filter(s => s.submission.status === 'disqualified').length,
    };

    return NextResponse.json({
      success: true,
      submissions,
      metrics,
      registrations
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch admin submissions.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId, status, reviewNotes } = body;

    if (!submissionId || !status) {
      return NextResponse.json({ error: 'submissionId and status are required' }, { status: 400 });
    }

    const result = await updateSubmissionReview(
      submissionId,
      status,
      reviewNotes,
      session.username || 'Admin'
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update submission status.' }, { status: 500 });
  }
}

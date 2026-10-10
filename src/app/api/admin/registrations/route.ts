export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations, getAuditLogs, updateRegistration, deleteRegistration } from '@/lib/store';
import { getAdminSession, verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    let list = await getRegistrations();

    // Filter by search query (code, name, phone, instagram, city)
    if (search) {
      list = list.filter(r => 
        r.registrationCode.toLowerCase().includes(search) ||
        r.fullName.toLowerCase().includes(search) ||
        r.normalizedPhone.includes(search) ||
        r.instagramUsername.toLowerCase().includes(search) ||
        r.city.toLowerCase().includes(search)
      );
    }

    // Compute metrics
    const allRegistrations = await getRegistrations();
    let totalCount = allRegistrations.length;
    let bothCount = 0;
    let singleCount = 0;
    let underReviewCount = 0;
    let eligibleCount = 0;
    let disqualifiedCount = 0;

    allRegistrations.forEach(r => {
      const subs = r.submissions || [];
      if (subs.length === 2) bothCount++;
      else if (subs.length === 1) singleCount++;

      subs.forEach(s => {
        if (s.status === 'under_review') underReviewCount++;
        if (s.status === 'eligible') eligibleCount++;
        if (s.status === 'disqualified') disqualifiedCount++;
      });
    });

    const auditLogs = await getAuditLogs();

    return NextResponse.json({
      success: true,
      registrations: list,
      metrics: {
        total: totalCount,
        bothSubmitted: bothCount,
        singleSubmitted: singleCount,
        zeroSubmitted: totalCount - bothCount - singleCount,
        underReview: underReviewCount,
        eligible: eligibleCount,
        disqualified: disqualifiedCount,
      },
      auditLogs,
    });

  } catch (err) {
    console.error('Admin registrations API error:', err);
    return NextResponse.json({ error: 'Failed to load registrations.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Registration id is required' }, { status: 400 });
    }

    const result = await updateRegistration(id, updates);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration: result.registration });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update participant registration.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Registration id is required' }, { status: 400 });
    }

    await deleteRegistration(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete registration.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations } from '@/lib/store';
import { getAdminSession, verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const registrations = await getRegistrations();

    // Generate CSV
    const headers = [
      'Registration Code',
      'Full Name',
      'Mobile Phone',
      'Email',
      'City',
      'Instagram Handle',
      'College/Organization',
      'Main Story Reel URL',
      'Main Story Reel Status',
      'Durgi Reel URL',
      'Durgi Reel Status',
      'Registered At',
    ];

    const rows = registrations.map(r => {
      const mainSub = r.submissions?.find(s => s.videoType === 'main_story');
      const durgiSub = r.submissions?.find(s => s.videoType === 'durgi_reel');

      const sanitize = (val?: string) => `"${(val || '').replace(/"/g, '""')}"`;

      return [
        sanitize(r.registrationCode),
        sanitize(r.fullName),
        sanitize(r.normalizedPhone),
        sanitize(r.email),
        sanitize(r.city),
        sanitize(r.instagramUsername),
        sanitize(r.college || 'N/A'),
        sanitize(mainSub?.submittedUrl || 'Pending'),
        sanitize(mainSub?.status || 'Not Submitted'),
        sanitize(durgiSub?.submittedUrl || 'Pending'),
        sanitize(durgiSub?.status || 'Not Submitted'),
        sanitize(new Date(r.createdAt).toLocaleString('en-IN')),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="DRISHTI_2K26_Registrations_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });

  } catch (err) {
    console.error('CSV export error:', err);
    return new NextResponse('Error generating CSV', { status: 500 });
  }
}

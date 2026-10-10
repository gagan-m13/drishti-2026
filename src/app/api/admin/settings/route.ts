export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/store';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const settings = await getSiteSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  await saveSiteSettings(body);
  return NextResponse.json({ success: true, settings: body });
}

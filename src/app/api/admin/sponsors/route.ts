export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSponsors, saveSponsor, deleteSponsor } from '@/lib/store';
import { getAdminSession, verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const sponsors = await getSponsors();
  return NextResponse.json({ success: true, sponsors });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const sponsor = {
    ...body,
    id: body.id || `sp-${Date.now()}`,
    displayOrder: Number(body.displayOrder || 0),
    isActive: body.isActive ?? true,
  };
  await saveSponsor(sponsor);
  return NextResponse.json({ success: true, sponsor });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) await deleteSponsor(id);
  return NextResponse.json({ success: true });
}

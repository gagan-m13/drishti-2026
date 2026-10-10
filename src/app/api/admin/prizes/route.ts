export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getPrizes, savePrize, deletePrize } from '@/lib/store';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const prizes = await getPrizes();
  return NextResponse.json({ success: true, prizes });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const prize = {
    ...body,
    id: body.id || `prz-${Date.now()}`,
    rank: Number(body.rank || 1),
    displayOrder: Number(body.displayOrder || 0),
    isAnnounced: body.isAnnounced ?? true,
  };
  await savePrize(prize);
  return NextResponse.json({ success: true, prize });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) await deletePrize(id);
  return NextResponse.json({ success: true });
}

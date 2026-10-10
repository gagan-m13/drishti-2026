export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getCoordinators, saveCoordinator, deleteCoordinator } from '@/lib/store';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const coordinators = await getCoordinators();
  return NextResponse.json({ success: true, coordinators });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const coord = {
    ...body,
    id: body.id || `coord-${Date.now()}`,
    displayOrder: Number(body.displayOrder || 0),
    isActive: body.isActive ?? true,
  };
  await saveCoordinator(coord);
  return NextResponse.json({ success: true, coordinator: coord });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) await deleteCoordinator(id);
  return NextResponse.json({ success: true });
}

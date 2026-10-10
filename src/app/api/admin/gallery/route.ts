export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImages, saveGalleryImage, deleteGalleryImage } from '@/lib/store';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const gallery = await getGalleryImages();
  return NextResponse.json({ success: true, gallery });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const image = {
    ...body,
    id: body.id || `gal-${Date.now()}`,
    displayOrder: Number(body.displayOrder || 0),
    isFeatured: body.isFeatured ?? false,
    isActive: body.isActive ?? true,
  };
  await saveGalleryImage(image);
  return NextResponse.json({ success: true, image });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) await deleteGalleryImage(id);
  return NextResponse.json({ success: true });
}

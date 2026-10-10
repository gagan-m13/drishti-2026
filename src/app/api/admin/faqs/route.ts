export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getFaqs, saveFaq, deleteFaq } from '@/lib/store';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const faqs = await getFaqs();
  return NextResponse.json({ success: true, faqs });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const faq = {
    ...body,
    id: body.id || `faq-${Date.now()}`,
    displayOrder: Number(body.displayOrder || 0),
    isPublished: body.isPublished ?? true,
  };
  await saveFaq(faq);
  return NextResponse.json({ success: true, faq });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('drishti_admin_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyAdminToken(token || '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) await deleteFaq(id);
  return NextResponse.json({ success: true });
}

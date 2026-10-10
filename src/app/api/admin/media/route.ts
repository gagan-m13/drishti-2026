export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getMediaAssets, addMediaAsset, deleteMediaAsset } from '@/lib/store';
import { getAdminSession, verifyAdminToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assets = await getMediaAssets();
    return NextResponse.json({ success: true, assets });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get media assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const altText = (formData.get('altText') as string) || '';
    const caption = (formData.get('caption') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 8MB limit' }, { status: 400 });
    }

    // Validate format (jpg, png, webp)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file format. Only JPG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    const newAsset = {
      id: `media-${Date.now()}`,
      filename: file.name,
      filePath: publicUrl,
      fileSize: file.size,
      mimeType: file.type,
      altText,
      caption,
      createdAt: new Date().toISOString(),
    };

    await addMediaAsset(newAsset);

    return NextResponse.json({ success: true, asset: newAsset });
  } catch (err) {
    console.error('Media upload error:', err);
    return NextResponse.json({ error: 'Failed to upload media asset.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }

    await deleteMediaAsset(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}

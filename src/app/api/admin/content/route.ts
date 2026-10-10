export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { 
  getHeroContent, 
  saveHeroContent, 
  publishHeroDraft, 
  discardHeroDraft,
  getContentRevisions
} from '@/lib/store';
import { getAdminSession, verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('drishti_admin_token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');
    const session = token ? verifyAdminToken(token) : await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hero = await getHeroContent(false);
    const draft = await getHeroContent(true);
    const revisions = await getContentRevisions();

    return NextResponse.json({
      success: true,
      published: hero,
      draft: draft,
      hasDraft: JSON.stringify(hero) !== JSON.stringify(draft),
      revisions,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
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

    const body = await req.json();
    const { action, content } = body;

    if (action === 'save_draft') {
      await saveHeroContent(content, true);
      return NextResponse.json({ success: true, message: 'Draft saved successfully.' });
    } else if (action === 'publish') {
      if (content) {
        await saveHeroContent(content, false);
      } else {
        await publishHeroDraft();
      }
      return NextResponse.json({ success: true, message: 'Content published live to website!' });
    } else if (action === 'discard_draft') {
      await discardHeroDraft();
      return NextResponse.json({ success: true, message: 'Draft discarded.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

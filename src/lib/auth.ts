import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Durgi2026Admin!';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'drishti_admin_secret_key_kaduru_dasara_2026';

export interface AdminSession {
  role: 'super_admin' | 'content_editor' | 'registration_manager';
  username: string;
  authenticatedAt: string;
}

export function generateAdminToken(session: AdminSession): string {
  const payload = JSON.stringify(session);
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET_KEY)
    .update(payload)
    .digest('hex');
  
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    if (!token) return null;
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const { payload, signature } = decoded;

    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET_KEY)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    return JSON.parse(payload) as AdminSession;
  } catch (err) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('drishti_admin_token')?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch (err) {
    return null;
  }
}

export function validateAdminCredentials(password: string): { success: boolean; session?: AdminSession; error?: string } {
  if (password === ADMIN_PASSWORD) {
    return {
      success: true,
      session: {
        role: 'super_admin',
        username: 'Organizer Admin',
        authenticatedAt: new Date().toISOString(),
      },
    };
  }
  return { success: false, error: 'Invalid administrator password.' };
}

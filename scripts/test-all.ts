import { 
  createRegistration, 
  getRegistrationByCode, 
  getRegistrationByToken, 
  verifyParticipantAccess,
  saveVideoSubmission,
  getHeroContent,
  saveHeroContent,
  publishHeroDraft,
  getSiteSettings,
  saveSiteSettings,
  normalizePhoneNumber,
  normalizeInstagram,
  normalizeInstagramReelUrl
} from '../src/lib/store';
import { validateAdminCredentials, generateAdminToken, verifyAdminToken } from '../src/lib/auth';
import { checkRateLimit } from '../src/lib/rate-limit';
import * as fs from 'fs';
import * as path from 'path';

async function runTests() {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const dbBackup = fs.existsSync(dbPath) ? fs.readFileSync(dbPath, 'utf8') : null;
  let passed = 0;
  let failed = 0;

  try {
    console.log('====================================================');
    console.log('  DRISHTI 2K26 — AUTOMATED TEST SUITE EXECUTION');
    console.log('====================================================\n');

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Phone & Instagram Normalization Tests
  console.log('--- 1. Normalization & Input Sanitization ---');
  assert(normalizePhoneNumber('9876543210') === '9876543210', 'Standard 10-digit mobile passes');
  assert(normalizePhoneNumber('+91 98765 43210') === '9876543210', 'Handles +91 with spaces');
  assert(normalizePhoneNumber('09876543210') === '9876543210', 'Handles leading 0');
  assert(normalizeInstagram('@kiran_films') === 'kiran_films', 'Strips @ prefix from Instagram');
  assert(normalizeInstagram('https://instagram.com/kiran_films/?hl=en') === 'kiran_films', 'Extracts username from full IG profile URL');
  assert(normalizeInstagramReelUrl('https://www.instagram.com/reel/C8xyz123/?igsh=123') === 'https://www.instagram.com/reel/C8xyz123', 'Normalizes Reel URL and strips query params');

  // 2. Registration Tests
  console.log('\n--- 2. Registration System & Duplicate Prevention ---');
  const testPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testInsta = `creator_${Date.now()}`;

  const regResult = await createRegistration({
    fullName: 'Aditya Sharma',
    phone: testPhone,
    email: 'aditya@example.com',
    city: 'Kadur',
    instagramUsername: testInsta,
    college: 'Kadur Degree College',
    ageRange: '18-25',
  });

  assert(regResult.success === true, 'Valid registration succeeds');
  assert(Boolean(regResult.registration?.registrationCode.startsWith('DR26-')), 'Unique Registration ID has DR26- prefix');
  assert(Boolean(regResult.registration?.accessToken.startsWith('tok_')), 'Generated secure verified access token');

  // Test duplicate registration by phone
  const dupPhoneResult = await createRegistration({
    fullName: 'Duplicate User',
    phone: testPhone,
    email: 'dup@example.com',
    city: 'Kadur',
    instagramUsername: `other_${Date.now()}`,
  });
  assert(dupPhoneResult.success === false, 'Duplicate phone number registration is strictly rejected');

  // Test duplicate registration by Instagram handle
  const dupInstaResult = await createRegistration({
    fullName: 'Duplicate User 2',
    phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: 'dup2@example.com',
    city: 'Kadur',
    instagramUsername: testInsta,
  });
  assert(dupInstaResult.success === false, 'Duplicate Instagram handle registration is strictly rejected');

  // 3. Secure Verification & Access Recovery
  console.log('\n--- 3. Verified Access & Token Retrieval ---');
  const code = regResult.registration!.registrationCode;
  const verified = await verifyParticipantAccess(code, testPhone);
  assert(verified.success === true && verified.token === regResult.registration!.accessToken, 'Verified access recovery by ID + Phone succeeds');

  const invalidVerified = await verifyParticipantAccess(code, '9999999999');
  assert(invalidVerified.success === false, 'Mismatched Phone + Registration ID fails securely');

  // 4. Video Submissions & Independent Updating
  console.log('\n--- 4. Video Submissions Portal ---');
  const regId = regResult.registration!.id;

  // Submit Main Story Video
  const storySub = await saveVideoSubmission(
    regId,
    'main_story',
    'https://www.instagram.com/reel/C8StoryReel123/?utm_source=ig_web_copy_link'
  );
  assert(storySub.success === true, 'Main Story Video URL saved and normalized');

  // Submit Durgi Reel
  const durgiSub = await saveVideoSubmission(
    regId,
    'durgi_reel',
    'https://www.instagram.com/reel/C8DurgiReel456/'
  );
  assert(durgiSub.success === true, 'Durgi Reel URL saved');

  // Verify both submissions attached to participant
  const updatedReg = await getRegistrationByCode(code);
  assert(updatedReg?.submissions?.length === 2, 'Participant now has both (2/2) reel submissions recorded');

  // Test invalid non-Instagram URL rejection
  const invalidUrlSub = await saveVideoSubmission(regId, 'main_story', 'https://youtube.com/watch?v=123');
  assert(invalidUrlSub.success === false, 'Non-Instagram URL is rejected with error');

  // 5. Admin Authentication & Session Cryptography
  console.log('\n--- 5. Admin Security & Authentication ---');
  const validAuth = validateAdminCredentials('Durgi2026Admin!');
  assert(validAuth.success === true && validAuth.session?.role === 'super_admin', 'Admin credentials validate correctly');

  const invalidAuth = validateAdminCredentials('WrongPassword123');
  assert(invalidAuth.success === false, 'Invalid admin password rejected');

  if (validAuth.session) {
    const token = generateAdminToken(validAuth.session);
    const verifiedSession = verifyAdminToken(token);
    assert(verifiedSession?.username === validAuth.session.username, 'HMAC-signed admin session token verified');

    const tamperedToken = token.slice(0, -4) + 'abcd';
    assert(verifyAdminToken(tamperedToken) === null, 'Tampered admin token fails signature validation');
  }

  // 6. CMS Draft, Publish & Revisions
  console.log('\n--- 6. CMS Draft & Live Publishing Workflow ---');
  const originalHero = await getHeroContent(false);
  const modifiedDraft = { ...originalHero, title: 'DRISHTI 2K26 TEST DRAFT' };

  await saveHeroContent(modifiedDraft, true);
  const liveHeroBefore = await getHeroContent(false);
  const draftHero = await getHeroContent(true);
  assert(liveHeroBefore.title !== 'DRISHTI 2K26 TEST DRAFT', 'Live website content stays unchanged when saving as draft');
  assert(draftHero.title === 'DRISHTI 2K26 TEST DRAFT', 'Draft version reflects updated draft content');

  await publishHeroDraft();
  const liveHeroAfter = await getHeroContent(false);
  assert(liveHeroAfter.title === 'DRISHTI 2K26 TEST DRAFT', 'Published draft is now live on the public site');

  // Restore original
  await saveHeroContent(originalHero, false);

  // 7. Rate Limiter Validation
  console.log('\n--- 7. Rate Limiter ---');
  const testIp = 'test_ip_123';
  let allowedCount = 0;
  for (let i = 0; i < 7; i++) {
    const r = checkRateLimit(testIp, 5, 10000);
    if (r.allowed) allowedCount++;
  }
  assert(allowedCount === 5, 'Rate limiter permits exactly 5 requests and blocks further attempts');

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');

  } finally {
    if (dbBackup !== null && fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, dbBackup, 'utf8');
      console.log('  🧹 Cleaned up: Database state restored cleanly. Zero fake test records retained.');
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

import { createRegistration, getRegistrationByCode, getHeroContent, getSiteSettings } from '../src/lib/store';

async function runLoadTest() {
  console.log('====================================================');
  console.log('  DRISHTI 2K26 — 100 CONCURRENT USER LOAD SIMULATION');
  console.log('====================================================\n');

  const TOTAL_USERS = 100;
  const startTime = Date.now();
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;

  console.log(`🚀 Launching ${TOTAL_USERS} concurrent user transactions...\n`);

  const tasks = Array.from({ length: TOTAL_USERS }, async (_, index) => {
    const userStart = Date.now();
    try {
      const syntheticPhone = `91${String(10000000 + index).padStart(8, '0')}`;
      const syntheticInsta = `loadtest_creator_${Date.now()}_${index}`;

      // 1. Participant registers
      const regRes = await createRegistration({
        fullName: `Load Test Participant ${index + 1}`,
        phone: syntheticPhone,
        email: `loadtest_${index + 1}@example.com`,
        city: 'Kadur',
        instagramUsername: syntheticInsta,
        college: 'Kaduru Dasara Arts',
        ageRange: '18-25',
      });

      if (!regRes.success || !regRes.registration) {
        throw new Error(regRes.error || 'Registration failed');
      }

      // 2. Participant queries their registration by code
      const reg = await getRegistrationByCode(regRes.registration.registrationCode);
      if (!reg) {
        throw new Error('Could not retrieve created registration');
      }

      // 3. User simultaneously loads public event settings & hero
      await getHeroContent(false);
      await getSiteSettings();

      const duration = Date.now() - userStart;
      latencies.push(duration);
      successful++;
    } catch (err: any) {
      failed++;
      console.error(`User ${index + 1} failed:`, err.message);
    }
  });

  await Promise.all(tasks);

  const totalDuration = Date.now() - startTime;
  latencies.sort((a, b) => a - b);

  const p50 = latencies[Math.floor(latencies.length * 0.50)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
  const rps = ((TOTAL_USERS / totalDuration) * 1000).toFixed(1);

  console.log('====================================================');
  console.log('  LOAD TEST RESULTS & METRICS');
  console.log('====================================================');
  console.log(`  Total Concurrent Visitors: ${TOTAL_USERS}`);
  console.log(`  Successful Transactions:   ${successful} / ${TOTAL_USERS} (${((successful / TOTAL_USERS) * 100).toFixed(1)}%)`);
  console.log(`  Failed Transactions:       ${failed}`);
  console.log(`  Total Execution Time:      ${totalDuration} ms`);
  console.log(`  Throughput:                ${rps} transactions/sec`);
  console.log(`  Latency p50 (Median):      ${p50} ms`);
  console.log(`  Latency p95:               ${p95} ms`);
  console.log(`  Latency p99:               ${p99} ms`);
  console.log('====================================================\n');

  if (failed === 0 && successful === TOTAL_USERS) {
    console.log('✨ LOAD TEST PASSED: Site easily handles 100+ concurrent users with zero errors!');
  } else {
    console.error('❌ LOAD TEST FAILED');
    process.exit(1);
  }
}

runLoadTest().catch(err => {
  console.error('Fatal load test error:', err);
  process.exit(1);
});

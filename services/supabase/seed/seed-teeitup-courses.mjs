import https from 'https';

const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PROJECT = 'opzqsxrfqasqadnjdgop';

const COURSES = [
  { name: 'Soldier Hollow Golf Course (Silver)', county: 'wasatch', holes: 18, booking_platform: 'teeitup', booking_url: 'https://aspira-management-company.book-v2.teeitup.golf/?course=17072', active: true },
  { name: 'Soldier Hollow Golf Course (Gold)',   county: 'wasatch', holes: 18, booking_platform: 'teeitup', booking_url: 'https://aspira-management-company.book-v2.teeitup.golf/?course=17073', active: true },
  { name: 'Wasatch Mountain Golf Course (Lake)', county: 'wasatch', holes: 18, booking_platform: 'teeitup', booking_url: 'https://aspira-management-company.book-v2.teeitup.golf/?course=17070', active: true },
  { name: 'Wasatch Mountain Golf Course (Canyon)', county: 'wasatch', holes: 18, booking_platform: 'teeitup', booking_url: 'https://aspira-management-company.book-v2.teeitup.golf/?course=17067', active: true },
  // Round Valley (Morgan County) — previously skipped, now unblocked by migration 006
  { name: 'Round Valley Golf Course', county: 'morgan', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/round-valley-golf-course', active: true },
];

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: `${PROJECT}.supabase.co`,
      path: `/rest/v1/${path}`,
      method,
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const r = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${d}`));
        else resolve(JSON.parse(d || '[]'));
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

const existing = await req('GET', 'courses?select=booking_url', null);
const existingUrls = new Set(existing.map(c => c.booking_url));
const toInsert = COURSES.filter(c => !existingUrls.has(c.booking_url));

console.log(`${existing.length} existing | ${toInsert.length} to insert`);
if (!toInsert.length) { console.log('Nothing to insert.'); process.exit(0); }

const inserted = await req('POST', 'courses', toInsert);
for (const c of inserted) console.log(`  ✓ ${c.name} (${c.id})`);

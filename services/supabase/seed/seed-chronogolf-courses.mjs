/**
 * seed-chronogolf-courses.mjs
 * Seeds 9 Chronogolf courses into the Supabase `courses` table.
 * Run with: node seed-chronogolf-courses.mjs
 */
import https from 'https';

const SUPABASE_PROJECT = 'opzqsxrfqasqadnjdgop';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY env var');
  process.exit(1);
}

const CHRONOGOLF_COURSES = [
  { name: 'Mountain Dell Golf Course (Lake)',   county: 'salt_lake', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/mountain-dell-golf-club',        active: true },
  { name: 'Mountain Dell Golf Course (Canyon)', county: 'salt_lake', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/mountain-dell-golf-club#canyon', active: true },
  { name: 'Forest Dale Golf Course',            county: 'salt_lake', holes: 9,  booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/forest-dale-golf-course',        active: true },
  { name: 'Glendale Golf Course',               county: 'salt_lake', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/glendale-golf-course',           active: true },
  { name: 'Bonneville Golf Course',             county: 'salt_lake', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/bonneville-golf-course',         active: true },
  { name: 'Nibley Park Golf Course',            county: 'salt_lake', holes: 9,  booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/nibley-park-golf-course',        active: true },
  { name: 'Rose Park Golf Course',              county: 'salt_lake', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/rose-park-golf-course',          active: true },
  { name: 'River Oaks Golf Course',             county: 'salt_lake', holes: 18, booking_platform: 'chronogolf', booking_url: 'https://www.chronogolf.com/club/river-oaks-golf-course-utah',    active: true },
  // Round Valley (Morgan County) skipped — 'morgan' not in county CHECK constraint; add migration first

];

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: `${SUPABASE_PROJECT}.supabase.co`,
      path: `/rest/v1/${path}`,
      method,
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    };
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data || '[]'));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  // First check which courses already exist by booking_url
  const existingRaw = await supabaseRequest('GET', 'courses?select=name,booking_url', null);
  const existingUrls = new Set(existingRaw.map(c => c.booking_url));
  
  const toInsert = CHRONOGOLF_COURSES.filter(c => !existingUrls.has(c.booking_url));
  console.log(`Found ${existingRaw.length} existing courses, ${toInsert.length} to insert`);

  if (toInsert.length === 0) {
    console.log('Nothing to insert — all courses already in DB.');
    return;
  }

  const inserted = await supabaseRequest('POST', 'courses', toInsert);
  console.log(`Inserted ${inserted.length} courses:`);
  for (const c of inserted) {
    console.log(`  ✓ ${c.name} (${c.id})`);
  }
}

run().catch(err => { console.error(err); process.exit(1); });

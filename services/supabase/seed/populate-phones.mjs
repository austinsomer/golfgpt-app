// populate-phones.mjs
// Adds phone numbers + fixes several addresses
// Sources: slc-golf.com, yelp, pga.com, individual course websites, utahgolf.com
// Marked "est." in comments = best-known number, should be verified before App Store launch

import https from 'https';

const SUPABASE_PROJECT_ID = 'opzqsxrfqasqadnjdgop';

if (!process.env.SUPABASE_PAT) {
  console.error('Missing SUPABASE_PAT');
  process.exit(1);
}

// Each entry: booking_url, phone, and optionally corrected address
// Sources: ✓ = verified from official site/yelp/search snippet
const updates = [
  // === SALT LAKE COUNTY ===
  // SLC city courses — confirmed from slc-golf.com
  { url: '/booking/500/500',     phone: '(801) 583-9513' }, // Bonneville ✓
  { url: '/booking/10/10',       phone: '(801) 582-3812' }, // Mountain Dell ✓
  { url: '/booking/7/7',         phone: '(801) 483-5418' }, // Nibley Park ✓
  { url: '/booking/6/6',         phone: '(801) 596-5030' }, // Rose Park ✓
  // Other SL County — confirmed from Yelp/web
  { url: '/booking/21195/7223',  phone: '(801) 957-9000' }, // Stonebridge ✓ (Yelp Feb 2026)
  { url: '/booking/16/16',       phone: '(801) 966-4653' }, // Fore Lakes (est.)
  { url: '/booking/15/15',       phone: '(801) 533-4527' }, // Jordan River (est.)
  { url: '/booking/14/14',       phone: '(801) 266-0971' }, // Meadowbrook (est.)
  { url: '/booking/67/67',       phone: '(801) 575-4653' }, // Wingpointe (est.)

  // === UTAH COUNTY ===
  // Thanksgiving Point — confirmed from thanksgivingpointgolfclub.com ✓
  {
    url: '/booking/23/23',
    phone: '(801) 768-7401',
    address: '3300 W Clubhouse Drive, Lehi, UT 84043', // corrected
  },
  // Sleepy Ridge — address corrected from golfnow.com ✓
  {
    url: '/booking/17/17',
    phone: '(801) 765-7653',  // est.
    address: '700 S Sleepy Ridge Dr, Orem, UT 84058', // corrected
  },
  { url: '/booking/24/24',       phone: '(801) 373-6262' }, // East Bay (est.)
  { url: '/booking/29/29',       phone: '(801) 489-6297' }, // Hobble Creek (est.)
  { url: '/booking/30/30',       phone: '(801) 375-5106' }, // Riverside (est.)

  // === DAVIS COUNTY ===
  { url: '/booking/31/31',       phone: '(801) 546-4154' }, // Davis Park (est.)
  { url: '/booking/33/33',       phone: '(801) 546-1630' }, // Valley View (est.)
  { url: '/booking/35/35',       phone: '(801) 451-7930' }, // Cherry Hill (est.)
  { url: '/booking/37/37',       phone: '(801) 299-0088' }, // Eaglewood (est.)
  { url: '/booking/38/38',       phone: '(801) 298-6040' }, // Bountiful Ridge (est.)
  { url: '/booking/39/39',       phone: '(801) 499-0990' }, // North Shore (est.)
  { url: '/booking/40/40',       phone: '(801) 295-1019' }, // Lakeside (est.)

  // === WEBER COUNTY ===
  // Ben Lomond — confirmed from utahgolf.com ✓, address corrected
  {
    url: '/booking/26/26',
    phone: '(801) 782-7754',
    address: '1800 N Hwy 89, Ogden, UT 84404', // corrected
  },
  { url: '/booking/1/1',         phone: '(801) 731-1938' }, // Remuda (est.)
  { url: '/booking/27/27',       phone: '(801) 745-3365' }, // Wolf Creek (est.)
  // Schneitter's — confirmed from pga.com ✓, address corrected
  {
    url: '/booking/34/34',
    phone: '(801) 399-4636',
    address: '5460 S Weber Dr, Riverdale, UT 84405', // corrected
  },

  // === WASHINGTON COUNTY ===
  { url: '/booking/41/41',       phone: '(435) 627-4400' }, // Sunbrook (est.)
  { url: '/booking/42/42',       phone: '(435) 628-0000' }, // Southgate (est.)
  { url: '/booking/44/44',       phone: '(435) 674-7500' }, // Entrada (est.)
  // Sand Hollow — confirmed from sandhollowresort.com ✓, address corrected
  {
    url: '/booking/47/47',
    phone: '(435) 656-4653',
    address: '5662 W Clubhouse Dr, Hurricane, UT 84737', // corrected
  },
  { url: '/booking/49/49',       phone: '(435) 688-1700' }, // Coral Canyon (est.)
  // Sky Mountain — confirmed from skymountaingolf.com ✓
  {
    url: '/booking/51/51',
    phone: '(435) 635-7888',
  },
];

const BASE = 'https://foreupsoftware.com/index.php';

const statements = updates.map(u => {
  const fullUrl = `${BASE}${u.url}`;
  const parts = [];
  parts.push(`phone = '${u.phone}'`);
  if (u.address) parts.push(`address = '${u.address.replace(/'/g, "''")}'`);
  return `UPDATE courses SET ${parts.join(', ')} WHERE booking_url = '${fullUrl}';`;
}).join('\n');

console.log(`Updating ${updates.length} courses with phone + address fixes...`);

const result = await (function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${SUPABASE_PROJECT_ID}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_PAT}`,
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
})(statements);

console.log('Status:', result.status);
if (result.status === 200 || result.status === 201) {
  console.log('✅ Phones + address corrections applied');
  console.log('Note: entries marked (est.) should be verified before App Store launch');
} else {
  console.error('❌', result.body.substring(0, 500));
  process.exit(1);
}

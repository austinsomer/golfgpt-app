// populate-course-details.mjs
// Populates par, address, and course_length_yards for all 31 courses
// Matches on booking_url (unique constraint exists from migration 002)

import https from 'https';

const SUPABASE_PROJECT_ID = 'opzqsxrfqasqadnjdgop';

if (!process.env.SUPABASE_PAT) {
  console.error('Missing SUPABASE_PAT');
  process.exit(1);
}

// Match on booking_url (unique, stable identifier)
const courseDetails = [
  { booking_url: 'https://foreupsoftware.com/index.php/booking/21195/7223', par: 71, course_length_yards: 6747, address: '4415 Links Dr, West Valley City, UT 84120' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/1/1',       par: 71, course_length_yards: 6189, address: '2703 Ogden Ave, Ogden, UT 84401' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/500/500',   par: 72, course_length_yards: 6822, address: '954 Connor St, Salt Lake City, UT 84108' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/6/6',       par: 34, course_length_yards: 2941, address: '1386 N Redwood Rd, Salt Lake City, UT 84116' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/7/7',       par: 70, course_length_yards: 5801, address: '2730 S 700 E, Salt Lake City, UT 84106' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/10/10',     par: 71, course_length_yards: 6787, address: '3300 E Lincoln Hwy, Salt Lake City, UT 84109' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/14/14',     par: 72, course_length_yards: 6801, address: '4197 S 1300 W, Taylorsville, UT 84123' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/15/15',     par: 71, course_length_yards: 5720, address: '1200 N Redwood Rd, Salt Lake City, UT 84116' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/16/16',     par: 72, course_length_yards: 6502, address: '3800 W California Ave, Salt Lake City, UT 84104' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/17/17',     par: 72, course_length_yards: 7004, address: '1613 W 800 N, Orem, UT 84057' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/23/23',     par: 72, course_length_yards: 7434, address: '3300 N Thanksgiving Way, Lehi, UT 84043' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/24/24',     par: 72, course_length_yards: 6814, address: '1860 S East Bay Blvd, Provo, UT 84606' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/26/26',     par: 71, course_length_yards: 6404, address: '1800 N Ogden Ave, Ogden, UT 84404' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/27/27',     par: 72, course_length_yards: 7111, address: '3900 N Wolf Creek Dr, Eden, UT 84310' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/29/29',     par: 71, course_length_yards: 6694, address: '777 E Hobble Creek Canyon Rd, Springville, UT 84663' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/30/30',     par: 72, course_length_yards: 6608, address: '1000 N University Ave, Provo, UT 84604' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/34/34',     par: 36, course_length_yards: 3145, address: '4045 S Washington Blvd, Ogden, UT 84403' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/31/31',     par: 71, course_length_yards: 6521, address: '1074 E Nicklaus Dr, Fruit Heights, UT 84037' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/33/33',     par: 72, course_length_yards: 7176, address: '2510 E Gentile St, Layton, UT 84040' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/35/35',     par: 71, course_length_yards: 6311, address: '1325 S Main St, Kaysville, UT 84037' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/37/37',     par: 71, course_length_yards: 6802, address: '1110 E Eaglewood Dr, North Salt Lake, UT 84054' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/38/38',     par: 71, course_length_yards: 6310, address: '2430 S Bountiful Blvd, Bountiful, UT 84010' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/39/39',     par: 72, course_length_yards: 6988, address: '1710 N Tumwater Dr, Layton, UT 84041' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/40/40',     par: 72, course_length_yards: 6875, address: '1201 N 1075 W, West Bountiful, UT 84087' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/41/41',     par: 72, course_length_yards: 6824, address: '2366 W Sunbrook Dr, St. George, UT 84770' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/42/42',     par: 70, course_length_yards: 5884, address: '975 S Tonaquint Dr, St. George, UT 84770' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/44/44',     par: 72, course_length_yards: 7261, address: '2511 W Entrada Trail, St. George, UT 84770' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/47/47',     par: 71, course_length_yards: 7112, address: '3955 W Clubhouse Dr, Hurricane, UT 84737' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/49/49',     par: 72, course_length_yards: 7078, address: '1925 N Canyon Greens Dr, Washington, UT 84780' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/51/51',     par: 72, course_length_yards: 6706, address: '1030 N 2600 W, Hurricane, UT 84737' },
  { booking_url: 'https://foreupsoftware.com/index.php/booking/67/67',     par: 72, course_length_yards: 7103, address: '3602 W 1100 N, Salt Lake City, UT 84122' },
];

const migrationSQL = `ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_length_yards integer;`;

const updateStatements = courseDetails.map(c =>
  `UPDATE courses SET par = ${c.par}, address = '${c.address.replace(/'/g, "''")}', course_length_yards = ${c.course_length_yards} WHERE booking_url = '${c.booking_url}';`
).join('\n');

const sql = `${migrationSQL}\n\n${updateStatements}`;

console.log(`Running migration + ${courseDetails.length} UPDATE statements...`);

function execSQL(sql) {
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const result = await execSQL(sql);
console.log('Status:', result.status);
const responseBody = result.body.substring(0, 1000);
console.log('Response:', responseBody);

if (result.status === 200 || result.status === 201) {
  console.log(`\n✅ Done — par, address, course_length_yards populated for ${courseDetails.length} courses`);
} else {
  console.error('\n❌ Failed — check response above');
  process.exit(1);
}

import https from 'https';

const PAT = process.env.SUPABASE_PAT;
const sql = `
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_booking_platform_check;
ALTER TABLE courses ADD CONSTRAINT courses_booking_platform_check CHECK (
  booking_platform = ANY (ARRAY[
    'foreup','lightspeed','chronogolf','ezlinks','teeup','teeitup','custom','unknown'
  ]::text[])
);
`;

const body = JSON.stringify({ query: sql });
const opts = {
  hostname: 'api.supabase.com',
  path: '/v1/projects/opzqsxrfqasqadnjdgop/database/query',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PAT}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(opts, (res) => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', () => console.log(res.statusCode, d));
});
req.write(body); req.end();

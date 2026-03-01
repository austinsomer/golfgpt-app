import https from 'https';

const PAT = process.env.SUPABASE_PAT;
const sql = `
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_county_check;
ALTER TABLE courses ADD CONSTRAINT courses_county_check CHECK (
  county = ANY (ARRAY[
    'salt_lake','utah','summit','washington','weber','davis',
    'cache','box_elder','tooele','iron','kane','wasatch','morgan'
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
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log(res.statusCode, d));
});
req.write(body);
req.end();

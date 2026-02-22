#!/usr/bin/env node
/**
 * Seed the Supabase `courses` table from the scraper's course catalog.
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node seed-courses.mjs
 *
 * Or with .env:
 *   node --env-file=../../.env seed-courses.mjs
 *
 * Source of truth: services/scraper/data/courses.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Load course catalog from scraper config
const coursesPath = resolve(__dirname, '../../scraper/data/courses.json');
let rawCourses;
try {
  rawCourses = JSON.parse(readFileSync(coursesPath, 'utf-8'));
} catch (err) {
  console.error(`Could not read courses.json at ${coursesPath}:`, err.message);
  process.exit(1);
}

// Map scraper schema → Supabase schema
const rows = rawCourses.map((c) => ({
  name: c.name,
  county: c.county,
  address: c.address ?? null,
  lat: c.lat ?? null,
  lng: c.lng ?? null,
  holes: c.holes ?? 18,
  par: c.par ?? null,
  website_url: c.website_url ?? null,
  booking_url: c.booking_url ?? null,
  booking_platform: c.platform ?? 'foreup',
  phone: c.phone ?? null,
  description: c.description ?? null,
  active: c.verified !== false, // mark unverified courses as inactive
}));

console.log(`Seeding ${rows.length} course(s)...`);

const { data, error } = await supabase
  .from('courses')
  .upsert(rows, { onConflict: 'name' })
  .select('id, name, active');

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log('Seeded:');
data.forEach((c) => console.log(`  [${c.active ? '✅' : '⚠️ inactive'}] ${c.name} (id: ${c.id})`));
console.log('Done.');

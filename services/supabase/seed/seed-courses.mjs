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

// Normalize county string to schema enum value (e.g. "Salt Lake" → "salt_lake")
function toCountyEnum(county) {
  return county.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
}

// Map scraper schema (camelCase) → Supabase schema (snake_case)
const rows = rawCourses.map((c) => ({
  name: c.name,
  county: toCountyEnum(c.county),
  address: c.address ?? null,
  lat: c.lat ?? null,
  lng: c.lng ?? null,
  holes: c.holes ?? 18,
  par: c.par ?? null,
  website_url: c.websiteUrl ?? c.website_url ?? null,
  booking_url: c.bookingUrl ?? c.booking_url ?? null,
  booking_platform: c.platform ?? 'foreup',
  phone: c.phone ?? null,
  description: c.description ?? null,
  active: c.verified !== false, // mark unverified courses as inactive
}));

// Migration 003 applied — all Utah counties now supported
const seedRows = rows;
const skipped = [];

console.log(`Seeding ${seedRows.length} course(s)...`);

// Note: upsert requires a unique constraint on booking_url (migration 002).
// If that migration hasn't been applied yet, this falls back to plain insert.
let data, error;
({ data, error } = await supabase
  .from('courses')
  .upsert(seedRows, { onConflict: 'booking_url' })
  .select('id, name, active'));

// Fallback: if upsert fails (no unique constraint yet), try plain insert
if (error && error.message.includes('no unique or exclusion constraint')) {
  console.warn('No unique constraint on booking_url — falling back to plain insert.');
  console.warn('Apply migration 002_courses_unique_booking_url.sql in Supabase Studio for future upserts.');
  ({ data, error } = await supabase
    .from('courses')
    .insert(seedRows)
    .select('id, name, active'));
}

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log('Seeded:');
data.forEach((c) => console.log(`  [${c.active ? '✅' : '⚠️ inactive'}] ${c.name} (id: ${c.id})`));
console.log('Done.');

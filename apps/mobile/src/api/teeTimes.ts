import { supabase } from '../lib/supabase';
import { TeeTimeRow, Course, County, COUNTY_DISPLAY } from '../lib/database.types';

export interface TeeTimeSearchParams {
  date: string;        // ISO date string YYYY-MM-DD
  players?: number;    // min players available
  county?: string;     // display name or slug — null/undefined/'All' = all counties
  maxPrice?: number;
  timeFrom?: string;   // 'HH:MM' 24hr
  timeTo?: string;     // 'HH:MM' 24hr
}

export interface TeeTimeResult {
  teeTime: TeeTimeRow;
  course: Pick<Course, 'id' | 'name' | 'county' | 'booking_url' | 'holes'>;
}

/** Format a price decimal as a display string: 70 → '$70' */
export function formatPrice(price: number | null): string {
  if (price == null) return 'N/A';
  return `$${Math.round(price)}`;
}

/**
 * Return the UTC offset in hours for Mountain Time at a given UTC timestamp.
 * MDT (summer, UTC-6): 2nd Sunday in March 2am local → 1st Sunday in November 2am local.
 * MST (winter, UTC-7): all other times.
 *
 * We compute this manually to avoid Hermes Intl.DateTimeFormat timeZone limitations.
 */
function getMtnOffsetHours(utcMs: number): number {
  const d = new Date(utcMs);
  const year = d.getUTCFullYear();

  // nth Sunday of a given month (0=Jan, 2=Mar, 10=Nov), returns UTC ms at midnight
  function nthSunday(month: number, nth: number): number {
    const day = new Date(Date.UTC(year, month, 1));
    let count = 0;
    while (day.getUTCMonth() === month) {
      if (day.getUTCDay() === 0) {
        count++;
        if (count === nth) return day.getTime();
      }
      day.setUTCDate(day.getUTCDate() + 1);
    }
    return day.getTime();
  }

  // 2nd Sunday of March at 2:00 AM MST = 09:00 UTC
  const dstStart = nthSunday(2, 2) + 9 * 3600000;
  // 1st Sunday of November at 2:00 AM MDT = 08:00 UTC
  const dstEnd = nthSunday(10, 1) + 8 * 3600000;

  return utcMs >= dstStart && utcMs < dstEnd ? -6 : -7;
}

/**
 * Convert a UTC ms timestamp to a Mountain Time HH:MM string (24h, zero-padded).
 * Used for time-of-day filtering.
 */
function toMtnTimeStr(utcMs: number): string {
  const offset = getMtnOffsetHours(utcMs);
  const mtnMs = utcMs + offset * 3600000;
  const d = new Date(mtnMs);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Format a tee time datetime string to a human-readable Mountain Time string.
 * Example: '2026-02-23T13:32:00.000Z' → '6:32 AM'
 *
 * Uses manual DST-aware offset instead of Intl timeZone option (Hermes compat).
 */
export function formatTeeTime(datetime: string): string {
  const utcMs = new Date(datetime).getTime();
  const offset = getMtnOffsetHours(utcMs);
  const mtnMs = utcMs + offset * 3600000;
  const d = new Date(mtnMs);
  const hUtc = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hUtc >= 12 ? 'PM' : 'AM';
  const h = hUtc % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Resolve a county display name or slug to a DB slug (County).
 * 'St. George' → 'washington', 'Salt Lake' → 'salt_lake', etc.
 */
function toCountySlug(input: string): County | null {
  if (!input || input === 'All' || input === 'ALL') return null;
  // Already a slug?
  const knownSlugs = Object.keys(COUNTY_DISPLAY) as County[];
  if (knownSlugs.includes(input as County)) return input as County;
  // Match by display name (case-insensitive)
  const entry = Object.entries(COUNTY_DISPLAY).find(
    ([, display]) => display.toLowerCase() === input.toLowerCase(),
  );
  return entry ? (entry[0] as County) : null;
}

/**
 * Search available (non-expired) tee times with filters.
 */
export async function searchTeeTimes(
  params: TeeTimeSearchParams,
): Promise<TeeTimeResult[]> {
  const { date, players = 1, county, maxPrice, timeFrom, timeTo } = params;

  // Build day bounds in Mountain Time — use -07:00 (MST); scraper stores UTC correctly
  const dayStart = `${date}T00:00:00-07:00`;
  const dayEnd = `${date}T23:59:59-07:00`;

  // Resolve county to DB slug before building query
  const countySlug = county ? toCountySlug(county) : null;

  let query = supabase
    .from('tee_times')
    .select(
      `*, course:courses!inner(id, name, county, booking_url, holes)`,
    )
    .gte('datetime', dayStart)
    .lte('datetime', dayEnd)
    .gt('expires_at', new Date().toISOString())
    .gte('players_available', players)
    .order('datetime', { ascending: true });

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  // Push county filter to the DB — avoids client-side slug resolution issues
  if (countySlug) {
    query = (query as any).eq('courses.county', countySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[searchTeeTimes] Supabase error:', error.message);
    throw new Error(error.message);
  }

  if (!data) return [];

  type RawRow = TeeTimeRow & { course: TeeTimeResult['course'] };

  return (data as RawRow[])
    .filter((row) => {
      // Belt-and-suspenders county check (catches any PostgREST edge cases)
      if (countySlug && row.course?.county !== countySlug) return false;

      // Time-of-day filter using manual Mountain Time conversion (Hermes safe)
      if (timeFrom || timeTo) {
        const localTime = toMtnTimeStr(new Date(row.datetime).getTime());
        if (timeFrom && localTime < timeFrom) return false;
        if (timeTo && localTime > timeTo) return false;
      }

      return true;
    })
    .map((row) => ({ teeTime: row, course: row.course }));
}

/**
 * Get upcoming tee times across all courses (homepage / no-filter state).
 */
export async function getUpcomingTeeTimes(limit = 20): Promise<TeeTimeResult[]> {
  const { data, error } = await supabase
    .from('tee_times')
    .select(`*, course:courses!inner(id, name, county, booking_url, holes)`)
    .gt('datetime', new Date().toISOString())
    .gt('expires_at', new Date().toISOString())
    .order('datetime', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[getUpcomingTeeTimes] Supabase error:', error.message);
    throw new Error(error.message);
  }

  type RawRow = TeeTimeRow & { course: TeeTimeResult['course'] };
  return ((data ?? []) as RawRow[]).map((row) => ({ teeTime: row, course: row.course }));
}

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

/** Format a tee time datetime string to a human-readable time: '2026-02-23T16:03:00+00:00' → '9:03 AM' */
export function formatTeeTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Denver',
  });
}

/**
 * Search available (non-expired) tee times with filters.
 */
export async function searchTeeTimes(
  params: TeeTimeSearchParams,
): Promise<TeeTimeResult[]> {
  const { date, players = 1, county, maxPrice, timeFrom, timeTo } = params;

  const dayStart = `${date}T00:00:00-07:00`; // Mountain Time
  const dayEnd = `${date}T23:59:59-07:00`;

  let query = supabase
    .from('tee_times')
    .select(
      `*, course:courses(id, name, county, booking_url, holes)`,
    )
    .gte('datetime', dayStart)
    .lte('datetime', dayEnd)
    .gt('expires_at', new Date().toISOString())
    .gte('players_available', players)
    .order('datetime', { ascending: true });

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
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
      // County filter — compare by slug
      if (county && county !== 'All' && county !== 'ALL') {
        const wantedSlug = toCountySlug(county);
        if (wantedSlug && row.course?.county !== wantedSlug) return false;
      }
      // Time-of-day filter (Mountain Time)
      if (timeFrom || timeTo) {
        const localTime = new Date(row.datetime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/Denver',
        });
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
    .select(`*, course:courses(id, name, county, booking_url, holes)`)
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

function toCountySlug(input: string): County | null {
  const normalized = input.toLowerCase().replace(/\s+/g, '_');
  const knownSlugs = Object.keys(COUNTY_DISPLAY) as County[];
  if (knownSlugs.includes(normalized as County)) return normalized as County;
  const entry = Object.entries(COUNTY_DISPLAY).find(
    ([, display]) => display.toLowerCase() === input.toLowerCase(),
  );
  return entry ? (entry[0] as County) : null;
}

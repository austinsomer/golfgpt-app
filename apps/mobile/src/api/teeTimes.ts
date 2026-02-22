import { supabase } from '../lib/supabase';
import { TeeTimeRow, Course } from '../lib/database.types';

export interface TeeTimeSearchParams {
  date: string;        // ISO date string YYYY-MM-DD
  players?: number;    // minimum players available
  county?: string;     // filter by county name (null/undefined = all)
  maxPrice?: number;   // max price in dollars
  timeFrom?: string;   // HH:MM (24hr) — earliest tee time
  timeTo?: string;     // HH:MM (24hr) — latest tee time
}

export interface TeeTimeResult {
  teeTime: TeeTimeRow;
  course: Pick<Course, 'id' | 'name' | 'county' | 'booking_url' | 'holes'>;
}

/**
 * Search available tee times with filters.
 * Returns non-expired slots joined with course info.
 */
export async function searchTeeTimes(
  params: TeeTimeSearchParams,
): Promise<TeeTimeResult[]> {
  const { date, players = 1, county, maxPrice, timeFrom, timeTo } = params;

  // Date range: full day requested
  const dayStart = `${date}T00:00:00`;
  const dayEnd = `${date}T23:59:59`;

  let query = supabase
    .from('tee_times')
    .select(
      `
      *,
      course:courses (
        id, name, county, booking_url, holes
      )
    `,
    )
    .gte('datetime', dayStart)
    .lte('datetime', dayEnd)
    .gt('expires_at', new Date().toISOString())
    .order('datetime', { ascending: true });

  if (players) {
    query = query.gte('players_available', players);
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[searchTeeTimes] Supabase error:', error.message);
    throw new Error(error.message);
  }

  if (!data) return [];

  // Filter by county and time range in-memory (Supabase can't join-filter easily)
  return (data as (TeeTimeRow & { course: TeeTimeResult['course'] })[])
    .filter((row) => {
      if (county && row.course?.county?.toLowerCase() !== county.toLowerCase()) {
        return false;
      }
      if (timeFrom || timeTo) {
        const timeStr = row.datetime.split('T')[1]?.substring(0, 5); // HH:MM
        if (timeFrom && timeStr < timeFrom) return false;
        if (timeTo && timeStr > timeTo) return false;
      }
      return true;
    })
    .map((row) => ({
      teeTime: row,
      course: row.course,
    }));
}

/**
 * Get the most recent tee times for display (homepage / recent activity).
 */
export async function getRecentTeeTimes(limit = 20): Promise<TeeTimeResult[]> {
  const { data, error } = await supabase
    .from('tee_times')
    .select(
      `
      *,
      course:courses (
        id, name, county, booking_url, holes
      )
    `,
    )
    .gt('expires_at', new Date().toISOString())
    .order('datetime', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[getRecentTeeTimes] Supabase error:', error.message);
    throw new Error(error.message);
  }

  return ((data ?? []) as (TeeTimeRow & { course: TeeTimeResult['course'] })[]).map(
    (row) => ({ teeTime: row, course: row.course }),
  );
}

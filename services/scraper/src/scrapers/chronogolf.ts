import { Course, ChronogolfResponse, TeeTime } from '../types';

const BASE_URL = 'https://www.chronogolf.com/marketplace/v2';

/**
 * Returns true if the given UTC date falls within Mountain Daylight Time.
 * MDT: 2nd Sunday of March 02:00 → 1st Sunday of November 02:00
 */
function isMDT(utcDate: Date): boolean {
  const year = utcDate.getUTCFullYear();

  const mar1Day = new Date(Date.UTC(year, 2, 1)).getUTCDay();
  const dstStartDay = mar1Day === 0 ? 8 : 8 + (7 - mar1Day);
  const dstStart = new Date(Date.UTC(year, 2, dstStartDay, 9, 0, 0)); // 02:00 MST = 09:00 UTC

  const nov1Day = new Date(Date.UTC(year, 10, 1)).getUTCDay();
  const dstEndDay = nov1Day === 0 ? 1 : 8 - nov1Day;
  const dstEnd = new Date(Date.UTC(year, 10, dstEndDay, 8, 0, 0)); // 02:00 MDT = 08:00 UTC

  return utcDate >= dstStart && utcDate < dstEnd;
}

/**
 * Chronogolf returns local Mountain Time strings like "07:30" with a separate date "2026-03-07".
 * Convert to UTC ISO string with correct DST offset.
 */
function mountainToISO(date: string, time: string): string {
  const localStr = `${date}T${time}:00`;
  const approxUTC = new Date(localStr + 'Z');
  const offset = isMDT(approxUTC) ? '-06:00' : '-07:00';
  return new Date(localStr + offset).toISOString();
}

/**
 * Resolve Chronogolf course IDs for a given club slug.
 * Returns an array of numeric course IDs.
 */
export async function fetchCourseIds(slug: string): Promise<number[]> {
  try {
    const res = await fetch(`${BASE_URL}/clubs/${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TheLoop/1.0)' },
    });
    if (!res.ok) {
      console.error(`[chronogolf] clubs/${slug} returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    const courses: Array<{ id: number }> = data?.courses ?? [];
    return courses.map((c) => c.id);
  } catch (err) {
    console.error(`[chronogolf] Error fetching club ${slug}:`, err);
    return [];
  }
}

/**
 * Fetch tee times for a Chronogolf course on a given date (YYYY-MM-DD).
 */
export async function fetchTeeTimes(course: Course, date: string): Promise<TeeTime[]> {
  if (!course.courseIds || course.courseIds.length === 0) {
    console.warn(`[chronogolf] ${course.name} has no courseIds — skipping`);
    return [];
  }

  const params = new URLSearchParams({
    start_date: date,
    course_ids: course.courseIds.join(','),
    holes: course.holes.toString(),
    free_slots: '1',
  });

  try {
    const res = await fetch(`${BASE_URL}/teetimes?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TheLoop/1.0)',
      },
    });

    if (!res.ok) {
      console.error(`[chronogolf] ${course.name} ${date} returned ${res.status}`);
      return [];
    }

    const data: ChronogolfResponse = await res.json();

    if (!Array.isArray(data?.teetimes)) {
      console.error(`[chronogolf] Unexpected response for ${course.name}:`, data);
      return [];
    }

    return data.teetimes
      .filter((slot) => slot.status === 'published' && slot.available_players > 0)
      .map((slot) => ({
        courseId: course.id,
        time: mountainToISO(slot.start_date, slot.start_time),
        holes: course.holes,
        players: slot.available_players,
        priceUsd: slot.price_per_player ?? null,
      }));
  } catch (err) {
    console.error(`[chronogolf] Error fetching ${course.name} ${date}:`, err);
    return [];
  }
}

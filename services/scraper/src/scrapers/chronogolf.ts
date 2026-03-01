import { TeeTime } from '../types';

const BASE_URL = 'https://www.chronogolf.com/marketplace/v2/teetimes';

/**
 * Chronogolf course config (separate from ForeUp courses.json).
 * course_ids are the sub-course numeric IDs from /marketplace/v2/clubs/{slug}.
 */
export interface ChronogolfCourse {
  id: string;          // our internal ID
  name: string;
  city: string;
  county: string;
  slug: string;        // chronogolf club slug
  courseIds: number[]; // sub-course IDs (Gold, Lake, Canyon, etc.)
  bookingUrl: string;
  holes: number;
}

export const CHRONOGOLF_COURSES: ChronogolfCourse[] = [
  {
    id: 'cg-mountain-dell-lake',
    name: 'Mountain Dell Golf Course (Lake)',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'mountain-dell-golf-club',
    courseIds: [16291],
    bookingUrl: 'https://www.chronogolf.com/club/mountain-dell-golf-club',
    holes: 18,
  },
  {
    id: 'cg-mountain-dell-canyon',
    name: 'Mountain Dell Golf Course (Canyon)',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'mountain-dell-golf-club',
    courseIds: [16290],
    bookingUrl: 'https://www.chronogolf.com/club/mountain-dell-golf-club',
    holes: 18,
  },
  {
    id: 'cg-forest-dale',
    name: 'Forest Dale Golf Course',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'forest-dale-golf-course',
    courseIds: [], // populated on first run via API
    bookingUrl: 'https://www.chronogolf.com/club/forest-dale-golf-course',
    holes: 9,
  },
  {
    id: 'cg-glendale',
    name: 'Glendale Golf Course',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'glendale-golf-course',
    courseIds: [],
    bookingUrl: 'https://www.chronogolf.com/club/glendale-golf-course',
    holes: 18,
  },
  {
    id: 'cg-bonneville',
    name: 'Bonneville Golf Course',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'bonneville-golf-course',
    courseIds: [],
    bookingUrl: 'https://www.chronogolf.com/club/bonneville-golf-course',
    holes: 18,
  },
  {
    id: 'cg-nibley-park',
    name: 'Nibley Park Golf Course',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'nibley-park-golf-course',
    courseIds: [],
    bookingUrl: 'https://www.chronogolf.com/club/nibley-park-golf-course',
    holes: 9,
  },
  {
    id: 'cg-rose-park',
    name: 'Rose Park Golf Course',
    city: 'Salt Lake City',
    county: 'Salt Lake',
    slug: 'rose-park-golf-course',
    courseIds: [],
    bookingUrl: 'https://www.chronogolf.com/club/rose-park-golf-course',
    holes: 18,
  },
  {
    id: 'cg-river-oaks',
    name: 'River Oaks Golf Course',
    city: 'Sandy',
    county: 'Salt Lake',
    slug: 'river-oaks-golf-course-utah',
    courseIds: [],
    bookingUrl: 'https://www.chronogolf.com/club/river-oaks-golf-course-utah',
    holes: 18,
  },
  {
    id: 'cg-round-valley',
    name: 'Round Valley Golf Course',
    city: 'Morgan',
    county: 'Morgan',
    slug: 'round-valley-golf-course',
    courseIds: [],
    bookingUrl: 'https://www.chronogolf.com/club/round-valley-golf-course',
    holes: 18,
  },
];

interface ChronogolfTeeTime {
  uuid: string;
  start_time: string; // 'HH:MM'
  start_date: string; // 'YYYY-MM-DD'
  price_per_player: number | null;
  available_players: number;
  holes: number;
  status: string;
}

interface ChronogolfResponse {
  status: 'open' | 'closed' | 'off_season' | string;
  teetimes: ChronogolfTeeTime[];
}

/**
 * Resolve course IDs from the Chronogolf club API if not hardcoded.
 */
async function resolveCourseIds(slug: string): Promise<number[]> {
  const res = await fetch(`https://www.chronogolf.com/marketplace/v2/clubs/${slug}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; TheLoop/1.0)',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    console.warn(`[chronogolf] Could not fetch club info for ${slug}: ${res.status}`);
    return [];
  }

  const data = await res.json();
  if (!data.features?.online_booking_enabled) {
    console.log(`[chronogolf] ${slug} has online_booking_enabled=false, skipping`);
    return [];
  }

  return (data.courses ?? []).map((c: { id: number }) => c.id);
}

/**
 * Fetch tee times for a Chronogolf course on a given date.
 * date: YYYY-MM-DD
 */
export async function fetchChronogolfTeeTimes(
  course: ChronogolfCourse,
  date: string,
): Promise<TeeTime[]> {
  // Resolve course IDs if not hardcoded
  let courseIds = course.courseIds;
  if (courseIds.length === 0) {
    courseIds = await resolveCourseIds(course.slug);
    if (courseIds.length === 0) return [];
    // Cache them back on the object for subsequent calls
    course.courseIds = courseIds;
  }

  const params = new URLSearchParams({
    start_date: date,
    course_ids: courseIds.join(','),
    holes: course.holes.toString(),
    free_slots: '4',
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TheLoop/1.0)',
        'Referer': `https://www.chronogolf.com/club/${course.slug}`,
      },
    });

    if (!res.ok) {
      console.warn(`[chronogolf] ${course.name} ${date}: HTTP ${res.status}`);
      return [];
    }

    const data: ChronogolfResponse = await res.json();

    if (data.status === 'closed' || data.status === 'off_season') {
      return [];
    }

    return (data.teetimes ?? [])
      .filter((t) => t.status === 'published' && t.available_players > 0)
      .map((t) => ({
        courseId: course.id,
        time: new Date(`${t.start_date}T${t.start_time}:00-07:00`).toISOString(), // MST
        holes: t.holes ?? course.holes,
        players: t.available_players,
        priceUsd: t.price_per_player ?? null,
      }));
  } catch (err) {
    console.error(`[chronogolf] ${course.name} ${date}: fetch error`, err);
    return [];
  }
}

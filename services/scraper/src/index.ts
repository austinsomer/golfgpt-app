import courses from './config/courses';
import { fetchTeeTimes as fetchForeUpTeeTimes } from './scrapers/foreup';
import { fetchTeeTimes as fetchChronogolfTeeTimes } from './scrapers/chronogolf';
import { TeeTime } from './types';
import supabase from './lib/supabase';

function getDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    dates.push(`${mm}-${dd}-${yyyy}`);
  }
  return dates;
}

// Fetch UUID → course slug mapping from Supabase
async function fetchCourseUuids(): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, booking_url')
    .eq('active', true);

  if (error) throw new Error(`Failed to fetch courses: ${error.message}`);

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    // Match by booking_url against our local config
    const local = courses.find((c) => c.bookingUrl === row.booking_url);
    if (local) map.set(local.id, row.id);
  }
  return map;
}

async function run() {
  const dates = getDateRange(7);
  console.log(`[scraper] Running for ${courses.length} courses × ${dates.length} days`);

  // Get real UUIDs from DB
  const uuidMap = await fetchCourseUuids();

  for (const course of courses) {
    const dbUuid = uuidMap.get(course.id);
    if (!dbUuid) {
      console.warn(`[scraper] Skipping ${course.name} — not found in DB (seed it first)`);
      continue;
    }

    const startedAt = new Date().toISOString();
    let totalFound = 0;

    for (const date of dates) {
      let times: TeeTime[];
      if (course.platform === 'chronogolf') {
        // Chronogolf uses YYYY-MM-DD; convert from MM-DD-YYYY
        const [mm, dd, yyyy] = date.split('-');
        times = await fetchChronogolfTeeTimes(course, `${yyyy}-${mm}-${dd}`);
      } else {
        times = await fetchForeUpTeeTimes(course, date);
      }
      totalFound += times.length;

      if (times.length > 0) {
        const rows = times.map((t) => {
          const teetime = new Date(t.time);
          const expiresAt = new Date(teetime.getTime() + 60 * 60 * 1000); // expire 1h after tee time
          return {
            course_id: dbUuid,
            datetime: t.time,
            holes: t.holes,
            players_available: t.players,
            price: t.priceUsd,
            expires_at: expiresAt.toISOString(),
          };
        });

        const { error } = await supabase
          .from('tee_times')
          .upsert(rows, { onConflict: 'course_id,datetime' });

        if (error) {
          console.error(`[scraper] Upsert error for ${course.name} ${date}:`, error.message);
        }
      }
    }

    const completedAt = new Date().toISOString();

    await supabase.from('scraper_runs').insert({
      course_id: dbUuid,
      started_at: startedAt,
      finished_at: completedAt,
      status: 'success',
      tee_times_found: totalFound,
    });

    console.log(`[scraper] ${course.name}: ${totalFound} tee times found`);
  }

  console.log('[scraper] Done.');
}

run().catch(console.error);

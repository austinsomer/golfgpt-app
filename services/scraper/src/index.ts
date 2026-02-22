import courses from './config/courses';
import { fetchTeeTimes } from './scrapers/foreup';
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

async function run() {
  const dates = getDateRange(7);
  console.log(`[scraper] Running for ${courses.length} courses × ${dates.length} days`);

  for (const course of courses) {
    const startedAt = new Date().toISOString();
    let totalFound = 0;

    for (const date of dates) {
      const times = await fetchTeeTimes(course, date);
      totalFound += times.length;

      if (times.length > 0) {
        const rows = times.map((t) => ({
          course_id: t.courseId,
          time: t.time,
          holes: t.holes,
          available_spots: t.players,
          price_usd: t.priceUsd,
        }));

        const { error } = await supabase
          .from('tee_times')
          .upsert(rows, { onConflict: 'course_id,time' });

        if (error) {
          console.error(`[scraper] Upsert error for ${course.name} ${date}:`, error.message);
        }
      }
    }

    const completedAt = new Date().toISOString();

    await supabase.from('scraper_runs').insert({
      course_id: course.id,
      started_at: startedAt,
      completed_at: completedAt,
      tee_times_found: totalFound,
    });

    console.log(`[scraper] ${course.name}: ${totalFound} tee times found`);
  }

  console.log('[scraper] Done.');
}

run().catch(console.error);

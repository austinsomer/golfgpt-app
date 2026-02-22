import { Course, ForeUpTimeSlot, TeeTime } from '../types';

const BASE_URL = 'https://foreupsoftware.com/index.php/api/booking/times';

export async function fetchTeeTimes(course: Course, date: string): Promise<TeeTime[]> {
  // date format: MM-DD-YYYY
  const params = new URLSearchParams({
    time: 'all',
    date,
    holes: 'all',
    players: '4',
    schedule_id: course.scheduleId.toString(),
    specials_only: '0',
    api_key: 'no_limits',
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (compatible; GolfGPT/1.0)',
      },
    });

    const data = await res.json();

    // ForeUp returns false for invalid schedule_id
    if (!Array.isArray(data)) {
      console.error(`[foreup] Invalid response for ${course.name} (scheduleId=${course.scheduleId}):`, data);
      return [];
    }

    return (data as ForeUpTimeSlot[]).map((slot) => ({
      courseId: course.id,
      time: new Date(slot.time.replace(' ', 'T') + ':00').toISOString(),
      holes: slot.teesheet_holes,
      players: slot.available_spots ?? 4,
      priceUsd: slot.green_fee ?? null,
    }));
  } catch (err) {
    console.error(`[foreup] Error fetching ${course.name}:`, err);
    return [];
  }
}

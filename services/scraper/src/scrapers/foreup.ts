import { Course, ForeUpTimeSlot, TeeTime } from '../types';

const BASE_URL = 'https://foreupsoftware.com/index.php/api/booking/times';

/**
 * Returns true if the given UTC date falls within Mountain Daylight Time.
 * MDT: 2nd Sunday of March 02:00 → 1st Sunday of November 02:00
 */
function isMDT(utcDate: Date): boolean {
  const year = utcDate.getUTCFullYear();

  // 2nd Sunday of March (DST start)
  const mar1Day = new Date(Date.UTC(year, 2, 1)).getUTCDay(); // 0=Sun
  const dstStartDay = (mar1Day === 0 ? 8 : 8 + (7 - mar1Day)); // first Sun + 7
  const dstStart = new Date(Date.UTC(year, 2, dstStartDay, 9, 0, 0)); // 02:00 MT = 09:00 UTC (MST)

  // 1st Sunday of November (DST end)
  const nov1Day = new Date(Date.UTC(year, 10, 1)).getUTCDay();
  const dstEndDay = nov1Day === 0 ? 1 : 8 - nov1Day;
  const dstEnd = new Date(Date.UTC(year, 10, dstEndDay, 8, 0, 0)); // 02:00 MT = 08:00 UTC (MDT)

  return utcDate >= dstStart && utcDate < dstEnd;
}

/**
 * ForeUp returns local Mountain Time strings like "2026-02-23 07:00".
 * Railway/Node treats bare ISO strings as UTC, so we must append the
 * correct Mountain offset before parsing.
 */
function mountainToISO(slotTime: string): string {
  // First pass: parse as UTC to determine approximate date for DST check
  const approxUTC = new Date(slotTime.replace(' ', 'T') + ':00Z');
  const offset = isMDT(approxUTC) ? '-06:00' : '-07:00';
  return new Date(slotTime.replace(' ', 'T') + ':00' + offset).toISOString();
}

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
      time: mountainToISO(slot.time),
      holes: slot.teesheet_holes,
      players: slot.available_spots ?? 4,
      priceUsd: slot.green_fee ?? null,
    }));
  } catch (err) {
    console.error(`[foreup] Error fetching ${course.name}:`, err);
    return [];
  }
}

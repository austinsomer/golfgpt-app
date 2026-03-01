import { Course, TeeItUpCourseBlock, TeeTime } from '../types';

const BASE_URL = 'https://phx-api-be-east-1b.kenna.io/v2/tee-times';

/**
 * Fetch tee times for a TeeItUp/Kenna Sports course on a given date (YYYY-MM-DD).
 *
 * The API requires:
 *   x-be-alias: {operator-alias}   (e.g. 'aspira-management-company')
 *   Origin: https://{alias}.book-v2.teeitup.golf
 *
 * Response is an array of course blocks, each containing a teetimes array.
 * teetime timestamps are UTC ISO 8601 — no timezone conversion needed.
 * Prices are in cents (greenFeeWalking: 4500 → $45.00).
 */
export async function fetchTeeTimes(course: Course, date: string): Promise<TeeTime[]> {
  if (!course.alias) {
    console.warn(`[teeitup] ${course.name} has no alias — skipping`);
    return [];
  }
  if (!course.facilityIds || course.facilityIds.length === 0) {
    console.warn(`[teeitup] ${course.name} has no facilityIds — skipping`);
    return [];
  }

  const params = new URLSearchParams({ date });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: {
        'x-be-alias': course.alias,
        'Origin': `https://${course.alias}.book-v2.teeitup.golf`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TheLoop/1.0)',
      },
    });

    if (!res.ok) {
      console.error(`[teeitup] ${course.name} ${date} returned ${res.status}`);
      return [];
    }

    const data: TeeItUpCourseBlock[] = await res.json();

    if (!Array.isArray(data)) {
      console.error(`[teeitup] Unexpected response for ${course.name}:`, data);
      return [];
    }

    const facilityIdSet = new Set(course.facilityIds!.map(String));

    return data
      .filter((block) => facilityIdSet.has(block.courseId))
      .flatMap((block) =>
        (block.teetimes ?? [])
          .filter((t) => t.maxPlayers - t.bookedPlayers > 0)
          .map((t) => {
            const availablePlayers = t.maxPlayers - t.bookedPlayers;
            // Prices in cents → dollars
            const cents = t.rates?.[0]?.greenFeeWalking ?? null;
            return {
              courseId: course.id,
              time: t.teetime, // already UTC ISO
              holes: course.holes,
              players: availablePlayers,
              priceUsd: cents != null ? cents / 100 : null,
            };
          }),
      );
  } catch (err) {
    console.error(`[teeitup] Error fetching ${course.name} ${date}:`, err);
    return [];
  }
}

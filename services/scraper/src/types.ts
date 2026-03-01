export interface Course {
  id: string;
  name: string;
  city: string;
  county: string;
  holes: number;
  bookingUrl: string;
  platform: 'foreup' | 'chronogolf' | 'teeitup';
  verified: boolean;

  // ForeUp-specific
  bookingId?: number;
  scheduleId?: number;

  // Chronogolf-specific
  slug?: string;        // e.g. 'forest-dale-golf-course'
  courseIds?: number[]; // numeric IDs returned by /clubs/{slug}

  // TeeItUp-specific
  alias?: string;       // x-be-alias header value, e.g. 'aspira-management-company'
  facilityIds?: number[]; // course facility IDs (e.g. [17072, 17073])
}

export interface TeeTime {
  courseId: string;
  time: string; // ISO string (UTC)
  holes: number;
  players: number;
  priceUsd: number | null;
}

// ForeUp

export interface ForeUpTimeSlot {
  time: string; // 'YYYY-MM-DD HH:MM'
  course_id: number;
  course_name: string;
  schedule_id: number;
  teesheet_holes: number;
  available_spots: number;
  green_fee: number | null;
}

// TeeItUp / Kenna Sports

export interface TeeItUpTeeTime {
  teetime: string;      // ISO 8601 UTC e.g. '2026-03-01T07:00:00.000Z'
  courseId: string;     // numeric string matching facilityId
  bookedPlayers: number;
  maxPlayers: number;
  rates: Array<{ greenFeeWalking?: number; [key: string]: number | undefined }>;
}

export interface TeeItUpCourseBlock {
  courseId: string;
  teetimes: TeeItUpTeeTime[];
}

// Chronogolf

export interface ChronogolfTeeTime {
  uuid: string;
  start_date: string;   // 'YYYY-MM-DD'
  start_time: string;   // 'HH:MM' local Mountain Time
  available_players: number;
  price_per_player: number | null;
  course_id: number;
  status: string;       // 'published' | 'closed' | etc.
}

export interface ChronogolfResponse {
  status: string;
  teetimes: ChronogolfTeeTime[];
}

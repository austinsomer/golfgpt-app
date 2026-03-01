export interface Course {
  id: string;
  name: string;
  city: string;
  county: string;
  holes: number;
  bookingId: number;
  scheduleId: number;
  bookingUrl: string;
  platform: 'foreup' | 'chronogolf' | 'teeitup';
  verified: boolean;
}

export interface TeeTime {
  courseId: string;
  time: string; // ISO string
  holes: number;
  players: number;
  priceUsd: number | null;
}

export interface ForeUpTimeSlot {
  time: string; // 'YYYY-MM-DD HH:MM'
  course_id: number;
  course_name: string;
  schedule_id: number;
  teesheet_holes: number;
  available_spots: number;
  green_fee: number | null;
}

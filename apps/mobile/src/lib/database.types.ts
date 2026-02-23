// Auto-generated types from Supabase schema
// Source: services/supabase/migrations/001_initial_schema.sql
// Regenerate with: npx supabase gen types typescript --project-id opzqsxrfqasqadnjdgop

export type County =
  | 'salt_lake'
  | 'utah'
  | 'summit'
  | 'washington'
  | 'weber'
  | 'davis'
  | 'cache'
  | 'box_elder'
  | 'tooele'
  | 'iron'
  | 'kane';

export type BookingPlatform =
  | 'foreup'
  | 'lightspeed'
  | 'chronogolf'
  | 'ezlinks'
  | 'teeup'
  | 'custom'
  | 'unknown';

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;              // UUID
          name: string;
          county: County;
          address: string | null;
          lat: number | null;
          lng: number | null;
          holes: 9 | 18 | 27 | 36 | null;
          par: number | null;
          website_url: string | null;
          booking_url: string | null;
          booking_platform: BookingPlatform | null;
          phone: string | null;
          description: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      tee_times: {
        Row: {
          id: string;              // UUID
          course_id: string;       // UUID → courses.id
          datetime: string;        // ISO timestamp
          players_available: 1 | 2 | 3 | 4 | null;
          price: number | null;    // decimal dollars
          holes: number | null;
          scraped_at: string;
          expires_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tee_times']['Row'], 'id' | 'scraped_at'>;
        Update: Partial<Database['public']['Tables']['tee_times']['Insert']>;
      };
      scraper_runs: {
        Row: {
          id: string;              // UUID
          course_id: string;       // UUID
          started_at: string;
          finished_at: string | null;
          status: string;
          tee_times_found: number | null;
          error_msg: string | null;
        };
        Insert: Omit<Database['public']['Tables']['scraper_runs']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['scraper_runs']['Insert']>;
      };
    };
  };
};

// Convenience row types
export type Course = Database['public']['Tables']['courses']['Row'];
export type TeeTimeRow = Database['public']['Tables']['tee_times']['Row'];
export type ScraperRun = Database['public']['Tables']['scraper_runs']['Row'];

// County display names (snake_case → human readable)
export const COUNTY_DISPLAY: Record<County, string> = {
  salt_lake: 'Salt Lake',
  utah: 'Utah County',
  summit: 'Summit',
  washington: 'St. George',
  weber: 'Weber',
  davis: 'Davis',
  cache: 'Cache',
  box_elder: 'Box Elder',
  tooele: 'Tooele',
  iron: 'Iron',
  kane: 'Kane',
};

export function formatCounty(county: County): string {
  return COUNTY_DISPLAY[county] ?? county;
}

// Auto-generated types from Supabase schema
// Source: services/supabase/migrations/001_initial_schema.sql
// Regenerate with: npx supabase gen types typescript --project-id opzqsxrfqasqadnjdgop

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: number;
          name: string;
          county: string;
          address: string | null;
          lat: number | null;
          lng: number | null;
          holes: number | null;
          par: number | null;
          website_url: string | null;
          booking_url: string | null;
          booking_platform: string | null;
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
          id: number;
          course_id: number;
          datetime: string;
          players_available: number | null;
          price: number | null;
          holes: number | null;
          scraped_at: string;
          expires_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tee_times']['Row'], 'id' | 'scraped_at'>;
        Update: Partial<Database['public']['Tables']['tee_times']['Insert']>;
      };
      scraper_runs: {
        Row: {
          id: number;
          course_id: number;
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

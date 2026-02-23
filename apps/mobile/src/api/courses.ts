import { supabase } from '../lib/supabase';
import { Course, County, COUNTY_DISPLAY } from '../lib/database.types';

/**
 * Fetch all active courses, optionally filtered by county (display name or slug).
 */
export async function getCourses(county?: string): Promise<Course[]> {
  let query = supabase
    .from('courses')
    .select('*')
    .eq('active', true)
    .order('name', { ascending: true });

  if (county && county !== 'All' && county !== 'ALL') {
    // Accept either display form ('Salt Lake') or slug ('salt_lake')
    const slug = toCountySlug(county);
    if (slug) query = query.eq('county', slug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getCourses] Supabase error:', error.message);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Fetch a single course by UUID.
 */
export async function getCourse(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    console.error('[getCourse] Supabase error:', error.message);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Return distinct county display names for active courses.
 * Used to populate the county filter chips in SearchScreen.
 */
export async function getCounties(): Promise<string[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('county')
    .eq('active', true);

  if (error) {
    console.error('[getCounties] Supabase error:', error.message);
    return [];
  }

  const slugs = [...new Set((data ?? []).map((r) => r.county as County).filter(Boolean))];
  return slugs.sort().map((s) => COUNTY_DISPLAY[s] ?? s);
}

// Normalize display names or slugs to DB slug form
function toCountySlug(input: string): County | null {
  const normalized = input.toLowerCase().replace(/\s+/g, '_');
  const knownSlugs = Object.keys(COUNTY_DISPLAY) as County[];
  if (knownSlugs.includes(normalized as County)) return normalized as County;

  // Try matching by display name
  const entry = Object.entries(COUNTY_DISPLAY).find(
    ([, display]) => display.toLowerCase() === input.toLowerCase(),
  );
  return entry ? (entry[0] as County) : null;
}

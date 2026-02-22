import { supabase } from '../lib/supabase';
import { Course } from '../lib/database.types';

/**
 * Fetch all active courses, optionally filtered by county.
 */
export async function getCourses(county?: string): Promise<Course[]> {
  let query = supabase
    .from('courses')
    .select('*')
    .eq('active', true)
    .order('name', { ascending: true });

  if (county && county.toLowerCase() !== 'all') {
    query = query.ilike('county', county);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getCourses] Supabase error:', error.message);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Fetch a single course by ID.
 */
export async function getCourse(id: number): Promise<Course | null> {
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
 * List all counties with at least one active course.
 * Used to populate the county filter in SearchScreen.
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

  const unique = [...new Set((data ?? []).map((r) => r.county).filter(Boolean))];
  return unique.sort();
}

-- Migration: 004_rls_policies
-- Created: 2026-02-23
-- Enable Row Level Security on all tables.
-- Public (anon) users get read-only access to active courses and non-expired tee times.
-- scraper_runs is internal only (service role access via scraper, no public read).

-- ============================================================
-- courses: public read-only for active courses
-- ============================================================
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active courses"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Service role (scraper) bypasses RLS automatically — no policy needed for writes.

-- ============================================================
-- tee_times: public read-only for non-expired tee times
-- ============================================================
ALTER TABLE tee_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read non-expired tee times"
  ON tee_times
  FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

-- ============================================================
-- scraper_runs: no public access — internal use only
-- ============================================================
ALTER TABLE scraper_runs ENABLE ROW LEVEL SECURITY;

-- No SELECT policy = anon/authenticated users cannot read scraper_runs.
-- Service role bypasses RLS and can still write run logs.

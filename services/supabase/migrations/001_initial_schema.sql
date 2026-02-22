-- Migration: 001_initial_schema
-- Created: 2026-02-22

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  county TEXT NOT NULL CHECK (county IN ('salt_lake', 'utah', 'summit', 'washington')),
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  holes INTEGER CHECK (holes IN (9, 18, 27, 36)),
  par INTEGER,
  website_url TEXT,
  booking_url TEXT,
  booking_platform TEXT CHECK (booking_platform IN ('foreup', 'lightspeed', 'chronogolf', 'ezlinks', 'teeup', 'custom', 'unknown')),
  phone TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tee times cache table
CREATE TABLE IF NOT EXISTS tee_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  datetime TIMESTAMPTZ NOT NULL,
  players_available INTEGER CHECK (players_available BETWEEN 1 AND 4),
  price DECIMAL(6, 2),
  holes INTEGER CHECK (holes IN (9, 18)),
  scraped_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(course_id, datetime)
);

-- Scraper run log table
CREATE TABLE IF NOT EXISTS scraper_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('running', 'success', 'failed', 'partial')),
  tee_times_found INTEGER DEFAULT 0,
  error_msg TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tee_times_course_id ON tee_times(course_id);
CREATE INDEX IF NOT EXISTS idx_tee_times_datetime ON tee_times(datetime);
CREATE INDEX IF NOT EXISTS idx_tee_times_expires_at ON tee_times(expires_at);
CREATE INDEX IF NOT EXISTS idx_tee_times_players ON tee_times(players_available);
CREATE INDEX IF NOT EXISTS idx_courses_county ON courses(county);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);
CREATE INDEX IF NOT EXISTS idx_scraper_runs_course_id ON scraper_runs(course_id);

-- Auto-update updated_at on courses
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Cleanup function: delete expired tee times
CREATE OR REPLACE FUNCTION cleanup_expired_tee_times()
RETURNS void AS $$
BEGIN
  DELETE FROM tee_times WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

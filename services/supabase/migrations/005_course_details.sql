-- Migration 005: Add course_length_yards column
-- Companion UPDATE in populate-course-details.sql

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS course_length_yards integer;

COMMENT ON COLUMN courses.course_length_yards IS 'Course length from primary/white tees in yards';

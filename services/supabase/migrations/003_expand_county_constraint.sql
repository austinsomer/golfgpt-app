-- Migration: 003_expand_county_constraint
-- Created: 2026-02-22
-- Expands county CHECK constraint to cover all major Utah golf counties

ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_county_check;

ALTER TABLE courses ADD CONSTRAINT courses_county_check
  CHECK (county IN (
    'salt_lake',
    'utah',
    'summit',
    'washington',
    'weber',
    'davis',
    'cache',
    'box_elder',
    'tooele',
    'iron',
    'kane'
  ));

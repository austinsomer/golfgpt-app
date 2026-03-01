-- Migration 006: Add wasatch and morgan to county CHECK constraint
-- Required for Soldier Hollow / Wasatch Mountain State Park (Wasatch County)
-- and Round Valley Golf Course (Morgan County)

ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_county_check;

ALTER TABLE courses ADD CONSTRAINT courses_county_check CHECK (
  county = ANY (ARRAY[
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
    'kane',
    'wasatch',
    'morgan'
  ]::text[])
);

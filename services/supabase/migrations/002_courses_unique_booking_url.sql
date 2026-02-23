-- Migration: 002_courses_unique_booking_url
-- Created: 2026-02-22
-- Adds unique constraint on booking_url so seed/scraper can upsert safely

ALTER TABLE courses ADD CONSTRAINT courses_booking_url_unique UNIQUE (booking_url);

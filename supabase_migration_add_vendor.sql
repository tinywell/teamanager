-- Add vendor column to teas table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE teas 
ADD COLUMN IF NOT EXISTS vendor TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN teas.vendor IS 'Tea vendor or brand name';

-- Adds affiliate_image column to the articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS affiliate_image TEXT;

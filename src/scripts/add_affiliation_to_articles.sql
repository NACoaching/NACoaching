-- Add affiliation columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS affiliate_link TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS affiliate_text TEXT;

-- Update existing articles to have null values (default)
-- Not strictly necessary as they will stay null by default

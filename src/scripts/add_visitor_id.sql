-- Add visitor_id to page_views
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS visitor_id TEXT;

-- Index for better performance when counting uniques
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);

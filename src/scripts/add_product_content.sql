-- Add content column to products table
ALTER TABLE products 
ADD COLUMN content TEXT;

-- Update existing rows to have empty string instead of NULL if needed (optional)
UPDATE products SET content = '' WHERE content IS NULL;

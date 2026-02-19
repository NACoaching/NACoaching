-- Add images array column to products table
ALTER TABLE products 
ADD COLUMN images TEXT[];

-- Migrate existing single image to the images array (optional but recommended)
UPDATE products 
SET images = ARRAY[image] 
WHERE image IS NOT NULL AND (images IS NULL OR images = '{}');

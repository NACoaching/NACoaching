-- Fix reviews table: change product_id from uuid to bigint to match products table
-- Step 1: Drop the existing foreign key constraint and column
ALTER TABLE reviews DROP COLUMN IF EXISTS product_id;

-- Step 2: Add the correct column type
ALTER TABLE reviews ADD COLUMN product_id bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE;

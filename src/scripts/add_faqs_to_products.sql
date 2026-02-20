-- Script to add 'faqs' jsonb column to the 'products' table
ALTER TABLE products ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;

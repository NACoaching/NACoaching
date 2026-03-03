ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

UPDATE public.products SET slug = 'programme-musculation-ppl' WHERE id = 2;

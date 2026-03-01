-- Script to assign the 'Récupération Active vs Passive' article to Volume 3 (La Science de la Santé)
-- Run this in the Supabase SQL Editor

UPDATE articles
SET category = 'Volume 3 : La Science de la Santé'
WHERE LOWER(title) ILIKE '%r%cup%r%ation%active%passive%'
   OR LOWER(title) ILIKE '%r%cup%r%ation active%'
   OR LOWER(title) ILIKE '%active vs passive%'
RETURNING id, title, category;

-- If the above doesn't match, search for the article first with this query:
-- SELECT id, title, category FROM articles WHERE LOWER(title) ILIKE '%recup%' OR LOWER(title) ILIKE '%récup%';

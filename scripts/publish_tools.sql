-- Ce script publie officiellement les 7 nouveaux outils et configure leurs liens (CTA)

UPDATE public.articles
SET 
    is_published = true,
    cta = CASE slug
        WHEN 'convertisseur-rpe-1rm' THEN '/outils/rpe-1rm'
        WHEN 'calculateur-de-macros-avance' THEN '/outils/macros-avancees'
        WHEN 'test-demi-cooper' THEN '/outils/test-demi-cooper'
        WHEN 'score-de-recuperation-readiness' THEN '/outils/score-recuperation'
        WHEN 'calculateur-acwr-charge-d-entrainement' THEN '/outils/acwr'
        WHEN 'predicteur-de-performance-running' THEN '/outils/predictateur-performance'
        WHEN 'calculateur-de-volume-effectif' THEN '/outils/volume-effectif'
        ELSE cta
    END
WHERE slug IN (
    'convertisseur-rpe-1rm',
    'calculateur-de-macros-avance',
    'test-demi-cooper',
    'score-de-recuperation-readiness',
    'calculateur-acwr-charge-d-entrainement',
    'predicteur-de-performance-running',
    'calculateur-de-volume-effectif'
) AND category = 'Outils';

-- Vérification des mises à jour
SELECT id, title, slug, is_published, cta 
FROM public.articles 
WHERE category = 'Outils' 
ORDER BY title;

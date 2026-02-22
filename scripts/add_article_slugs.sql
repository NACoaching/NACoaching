-- 1. Ajouter la colonne 'slug' à la table 'articles' si elle n'existe pas
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- 2. Générer et mettre à jour les slugs pour les articles existants
-- Le regex va enlever les accents, mettre en minuscule, et remplacer les espaces/caractères spéciaux par des tirets
UPDATE articles
SET slug = lower(
    regexp_replace(
        replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
        title, 
        'é', 'e'), 'è', 'e'), 'ê', 'e'), 'ë', 'e'),
        'à', 'a'), 'â', 'a'), 'ä', 'a'),
        'ô', 'o'), 'ö', 'o'),
        'î', 'i'), 'ï', 'i'),
        'û', 'u'), 'ü', 'u'),
        '[^a-zA-Z0-9]+', '-', 'g'
    )
)
WHERE slug IS NULL;

-- 3. Nettoyer les tirets en début ou fin de slug qui auraient pu être générés par erreur
UPDATE articles
SET slug = trim(both '-' from slug)
WHERE slug LIKE '-%' OR slug LIKE '%-';

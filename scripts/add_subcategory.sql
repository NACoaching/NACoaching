-- Ajouter la colonne subcategory à la table articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS subcategory text;

-- Mettre à jour les sous-catégories pour les outils existants
UPDATE articles SET subcategory = 'Force & Musculation' WHERE cta IN ('/outils/calculateur-1rm', '/outils/rpe-1rm', '/outils/volume-effectif') AND category = 'Outils';
UPDATE articles SET subcategory = 'Endurance & Cardio' WHERE cta IN ('/outils/vma-vo2', '/outils/frequence-cardiaque', '/outils/convertisseur-vitesse', '/outils/test-demi-cooper', '/outils/predictateur-performance', '/outils/acwr') AND category = 'Outils';
UPDATE articles SET subcategory = 'Nutrition & Récupération' WHERE cta IN ('/outils/besoins-caloriques', '/outils/macros-avancees', '/outils/score-recuperation') AND category = 'Outils';

-- Pour s'assurer qu'aucun outil ne reste sans sous-catégorie
UPDATE articles SET subcategory = 'Divers' WHERE subcategory IS NULL AND category = 'Outils';

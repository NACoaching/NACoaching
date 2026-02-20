-- Insert tool articles into the articles table with category 'Outils'
-- Using the 'cta' field to store the tool page URL

INSERT INTO articles (title, category, excerpt, image, cta, date)
VALUES
(
  'Calculateur 1RM - Estime ta charge maximale',
  'Outils',
  'Calcule ta répétition maximale (1RM) à partir d''une charge et d''un nombre de répétitions. Basé sur les formules de Brzycki et Epley.',
  NULL,
  '/outils/calculateur-1rm',
  '2025-01-15'
),
(
  'Calculateur de besoins caloriques',
  'Outils',
  'Estime tes besoins énergétiques journaliers selon ton profil, ton métabolisme de base et ton niveau d''activité physique.',
  NULL,
  '/outils/besoins-caloriques',
  '2025-01-15'
),
(
  'Calculateur VMA / VO2max',
  'Outils',
  'Estime ta Vitesse Maximale Aérobie et ta consommation maximale d''oxygène à partir de tes résultats de test.',
  NULL,
  '/outils/vma-vo2',
  '2025-01-15'
),
(
  'Zones de fréquence cardiaque',
  'Outils',
  'Détermine tes 5 zones d''entraînement cardio à partir de ta fréquence cardiaque maximale pour optimiser tes séances.',
  NULL,
  '/outils/frequence-cardiaque',
  '2025-01-15'
),
(
  'Convertisseur de vitesse',
  'Outils',
  'Convertis facilement entre km/h, min/km et m/s pour planifier et analyser tes séances de course.',
  NULL,
  '/outils/convertisseur-vitesse',
  '2025-01-15'
);

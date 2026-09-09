-- =============================================================================
-- MISE À JOUR DU CONVERTISSEUR DE VITESSE : KM/H, MIN/KM & M/S + FRACTIONNÉ 15/15
-- =============================================================================

-- 1. Mise à jour de l'article de l'outil dans la table articles
UPDATE articles
SET 
  title = 'Convertisseur de Vitesse Running : km/h, min/km & m/s (Allures & Fractionné)',
  excerpt = 'Convertissez instantanément vos vitesses entre km/h, min/km et m/s (mètres par seconde). Calculez précisément vos temps de passage et les distances exactes pour vos séances de fractionné court (15/15, 30/30) avec une précision de coach Master EOPS.'
WHERE cta = '/outils/convertisseur-vitesse';

-- 2. Mise à jour des clés site_content pour l'outil
INSERT INTO site_content (key, label, value)
VALUES 
  ('tool_speed_title', 'Titre Convertisseur Vitesse', 'Convertisseur de Vitesse Running : km/h, min/km & m/s (Allures & Fractionné)'),
  ('tool_speed_intro', 'Intro Convertisseur Vitesse', 'Convertissez instantanément vos vitesses entre km/h, min/km et m/s (mètres par seconde). Calculez précisément vos temps de passage et les distances exactes pour vos séances de fractionné court (15/15, 30/30) avec une précision de coach Master EOPS.')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, label = EXCLUDED.label;

-- 3. Mise à jour de la FAQ enrichie avec les m/s et le 15/15
INSERT INTO site_content (key, label, value)
VALUES (
  'tool_speed_faq', 
  'FAQ Convertisseur Vitesse & m/s',
  '[
    {"question":"Comment convertir des km/h en m/s (mètres par seconde) ?","answer":"Pour convertir des km/h en m/s, divisez simplement la vitesse par 3,6 (formule : m/s = km/h ÷ 3,6). Par exemple, 18 km/h ÷ 3,6 = 5,00 m/s. À l''inverse, multipliez vos m/s par 3,6 pour obtenir des km/h (ex : 4 m/s × 3,6 = 14,4 km/h). Notre convertisseur effectue le calcul en temps réel."},
    {"question":"Combien de mètres faut-il courir lors d''un fractionné 15/15 ou 30/30 ?","answer":"La distance dépend de votre vitesse en m/s multipliée par la durée de fraction en secondes (distance = m/s × secondes). Par exemple, pour un 15/15 à 18 km/h (5 m/s), vous devez courir exactement 75 mètres en 15 secondes. À 15 km/h (4,17 m/s), cela fait 62,5 mètres. Utilisez notre calculateur de fractionné ci-dessus pour baliser votre piste avec des plots."},
    {"question":"Pourquoi convertir sa vitesse en m/s est indispensable sur piste ?","answer":"Sur des fractions très courtes (15/15, 30/30, 10/10), les puces GPS des montres ont un temps de latence de plusieurs secondes et manquent de précision instantanée. Convertir votre allure en m/s vous permet de mesurer la distance exacte en mètres et de baliser des repères fixes au sol (plots) pour courir à l''intensité physiologique exacte voulue."},
    {"question":"Comment convertir les km/h en min/km (allure de course) ?","answer":"La formule est : allure (min/km) = 60 ÷ vitesse (km/h). Par exemple, 12 km/h = 60 ÷ 12 = 5:00 min/km. Notre convertisseur fait le calcul instantanément dans les deux sens et affiche aussi les mètres par seconde correspondants."},
    {"question":"Quelle allure pour courir un marathon en moins de 4 heures ?","answer":"Pour terminer un marathon (42.195 km) en moins de 4 heures, vous devez maintenir une allure moyenne de 5:41 min/km, soit environ 10.55 km/h (ou 2.93 m/s). Prévoyez de courir les premiers kilomètres légèrement plus vite (5:35 min/km) pour avoir une marge de sécurité."},
    {"question":"Pourquoi les coureurs utilisent l''allure en min/km plutôt que la vitesse en km/h ?","answer":"L''allure en min/km est plus pratique en course à pied car elle permet de calculer facilement ses temps de passage au kilomètre et de gérer son effort pendant la course. C''est aussi le format universel affiché sur les montres GPS de running comme Garmin, Polar ou COROS."}
  ]'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, label = EXCLUDED.label;

-- 4. Enrichissement des auto-liens de maillage interne
UPDATE auto_links 
SET keywords = 'convertir son allure, calculer son allure, vitesse, allures, allure, 14 km/h, convertisseur de vitesse, km/h en m/s, m/s en km/h, convertisseur m/s, mètres par seconde, distance 15/15, fractionné 15/15'
WHERE url = '/outils/convertisseur-vitesse';

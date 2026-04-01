-- 1. Enrichissement du texte du Convertisseur d'Allure (Pace Converter)
-- On met à jour le contenu de l'article lié à cet outil dans la table "articles"
UPDATE articles
SET content = content || '

## Comment convertir des km/h en min/km (et inversement) ?

L''allure (exprimée en min/km) est la métrique de référence pour les coureurs à pied. Elle indique le temps nécessaire pour parcourir un kilomètre. À l''inverse, la vitesse sur tapis de course ou sur un vélo est souvent exprimée en km/h. 

Voici un **tableau de conversion des allures les plus courantes** pour vous aider à vous repérer instantanément lors de vos entraînements VMA ou footing :

| Vitesse (km/h) | Allure (min/km) | Temps sur 10km | Temps sur Semi-Marathon |
|----------------|-----------------|----------------|-------------------------|
| 10 km/h        | 6:00 min/km     | 1h 00min       | 2h 06min                |
| 11 km/h        | 5:27 min/km     | 54min 32s      | 1h 55min                |
| 12 km/h        | 5:00 min/km     | 50min 00s      | 1h 45min                |
| 13 km/h        | 4:36 min/km     | 46min 09s      | 1h 37min                |
| 14 km/h        | 4:17 min/km     | 42min 51s      | 1h 30min                |
| 15 km/h        | 4:00 min/km     | 40min 00s      | 1h 24min                |
| 16 km/h        | 3:45 min/km     | 37min 30s      | 1h 19min                |
| 18 km/h        | 3:20 min/km     | 33min 20s      | 1h 10min                |
| 20 km/h        | 3:00 min/km     | 30min 00s      | 1h 03min                |

### Pourquoi utiliser notre convertisseur d''allure ?
Si vous suivez un plan d''entraînement, votre coach NA Coaching vous donnera souvent des allures cibles (ex: "Footing à 5:30/km", "Fractionné à 3:45/km"). Notre outil vous permet de traduire instantanément ces données à la virgule près si vous courez sur piste, ou de régler parfaitement la vitesse de votre tapis de course (par exemple, taper 14 km/h au lieu de chercher 4:17 min/km).
'
WHERE cta = '/outils/convertisseur-vitesse';


-- 2. Amélioration de la FAQ pour inclure les requêtes exactes (14 km/h etc.)
-- On insère ou on met à jour la FAQ dynamique dans site_content
INSERT INTO site_content (key, label, value)
VALUES (
  'tool_speed_faq', 
  'FAQ Convertisseur Vitesse',
  '[{"question":"À quelle allure correspond 14 km/h ?","answer":"Une vitesse de 14 km/h correspond exactement à une allure de 4 minutes et 17 secondes au kilomètre (4:17 min/km). À cette allure, vous terminez un 10km en 42 minutes et 50 secondes."},{"question":"Comment passer de min/km en km/h de tête ?","answer":"C''est complexe car l''allure est sur une base 60 (minutes) et la vitesse en décimales. La formule est : 60 / Allure décimale. C''est pourquoi utiliser notre convertisseur ci-dessus est la solution la plus rapide et fiable."},{"question":"Quelle est l''allure pour un 10km en 45 minutes ?","answer":"Pour courir un 10 kilomètres en 45 minutes, vous devez maintenir une allure moyenne de 4:30 min/km. Cela équivaut à une vitesse constante de 13,33 km/h."}]'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, label = EXCLUDED.label;


-- 3. Maillage Interne puissant pour le Test Demi-Cooper
-- On utilise le système incroyable des "auto_links" de ton site pour lier automatiquement le mot "demi-cooper" ou "VMA" dans TOUS tes articles de blog vers l'outil.
INSERT INTO auto_links (keywords, url, is_active)
VALUES 
  ('test demi cooper,test demi-cooper', '/outils/test-demi-cooper', true),
  ('calculer sa VMA,connaitre sa VMA', '/outils/test-demi-cooper', true),
  ('14 km/h', '/outils/convertisseur-vitesse', true),
  ('convertir son allure,calculer son allure', '/outils/convertisseur-vitesse', true)
ON CONFLICT (id) DO NOTHING; -- S'appuie sur la clé primaire id, si conflit ignoré, mais normalement c'est auto-généré. 
-- Note: Supabase va générer l'UUID automatiquement si on ne le précise pas.

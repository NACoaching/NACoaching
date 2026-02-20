-- Migrate tool SEO content from site_content to articles.content
-- This allows all tool content to be managed from a single place (Articles section)

UPDATE articles
SET content = (SELECT value FROM site_content WHERE key = 'tool_1rm_content')
WHERE cta = '/outils/calculateur-1rm';

UPDATE articles
SET content = (SELECT value FROM site_content WHERE key = 'tool_calories_content')
WHERE cta = '/outils/besoins-caloriques';

UPDATE articles
SET content = (SELECT value FROM site_content WHERE key = 'tool_vma_content')
WHERE cta = '/outils/vma-vo2';

UPDATE articles
SET content = (SELECT value FROM site_content WHERE key = 'tool_hr_content')
WHERE cta = '/outils/frequence-cardiaque';

UPDATE articles
SET content = (SELECT value FROM site_content WHERE key = 'tool_speed_content')
WHERE cta = '/outils/convertisseur-vitesse';

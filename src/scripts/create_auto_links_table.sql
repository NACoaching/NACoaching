-- Table to store user-defined auto-links
CREATE TABLE IF NOT EXISTS auto_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    keywords TEXT NOT NULL, -- Comma separated keywords or JSON array
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE auto_links ENABLE ROW LEVEL SECURITY;

-- Allow public read (for the site)
CREATE POLICY "Allow public read on auto_links" ON auto_links
    FOR SELECT USING (true);

-- Allow authenticated insert/update/delete (for admin)
CREATE POLICY "Allow admin to manage auto_links" ON auto_links
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial baseline from the previous hardcoded glossary
INSERT INTO auto_links (keywords, url) VALUES
('VMA, VO2max, Vitesse Maximale Aérobie', '/outils/vma-vo2'),
('1RM, Rep maximale, Max rep', '/outils/calculateur-1rm'),
('Calories, Besoin calorique', '/outils/besoins-caloriques'),
('Macros, Protéines, Glucides, Lipides', '/outils/macros-avancees'),
('RPE, RPE 1-10', '/outils/rpe-1rm'),
('Cardiaque, FC Max, Fréquence cardiaque', '/outils/frequence-cardiaque'),
('Récupération, Score de récup', '/outils/score-recuperation'),
('ACWR, Charge de travail', '/outils/acwr'),
('Volume effectif, Séries effectives', '/outils/volume-effectif'),
('Cooper, Demi-Cooper', '/outils/test-demi-cooper'),
('Boutique, Magasin', '/boutique'),
('Le Labo', '/labo');

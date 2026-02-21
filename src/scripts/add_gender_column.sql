-- Ajout de la colonne gender aux tables reviews et comments
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'neutral';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'neutral';

-- Optionnel : mettre à jour les métadonnées si nécessaire
COMMENT ON COLUMN reviews.gender IS 'Genre de l''auteur de l''avis (male, female, neutral)';
COMMENT ON COLUMN comments.gender IS 'Genre de l''auteur du commentaire (male, female, neutral)';

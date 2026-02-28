-- Ajout de la colonne tool_hints à la table articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tool_hints JSONB DEFAULT '{}'::jsonb;

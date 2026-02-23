-- Script pour ajouter la configuration customisée des recommandations par article/outil
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS related_title TEXT,
ADD COLUMN IF NOT EXISTS related_subtitle TEXT,
ADD COLUMN IF NOT EXISTS related_articles JSONB DEFAULT '[]'::jsonb;

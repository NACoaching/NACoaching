-- Ajoute les clés pour le contenu dynamique supplémentaire

INSERT INTO site_content (key, label, value) VALUES
('hero_cta_primary', 'Héro - Bouton Principal', 'Commencer l''entraînement'),
('hero_cta_secondary', 'Héro - Bouton Secondaire', 'Découvrir le Labo'),
('expertise_1', 'Expertise - Point 1', 'Master EOPS'),
('expertise_2', 'Expertise - Point 2', 'Expert Sport-Santé'),
('expertise_3', 'Expertise - Point 3', 'Brevet Football'),
('expertise_4', 'Expertise - Point 4', 'Licence STAPS'),
('contact_cta_title', 'Contact - Titre', 'Prêt à passer au niveau supérieur ?'),
('contact_cta_text', 'Contact - Texte', 'Besoin d''un accompagnement personnalisé ou d''une question sur un programme ? N''hésitez pas à me contacter.'),
('contact_cta_button', 'Contact - Bouton', 'Me Contacter'),
('footer_newsletter_title', 'Pied de page - Titre Newsletter', 'Newsletter'),
('footer_newsletter_text', 'Pied de page - Texte Newsletter', 'Recevez mes analyses scientifiques hebdomadaires (Gratuit).'),
('footer_follow_title', 'Pied de page - Titre Réseaux', 'Suivre l''actu'),
('footer_copyright', 'Pied de page - Copyright', '© 2024 NA Coaching - Master EOPS / Licence STAPS'),
('footer_sub_copyright', 'Pied de page - Sous-Copyright', 'Design Scientifique & Terrain')
ON CONFLICT (key) DO NOTHING;

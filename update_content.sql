-- Ajout ds clés manquantes pour le contenu dynamique
insert into site_content (key, label, value) values
  ('contact_title', 'TITRE "CONTACT"', 'Me Contacter'),
  ('contact_subtitle', 'SOUS-TITRE "CONTACT"', 'Une question sur un programme ou une demande de coaching ? Remplissez le formulaire ci-dessous.'),
  ('boutique_title', 'TITRE "BOUTIQUE"', 'BOUTIQUE PERFORMANCE'),
  ('boutique_text', 'TEXTE "BOUTIQUE"', 'Retrouvez tous mes programmes d''entraînement et de nutrition pour atteindre vos objectifs.'),
  ('footer_text', 'TEXTE PIED DE PAGE', '© 2026 NA Coaching. Tous droits réservés.');

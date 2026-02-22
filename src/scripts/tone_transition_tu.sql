-- =============================================================
-- SCRIPT DE TRANSITION VERS LE TUTOIEMENT (TU)
-- Met à jour tous les textes de la base de données
-- =============================================================

-- 1. HERO & CTAs
UPDATE site_content SET value = 'LA SCIENCE AU SERVICE DE TON MOUVEMENT' WHERE key = 'hero_title';
UPDATE site_content SET value = 'Optimisation de la performance et réathlétisation par un expert diplômé Master EOPS. Apprends à comprendre ton corps pour repousser tes limites.' WHERE key = 'hero_subtitle';
UPDATE site_content SET value = 'Mes outils pour toi' WHERE key = 'hero_cta_secondary';
UPDATE site_content SET value = 'Mes outils pour toi' WHERE key = 'hero_cta_secondary_v2';
UPDATE site_content SET value = 'Besoin d\'un accompagnement personnalisé ou d\'une question sur un programme ? N\'hésite pas à me contacter.' WHERE key = 'contact_cta_text';
UPDATE site_content SET value = 'Contacte-moi' WHERE key = 'contact_cta_button';
UPDATE site_content SET value = 'En tant que professionnel, je te conseille de ne jamais ignorer une douleur asymétrique.' WHERE key = 'expert_box_text';

-- 2. FAQ GLOBALE
UPDATE site_content SET value = '[
  {"question": "Le coaching est-il adapté aux débutants ?", "answer": "Absolument. En tant que Master EOPS, j\'adapte chaque programme à ton niveau, tes antécédents et tes objectifs pour une progression sécurisée."},
  {"question": "Proposez-vous des programmes de réathlétisation ?", "answer": "Oui, c\'est mon expertise première. Si tu sors d\'une blessure, nous établirons un protocole scientifique pour un retour au sport optimal."},
  {"question": "Comment fonctionne l\'achat d\'un programme digital ?", "answer": "Après paiement via notre système sécurisé, tu reçois immédiatement un accès à ton programme. Tout est accessible depuis ton téléphone ou ordinateur."}
]' WHERE key = 'site_faq';

-- 3. CONTENU DES OUTILS (CALCULATEURS)
UPDATE site_content SET value = replace(replace(replace(replace(replace(replace(replace(replace(value, 'votre', 'ta'), 'Votre', 'Ta'), 'vos', 'tes'), 'Vos', 'Tes'), 'avez', 'as'), 'pouvez', 'peux'), 'soulevez', 'soulèves'), 'apprenez', 'apprends')
WHERE key LIKE 'tool_%';

-- 4. BOUTIQUE / PRODUITS (Si besoin de forcer les sous-titres)
UPDATE site_content SET value = 'Ce que tu vas obtenir' WHERE key = 'product_page_features_title';

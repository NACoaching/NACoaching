-- 1. Insert global Homepage FAQs into site_content
INSERT INTO site_content (key, value)
VALUES (
    'site_faq', 
    '[{"question": "Le coaching sportif est-il adapté aux débutants ?", "answer": "Absolument. En tant que Master EOPS, j''adapte chaque séance à votre niveau initial, vos antécédents et vos objectifs personnels pour une progression sécurisée."}, {"question": "Comment se déroule le suivi à distance ?", "answer": "Via une application dédiée, vous recevez vos programmes vidéo, planifiez vos séances et nous communiquons quotidiennement. Un bilan est fait chaque semaine."}, {"question": "Proposez-vous des programmes de réathlétisation ?", "answer": "Oui, c''est mon expertise première. Si vous sortez d''une blessure (croisés, entorse, déchirure), nous établirons un protocole scientifique pour un retour au sport optimal."}]'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

-- 2. Insert sample FAQs into the first product (assuming it exists)
UPDATE products 
SET faqs = '[{"question": "Combien de temps dure ce programme ?", "answer": "Ce programme est conçu pour être suivi sur un cycle de 12 semaines, avec 3 à 4 séances par semaine recommandées pour des résultats optimaux."}, {"question": "Ai-je besoin de matériel spécifique ?", "answer": "Une paire d''haltères, un élastique de résistance et un banc (ou une chaise solide) suffisent pour réaliser la grande majorité de nos séances à domicile."}]'::jsonb
WHERE id = (SELECT id FROM products LIMIT 1);

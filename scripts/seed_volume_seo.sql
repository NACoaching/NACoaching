-- Auto-generated script to seed SEO content for Encyclopedia Pillar Pages into site_content

-- Auto-generated script to seed SEO content for Encyclopedia Pillar Pages into site_content

INSERT INTO site_content (key, label, value) VALUES 
('volume_seo_volume-1-la-science-de-la-force', 'SEO Volume 1', 'Bienvenue dans le Volume 1 de l''Encyclopédie NA Coaching, entièrement consacré à l''art et la science de devenir plus fort. 

L''entraînement en force n''est pas qu''une question de soulever lourd ; c''est une question de biomécanique, de tension mécanique, et de gestion nerveuse. 

Que vous cherchiez à exploser vos max au Squat, Bench et Deadlift (Force Athlétique / Powerlifting), à maximiser votre croissance musculaire (Hypertrophie), ou simplement à construire une armure solide pour prévenir les blessures, ce volume regroupe toutes les réponses.

Explorez nos chapitres détaillés ci-dessous pour maîtriser les concepts clés comme le RPE, le volume effectif, la surcharge progressive, et l''anatomie fonctionnelle appliquée à la musculation.'),

('volume_seo_volume-2-la-science-de-lendurance', 'SEO Volume 2', 'Bienvenue dans le Volume 2 de l''Encyclopédie NA Coaching : le guide ultime pour bâtir un cardio inépuisable.

L''endurance est bien plus qu''un simple footing du dimanche. C''est l''optimisation de vos filières énergétiques (aérobie, anaérobie lactique et alactique), la maîtrise de votre VMA (Vitesse Maximale Aérobie), et l''amélioration de votre VO2 Max.

Que vous soyez coureur (marathon, semi, 10km), cycliste, ou athlète de sport collectif (football, rugby) cherchant à répéter les sprints sans baisse de régime, vous trouverez ici la science exacte pour faire évoluer votre "moteur" interne.

Découvrez dans les chapitres ci-dessous les secrets de l''entraînement polarisé, le travail au seuil, et la physiologie de l''effort continu.'),

('volume_seo_volume-3-la-science-de-la-sante', 'SEO Volume 3', 'Le Volume 3 de l''Encyclopédie NA Coaching est dédié au pilier fondamental de la performance : la Santé et la Longévité.

Il n''y a pas de progression sans santé de fer. La performance brute sur le terrain est définie par ce que vous faites en dehors : comment vous mangez, comment vous dormez, et comment vous gérez votre stress physique et nerveux.

Dans ce volume, nous décryptons la science nutritionnelle (macros, micronutriments, hydratation), l''optimisation de la récupération (sommeil, gestion du système nerveux autonome), et les stratégies de réathlétisation pour soigner et prévenir les blessures.

Consultez nos articles ci-dessous pour transformer votre mode de vie et construire un corps capable d''endurer les années.')

ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, label = EXCLUDED.label;

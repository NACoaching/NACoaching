-- Insert default content for tools SEO
-- We use ON CONFLICT DO NOTHING to avoid errors if run multiple times, 
-- but ideally we want to update if it exists to match the hardcoded values we just created.
-- For simplicity in this migration, we'll use INSERT ... ON CONFLICT (key) DO UPDATE

INSERT INTO site_content (key, label, value) VALUES

-- 1RM Calculator
('tool_1rm_title', 'Titre Outil 1RM', 'Calculateur 1RM (Max Rep)'),
('tool_1rm_intro', 'Intro Outil 1RM', 'Estimez votre charge maximale théorique pour calibrer vos entraînements de force et d''hypertrophie.'),
('tool_1rm_content', 'Contenu SEO Outil 1RM', '<h2>Qu''est-ce que le 1RM en musculation ?</h2>
<p>
    Le <strong>1RM (One Repetition Maximum)</strong> correspond à la charge maximale que vous pouvez soulever sur une seule répétition complète avec une technique correcte. 
    C''est l''étalon de mesure de votre force absolue sur un exercice donné (Développé Couché, Squat, Soulevé de Terre, etc.).
</p>

<h2>Pourquoi calculer son 1RM ?</h2>
<p>
    Connaître votre 1RM est essentiel pour suivre un programme d''entraînement structuré. La plupart des programmes de force ou de prise de masse basent les charges de travail sur un pourcentage de votre 1RM :
</p>
<ul>
    <li><strong>Force maximale :</strong> 85% à 100% du 1RM</li>
    <li><strong>Hypertrophie (Masse) :</strong> 70% à 85% du 1RM</li>
    <li><strong>Endurance de force :</strong> &lt; 65% du 1RM</li>
</ul>

<h2>Comment utiliser ce calculateur ?</h2>
<p>
    Il n''est pas nécessaire de tester votre vrai 1RM à chaque séance, car cela est très taxant pour le système nerveux et augmente le risque de blessure. 
    Notre calculateur utilise la méthode de <strong>Brzycki</strong>, l''une des formules les plus précises, pour estimer votre max à partir d''une série de plusieurs répétitions (entre 2 et 10 de préférence).
</p>'),

-- Calories Calculator
('tool_calories_title', 'Titre Outil Calories', 'Calculateur de Calories'),
('tool_calories_intro', 'Intro Outil Calories', 'Déterminez vos besoins énergétiques précis pour la perte de poids, la maintenance ou la prise de masse.'),
('tool_calories_content', 'Contenu SEO Outil Calories', '<h2>Comprendre ses besoins caloriques</h2>
<p>
    La gestion du poids est avant tout une question de balance énergétique. Pour perdre du poids (sèche), vous devez consommer moins de calories que vous n''en dépensez. Pour prendre du poids (prise de masse), vous devez en consommer plus.
</p>

<h3>Les composantes de votre dépense énergétique</h3>
<ul>
    <li><strong>MB (Métabolisme de Base) :</strong> L''énergie nécessaire au fonctionnement de vos organes au repos complet.</li>
    <li><strong>NEAT (Non-Exercise Activity Thermogenesis) :</strong> L''énergie brûlée par vos mouvements du quotidien (marcher, bouger, travailler).</li>
    <li><strong>EAT (Exercise Activity Thermogenesis) :</strong> L''énergie brûlée par le sport.</li>
    <li><strong>TEF (Thermic Effect of Food) :</strong> L''énergie utilisée pour la digestion.</li>
</ul>

<h2>Comment ajuster ses macros ?</h2>
<p>
    Une fois votre total calorique défini par notre calculateur, il est important de bien répartir vos macronutriments :
</p>
<ul>
    <li><strong>Protéines :</strong> Essentielles pour la construction et le maintien musculaire (1.6g à 2.2g par kg de poids de corps).</li>
    <li><strong>Lipides :</strong> Importants pour le système hormonal (0.8g à 1.2g par kg).</li>
    <li><strong>Glucides :</strong> Le carburant de vos entraînements (le reste des calories).</li>
</ul>'),

-- Speed Converter
('tool_speed_title', 'Titre Outil Vitesse', 'Convertisseur Vitesse / Allure'),
('tool_speed_intro', 'Intro Outil Vitesse', 'Passez facilement des km/h aux min/km pour calibrer vos séances de course à pied.'),
('tool_speed_content', 'Contenu SEO Outil Vitesse', '<h2>Pourquoi convertir la vitesse en allure ?</h2>
<p>
    En course à pied, les montres GPS et les plans d''entraînement parlent souvent deux langages différents :
</p>
<ul>
    <li><strong>Vitesse (km/h) :</strong> Souvent utilisée sur tapis de course ou pour la VMA.</li>
    <li><strong>Allure (min/km) :</strong> Le standard pour les coureurs sur route et trail (ex: courir en 5:00/km signifie mettre 5 minutes pour faire 1 kilomètre).</li>
</ul>

<h2>Exemples de conversions courantes</h2>
<ul>
    <li><strong>10 km/h</strong> = 6:00 min/km</li>
    <li><strong>12 km/h</strong> = 5:00 min/km</li>
    <li><strong>15 km/h</strong> = 4:00 min/km</li>
    <li><strong>20 km/h</strong> = 3:00 min/km</li>
</ul>

<h2>L''importance pour le fractionné</h2>
<p>
    Lors d''une séance de VMA ou de seuil, connaître votre allure cible est crucial pour ne pas partir trop vite et exploser en vol, ou trop lentement et rater la stimulation physiologique recherchée.
</p>'),

-- VMA VO2 Converter
('tool_vma_title', 'Titre Outil VMA/VO2', 'Convertisseur VMA / VO2max'),
('tool_vma_intro', 'Intro Outil VMA/VO2', 'Analysez votre potentiel aérobie en reliant votre vitesse maximale à votre consommation d''oxygène.'),
('tool_vma_content', 'Contenu SEO Outil VMA/VO2', '<h2>VMA et VO2max : Quelle différence ?</h2>
<p>
    Ces deux valeurs sont intimement liées mais mesurent des choses différentes :
</p>
<ul>
    <li><strong>VO2max (ml/min/kg) :</strong> C''est la cylindrée de votre moteur. La quantité maximale d''oxygène que votre corps peut utiliser par minute.</li>
    <li><strong>VMA (km/h) :</strong> C''est la vitesse à laquelle vous atteignez votre consommation maximale d''oxygène. C''est le reflet de votre VO2max + votre économie de course.</li>
</ul>

<h2>La formule de Léger</h2>
<p>
    Notre outil utilise la formule simplifiée de Léger & Mercier : <br/>
    <code>VO2max = VMA x 3.5</code>
</p>
<p>
    Cette formule est une estimation fiable pour la majorité des coureurs, bien que l''économie de course (technique) puisse faire varier ce rapport.
</p>

<h2>À quoi ça sert ?</h2>
<p>
    Connaître ces valeurs permet de prédire vos performances potentielles sur des distances allant du 1500m au marathon, et surtout de définir vos allures d''entraînement précises.
</p>'),

-- Heart Rate Calculator
('tool_hr_title', 'Titre Outil FC', 'Zones de Fréquence Cardiaque'),
('tool_hr_intro', 'Intro Outil FC', 'Optimisez votre entraînement en ciblant les bonnes zones d''intensité grâce à la formule de Karvonen.'),
('tool_hr_content', 'Contenu SEO Outil FC', '<h2>Pourquoi utiliser la méthode Karvonen ?</h2>
<p>
    Contrairement à la méthode classique (<code>220 - âge</code>), la formule de Karvonen prend en compte votre <strong>Fréquence Cardiaque de Repos (FC Repos)</strong>.
    Cela la rend beaucoup plus précise et personnalisée, car elle se base sur votre <strong>Fréquence Cardiaque de Réserve</strong>.
</p>

<h2>Les 5 zones d''intensité</h2>
<ul>
    <li><strong>Zone 1 (50-60%) - Échauffement / Récupération :</strong> Effort très facile, pour récupérer ou s''échauffer.</li>
    <li><strong>Zone 2 (60-70%) - Endurance Fondamentale :</strong> La base de l''entraînement. Vous pouvez parler sans essoufflement. Idéal pour brûler les graisses.</li>
    <li><strong>Zone 3 (70-80%) - Endurance Active :</strong> Effort modéré. On travaille le "cardio" et on améliore l''endurance aérobie.</li>
    <li><strong>Zone 4 (80-90%) - Seuil Anaérobie :</strong> Effort difficile. On repousse la fatigue musculaire et l''accumulation d''acide lactique.</li>
    <li><strong>Zone 5 (90-100%) - VMA / Sprint :</strong> Effort maximal. Travail de la puissance et de la vitesse pure. Tenable seulement quelques minutes.</li>
</ul>')

ON CONFLICT (key) DO UPDATE SET
    label = EXCLUDED.label,
    value = EXCLUDED.value;

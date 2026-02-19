-- Crée la table 'site_content'
create table site_content (
  key text primary key,
  label text not null,
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sécurité (RLS)
alter table site_content enable row level security;

create policy "Enable read access for all users"
on site_content for select
using (true);

create policy "Enable insert/update/delete for authenticated only"
on site_content for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Insérer les données par défaut (Textes actuels du site)
insert into site_content (key, label, value) values
('hero_title', 'Titre Principal (Hero)', 'La science au service de votre mouvement'),
('hero_subtitle', 'Sous-titre (Hero)', 'Optimisation de la performance et réathlétisation par un expert diplômé Master EOPS. Apprenez à comprendre votre corps pour repousser vos limites.'),
('about_title', 'Titre "Le Labo"', 'Le Labo'),
('about_text', 'Description "Le Labo"', 'Ici, je vulgarise les concepts scientifiques de mon Master EOPS pour vous aider à optimiser votre entraînement et soigner vos blessures.'),
('shop_title', 'Titre Boutique', 'La Boutique'),
('shop_subtitle', 'Sous-titre Boutique', 'Des solutions prêtes à l''emploi, basées sur des protocoles de recherche pour des résultats concrets.');

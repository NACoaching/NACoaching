-- On ne touche pas à la table principale (déjà sécurisée par Supabase)
-- On ajoute juste les permissions

-- 1. Permission d'UPLOAD (Images)
CREATE POLICY "Auth Upload Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- 2. Permission de MODIFICATION (Images)
CREATE POLICY "Auth Update Images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

-- 3. Permission de SUPPRESSION (Images)
CREATE POLICY "Auth Delete Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );

-- Note: La lecture est déjà publique (Public Access), pas besoin de la rajouter.

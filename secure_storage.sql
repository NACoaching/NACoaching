-- 1. Create the bucket 'images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts or security holes
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Images" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects; -- clean up any potential test policies

-- 3. Create strict policies

-- Policy: Public Read Access (Everyone can view images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Policy: Authenticated Upload (Only logged-in users can upload)
CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Policy: Authenticated Update (Only logged-in users can update their own uploads or all uploads depending on requirement. Here giving access to all auth users for the bucket)
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

-- Policy: Authenticated Delete (Only logged-in users can delete)
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );

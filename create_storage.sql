-- Enable storage if not enabled (not possible via SQL usually, but good to check)
-- Create a public bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Set up RLS policy for public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Set up RLS policy for authenticated users to upload images (or public if needed for this demo)
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'images' );

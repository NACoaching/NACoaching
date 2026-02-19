-- Create a PRIVATE bucket for digital products
insert into storage.buckets (id, name, public)
values ('secure_products', 'secure_products', false);

-- Policy: Authenticated users (Admins) can upload/select/delete
create policy "Authenticated users can upload to secure_products"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'secure_products' );

create policy "Authenticated users can select from secure_products"
on storage.objects for select
to authenticated
using ( bucket_id = 'secure_products' );

create policy "Authenticated users can delete from secure_products"
on storage.objects for delete
to authenticated
using ( bucket_id = 'secure_products' );

-- Add file_path column to products table
alter table products
add column file_path text;

-- Add stripe_price_id column (optional, but good for tracking)
alter table products
add column stripe_price_id text;

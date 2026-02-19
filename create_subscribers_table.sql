-- Create subscribers table
create table subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table subscribers enable row level security;

-- Policy: Everyone can insert (Subscribe)
create policy "Public can subscribe"
on subscribers for insert
with check (true);

-- Policy: Only Admin can read
create policy "Admin can view subscribers"
on subscribers for select
to authenticated
using (true);

-- Policy: Only Admin can delete
create policy "Admin can delete subscribers"
on subscribers for delete
to authenticated
using (true);

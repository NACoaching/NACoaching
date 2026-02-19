-- Create page_views table
create table page_views (
  id uuid default uuid_generate_v4() primary key,
  page_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table page_views enable row level security;

-- Policy: Public can insert (Track views)
create policy "Public can track views"
on page_views for insert
with check (true);

-- Policy: Only Admin can read
create policy "Admin can view analytics"
on page_views for select
to authenticated
using (true);

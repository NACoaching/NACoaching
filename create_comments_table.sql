-- Create comments table
create table comments (
  id uuid default uuid_generate_v4() primary key,
  article_id uuid references articles(id) not null,
  author_name text not null,
  content text not null,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table comments enable row level security;

-- Policy: Everyone can read APPROVED comments
create policy "Public can read approved comments"
on comments for select
using (is_approved = true);

-- Policy: Everyone can insert comments (but they are unapproved by default)
create policy "Public can insert comments"
on comments for insert
with check (true);

-- Policy: Only authenticated (admin) can update/delete
create policy "Admin can update comments"
on comments for update
to authenticated
using (true);

create policy "Admin can delete comments"
on comments for delete
to authenticated
using (true);

-- Policy: Admin can read ALL comments (to moderate them)
create policy "Admin can read all comments"
on comments for select
to authenticated
using (true);

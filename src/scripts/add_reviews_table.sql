-- Create reviews table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references products(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  author_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table reviews enable row level security;

-- Policies
-- Allow everyone to read reviews
create policy "Reviews are viewable by everyone"
  on reviews for select
  using ( true );

-- Allow everyone to insert reviews (since we don't have user auth on store yet)
create policy "Anyone can insert reviews"
  on reviews for insert
  with check ( true );

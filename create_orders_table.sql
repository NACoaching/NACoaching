-- Create orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  product_id bigint references products(id) not null,
  stripe_session_id text,
  amount_total integer
);

-- Enable RLS
alter table orders enable row level security;

-- Policy: Only admin (service role) can insert/update/delete
-- But we might need read access for the API if we use supabase-js client side (we won't, we use API route)

-- For now, we only need internal access (via Service Role in API routes)
-- So we can leave RLS enabled with no policies (implicitly denies public access)

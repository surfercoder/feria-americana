-- SQL schema for products table
create table if not exists products (
  id bigint primary key,
  title text not null,
  color text,
  description text,
  brand text,
  size text,
  price text,
  other text,
  status text,
  buyer text,
  image text,
  category text default 'mujer'
);

-- Enable Row Level Security
alter table products enable row level security;

-- Allow all actions for anon (public) role for development
create policy "Allow all for anon" on products
  for all
  using (true)
  with check (true); 
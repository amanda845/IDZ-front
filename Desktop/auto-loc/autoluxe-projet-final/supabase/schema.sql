-- ============================================================
-- AUTOLUXE - SUPABASE SQL SCHEMA
-- Run this in your Supabase SQL Editor (in order)
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamp with time zone default now()
);

-- Vehicles
create table if not exists public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  brand text not null,
  model text not null,
  category text check (category in ('Luxury', 'Coupe', 'Supercar', 'Hypercar', 'SUV')),
  year integer,
  price_per_day numeric not null check (price_per_day > 0),
  available boolean default true,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Reservations
create table if not exists public.reservations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  license_url text,
  created_at timestamp with time zone default now(),
  constraint valid_dates check (end_date > start_date)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.reservations enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- VEHICLES POLICIES (public read)
create policy "Anyone can view vehicles"
  on public.vehicles for select
  using (true);

-- RESERVATIONS POLICIES
create policy "Users can view own reservations"
  on public.reservations for select
  using (auth.uid() = user_id);

create policy "Users can insert own reservations"
  on public.reservations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reservations"
  on public.reservations for update
  using (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Only insert if profile doesn't exist yet
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SEED DATA - Sample luxury vehicles
-- ============================================================

insert into public.vehicles (brand, model, category, year, price_per_day, available, image_url) values
('Tesla', 'Model X White', 'Luxury', 2024, 199, true, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80'),
('Ford', 'Mustang GT Premium', 'Coupe', 2024, 259, true, 'https://images.unsplash.com/photo-1584345604476-8ec5f452d1cd?w=800&q=80'),
('BMW', 'i8 Sports Car', 'Supercar', 2023, 349, true, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'),
('Mercedes-Benz', 'SLC-Class', 'Luxury', 2023, 289, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'),
('Mercedes-Benz', 'Classic CLA', 'Luxury', 2022, 259, true, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80'),
('Lamborghini', 'Huracán EVO', 'Supercar', 2024, 1499, true, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'),
('Ferrari', '488 GTB', 'Supercar', 2023, 1299, true, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'),
('Bugatti', 'Chiron', 'Hypercar', 2023, 4999, true, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80'),
('Rolls-Royce', 'Ghost', 'Luxury', 2024, 999, true, 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80'),
('Porsche', 'Cayenne Turbo', 'SUV', 2024, 449, true, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'),
('Range Rover', 'Sport HSE', 'SUV', 2024, 399, true, 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'),
('Bentley', 'Continental GT', 'Coupe', 2024, 899, true, 'https://images.unsplash.com/photo-1617469767053-8f67b7b6b47c?w=800&q=80');

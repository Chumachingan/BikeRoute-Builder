-- Schema SQL for BikeRoute Builder

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  coordinates jsonb not null,
  distance_km numeric not null,
  elevation_gain_m numeric not null,
  difficulty text not null,
  surface_stats jsonb not null,
  created_at timestamp with time zone default now()
);

alter table public.routes enable row level security;

create policy "Users can manage their own routes" on public.routes
  for all
  using (auth.uid() = user_id);

create policy "Users can insert their own routes" on public.routes
  for insert
  with check (auth.uid() = user_id);

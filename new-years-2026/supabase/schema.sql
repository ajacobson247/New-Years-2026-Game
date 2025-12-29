-- Minimal schema for the party QR game
-- Run this in Supabase SQL editor.

-- Enable UUID generation helpers
create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  type text not null,
  clue text null,
  player_id text null,
  player_name text null,
  user_agent text null
);

alter table public.events enable row level security;

-- Allow anyone (anon) to INSERT events (public QR game).
-- No SELECT policy: public cannot read events.
create policy "public can insert events"
  on public.events
  for insert
  to anon
  with check (true);

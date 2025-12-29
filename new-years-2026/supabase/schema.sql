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
  user_agent text null,

  -- For answer attempts (type = 'answer')
  is_correct boolean null
);

-- If you already created the table, these keep the schema up to date.
alter table public.events add column if not exists is_correct boolean;

alter table public.events enable row level security;

-- Allow anyone (anon) to INSERT events (public QR game).
-- No SELECT policy: public cannot read events.
create policy "public can insert events"
  on public.events
  for insert
  to anon
  with check (true);

-- Optional but helpful indexes for admin queries
create index if not exists events_type_created_at_idx on public.events (type, created_at desc);
create index if not exists events_clue_type_created_at_idx on public.events (clue, type, created_at desc);

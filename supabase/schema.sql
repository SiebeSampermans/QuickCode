create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text not null unique,
    score integer not null default 0 check (score >= 0),
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by everyone"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "users can insert their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

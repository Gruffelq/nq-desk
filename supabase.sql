-- NQ Desk: run once in Supabase → SQL Editor.
-- One table of encrypted rows. Each row belongs to the signed-in user; nobody else can read or change it.
create table if not exists public.nq_docs (
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null,
  iv text not null,
  ct text not null,
  updated_at timestamptz not null default now(),
  primary key (owner, id)
);
alter table public.nq_docs enable row level security;
drop policy if exists "own rows" on public.nq_docs;
create policy "own rows" on public.nq_docs for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());
revoke all on public.nq_docs from anon;

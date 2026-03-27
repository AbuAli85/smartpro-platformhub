begin;

create table if not exists public.schema_migrations (
  id uuid primary key default gen_random_uuid(),
  filename text not null unique,
  applied_at timestamptz not null default now()
);

create index if not exists idx_schema_migrations_applied_at
  on public.schema_migrations(applied_at desc);

commit;

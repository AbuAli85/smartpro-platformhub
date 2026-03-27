begin;

alter table public.schema_migrations
  add column if not exists checksum text;

commit;

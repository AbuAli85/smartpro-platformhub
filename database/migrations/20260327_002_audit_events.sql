begin;

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),

  actor_user_id uuid null references public.users(id) on delete set null,
  actor_type text not null check (actor_type in ('user', 'system', 'automation', 'support_override')),

  company_id uuid null references public.companies(id) on delete set null,

  action text not null,
  entity_type text not null,
  entity_id text not null,

  before_json jsonb null,
  after_json jsonb null,
  metadata_json jsonb null,

  created_at timestamptz not null default now()
);

create index if not exists idx_audit_events_actor_user_id
  on public.audit_events(actor_user_id);

create index if not exists idx_audit_events_company_id
  on public.audit_events(company_id);

create index if not exists idx_audit_events_action
  on public.audit_events(action);

create index if not exists idx_audit_events_entity
  on public.audit_events(entity_type, entity_id);

create index if not exists idx_audit_events_created_at
  on public.audit_events(created_at desc);

commit;

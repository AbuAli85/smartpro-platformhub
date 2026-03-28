begin;

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  service_id text not null,
  requested_by_user_id uuid not null references public.users(id) on delete restrict,
  status text not null check (
    status in (
      'draft',
      'submitted',
      'withdrawn',
      'converted_to_case',
      'cancelled'
    )
  ),
  submitted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_service_requests_company_id
  on public.service_requests(company_id);

create index if not exists idx_service_requests_company_status
  on public.service_requests(company_id, status);

create index if not exists idx_service_requests_created_at
  on public.service_requests(created_at desc);

drop trigger if exists trg_service_requests_updated_at on public.service_requests;
create trigger trg_service_requests_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

commit;

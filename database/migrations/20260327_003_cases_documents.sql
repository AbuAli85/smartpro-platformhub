begin;

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  service_id text not null,
  status text not null check (
    status in (
      'draft',
      'submitted',
      'under_review',
      'awaiting_documents',
      'in_progress',
      'pending_external',
      'approved',
      'rejected',
      'completed',
      'cancelled',
      'escalated'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cases_company_id
  on public.cases(company_id);

create index if not exists idx_cases_company_status
  on public.cases(company_id, status);

create index if not exists idx_cases_created_at
  on public.cases(created_at desc);

drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at
before update on public.cases
for each row execute function public.set_updated_at();

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  case_id uuid null references public.cases(id) on delete set null,
  status text not null check (
    status in (
      'uploaded',
      'pending_review',
      'valid',
      'invalid',
      'expired',
      'replaced',
      'rejected'
    )
  ),
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_company_id
  on public.documents(company_id);

create index if not exists idx_documents_case_company
  on public.documents(case_id, company_id);

create index if not exists idx_documents_company_status
  on public.documents(company_id, status);

create index if not exists idx_documents_created_at
  on public.documents(created_at desc);

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

commit;

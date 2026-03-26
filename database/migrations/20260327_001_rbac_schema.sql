-- 20260327_001_rbac_schema.sql

begin;

-- Optional: for UUID generation if not already enabled
create extension if not exists "pgcrypto";

-- =========================
-- prerequisite: users and companies (minimal stubs if not already present)
-- memberships / user_roles reference these; align with your canonical schema when it exists
-- =========================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- =========================
-- roles
-- =========================
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope_type text not null check (scope_type in ('platform', 'company')),
  description text,
  is_system_role boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roles_name_unique unique (name)
);

create index if not exists idx_roles_scope_type on public.roles(scope_type);

-- =========================
-- permissions
-- =========================
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint permissions_name_unique unique (name)
);

-- useful for prefix scans later if needed
create index if not exists idx_permissions_name on public.permissions(name);

-- =========================
-- role_permissions
-- =========================
create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create index if not exists idx_role_permissions_permission_id on public.role_permissions(permission_id);

-- =========================
-- memberships
-- baseline company membership table
-- assumes public.users and public.companies exist
-- if they already exist elsewhere, align foreign keys accordingly
-- =========================
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended', 'invited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_user_company_unique unique (user_id, company_id)
);

create index if not exists idx_memberships_user_id on public.memberships(user_id);
create index if not exists idx_memberships_company_id on public.memberships(company_id);
create index if not exists idx_memberships_status on public.memberships(status);

-- =========================
-- user_roles
-- platform roles => company_id null
-- company roles => company_id not null
-- =========================
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  company_id uuid null references public.companies(id) on delete cascade,
  assigned_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint user_roles_user_role_company_unique unique (user_id, role_id, company_id)
);

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role_id on public.user_roles(role_id);
create index if not exists idx_user_roles_company_id on public.user_roles(company_id);

-- =========================
-- updated_at trigger helper
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_roles_updated_at on public.roles;
create trigger trg_roles_updated_at
before update on public.roles
for each row execute function public.set_updated_at();

drop trigger if exists trg_permissions_updated_at on public.permissions;
create trigger trg_permissions_updated_at
before update on public.permissions
for each row execute function public.set_updated_at();

drop trigger if exists trg_memberships_updated_at on public.memberships;
create trigger trg_memberships_updated_at
before update on public.memberships
for each row execute function public.set_updated_at();

-- =========================
-- scope consistency check
-- company roles require company_id
-- platform roles require company_id null
-- =========================
create or replace function public.enforce_user_role_scope_consistency()
returns trigger
language plpgsql
as $$
declare
  v_scope_type text;
begin
  select scope_type into v_scope_type
  from public.roles
  where id = new.role_id;

  if v_scope_type is null then
    raise exception 'Role % not found', new.role_id;
  end if;

  if v_scope_type = 'platform' and new.company_id is not null then
    raise exception 'Platform role cannot be assigned with company_id';
  end if;

  if v_scope_type = 'company' and new.company_id is null then
    raise exception 'Company role requires company_id';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_user_roles_scope_consistency on public.user_roles;
create trigger trg_user_roles_scope_consistency
before insert or update on public.user_roles
for each row execute function public.enforce_user_role_scope_consistency();

commit;

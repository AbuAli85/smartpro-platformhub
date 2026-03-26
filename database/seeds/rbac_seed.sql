-- rbac_seed.sql

begin;

-- =========================
-- roles
-- =========================
insert into public.roles (name, scope_type, description, is_system_role)
values
  ('super_admin', 'platform', 'Highest privilege internal platform role', true),
  ('platform_admin', 'platform', 'Platform-wide administrative operator', true),
  ('reviewer', 'platform', 'Centralized reviewer role', true),
  ('support', 'platform', 'Operational support role', true),
  ('finance_admin', 'platform', 'Platform finance operations role', true),

  ('owner', 'company', 'Highest privilege within a company', true),
  ('company_admin', 'company', 'Administrative company role', true),
  ('manager', 'company', 'Operational manager role', true),
  ('staff', 'company', 'General internal staff role', true),
  ('provider', 'company', 'Provider-scoped role', true),
  ('client', 'company', 'Client/customer role', true)
on conflict (name) do update
set
  scope_type = excluded.scope_type,
  description = excluded.description,
  is_system_role = excluded.is_system_role,
  updated_at = now();

-- =========================
-- permissions
-- =========================
insert into public.permissions (name, description)
values
  ('admin:access', 'Access admin surfaces'),

  ('users:read', 'Read users'),
  ('users:manage', 'Manage users'),

  ('companies:read', 'Read companies'),
  ('companies:update', 'Update companies'),

  ('memberships:manage', 'Manage memberships'),

  ('roles:read', 'Read roles'),
  ('roles:manage', 'Manage roles'),
  ('permissions:read', 'Read permissions'),

  ('services:read', 'Read services'),
  ('services:manage', 'Manage services'),

  ('service_requests:create', 'Create service requests'),
  ('service_requests:read', 'Read service requests'),
  ('service_requests:update', 'Update service requests'),

  ('cases:create', 'Create cases'),
  ('cases:read', 'Read cases'),
  ('cases:update', 'Update cases'),
  ('cases:assign', 'Assign cases'),
  ('cases:approve', 'Approve cases'),
  ('cases:reject', 'Reject cases'),

  ('documents:upload', 'Upload documents'),
  ('documents:read', 'Read documents'),
  ('documents:verify', 'Verify documents'),
  ('documents:delete', 'Delete documents'),

  ('workflows:read', 'Read workflows'),
  ('workflows:manage', 'Manage workflows'),

  ('billing:read', 'Read billing'),
  ('billing:manage', 'Manage billing'),

  ('payments:create', 'Create payments'),
  ('payments:confirm', 'Confirm payments'),
  ('payments:refund', 'Refund payments'),

  ('notifications:read', 'Read notifications'),
  ('notifications:send', 'Send notifications'),

  ('reports:read', 'Read reports'),
  ('audit:read', 'Read audit events')
on conflict (name) do update
set
  description = excluded.description,
  updated_at = now();

-- =========================
-- role_permissions mapping
-- =========================

with rp as (
  select
    r.name as role_name,
    p.name as permission_name,
    r.id as role_id,
    p.id as permission_id
  from public.roles r
  join public.permissions p on (
    (r.name = 'platform_admin' and p.name in (
      'admin:access',
      'users:read','users:manage',
      'companies:read','companies:update',
      'roles:read','roles:manage',
      'permissions:read',
      'services:manage',
      'workflows:manage',
      'reports:read',
      'audit:read'
    ))
    or
    (r.name = 'reviewer' and p.name in (
      'admin:access',
      'cases:read','cases:approve','cases:reject',
      'documents:read','documents:verify',
      'reports:read'
    ))
    or
    (r.name = 'support' and p.name in (
      'admin:access',
      'users:read',
      'companies:read',
      'cases:read',
      'documents:read'
    ))
    or
    (r.name = 'finance_admin' and p.name in (
      'billing:read','billing:manage',
      'payments:create','payments:confirm','payments:refund',
      'reports:read','audit:read'
    ))
    or
    (r.name = 'owner' and p.name in (
      'companies:read','companies:update',
      'memberships:manage',
      'users:read',
      'services:read',
      'service_requests:create','service_requests:read','service_requests:update',
      'cases:create','cases:read','cases:update','cases:assign',
      'documents:upload','documents:read',
      'billing:read',
      'reports:read'
    ))
    or
    (r.name = 'company_admin' and p.name in (
      'companies:read',
      'memberships:manage',
      'users:read',
      'services:read',
      'service_requests:create','service_requests:read','service_requests:update',
      'cases:create','cases:read','cases:update','cases:assign',
      'documents:upload','documents:read',
      'reports:read'
    ))
    or
    (r.name = 'manager' and p.name in (
      'service_requests:read',
      'cases:read','cases:update','cases:assign',
      'documents:read','documents:upload',
      'reports:read'
    ))
    or
    (r.name = 'staff' and p.name in (
      'service_requests:create','service_requests:read',
      'cases:read',
      'documents:upload','documents:read'
    ))
    or
    (r.name = 'provider' and p.name in (
      'service_requests:read',
      'cases:read','cases:update',
      'documents:upload','documents:read'
    ))
    or
    (r.name = 'client' and p.name in (
      'service_requests:create','service_requests:read',
      'documents:upload','documents:read'
    ))
  )
)
insert into public.role_permissions (role_id, permission_id)
select distinct role_id, permission_id
from rp
on conflict do nothing;

-- super_admin gets all permissions
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'super_admin'
on conflict do nothing;

commit;

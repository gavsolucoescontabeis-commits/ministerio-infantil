-- V67: autorização exclusiva e auditoria de acesso assistido
-- Aplicar em janela de implantação. Não concede acesso às contas pelo Data API.
create table if not exists public.v67_master_access_owners (
  user_id uuid primary key references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
insert into public.v67_master_access_owners(user_id)
select p.id from public.profiles p
where p.role='developer' and p.active=true
  and (select count(*) from public.profiles where role='developer' and active=true)=1
on conflict do nothing;

create table if not exists public.v67_master_access_audit (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete restrict,
  target_id uuid not null references auth.users(id) on delete restrict,
  target_role text not null check(target_role in ('teacher','coordinator')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+ interval '15 minutes'),
  target_session_id uuid,
  activated_at timestamptz,
  ended_at timestamptz,
  check(admin_id <> target_id)
);
create index if not exists v67_master_access_audit_admin_idx on public.v67_master_access_audit(admin_id,started_at desc);
alter table public.v67_master_access_owners enable row level security;
alter table public.v67_master_access_audit enable row level security;
revoke all on public.v67_master_access_owners from public,anon,authenticated;
revoke all on public.v67_master_access_audit from public,anon,authenticated;
grant select on public.v67_master_access_owners to service_role;
grant select,insert,update on public.v67_master_access_audit to service_role;
-- A função de borda valida usuário e senha ANTES de emitir autenticação temporária.

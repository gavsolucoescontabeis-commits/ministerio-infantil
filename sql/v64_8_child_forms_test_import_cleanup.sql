-- V64 | Pré-cadastro externo de crianças (4ª IEQ Curitiba)
-- O formulário público grava SOMENTE pela Edge Function validada.
-- Nenhum acesso anon/authenticated direto a estas tabelas privadas.
create table if not exists public.child_registration_config_v64 (
  id boolean primary key default true check(id),
  mode text not null default 'test' check(mode in ('test','open','closed')),
  test_code_hash text not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.child_applications_v64 (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending' check(status in ('pending','approved','rejected','test_approved')),
  child_data jsonb not null check(jsonb_typeof(child_data)='object'),
  guardian_name text not null,
  guardian_phone text not null,
  guardian_relationship text not null,
  consent_at timestamptz not null,
  is_test boolean not null default true,
  ip_hash text not null,
  reviewed_at timestamptz,
  reviewed_by uuid,
  registry_child_id bigint
);
create index if not exists idx_child_applications_v64_status_created on public.child_applications_v64(status,created_at desc);
create index if not exists idx_child_applications_v64_ip_created on public.child_applications_v64(ip_hash,created_at desc);
alter table public.child_registration_config_v64 enable row level security;
alter table public.child_applications_v64 enable row level security;
revoke all on public.child_registration_config_v64 from anon,authenticated;
revoke all on public.child_applications_v64 from anon,authenticated;
grant all on public.child_registration_config_v64 to service_role;
grant all on public.child_applications_v64 to service_role;
-- Configuração do modo 'test' e código de teste: manter fora de publicação pública.

CREATE OR REPLACE FUNCTION public.v64_list_child_applications()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare result jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles where id=auth.uid() and role='developer' and active=true
  ) then raise exception 'Acesso restrito à administração' using errcode='42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',q.id,'status',q.status,'created_at',q.created_at,
    'child_data',q.child_data,'guardian_name',q.guardian_name,
    'guardian_phone',q.guardian_phone,'registry_child_id',q.registry_child_id,
    'guardian_relationship',q.guardian_relationship,'is_test',q.is_test
  ) order by q.created_at desc),'[]'::jsonb)
  into result
  from (
    select id,status,created_at,child_data,guardian_name,guardian_phone,
      guardian_relationship,is_test,registry_child_id
    from public.child_applications_v64
    where status='pending' or (status='test_approved' and registry_child_id is not null)
    order by created_at desc limit 150
  ) q;
  return result;
end $function$
;

CREATE OR REPLACE FUNCTION public.v64_remove_test_child_application(p_application_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  rec public.child_applications_v64%rowtype;
  state_before jsonb;
  app_owner uuid;
  rev bigint;
  rest_kids jsonb;
  state_without_child jsonb;
  target jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles where id=auth.uid() and role='developer' and active=true
  ) then raise exception 'Acesso restrito à administração' using errcode='42501'; end if;
  select * into rec from public.child_applications_v64 where id=p_application_id for update;
  if not found or not rec.is_test or rec.status<>'test_approved' or rec.registry_child_id is null
     then raise exception 'Cadastro de teste não elegível para remoção'; end if;
  select owner_id,data,revision into app_owner,state_before,rev
  from public.app_state_v58 where owner_id=(
    select id from public.profiles where role='developer' and active=true order by created_at limit 1
  ) for update;
  if state_before is null then raise exception 'Base principal não localizada'; end if;
  select item into target
  from jsonb_array_elements(coalesce(state_before->'kids','[]'::jsonb)) item
  where item->>'id'=rec.registry_child_id::text limit 1;
  if target is null or coalesce((target->>'registrationTest')::boolean,false) is not true
      or target->>'registrationApplicationId'<>rec.id::text
    then raise exception 'Registro não corresponde a teste; operação cancelada'; end if;
  select coalesce(jsonb_agg(item),'[]'::jsonb) into rest_kids
  from jsonb_array_elements(state_before->'kids') item
  where item->>'id'<>rec.registry_child_id::text;
  state_without_child:=jsonb_set(state_before,'{kids}',rest_kids);
  if position(rec.registry_child_id::text in state_without_child::text)>0 then
    raise exception 'A criança já possui referências ou históricos. Remoção bloqueada para proteger os dados.'; end if;
  update public.app_state_v58 set data=state_without_child,revision=rev+1,updated_at=now()
    where owner_id=app_owner;
  update public.child_applications_v64 set status='rejected',registry_child_id=null,
    updated_at=now(),reviewed_at=now(),reviewed_by=auth.uid() where id=rec.id;
  return jsonb_build_object('ok',true,'removed',true,'revision',rev+1);
end $function$
;

CREATE OR REPLACE FUNCTION public.v64_review_child_application(p_application_id uuid, p_action text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  rec public.child_applications_v64%rowtype;
  app_owner uuid;
  state_before jsonb;
  rev bigint;
  children jsonb;
  child jsonb;
  id_new bigint;
  n text;
  b text;
  bname text;
  obs text;
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles where id=auth.uid() and role='developer' and active=true
  ) then raise exception 'Acesso restrito à administração' using errcode='42501'; end if;
  if p_action not in ('approve','reject') then raise exception 'Ação inválida'; end if;
  select * into rec from public.child_applications_v64
    where id=p_application_id for update;
  if not found then raise exception 'Pré-cadastro não encontrado'; end if;
  if rec.status<>'pending' then raise exception 'Este pré-cadastro já foi analisado'; end if;

  if p_action='reject' then
    update public.child_applications_v64 set status='rejected',reviewed_at=now(),
      reviewed_by=auth.uid(),updated_at=now() where id=rec.id;
    return jsonb_build_object('ok',true,'status','rejected');
  end if;

  -- No registro de teste, insere com marcação e remoção controlada.

  n:=trim(coalesce(rec.child_data->>'name',''));
  b:=coalesce(rec.child_data->>'birth','');
  if length(n)<2 or b !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    then raise exception 'Nome ou nascimento inválido'; end if;

  select owner_id,data,revision into app_owner,state_before,rev
    from public.app_state_v58 where owner_id=(
      select id from public.profiles where role='developer' and active=true order by created_at limit 1
    ) for update;
  if state_before is null then raise exception 'Base principal não localizada'; end if;
  children:=coalesce(state_before->'kids','[]'::jsonb);
  if exists(
    select 1 from jsonb_array_elements(children) c
    where lower(trim(coalesce(c->>'name','')))=lower(n)
      and coalesce(c->>'birth','')=b
  ) then raise exception 'A criança já existe no cadastro geral. Confira antes de importar.'; end if;

  id_new:=floor(extract(epoch from clock_timestamp())*1000)::bigint * 1000
       + floor(random()*1000)::bigint;
  while exists(select 1 from jsonb_array_elements(children) c where c->>'id'=id_new::text) loop
    id_new:=id_new+1;
  end loop;

  child:=rec.child_data - 'broughtBy';
  obs:=coalesce(child->>'obs','');
  bname:=trim(coalesce(rec.child_data->>'broughtBy',''));
  if child->>'visitor'='sim' and bname<>'' then
    obs:=left(concat_ws(' | ',nullif(obs,''),'Visitante: quem trouxe (a conferir): '||bname),1500);
  end if;
  if rec.is_test then
    obs:=left(concat_ws(' | ','🧪 CADASTRO DE TESTE — não utilizar para presenças',nullif(obs,'')),1500);
  end if;
  child:=(child - 'visitorWithKidId') || jsonb_build_object(
     'id',id_new,'createdAt',clock_timestamp(),'initialTalents',0,
     'obs',obs,'visitorWithKidId','',
     'registrationTest',rec.is_test,
     'registrationApplicationId',rec.id::text,
     'registrationSource','parents_v64'
  );
  update public.app_state_v58 set data=jsonb_set(state_before,'{kids}',children||jsonb_build_array(child)),
    revision=rev+1,updated_at=now() where owner_id=app_owner;
  update public.child_applications_v64 set status=case when rec.is_test then 'test_approved' else 'approved' end,reviewed_at=now(),
    reviewed_by=auth.uid(),registry_child_id=id_new,updated_at=now() where id=rec.id;
  return jsonb_build_object('ok',true,
    'status',case when rec.is_test then 'test_approved' else 'approved' end,
    'is_test',rec.is_test,'imported',true,'child_id',id_new,'revision',rev+1);
end $function$
;

revoke all on function public.v64_list_child_applications() from public,anon,authenticated;
grant execute on function public.v64_list_child_applications() to authenticated;
revoke all on function public.v64_remove_test_child_application(uuid) from public,anon,authenticated;
grant execute on function public.v64_remove_test_child_application(uuid) to authenticated;
revoke all on function public.v64_review_child_application(uuid,text) from public,anon,authenticated;
grant execute on function public.v64_review_child_application(uuid,text) to authenticated;

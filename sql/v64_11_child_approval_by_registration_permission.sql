-- V64.11 | Autorizar confirmação de pré-cadastro infantil
-- Regra idêntica ao Cadastro Geral: developer, coordinator, ou teacher com perms.kids=true.
-- A autorização é verificada pela conta Supabase ativa e permissões atuais da equipe.
-- Cadastros de teste já importados só são listados à administração.

CREATE OR REPLACE FUNCTION public.v64_list_child_applications()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare result jsonb; access_info jsonb;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED' using errcode='42501'; end if;
  access_info:=public.v58_my_live_access();
  if not (
    access_info->>'role'='developer'
    or access_info->>'role'='coordinator'
    or (access_info->>'role'='teacher' and coalesce((access_info->'permissions'->>'kids')::boolean,false))
  ) then raise exception 'REGISTRY_PERMISSION_DENIED' using errcode='42501'; end if;
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
    where status='pending' or (status='test_approved' and registry_child_id is not null and access_info->>'role'='developer')
    order by created_at desc limit 150
  ) q;
  return result;
end $function$;

CREATE OR REPLACE FUNCTION public.v64_review_child_application(p_application_id uuid, p_action text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  rec public.child_applications_v64%rowtype;
  access_info jsonb;
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
  if auth.uid() is null then raise exception 'AUTH_REQUIRED' using errcode='42501'; end if;
  access_info:=public.v58_my_live_access();
  if not (
    access_info->>'role'='developer'
    or access_info->>'role'='coordinator'
    or (access_info->>'role'='teacher' and coalesce((access_info->'permissions'->>'kids')::boolean,false))
  ) then raise exception 'REGISTRY_PERMISSION_DENIED' using errcode='42501'; end if;
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
end $function$;

revoke all on function public.v64_list_child_applications() from public,anon,authenticated;
revoke all on function public.v64_review_child_application(uuid,text) from public,anon,authenticated;
grant execute on function public.v64_list_child_applications() to authenticated;
grant execute on function public.v64_review_child_application(uuid,text) to authenticated;

CREATE OR REPLACE FUNCTION public.v64_remove_test_child_with_room(p_application_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 a record;
 d jsonb;
 owner uuid;
 cid text;
 target jsonb;
 final_result jsonb;
begin
 if auth.uid() is null or not exists (
  select 1 from public.profiles
  where id=auth.uid() and role='developer' and active=true
 ) then raise exception 'Acesso restrito ao administrador'; end if;
 select * into a from public.child_applications_v64
   where id=p_application_id for update;
 if not found or a.is_test is not true
    or a.status<>'test_approved' or a.registry_child_id is null
 then raise exception 'Registro nao e um teste importado'; end if;
 cid:=a.registry_child_id::text;
 select owner_id,data into owner,d from public.app_state_v58
  where owner_id=(select id from public.profiles where role='developer' and active=true order by created_at limit 1)
  for update;
 if d is null then raise exception 'Base principal indisponivel'; end if;
 select item into target from jsonb_array_elements(coalesce(d->'kids','[]'::jsonb)) item
 where item->>'id'=cid limit 1;
 if target is null or target->>'registrationTest'<>'true'
    or target->>'registrationApplicationId'<>a.id::text then
 raise exception 'Identificacao do teste nao corresponde'; end if;
 if exists(
  select 1 from jsonb_array_elements(coalesce(d->'roomLinks','[]'::jsonb)) l
  where l->>'kid'=cid
   and exists (select 1 from jsonb_object_keys(l) k where k not in ('id','kid','room','date'))
 ) then raise exception 'Existe historico de transferencia da crianca. Exclusao bloqueada'; end if;
 update public.app_state_v58 set
  data=jsonb_set(jsonb_set(d,'{ebdRooms}',
    coalesce(d->'ebdRooms','{}'::jsonb)-cid,true),
   '{roomLinks}',(
    select coalesce(jsonb_agg(l order by ord),'[]'::jsonb)
    from jsonb_array_elements(coalesce(d->'roomLinks','[]'::jsonb))
    with ordinality as x(l,ord) where l->>'kid' is distinct from cid
   ),true),
  revision=revision+1,updated_at=now()
 where owner_id=owner;
 final_result:=public.v64_remove_test_child_application(p_application_id);
 return final_result || jsonb_build_object('room_unlinked',true);
end $function$
;
revoke all on function public.v64_remove_test_child_with_room(uuid) from public, anon, authenticated;
grant execute on function public.v64_remove_test_child_with_room(uuid) to authenticated;

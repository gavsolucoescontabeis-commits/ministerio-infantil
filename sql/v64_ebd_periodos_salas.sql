-- V64: operacoes pontuais da EBD, sempre autenticadas e com controle de revisao.
-- Guarda snapshots agregados no JSON ja existente; nao remove/zera registros.
create or replace function public.v64_ebd_manage_room(
 p_action text, p_room text, p_new_name text default null, p_expected_revision bigint default null)
returns jsonb language plpgsql security definer set search_path='' as $body$
declare
 a jsonb; s jsonb; rev bigint; v_owner uuid; old_name text:=trim(coalesce(p_room,''));
 new_name text:=trim(coalesce(p_new_name,'')); rooms jsonb; updated_rooms jsonb;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 a:=public.v58_my_live_access();
 if not (a->>'role'='developer' or
   (a->>'role'='coordinator' and coalesce((a->'permissions'->>'ebd')::boolean,false)))
 then raise exception 'EBD_COORDINATOR_PERMISSION_DENIED'; end if;
 if p_action not in ('add','rename','delete') then raise exception 'INVALID_ACTION'; end if;
 if length(old_name)<1 or length(old_name)>80 then raise exception 'INVALID_ROOM'; end if;
 if p_action='rename' and (length(new_name)<1 or length(new_name)>80) then raise exception 'INVALID_NEW_ROOM'; end if;
 select x.owner_id,x.data,x.revision into v_owner,s,rev
 from public.app_state_v58 x where x.owner_id=(
   select id from public.profiles where role='developer' and active=true order by created_at limit 1
 ) for update;
 if s is null then raise exception 'NO_STATE'; end if;
 if p_expected_revision is distinct from rev then raise exception 'REVISION_CONFLICT'; end if;
 rooms:=coalesce(s->'rooms','[]'::jsonb);
 if jsonb_typeof(rooms)<>'array' then raise exception 'INVALID_ROOMS'; end if;
 if p_action='add' then
  if exists (select 1 from jsonb_array_elements_text(rooms) r where lower(trim(r.value))=lower(old_name))
  then raise exception 'ROOM_ALREADY_EXISTS'; end if;
  if jsonb_array_length(rooms)>=100 then raise exception 'ROOM_LIMIT'; end if;
  updated_rooms:=rooms||to_jsonb(old_name);
 else
  if not rooms ? old_name then raise exception 'ROOM_NOT_FOUND'; end if;
  if p_action='rename' then
   if old_name=new_name then return jsonb_build_object('ok',true,'revision',rev,'unchanged',true); end if;
   if exists(select 1 from jsonb_array_elements_text(rooms) r where lower(trim(r.value))=lower(new_name))
   then raise exception 'ROOM_ALREADY_EXISTS'; end if;
   select coalesce(jsonb_agg(case when r.value=old_name then to_jsonb(new_name) else to_jsonb(r.value) end order by r.ord),'[]'::jsonb)
     into updated_rooms from jsonb_array_elements_text(rooms) with ordinality r(value,ord);
   -- Mantem vinculacoes atuais e referencias necessarias para consultas e ofertas.
   s:=jsonb_set(s,'{ebdRooms}',coalesce((select jsonb_object_agg(k.key,case when k.value=old_name then new_name else k.value end)
      from jsonb_each_text(coalesce(s->'ebdRooms','{}'::jsonb)) k),'{}'::jsonb),true);
   s:=jsonb_set(s,'{teachers}',coalesce((select jsonb_agg(case when t.item->>'room'=old_name
     then jsonb_set(t.item,'{room}',to_jsonb(new_name),true) else t.item end order by t.ord)
     from jsonb_array_elements(coalesce(s->'teachers','[]'::jsonb)) with ordinality t(item,ord)),'[]'::jsonb),true);
   s:=jsonb_set(s,'{roomLinks}',coalesce((select jsonb_agg(case when l.item->>'room'=old_name
     then jsonb_set(l.item,'{room}',to_jsonb(new_name),true) else l.item end order by l.ord)
     from jsonb_array_elements(coalesce(s->'roomLinks','[]'::jsonb)) with ordinality l(item,ord)),'[]'::jsonb),true);
   s:=jsonb_set(s,'{fin,ebd,offers}',coalesce((select jsonb_agg(case when o.item->>'room'=old_name
     then jsonb_set(o.item,'{room}',to_jsonb(new_name),true) else o.item end order by o.ord)
     from jsonb_array_elements(coalesce(s->'fin'->'ebd'->'offers','[]'::jsonb)) with ordinality o(item,ord)),'[]'::jsonb),true);
   update public.v58_staff_room_assignments set room_name=new_name where room_name=old_name;
  else
   if exists(select 1 from jsonb_each_text(coalesce(s->'ebdRooms','{}'::jsonb)) k where k.value=old_name)
   or exists(select 1 from jsonb_array_elements(coalesce(s->'teachers','[]'::jsonb)) t where t->>'room'=old_name)
   or exists(select 1 from public.v58_staff_room_assignments x where x.room_name=old_name)
   then raise exception 'ROOM_HAS_ACTIVE_LINKS'; end if;
   select coalesce(jsonb_agg(to_jsonb(r.value) order by r.ord),'[]'::jsonb) into updated_rooms
   from jsonb_array_elements_text(rooms) with ordinality r(value,ord) where r.value<>old_name;
  end if;
 end if;
 s:=jsonb_set(s,'{rooms}',updated_rooms,true);
 update public.app_state_v58 set data=s,revision=rev+1,updated_at=now() where owner_id=v_owner;
 return jsonb_build_object('ok',true,'revision',rev+1,'rooms',updated_rooms);
end $body$;

create or replace function public.v64_ebd_period(
 p_action text, p_start date default null, p_end date default null,
 p_label text default null, p_expected_revision bigint default null)
returns jsonb language plpgsql security definer set search_path='' as $body$
declare
 a jsonb; s jsonb; rev bigint; v_owner uuid; periods jsonb; item jsonb;
 snapshot jsonb; details jsonb:='[]'::jsonb; room text; cr integer; te integer;
 tp numeric; amount numeric; general_amount numeric:=0; total_points numeric:=0;
 total_offers numeric:=0; total_entries integer:=0; total_children integer:=0;
 offer_count integer:=0; label_clean text:=trim(coalesce(p_label,''));
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 a:=public.v58_my_live_access();
 if not (a->>'role'='developer' or
   (a->>'role'='coordinator' and coalesce((a->'permissions'->>'ebd')::boolean,false)))
 then raise exception 'EBD_COORDINATOR_PERMISSION_DENIED'; end if;
 if p_action not in ('list','preview','close') then raise exception 'INVALID_ACTION'; end if;
 select x.owner_id,x.data,x.revision into v_owner,s,rev from public.app_state_v58 x
 where x.owner_id=(select id from public.profiles where role='developer' and active=true order by created_at limit 1)
 for update;
 if s is null then raise exception 'NO_STATE'; end if;
 periods:=coalesce(s->'ebdClosures','[]'::jsonb);
 if p_action='list' then return jsonb_build_object('ok',true,'closures',periods,'revision',rev); end if;
 if p_start is null or p_end is null or p_end<p_start or p_end>current_date
    or p_end-p_start>366 then raise exception 'INVALID_PERIOD'; end if;
 if length(label_clean)<3 or length(label_clean)>100 then raise exception 'INVALID_LABEL'; end if;
 if p_action='close' then
   if p_expected_revision is distinct from rev then raise exception 'REVISION_CONFLICT'; end if;
   if exists(select 1 from jsonb_array_elements(periods) x
     where (x->>'start')::date<=p_end and (x->>'end')::date>=p_start)
   then raise exception 'PERIOD_OVERLAP'; end if;
 end if;
 for room in select value from jsonb_array_elements_text(coalesce(s->'rooms','[]'::jsonb)) loop
  select count(*) into cr from jsonb_each_text(coalesce(s->'ebdRooms','{}'::jsonb)) k where k.value=room;
  select count(*),coalesce(sum(
    case when t->>'normal'~'^[0-9]+([.][0-9]+)?$' then (t->>'normal')::numeric else 0 end
   +case when t->>'extra'~'^[0-9]+([.][0-9]+)?$' then (t->>'extra')::numeric else 0 end),0)
  into te,tp from jsonb_array_elements(coalesce(s->'talents','[]'::jsonb)) t
  where t->>'date'>=p_start::text and t->>'date'<=p_end::text
   and (s->'ebdRooms'->>(t->>'kid')=room
   or exists(select 1 from jsonb_array_elements(coalesce(s->'teachers','[]'::jsonb)) teacher
     where 'T'||(teacher->>'id')=t->>'kid' and teacher->>'room'=room));
  select coalesce(sum(case when o->>'value'~'^[0-9]+([.][0-9]+)?$'
    then (o->>'value')::numeric else 0 end),0),count(*) into amount,offer_count
  from jsonb_array_elements(coalesce(s->'fin'->'ebd'->'offers','[]'::jsonb)) o
  where o->>'date'>=p_start::text and o->>'date'<=p_end::text and o->>'room'=room;
  details:=details||jsonb_build_array(jsonb_build_object('room',room,'children',cr,
   'talentEntries',te,'talents',tp,'offers',amount,'offerEntries',offer_count));
  total_children:=total_children+cr;total_entries:=total_entries+te;
  total_points:=total_points+tp;total_offers:=total_offers+amount;
 end loop;
 select coalesce(sum(case when o->>'value'~'^[0-9]+([.][0-9]+)?$'
   then (o->>'value')::numeric else 0 end),0) into general_amount
 from jsonb_array_elements(coalesce(s->'fin'->'ebd'->'offers','[]'::jsonb)) o
 where o->>'date'>=p_start::text and o->>'date'<=p_end::text
   and (coalesce(o->>'room','')='' or not (coalesce(s->'rooms','[]'::jsonb) ? (o->>'room')));
 total_offers:=total_offers+general_amount;
 snapshot:=jsonb_build_object('id',gen_random_uuid(),'label',label_clean,
   'start',p_start,'end',p_end,'createdAt',clock_timestamp(),'createdBy',a->>'name',
   'createdByRole',a->>'role','revisionBase',rev,'rooms',details,
   'totalChildren',total_children,'talentEntries',total_entries,'talents',total_points,
   'offers',total_offers,'generalOffers',general_amount,
   'note','Retrato historico por sala e vinculacao atual. Sem exclusao de dados.');
 if p_action='preview' then return jsonb_build_object('ok',true,'preview',snapshot,'revision',rev); end if;
 s:=jsonb_set(s,'{ebdClosures}',periods||jsonb_build_array(snapshot),true);
 update public.app_state_v58 set data=s,revision=rev+1,updated_at=now() where owner_id=v_owner;
 return jsonb_build_object('ok',true,'closure',snapshot,'revision',rev+1);
end $body$;

-- Apenas contas autenticadas podem chamar estas funcoes, com autorizacao adicional por perfil.
revoke all on function public.v64_ebd_manage_room(text,text,text,bigint) from public, anon;
revoke all on function public.v64_ebd_period(text,date,date,text,bigint) from public, anon;
grant execute on function public.v64_ebd_manage_room(text,text,text,bigint) to authenticated;
grant execute on function public.v64_ebd_period(text,date,date,text,bigint) to authenticated;

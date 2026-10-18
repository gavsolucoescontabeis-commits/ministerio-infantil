-- V64.6c | 2026-10-18
-- Correção definitiva da ambiguidade de identificadores na aprovação da equipe.
-- room_name era simultaneamente variável PL/pgSQL e coluna de v58_staff_room_assignments.
-- Variável agora: v_requested_room. Conflito agora identificado pela constraint PK.
-- Preserva validação administrativa, associação transacional da sala e todo o fluxo aprovado.
-- Validado com upsert idempotente de teste sem persistir cadastros de pessoas.
CREATE OR REPLACE FUNCTION public.v60_import_staff_application(p_application_id uuid, p_target_role text, p_target_area text, p_room text, p_permissions jsonb, p_storage_path text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  app public.staff_applications_v60%rowtype;
  st public.app_state_v58%rowtype;
  new_id bigint;
  new_staff jsonb;
  perms jsonb;
  person_key text;
  v_requested_room text := btrim(coalesce(p_room,''));
  role_name text := lower(btrim(coalesce(p_target_role,'')));
  area_name text := lower(btrim(coalesce(p_target_area,'')));
  cpf_digits text;
  new_auth_user uuid;
  final_path text := btrim(coalesce(p_storage_path,''));
begin
  if not public.is_developer() then
    raise exception 'Acesso exclusivo do administrador';
  end if;

  if role_name not in ('teacher','coordinator','office') then
    raise exception 'Perfil inválido';
  end if;
  if area_name not in ('ebd','net') then
    raise exception 'Área inválida';
  end if;
  if final_path not like ('certidoes/'||auth.uid()::text||'/%') then
    raise exception 'Caminho definitivo da certidão inválido';
  end if;

  select * into app
  from public.staff_applications_v60
  where id=p_application_id
  for update;

  if not found then raise exception 'Pré-cadastro não encontrado'; end if;
  if app.status<>'pending' then raise exception 'Este pré-cadastro já foi analisado'; end if;

  select * into st
  from public.app_state_v58
  where owner_id=auth.uid()
  for update;

  if not found then raise exception 'Base principal não encontrada'; end if;

  cpf_digits:=regexp_replace(coalesce(app.cpf,''),'[^0-9]','','g');
  if length(cpf_digits)<>11 then raise exception 'CPF inválido no pré-cadastro'; end if;

  if role_name='teacher' then
    if area_name='ebd' then
      if v_requested_room='' then raise exception 'Selecione a sala da EBD'; end if;
      if not exists (
        select 1 from jsonb_array_elements_text(coalesce(st.data->'rooms','[]'::jsonb)) r
        where r=v_requested_room
      ) then raise exception 'Sala da EBD não encontrada'; end if;
    else
      v_requested_room:='';
    end if;

    if exists (
      select 1 from jsonb_array_elements(coalesce(st.data->'teachers','[]'::jsonb)) t
      where regexp_replace(coalesce(t->>'cpf',''),'[^0-9]','','g')=cpf_digits
        and coalesce(t->>'area','ebd')=area_name
    ) then raise exception 'Este CPF já está cadastrado como professor nesta área'; end if;

    perms:=jsonb_build_object(
      'tal', coalesce(p_permissions->'tal','false'::jsonb)='true'::jsonb,
      'fin', coalesce(p_permissions->'fin','false'::jsonb)='true'::jsonb,
      'rep', coalesce(p_permissions->'rep','false'::jsonb)='true'::jsonb,
      'kids', coalesce(p_permissions->'kids','false'::jsonb)='true'::jsonb,
      'check', true
    );

    new_id:=(extract(epoch from clock_timestamp())*1000)::bigint;
    while exists (
      select 1
      from jsonb_array_elements(coalesce(st.data->'teachers','[]'::jsonb) || coalesce(st.data->'coords','[]'::jsonb)) x
      where x->>'id'=new_id::text
    ) loop
      new_id:=new_id+1;
    end loop;

    new_staff:=jsonb_build_object(
      'id',new_id,
      'name',app.full_name,
      'cpf',cpf_digits,
      'area',area_name,
      'room',v_requested_room,
      'phone',app.phone,
      'email',coalesce(app.email,''),
      'perms',perms
    );
    st.data:=jsonb_set(st.data,'{teachers}',coalesce(st.data->'teachers','[]'::jsonb)||jsonb_build_array(new_staff),true);
    person_key:='teacher:'||new_id::text;
  else
    if exists (
      select 1 from jsonb_array_elements(coalesce(st.data->'coords','[]'::jsonb)) t
      where regexp_replace(coalesce(t->>'cpf',''),'[^0-9]','','g')=cpf_digits
        and coalesce(t->>'area','ebd')=area_name
    ) then raise exception 'Este CPF já está cadastrado como coordenador/escritório nesta área'; end if;

    perms:=jsonb_build_object(
      'ebd', coalesce(p_permissions->'ebd','false'::jsonb)='true'::jsonb,
      'net', coalesce(p_permissions->'net','false'::jsonb)='true'::jsonb,
      'tal', coalesce(p_permissions->'tal','false'::jsonb)='true'::jsonb,
      'fin', coalesce(p_permissions->'fin','false'::jsonb)='true'::jsonb,
      'repEbd', coalesce(p_permissions->'repEbd','false'::jsonb)='true'::jsonb,
      'repNet', coalesce(p_permissions->'repNet','false'::jsonb)='true'::jsonb,
      'importKids', coalesce(p_permissions->'importKids','false'::jsonb)='true'::jsonb,
      'addCoords', coalesce(p_permissions->'addCoords','false'::jsonb)='true'::jsonb,
      'kids', true,
      'check', true
    );

    new_id:=(extract(epoch from clock_timestamp())*1000)::bigint;
    while exists (
      select 1
      from jsonb_array_elements(coalesce(st.data->'teachers','[]'::jsonb) || coalesce(st.data->'coords','[]'::jsonb)) x
      where x->>'id'=new_id::text
    ) loop
      new_id:=new_id+1;
    end loop;

    new_staff:=jsonb_build_object(
      'id',new_id,
      'name',app.full_name,
      'cpf',cpf_digits,
      'area',area_name,
      'function',case when role_name='office' then 'office' else 'coordinator' end,
      'phone',app.phone,
      'email',coalesce(app.email,''),
      'perms',perms
    );
    st.data:=jsonb_set(st.data,'{coords}',coalesce(st.data->'coords','[]'::jsonb)||jsonb_build_array(new_staff),true);
    person_key:='coord:'||new_id::text;
  end if;

  -- Vincula a sala usando a sessao autenticada do ADMINISTRADOR.
  -- Antes, a Edge Function tentava gravar pela chave do servidor sem auth.uid(),
  -- e a validacao rejeitava ate salas existentes (ex.: Maternal).
  -- Fazer isto na mesma transacao preserva consistencia com o cadastro da equipe.
  if role_name='teacher' and area_name='ebd' then
    select p.id into new_auth_user
    from public.profiles p
    join public.account_login_aliases alias on alias.user_id=p.id
    join auth.users u on u.id=p.id
    where alias.cpf_digest=encode(extensions.digest(cpf_digits,'sha256'),'hex')
      and p.role='teacher'
      and p.active is true
      and lower(u.email)=lower(app.email)
    limit 1;
    if new_auth_user is null then
      raise exception 'Conta de professor nao encontrada para vinculacao a sala';
    end if;
    insert into public.v58_staff_room_assignments (staff_id,room_name)
    values (new_auth_user,v_requested_room)
    ON CONFLICT ON CONSTRAINT v58_staff_room_assignments_pkey DO NOTHING;
  end if;

  update public.app_state_v58
  set data=st.data,
      revision=st.revision+1,
      updated_at=now()
  where owner_id=st.owner_id;

  insert into public.v58_staff_documents(
    owner_id,person_key,issued_on,due_on,file_name,storage_path,verified_manually
  ) values (
    auth.uid(),person_key,app.cert_issued_on,(app.cert_issued_on+interval '6 months')::date,
    app.cert_file_name,final_path,false
  );

  update public.staff_applications_v60
  set status='imported',
      reviewed_at=now(),
      reviewed_by=auth.uid(),
      imported_person_key=person_key,
      cert_storage_path=final_path,
      updated_at=now()
  where id=app.id;

  return jsonb_build_object(
    'ok',true,
    'personKey',person_key,
    'staffId',new_id,
    'revision',st.revision+1
  );
end
$function$

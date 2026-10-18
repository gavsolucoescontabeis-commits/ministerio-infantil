-- V64: exclusão de qualquer criança antes da primeira movimentação.
-- A vinculação simples à sala não é movimentação; snapshots EBD são preservados.
create table if not exists public.v64_child_deletion_audit (
 id bigint generated always as identity primary key,
 child_id text not null,
 is_test boolean not null default false,
 deleted_by uuid not null,
 deleted_at timestamptz not null default now(),
 closure_snapshots_preserved integer not null default 0
);
alter table public.v64_child_deletion_audit enable row level security;
revoke all on public.v64_child_deletion_audit from public,anon,authenticated;
grant all on public.v64_child_deletion_audit to service_role;

CREATE OR REPLACE FUNCTION public.v64_delete_child_if_pristine(p_child_id text, p_action text DEFAULT 'check'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 v_owner uuid; v_data jsonb; v_revision bigint; v_kid jsonb; v_new jsonb;
 v_counts jsonb:='{}'::jsonb; v_reasons jsonb:='[]'::jsonb;
 v_count integer; v_snapshots integer:=0; v_sum integer:=0; v_key text;
 v_test boolean; v_other jsonb;
begin
 if auth.uid() is null or not exists(
  select 1 from public.profiles where id=auth.uid() and role='developer' and active=true
 ) then raise exception 'Acesso restrito a administracao' using errcode='42501'; end if;
 if p_action not in ('check','delete') then raise exception 'Acao invalida'; end if;
 if p_child_id is null or p_child_id !~ '^[0-9]{10,19}$' then raise exception 'Identificador invalido'; end if;

 select owner_id,data,revision into v_owner,v_data,v_revision
 from public.app_state_v58
 where owner_id=(select id from public.profiles where role='developer' and active=true order by created_at limit 1)
 for update;
 if v_data is null then raise exception 'Base indisponivel'; end if;
 select k into v_kid from jsonb_array_elements(coalesce(v_data->'kids','[]'::jsonb)) k
 where k->>'id'=p_child_id limit 1;
 if v_kid is null then return jsonb_build_object('ok',false,'not_found',true,'message','Cadastro ja nao existe. Atualize a pagina.'); end if;
 v_test:=coalesce(v_kid->>'registrationTest','false')='true';

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'checks','[]'::jsonb)) x
 where x->>'kid'=p_child_id or x->>'childId'=p_child_id or x->>'child_id'=p_child_id;
 v_counts:=v_counts||jsonb_build_object('entradas_saidas',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s registro(s) de entrada/saida',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'talents','[]'::jsonb)) x
 where x->>'kid'=p_child_id or x->>'childId'=p_child_id or x->>'child_id'=p_child_id;
 v_counts:=v_counts||jsonb_build_object('talentos',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s lancamento(s) de talentos',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'fin'->'ebd'->'offers','[]'::jsonb)) x
 where x->>'kid'=p_child_id or x->>'childId'=p_child_id or x->>'child_id'=p_child_id;
 v_counts:=v_counts||jsonb_build_object('ofertas_ebd',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s oferta(s) da EBD',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'fin'->'net'->'offers','[]'::jsonb)) x
 where x->>'kid'=p_child_id or x->>'childId'=p_child_id or x->>'child_id'=p_child_id;
 v_counts:=v_counts||jsonb_build_object('ofertas_rede',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s oferta(s) da Rede',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'ebdBrooches','[]'::jsonb)) x
 where x->>'kid'=p_child_id;
 v_counts:=v_counts||jsonb_build_object('broches',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s registro(s) de broche',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'roomTransfers','[]'::jsonb)) x
 where x->>'kid'=p_child_id or
  (jsonb_typeof(x->'kids')='array' and (x->'kids') ? p_child_id) or
  position(p_child_id in x::text)>0;
 v_counts:=v_counts||jsonb_build_object('transferencias',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s registro(s) de transferencia',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'roomLinks','[]'::jsonb)) x
 where x->>'kid'=p_child_id and (
  coalesce(x->>'kind','')='transfer'
  or coalesce(x->>'from','')<>''
  or exists (
    select 1 from jsonb_object_keys(x) field
    where field not in ('id','kid','room','date','kind')
  )
 );
 v_counts:=v_counts||jsonb_build_object('movimentacoes_sala',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s movimentacao(oes) de sala',v_count)); end if;

 select count(*) into v_count from jsonb_array_elements(coalesce(v_data->'kids','[]'::jsonb)) x
 where x->>'id'<>p_child_id and (x->>'visitorWithKidId'=p_child_id or x->>'broughtByChildId'=p_child_id);
 v_counts:=v_counts||jsonb_build_object('visitantes_vinculados',v_count);
 if v_count>0 then v_reasons:=v_reasons||jsonb_build_array(format('%s visitante(s) vinculado(s)',v_count)); end if;

 if coalesce(v_kid->>'initialTalents','') ~ '^[0-9]+$'
  and (v_kid->>'initialTalents')::numeric>0 then
  v_counts:=v_counts||jsonb_build_object('saldo_inicial_talentos',(v_kid->>'initialTalents')::numeric);
  v_reasons:=v_reasons||jsonb_build_array('possui saldo inicial de talentos');
 end if;

 -- Fechamentos sao fotografias historicas independentes e NUNCA sao editados na exclusao.
 select count(*) into v_snapshots from jsonb_array_elements(coalesce(v_data->'ebdClosures','[]'::jsonb)) x
 where position(p_child_id in x::text)>0;

 -- Bloquear outras referencias desconhecidas sem modificar historicos.
 select coalesce(jsonb_object_agg(k,v),'{}'::jsonb) into v_other
 from jsonb_each(v_data) as data(k,v)
 where k not in ('kids','checks','talents','fin','ebdBrooches','roomTransfers',
  'roomLinks','ebdRooms','ebdClosures');
 if position(p_child_id in v_other::text)>0
   or position(p_child_id in coalesce(v_data->'fin','{}'::jsonb)::text)>0
       and (v_counts->>'ofertas_ebd')::integer=0 and (v_counts->>'ofertas_rede')::integer=0 then
   v_reasons:=v_reasons||jsonb_build_array('outra referencia ou movimentacao vinculada');
 end if;

 if jsonb_array_length(v_reasons)>0 or p_action='check' then
  return jsonb_build_object('ok',true,'deleted',false,'can_delete',jsonb_array_length(v_reasons)=0,
   'reasons',v_reasons,'counts',v_counts,'preserved_closures',v_snapshots,
   'is_test',v_test,'child_name',v_kid->>'name','revision',v_revision);
 end if;

 -- Somente cadastro sem movimentacoes. Desvincula sala corrente e seus links simples.
 select coalesce(jsonb_agg(k order by ord),'[]'::jsonb) into v_new
 from jsonb_array_elements(coalesce(v_data->'kids','[]'::jsonb)) with ordinality as items(k,ord)
 where k->>'id'<>p_child_id;
 v_data:=jsonb_set(v_data,'{kids}',v_new,true);
 v_data:=jsonb_set(v_data,'{ebdRooms}',coalesce(v_data->'ebdRooms','{}'::jsonb)-p_child_id,true);
 select coalesce(jsonb_agg(k order by ord),'[]'::jsonb) into v_new
 from jsonb_array_elements(coalesce(v_data->'roomLinks','[]'::jsonb)) with ordinality as items(k,ord)
 where k->>'kid' is distinct from p_child_id;
 v_data:=jsonb_set(v_data,'{roomLinks}',v_new,true);

 update public.app_state_v58 set data=v_data,revision=v_revision+1,updated_at=now()
 where owner_id=v_owner;

 -- Finaliza a ficha pendente de TESTE, sem apagar dados enviados por responsaveis.
 update public.child_applications_v64
 set status='rejected',registry_child_id=null,updated_at=now(),reviewed_at=now(),reviewed_by=auth.uid()
 where is_test=true and status='test_approved' and registry_child_id::text=p_child_id;

 insert into public.v64_child_deletion_audit(child_id,is_test,deleted_by,closure_snapshots_preserved)
 values(p_child_id,v_test,auth.uid(),v_snapshots);
 return jsonb_build_object('ok',true,'deleted',true,'can_delete',true,
  'preserved_closures',v_snapshots,'revision',v_revision+1);
end $function$
;
revoke all on function public.v64_delete_child_if_pristine(text,text) from public,anon,authenticated;
grant execute on function public.v64_delete_child_if_pristine(text,text) to authenticated;

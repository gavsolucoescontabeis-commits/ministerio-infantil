-- V64.3: confirmar certidao ja recebida sem exigir novo upload.
-- Apenas administrador; registra verificacao MANUAL declarada, nao valida automaticamente autenticidade.
create or replace function public.v64_confirm_existing_staff_certificate(p_document_id uuid)
returns jsonb
language plpgsql
security definer
set search_path=''
as $function$
declare
  v_uid uuid:=auth.uid();
  v_doc public.v58_staff_documents%rowtype;
begin
  if v_uid is null or not public.is_developer() then
    raise exception 'Apenas o administrador pode confirmar a autenticidade';
  end if;
  select * into v_doc from public.v58_staff_documents
    where id=p_document_id and owner_id=v_uid
    for update;
  if not found then raise exception 'Certidao nao localizada'; end if;
  if not exists (
    select 1 from storage.objects o
    where o.bucket_id='certidoes-ministerio' and o.name=v_doc.storage_path
  ) then raise exception 'Arquivo da certidao nao encontrado no armazenamento'; end if;
  if not v_doc.verified_manually then
    update public.v58_staff_documents set verified_manually=true
    where id=p_document_id and owner_id=v_uid;
  end if;
  return jsonb_build_object('ok',true,'verified',true,'id',p_document_id,'personKey',v_doc.person_key);
end
$function$;
revoke all on function public.v64_confirm_existing_staff_certificate(uuid) from public,anon;
grant execute on function public.v64_confirm_existing_staff_certificate(uuid) to authenticated;
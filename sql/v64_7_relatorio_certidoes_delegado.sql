-- V64.7: acompanhamento de certidões. Metadados de equipe autorizada apenas.
CREATE OR REPLACE FUNCTION public.v64_staff_certificate_report()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_access jsonb;
  v_role text;
  v_perms jsonb;
  v_all boolean := false;
  v_ebd boolean := false;
  v_net boolean := false;
  v_state jsonb;
  v_rows jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Sessao obrigatoria'; END IF;

  SELECT p.role INTO v_role FROM public.profiles p
  WHERE p.id=v_uid AND p.active IS TRUE;
  IF v_role IS NULL THEN RAISE EXCEPTION 'Conta inativa ou sem perfil'; END IF;

  IF v_role='developer' AND public.is_developer() THEN
    v_all := true;
    v_ebd := true;
    v_net := true;
  ELSIF v_role='coordinator' THEN
    v_access:=public.v58_my_live_access();
    IF v_access->>'role'<>'coordinator' THEN RAISE EXCEPTION 'Sem permissao para relatorio'; END IF;
    v_perms:=COALESCE(v_access->'permissions','{}'::jsonb);
    v_ebd:=COALESCE((v_perms->>'repEbd')::boolean,false);
    v_net:=COALESCE((v_perms->>'repNet')::boolean,false);
    IF NOT v_ebd AND NOT v_net THEN RAISE EXCEPTION 'Sem permissao para relatorio de certidoes'; END IF;
  ELSE
    RAISE EXCEPTION 'Sem permissao para relatorio de certidoes';
  END IF;

  SELECT state.data INTO v_state FROM public.app_state_v58 state
  JOIN public.profiles admin ON admin.id=state.owner_id
  WHERE admin.role='developer' AND admin.active IS TRUE
  ORDER BY state.updated_at DESC LIMIT 1;
  IF v_state IS NULL THEN RAISE EXCEPTION 'Base principal indisponivel'; END IF;

  WITH people AS (
    SELECT
      'teacher'::text AS person_type,
      COALESCE(item->>'id','') AS person_id,
      COALESCE(item->>'name','') AS person_name,
      COALESCE(NULLIF(item->>'area',''),'ebd') AS area,
      'Professor(a)'::text AS role_name
    FROM jsonb_array_elements(COALESCE(v_state->'teachers','[]'::jsonb)) item
    UNION ALL
    SELECT
      'coord'::text,
      COALESCE(item->>'id',''),
      COALESCE(item->>'name',''),
      COALESCE(NULLIF(item->>'area',''),'ebd'),
      CASE WHEN item->>'function'='office' THEN 'Escritorio' ELSE 'Coordenador(a)' END
    FROM jsonb_array_elements(COALESCE(v_state->'coords','[]'::jsonb)) item
  ),
  scoped AS (
    SELECT person.* FROM people person
    WHERE person.person_id ~ '^[0-9]+$'
      AND person.person_name<>''
      AND ((person.area='ebd' AND v_ebd)
        OR (person.area='net' AND v_net))
  ),
  ranked AS (
    SELECT
      person.*,
      doc.issued_on,
      doc.due_on,
      doc.verified_manually,
      CASE
        WHEN doc.id IS NULL THEN 'missing'
        WHEN NOT doc.verified_manually THEN 'unverified'
        WHEN doc.due_on < current_date THEN 'expired'
        WHEN doc.due_on <= current_date+15 THEN 'due15'
        WHEN doc.due_on <= current_date+30 THEN 'due30'
        ELSE 'regular'
      END AS status_code
    FROM scoped person
    LEFT JOIN LATERAL (
      SELECT cert.id,cert.issued_on,cert.due_on,cert.verified_manually
      FROM public.v58_staff_documents cert
      JOIN public.profiles admin ON admin.id=cert.owner_id
      WHERE admin.role='developer' AND admin.active IS TRUE
        AND cert.person_key=person.person_type||':'||person.person_id
      ORDER BY cert.issued_on DESC,cert.created_at DESC
      LIMIT 1
    ) doc ON true
  )
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'personKey',ranked.person_type||':'||ranked.person_id,
      'name',ranked.person_name,
      'role',ranked.role_name,
      'area',ranked.area,
      'issued',ranked.issued_on,
      'due',ranked.due_on,
      'verified',ranked.verified_manually,
      'status',ranked.status_code
    )
    ORDER BY CASE ranked.status_code
      WHEN 'expired' THEN 0
      WHEN 'missing' THEN 1
      WHEN 'unverified' THEN 2
      WHEN 'due15' THEN 3
      WHEN 'due30' THEN 4
      ELSE 5 END,
      ranked.due_on NULLS FIRST,lower(ranked.person_name)
  ),'[]'::jsonb) INTO v_rows FROM ranked;

  RETURN jsonb_build_object(
    'asOf',current_date,
    'canReadEbd',v_ebd,
    'canReadNet',v_net,
    'admin',v_all,
    'rows',v_rows
  );
END;
$function$
;
REVOKE ALL ON FUNCTION public.v64_staff_certificate_report() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.v64_staff_certificate_report() TO authenticated;

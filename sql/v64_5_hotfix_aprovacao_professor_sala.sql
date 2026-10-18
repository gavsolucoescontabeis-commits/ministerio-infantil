-- OBSOLETO / REVOGADO: não executar a versão inicial deste hotfix.
-- A falha real foi corrigida na versão transacional, veja:
--   sql/v64_5b_aprovacao_sala_transacional.sql
--   supabase/functions/v60-admin-import-staff-application/index.ts
-- A sala é validada no RPC com o token do administrador, não no service_role.
-- Este arquivo restaura a validação estrita do trigger.
CREATE OR REPLACE FUNCTION public.v58_validate_room_assignment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.app_state_v58 s
    WHERE s.owner_id=auth.uid()
      AND s.data->'rooms' ? NEW.room_name
  ) THEN
    RAISE EXCEPTION 'Sala não cadastrada';
  END IF;
  RETURN NEW;
END;
$function$;
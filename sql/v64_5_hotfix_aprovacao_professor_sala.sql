-- Hotfix V64.5 / 18-10-2026: aprovação de professor(a) vinculada a sala.
-- O Edge Function v60-admin-import-staff-application autentica o administrador
-- e grava com chave de serviço. Nesse contexto auth.uid() não indica o administrador.
-- Por isso a validação anterior rejeitava qualquer sala válida ("Sala não cadastrada").
-- Mantém validações de sala válida, professor ativo, administrador ativo,
-- e não amplia permissões de chamadas autenticadas normais.
CREATE OR REPLACE FUNCTION public.v58_validate_room_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_is_service_role boolean := COALESCE(current_setting('request.jwt.claim.role', true), '') = 'service_role';
  v_owner uuid := auth.uid();
BEGIN
  IF v_is_service_role THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.profiles teacher_profile
      JOIN public.app_state_v58 state ON (state.data->'rooms' ? NEW.room_name)
      JOIN public.profiles admin_profile ON admin_profile.id = state.owner_id
      WHERE teacher_profile.id = NEW.staff_id
        AND teacher_profile.role = 'teacher'
        AND teacher_profile.active IS TRUE
        AND admin_profile.role = 'developer'
        AND admin_profile.active IS TRUE
    ) THEN
      RAISE EXCEPTION 'Sala não cadastrada ou professor não autorizado';
    END IF;
  ELSE
    IF v_owner IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.app_state_v58 s
      WHERE s.owner_id = v_owner AND s.data->'rooms' ? NEW.room_name
    ) THEN
      RAISE EXCEPTION 'Sala não cadastrada';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
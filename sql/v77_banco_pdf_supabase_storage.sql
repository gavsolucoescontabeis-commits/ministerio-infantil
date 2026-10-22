-- V77: publicação permanente dos cadernos bíblicos via Supabase Storage.
-- Executado no projeto Ministerio Infantil - 4 IEQ em 22/10/2026.
-- Original das artes segue intacto: arquivo PDF é enviado em bytes, sem recriação.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('mi-estudos-atividades','mi-estudos-atividades',true,52428800,ARRAY['application/pdf']::text[])
ON CONFLICT(id) DO NOTHING;

-- Upload apenas pela conta autenticada com papel developer. Arquivos imutáveis por nome UUID.
DROP POLICY IF EXISTS "mi_estudos_upload_developer_v77" ON storage.objects;
CREATE POLICY "mi_estudos_upload_developer_v77"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
 bucket_id='mi-estudos-atividades'
 AND (SELECT public.is_developer())
 AND name ~ '^[a-z0-9-]+/[0-9a-f-]{36}[.]pdf$'
);

GRANT INSERT (id,status,payload), UPDATE (status,payload,updated_at)
ON public.mi_study_activity_packages TO authenticated;

DO $migration$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='mi_study_activity_packages' AND policyname='mi_activity_editor_select_v77')
 THEN CREATE POLICY mi_activity_editor_select_v77 ON public.mi_study_activity_packages FOR SELECT TO authenticated USING ((SELECT public.is_developer())); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='mi_study_activity_packages' AND policyname='mi_activity_editor_insert_v77')
 THEN CREATE POLICY mi_activity_editor_insert_v77 ON public.mi_study_activity_packages FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_developer())); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='mi_study_activity_packages' AND policyname='mi_activity_editor_update_v77')
 THEN CREATE POLICY mi_activity_editor_update_v77 ON public.mi_study_activity_packages FOR UPDATE TO authenticated USING ((SELECT public.is_developer())) WITH CHECK ((SELECT public.is_developer())); END IF;
END $migration$;

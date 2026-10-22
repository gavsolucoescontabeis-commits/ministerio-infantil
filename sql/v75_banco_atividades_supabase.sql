-- V75: Banco persistente de atividades do Ministerio Infantil (22/10/2026)
-- O PDF original aprovado ja esta no GitHub Pages; este banco guarda somente metadados.
-- Executar no projeto Supabase jthxnjvqmvtydyfuqcct, sem alterar tabelas de acesso/EB D.
CREATE TABLE IF NOT EXISTS public.mi_study_activity_packages (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  status text NOT NULL CHECK (status IN ('draft','review','approved')),
  payload jsonb NOT NULL CHECK (
    jsonb_typeof(payload) = 'object'
    AND payload->>'id' = id AND payload->>'status' = status
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mi_study_activity_packages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mi_study_activity_packages FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.mi_study_activity_packages TO anon, authenticated;
DO $do$
BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname='public' AND tablename='mi_study_activity_packages'
    AND policyname='mi_study_activity_approved_read'
 ) THEN
   CREATE POLICY mi_study_activity_approved_read
     ON public.mi_study_activity_packages FOR SELECT TO anon, authenticated
     USING (status='approved');
 END IF;
END
$do$;
-- Cadastra a primeira atividade aprovada e conserva as demais em revisao.
-- Nao altera material ja cadastrado em execucoes posteriores.
INSERT INTO public.mi_study_activity_packages (id,status,payload)
VALUES
('criacao-9','approved','{"id":"criacao-9","title":"A Criação","age":9,"ageLabel":"7 a 9 anos","status":"approved","aliases":["a criação","criação","criação do mundo","o começo do mundo","começo do mundo","início do mundo","deus criou todas as coisas","deus criou tudo","gênesis 1","dias da criação","deus criou o mundo"],"books":["genesis 1"],"references":["Gênesis 1:1–2:3"],"summary":"Caderno A Criação com 10 páginas ilustradas (capa e nove atividades). PDF único, opcional, sem modificar o roteiro preparado pelo professor.","student":"./pacotes/A_Criacao.html","cover":"./assets/estudos/criacao_capa.webp","pages":10,"ageMin":7,"ageMax":9,"format":"pdf","teacher":""}'::jsonb),
('criacao-5-6','review','{"title":"A Criação","aliases":["a criação","criação","criação do mundo","o começo do mundo","início do mundo","deus criou todas as coisas","gênesis 1","dias da criação"],"books":["genesis 1"],"references":["Gênesis 1:1–2:3"],"status":"review","cover":"./assets/estudos/criacao_capa.webp","id":"criacao-5-6","age":5,"ageMin":5,"ageMax":6,"ageLabel":"5 e 6 anos","summary":"Prévia editorial ilustrada para 5–6 anos: descobertas com imagens, associação, desenho e missão.","student":"./pacotes/criacao-faixas-v72.html?idade=5-6&aba=child","teacher":"./pacotes/criacao-faixas-v72.html?idade=5-6&aba=teacher","pages":7}'::jsonb),
('criacao-10-12','review','{"title":"A Criação","aliases":["a criação","criação","criação do mundo","o começo do mundo","início do mundo","deus criou todas as coisas","gênesis 1","dias da criação"],"books":["genesis 1"],"references":["Gênesis 1:1–2:3"],"status":"review","cover":"./assets/estudos/criacao_capa.webp","id":"criacao-10-12","age":10,"ageMin":10,"ageMax":12,"ageLabel":"10 a 12 anos","summary":"Prévia editorial ilustrada para 10–12 anos: investigação bíblica, interpretação, evidências e aplicação.","student":"./pacotes/criacao-faixas-v72.html?idade=10-12&aba=child","teacher":"./pacotes/criacao-faixas-v72.html?idade=10-12&aba=teacher","pages":8}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Adicionar colunas para perfil e classificação de score
ALTER TABLE public.diagnostics 
ADD COLUMN IF NOT EXISTS profile TEXT,
ADD COLUMN IF NOT EXISTS score_classification TEXT,
ADD COLUMN IF NOT EXISTS quality_of_life INTEGER;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_diagnostics_profile ON public.diagnostics(profile);
CREATE INDEX IF NOT EXISTS idx_diagnostics_score_classification ON public.diagnostics(score_classification);

-- Criar tabela para armazenar histórico de scores
CREATE TABLE IF NOT EXISTS public.diagnostic_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  diagnostic_id UUID NOT NULL REFERENCES public.diagnostics(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL,
  dimension_scores JSONB NOT NULL,
  profile TEXT,
  score_classification TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diagnostic_history ENABLE ROW LEVEL SECURITY;

-- RLS policies para diagnostic_history
CREATE POLICY "Users can view own diagnostic history"
ON public.diagnostic_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostic history"
ON public.diagnostic_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all diagnostic history"
ON public.diagnostic_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Consultants can view client diagnostic history"
ON public.diagnostic_history
FOR SELECT
USING (has_role(auth.uid(), 'consultant'::app_role));

-- Criar tabela para notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Criar bucket de storage para relatórios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diagnostic-reports', 'diagnostic-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para relatórios
CREATE POLICY "Users can view own reports"
ON storage.objects
FOR SELECT
USING (bucket_id = 'diagnostic-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own reports"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'diagnostic-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all reports"
ON storage.objects
FOR SELECT
USING (bucket_id = 'diagnostic-reports' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Consultants can view client reports"
ON storage.objects
FOR SELECT
USING (bucket_id = 'diagnostic-reports' AND has_role(auth.uid(), 'consultant'::app_role));
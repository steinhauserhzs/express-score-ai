-- Criar enum para tipos de usuário
CREATE TYPE user_role AS ENUM ('client', 'consultant', 'admin');

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Consultants can view client profiles"
  ON public.profiles FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'consultant'
    AND role = 'client'
  );

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Criar dimensões do Score Express como enum
CREATE TYPE score_dimension AS ENUM (
  'debts',
  'behavior', 
  'spending',
  'goals',
  'reserves',
  'income'
);

-- Criar tabela de diagnósticos
CREATE TABLE public.diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responses_json JSONB NOT NULL,
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  dimension_scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT false
);

-- Habilitar RLS
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para diagnostics
CREATE POLICY "Users can view own diagnostics"
  ON public.diagnostics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostics"
  ON public.diagnostics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnostics"
  ON public.diagnostics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Consultants can view client diagnostics"
  ON public.diagnostics FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'consultant'
  );

CREATE POLICY "Admins can view all diagnostics"
  ON public.diagnostics FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Criar tabela de consultorias
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultations
CREATE POLICY "Clients can view own consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create own consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Consultants can view assigned consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() = consultant_id);

CREATE POLICY "Consultants can update assigned consultations"
  ON public.consultations FOR UPDATE
  USING (auth.uid() = consultant_id);

CREATE POLICY "Admins can manage all consultations"
  ON public.consultations FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Criar tabela de pagamentos
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em consultations
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil ao criar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Criar índices para performance
CREATE INDEX idx_diagnostics_user_id ON public.diagnostics(user_id);
CREATE INDEX idx_diagnostics_created_at ON public.diagnostics(created_at DESC);
CREATE INDEX idx_consultations_client_id ON public.consultations(client_id);
CREATE INDEX idx_consultations_consultant_id ON public.consultations(consultant_id);
CREATE INDEX idx_consultations_status ON public.consultations(status);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
-- Adicionar novos campos de endereço e documento à tabela profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS cep TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS rg TEXT;

-- Criar índice para busca por CEP (performance)
CREATE INDEX IF NOT EXISTS idx_profiles_cep ON public.profiles(cep);

-- Atualizar função handle_new_user para incluir novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone, 
    cpf,
    cep,
    street,
    city,
    state,
    rg,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'cpf', NULL),
    COALESCE(NEW.raw_user_meta_data->>'cep', NULL),
    COALESCE(NEW.raw_user_meta_data->>'street', NULL),
    COALESCE(NEW.raw_user_meta_data->>'city', NULL),
    COALESCE(NEW.raw_user_meta_data->>'state', NULL),
    COALESCE(NEW.raw_user_meta_data->>'rg', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'client'));
  
  RETURN NEW;
END;
$function$;
-- Adicionar colunas phone e cpf na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS cpf TEXT;

-- Adicionar constraint para validar CPF único
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS cpf_unique;

ALTER TABLE public.profiles
ADD CONSTRAINT cpf_unique UNIQUE (cpf);

-- Atualizar função handle_new_user para incluir phone e cpf
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, cpf, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'cpf', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'client'));
  
  RETURN NEW;
END;
$function$;
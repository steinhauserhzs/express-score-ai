-- Criar função para logar acessos de admins automaticamente
CREATE OR REPLACE FUNCTION log_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Só loga se for admin e não for o próprio perfil
  IF has_role(auth.uid(), 'admin'::app_role) AND auth.uid() != NEW.id THEN
    INSERT INTO admin_audit_logs (
      admin_id,
      action,
      table_name,
      record_id,
      accessed_at
    ) VALUES (
      auth.uid(),
      'SELECT',
      'profiles',
      NEW.id,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Comentário: Trigger automático será criado após aprovação da função
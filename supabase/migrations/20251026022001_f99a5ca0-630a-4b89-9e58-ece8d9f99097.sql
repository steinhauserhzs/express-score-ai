-- Remover função anterior já que triggers AFTER SELECT não existem no PostgreSQL
DROP FUNCTION IF EXISTS log_profile_access();

-- Criar função para ser chamada manualmente pelo código
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Só loga se for admin
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    INSERT INTO admin_audit_logs (
      admin_id,
      action,
      table_name,
      record_id,
      accessed_at
    ) VALUES (
      auth.uid(),
      p_action,
      p_table_name,
      p_record_id,
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';
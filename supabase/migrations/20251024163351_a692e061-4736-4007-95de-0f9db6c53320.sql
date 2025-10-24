-- Create audit log table for tracking admin access to sensitive data
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  accessed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.admin_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs (via service role or triggers)
CREATE POLICY "System can insert audit logs"
ON public.admin_audit_logs
FOR INSERT
WITH CHECK (true);

-- Improve the is_assigned_consultant function to only allow active consultations
CREATE OR REPLACE FUNCTION public.is_assigned_consultant(_consultant_id uuid, _client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.consultations
    WHERE consultant_id = _consultant_id
      AND client_id = _client_id
      AND status IN ('pending', 'scheduled', 'in_progress')
      AND (scheduled_date IS NULL OR scheduled_date >= now() - interval '90 days')
  )
$$;

-- Create function to log admin profile access
CREATE OR REPLACE FUNCTION public.log_admin_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user has admin role
  IF has_role(auth.uid(), 'admin'::app_role) AND auth.uid() != NEW.id THEN
    INSERT INTO public.admin_audit_logs (
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
$$;

-- Note: We can't directly trigger on SELECT, but we can add application-level logging
-- For now, we'll create a secure function that must be used for admin access

-- Create a secure function for admins to view profiles with automatic logging
CREATE OR REPLACE FUNCTION public.admin_view_profile(_profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  phone text,
  cpf text,
  role user_role,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin role
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  -- Log the access
  INSERT INTO public.admin_audit_logs (
    admin_id,
    action,
    table_name,
    record_id
  ) VALUES (
    auth.uid(),
    'ADMIN_VIEW_PROFILE',
    'profiles',
    _profile_id
  );
  
  -- Return the profile
  RETURN QUERY
  SELECT p.id, p.full_name, p.email, p.phone, p.cpf, p.role, p.created_at, p.updated_at
  FROM public.profiles p
  WHERE p.id = _profile_id;
END;
$$;

-- Add index for better performance on consultations lookup
CREATE INDEX IF NOT EXISTS idx_consultations_consultant_client 
ON public.consultations(consultant_id, client_id, status);

-- Add index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_accessed 
ON public.admin_audit_logs(admin_id, accessed_at DESC);
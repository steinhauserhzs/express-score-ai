-- Drop the insecure consultant policy
DROP POLICY IF EXISTS "Consultants can view client profiles" ON public.profiles;

-- Create a security definer function to check if a consultant is assigned to a client
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
  )
$$;

-- Create a new secure policy that only allows consultants to view their assigned clients
CREATE POLICY "Consultants can only view assigned client profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR (
    has_role(auth.uid(), 'consultant'::app_role) 
    AND is_assigned_consultant(auth.uid(), id)
  )
);
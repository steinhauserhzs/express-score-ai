-- Fix 1: Add INSERT policy to payments table to prevent unauthorized payment creation
-- Payments should only be created through secure backend functions with proper validation
CREATE POLICY "Block direct payment inserts"
ON public.payments
FOR INSERT
WITH CHECK (false);

-- Fix 2: Restrict consultant access to diagnostics - only assigned clients
DROP POLICY IF EXISTS "Consultants can view client diagnostics" ON public.diagnostics;

CREATE POLICY "Consultants can view assigned client diagnostics"
ON public.diagnostics
FOR SELECT
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (has_role(auth.uid(), 'consultant'::app_role) 
      AND is_assigned_consultant(auth.uid(), user_id))
);

-- Fix 3: Apply same restriction to diagnostic_history table
DROP POLICY IF EXISTS "Consultants can view client diagnostic history" ON public.diagnostic_history;

CREATE POLICY "Consultants can view assigned client diagnostic history"
ON public.diagnostic_history
FOR SELECT
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (has_role(auth.uid(), 'consultant'::app_role) 
      AND is_assigned_consultant(auth.uid(), user_id))
);
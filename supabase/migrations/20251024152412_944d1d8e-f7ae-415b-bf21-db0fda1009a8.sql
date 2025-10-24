-- Fix security issue: Move roles to separate table
CREATE TYPE public.app_role AS ENUM ('client', 'consultant', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles table RLS to use has_role function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Consultants can view client profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Consultants can view client profiles"
ON public.profiles FOR SELECT
USING (
  public.has_role(auth.uid(), 'consultant') OR
  auth.uid() = id
);

-- Update consultations RLS
DROP POLICY IF EXISTS "Admins can manage all consultations" ON public.consultations;

CREATE POLICY "Admins can manage all consultations"
ON public.consultations FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update diagnostics RLS
DROP POLICY IF EXISTS "Admins can view all diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "Consultants can view client diagnostics" ON public.diagnostics;

CREATE POLICY "Admins can view all diagnostics"
ON public.diagnostics FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Consultants can view client diagnostics"
ON public.diagnostics FOR SELECT
USING (public.has_role(auth.uid(), 'consultant'));

-- Update payments RLS
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;

CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger to create default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  
  -- Create default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'client'));
  
  RETURN NEW;
END;
$$;

-- Add progress tracking to diagnostics
ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 0;
ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS total_steps INTEGER DEFAULT 0;
-- Promote Hairã to admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'steinhauser.haira@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add optional tracking fields for better admin insights
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create admin notes table for internal notes (LGPD compliant)
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES profiles(id) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_notes
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Only admins can manage notes
CREATE POLICY "Admins can manage all notes"
ON admin_notes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for admin_notes updated_at
CREATE TRIGGER update_admin_notes_updated_at
BEFORE UPDATE ON admin_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
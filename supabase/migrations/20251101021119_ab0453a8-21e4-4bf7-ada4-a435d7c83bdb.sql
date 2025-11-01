-- Add foreign key between admin_audit_logs and profiles
ALTER TABLE admin_audit_logs 
ADD CONSTRAINT fk_admin_audit_logs_admin 
FOREIGN KEY (admin_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Create index to improve JOIN performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id 
ON admin_audit_logs(admin_id);
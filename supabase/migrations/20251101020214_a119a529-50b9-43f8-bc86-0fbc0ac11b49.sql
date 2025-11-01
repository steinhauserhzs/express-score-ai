-- Add foreign key between diagnostics and profiles
ALTER TABLE diagnostics 
ADD CONSTRAINT fk_diagnostics_user 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Create index to improve JOIN performance
CREATE INDEX IF NOT EXISTS idx_diagnostics_user_id 
ON diagnostics(user_id);
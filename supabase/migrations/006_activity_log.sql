-- Create activity_log table
-- Tracks user actions for analytics and audit

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT, -- 'match', 'intro', 'profile', etc.
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can only view their own activity
CREATE POLICY "Users can view own activity"
  ON activity_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert activity (using service role)
CREATE POLICY "System can insert activity"
  ON activity_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO activity_log (user_id, action, entity_type, entity_id, metadata)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_metadata)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log profile views
CREATE OR REPLACE FUNCTION log_profile_view()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'viewed' AND OLD.status = 'pending' THEN
    PERFORM log_activity(
      auth.uid(),
      'profile_viewed',
      'match',
      NEW.id,
      jsonb_build_object(
        'startup_id', NEW.startup_id,
        'investor_id', NEW.investor_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER match_viewed
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION log_profile_view();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- Create view for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT
  al.id,
  al.user_id,
  al.action,
  al.entity_type,
  al.entity_id,
  al.metadata,
  al.created_at,
  p.name as user_name,
  p.role as user_role
FROM activity_log al
JOIN profiles p ON p.id = al.user_id
ORDER BY al.created_at DESC;

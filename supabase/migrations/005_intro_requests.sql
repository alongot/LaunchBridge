-- Create intro_requests table
-- Tracks introduction requests between matched parties

CREATE TABLE IF NOT EXISTS intro_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'declined', 'expired'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days')
);

-- Enable RLS
ALTER TABLE intro_requests ENABLE ROW LEVEL SECURITY;

-- Senders can view their sent requests
CREATE POLICY "Users can view sent intro requests"
  ON intro_requests
  FOR SELECT
  USING (auth.uid() = sender_id);

-- Receivers can view received requests
CREATE POLICY "Users can view received intro requests"
  ON intro_requests
  FOR SELECT
  USING (auth.uid() = receiver_id);

-- Users can create intro requests for their matches
CREATE POLICY "Users can create intro requests"
  ON intro_requests
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Receivers can update (respond to) intro requests
CREATE POLICY "Receivers can respond to intro requests"
  ON intro_requests
  FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Function to update match status when intro is requested
CREATE OR REPLACE FUNCTION on_intro_request_created()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE matches
  SET status = 'intro-requested'
  WHERE id = NEW.match_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER intro_request_created
  AFTER INSERT ON intro_requests
  FOR EACH ROW
  EXECUTE FUNCTION on_intro_request_created();

-- Function to update match status when intro is accepted
CREATE OR REPLACE FUNCTION on_intro_request_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    NEW.responded_at := NOW();
    UPDATE matches
    SET status = 'connected'
    WHERE id = NEW.match_id;
  ELSIF NEW.status = 'declined' AND OLD.status = 'pending' THEN
    NEW.responded_at := NOW();
    UPDATE matches
    SET status = 'declined'
    WHERE id = NEW.match_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER intro_request_responded
  BEFORE UPDATE ON intro_requests
  FOR EACH ROW
  EXECUTE FUNCTION on_intro_request_accepted();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intro_requests_match ON intro_requests(match_id);
CREATE INDEX IF NOT EXISTS idx_intro_requests_sender ON intro_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_intro_requests_receiver ON intro_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_intro_requests_status ON intro_requests(status);

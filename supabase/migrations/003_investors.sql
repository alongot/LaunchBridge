-- Create investors table
-- Stores investor profile and investment criteria

CREATE TABLE IF NOT EXISTS investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  firm_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  location TEXT NOT NULL,
  investor_type TEXT NOT NULL CHECK (investor_type IN (
    'angel', 'vc', 'family-office', 'corporate'
  )),
  check_size_min BIGINT NOT NULL DEFAULT 0,
  check_size_max BIGINT NOT NULL DEFAULT 0,
  preferred_stages TEXT[] NOT NULL DEFAULT '{}',
  preferred_sectors TEXT[] NOT NULL DEFAULT '{}',
  portfolio_count INTEGER NOT NULL DEFAULT 0,
  thesis TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Investor owners can view and edit their own profile
CREATE POLICY "Users can view own investor profile"
  ON investors
  FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own investor profile"
  ON investors
  FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own investor profile"
  ON investors
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own investor profile"
  ON investors
  FOR DELETE
  USING (auth.uid() = profile_id);

-- Startups can view all investors (for matching)
CREATE POLICY "Startups can view all investors"
  ON investors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'startup'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_investors_type ON investors(investor_type);
CREATE INDEX IF NOT EXISTS idx_investors_location ON investors(location);
CREATE INDEX IF NOT EXISTS idx_investors_check_size ON investors(check_size_min, check_size_max);

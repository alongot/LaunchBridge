-- Create startups table
-- Stores startup company information

CREATE TABLE IF NOT EXISTS startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  founded_year INTEGER NOT NULL,
  team_size INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL,
  sector TEXT NOT NULL CHECK (sector IN (
    'ai-ml', 'fintech', 'healthtech', 'cleantech', 'saas',
    'consumer', 'edtech', 'foodtech', 'agtech', 'biotech',
    'hardware', 'marketplace'
  )),
  stage TEXT NOT NULL CHECK (stage IN (
    'pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'
  )),
  funding_target BIGINT NOT NULL DEFAULT 0,
  funding_raised BIGINT NOT NULL DEFAULT 0,
  pitch_deck_url TEXT,
  highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- Startup owners can view and edit their own startup
CREATE POLICY "Users can view own startup"
  ON startups
  FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own startup"
  ON startups
  FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own startup"
  ON startups
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own startup"
  ON startups
  FOR DELETE
  USING (auth.uid() = profile_id);

-- Investors can view all startups (for matching)
CREATE POLICY "Investors can view all startups"
  ON startups
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'investor'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER startups_updated_at
  BEFORE UPDATE ON startups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_startups_sector ON startups(sector);
CREATE INDEX IF NOT EXISTS idx_startups_stage ON startups(stage);
CREATE INDEX IF NOT EXISTS idx_startups_location ON startups(location);

-- Create matches table
-- Stores match scores and status between startups and investors

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  score_breakdown JSONB NOT NULL DEFAULT '{
    "stage_alignment": 0,
    "sector_match": 0,
    "check_size_fit": 0,
    "location_bonus": 0
  }',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'viewed', 'intro-requested', 'connected', 'declined'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  UNIQUE(startup_id, investor_id)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users can view their own matches
CREATE POLICY "Startups can view their matches"
  ON matches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM startups
      WHERE startups.id = matches.startup_id
      AND startups.profile_id = auth.uid()
    )
  );

CREATE POLICY "Investors can view their matches"
  ON matches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM investors
      WHERE investors.id = matches.investor_id
      AND investors.profile_id = auth.uid()
    )
  );

-- Users can update status of their matches
CREATE POLICY "Startups can update their match status"
  ON matches
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM startups
      WHERE startups.id = matches.startup_id
      AND startups.profile_id = auth.uid()
    )
  );

CREATE POLICY "Investors can update their match status"
  ON matches
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM investors
      WHERE investors.id = matches.investor_id
      AND investors.profile_id = auth.uid()
    )
  );

-- Function to calculate match score
CREATE OR REPLACE FUNCTION calculate_match_score(
  p_startup_id UUID,
  p_investor_id UUID
) RETURNS TABLE (
  score INTEGER,
  breakdown JSONB
) AS $$
DECLARE
  v_startup startups%ROWTYPE;
  v_investor investors%ROWTYPE;
  v_stage_score INTEGER := 0;
  v_sector_score INTEGER := 0;
  v_size_score INTEGER := 0;
  v_location_score INTEGER := 0;
  v_total INTEGER := 0;
BEGIN
  -- Get startup and investor
  SELECT * INTO v_startup FROM startups WHERE id = p_startup_id;
  SELECT * INTO v_investor FROM investors WHERE id = p_investor_id;

  -- Stage alignment (max 25 points)
  IF v_startup.stage = ANY(v_investor.preferred_stages) THEN
    v_stage_score := 25;
  ELSIF v_startup.stage IN ('pre-seed', 'seed') AND 'seed' = ANY(v_investor.preferred_stages) THEN
    v_stage_score := 15;
  END IF;

  -- Sector match (max 30 points)
  IF v_startup.sector = ANY(v_investor.preferred_sectors) THEN
    v_sector_score := 30;
  END IF;

  -- Check size fit (max 30 points)
  IF v_startup.funding_target >= v_investor.check_size_min
     AND v_startup.funding_target <= v_investor.check_size_max * 5 THEN
    IF v_startup.funding_target <= v_investor.check_size_max THEN
      v_size_score := 30;
    ELSE
      v_size_score := 20;
    END IF;
  END IF;

  -- Location bonus (max 15 points)
  IF v_startup.location ILIKE '%san francisco%' AND v_investor.location ILIKE '%san francisco%' THEN
    v_location_score := 15;
  ELSIF v_startup.location ILIKE '%california%' AND v_investor.location ILIKE '%california%' THEN
    v_location_score := 10;
  END IF;

  v_total := v_stage_score + v_sector_score + v_size_score + v_location_score;

  RETURN QUERY SELECT
    v_total,
    jsonb_build_object(
      'stage_alignment', v_stage_score,
      'sector_match', v_sector_score,
      'check_size_fit', v_size_score,
      'location_bonus', v_location_score
    );
END;
$$ LANGUAGE plpgsql;

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_matches_startup ON matches(startup_id);
CREATE INDEX IF NOT EXISTS idx_matches_investor ON matches(investor_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC);

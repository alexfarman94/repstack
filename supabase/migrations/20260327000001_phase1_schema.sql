-- ============================================================
-- Rep Stack — Phase 1 Migration
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- Run the verification queries at the bottom after execution
-- ============================================================

-- ============================================================
-- STEP 0: Check existing agents rows before migration
-- (informational — no changes made)
-- ============================================================
-- SELECT id, user_id, name, description, created_at FROM agents ORDER BY created_at;


-- ============================================================
-- STEP A: Create opportunities table
-- Must come before documents FK addition
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL,
  account_id   UUID REFERENCES accounts(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  stage        TEXT,
  value        NUMERIC(12,2),
  close_date   DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP B: Extend documents table
-- opportunity_id: optional scope to a specific opp
-- storage_path: raw file path in Supabase Storage (future use)
-- ============================================================
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS storage_path   TEXT;


-- ============================================================
-- STEP C: Create user_agents table
-- Mirrors old agents structure — user-scoped, private to each rep
-- ============================================================
CREATE TABLE IF NOT EXISTS user_agents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  system_prompt TEXT NOT NULL,
  inputs        JSONB NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP D: Migrate existing agents rows → user_agents
-- Safe no-op if agents table is empty
-- ============================================================
INSERT INTO user_agents (id, user_id, name, description, system_prompt, inputs, created_at)
SELECT id, user_id, name, description, system_prompt, COALESCE(inputs, '[]'), created_at
FROM agents
WHERE user_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- STEP E: Transform agents → platform agents table
-- Add is_active + created_by, delete migrated rows, drop user_id
-- ============================================================
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS created_by  TEXT;

-- Remove any rows that were migrated to user_agents
-- (platform agents table should only contain admin-seeded rows)
DELETE FROM agents WHERE user_id IS NOT NULL;

-- Drop user_id — platform agents are global, not user-scoped
ALTER TABLE agents DROP COLUMN IF EXISTS user_id;


-- ============================================================
-- STEP F: Create agent_runs table
-- Logs every AI call for analytics and audit trail
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT NOT NULL,
  agent_id        UUID,                -- FK to agents (platform agent), nullable
  user_agent_id   UUID,                -- FK to user_agents (custom agent), nullable
  account_id      UUID REFERENCES accounts(id) ON DELETE SET NULL,
  opportunity_id  UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  input_context   TEXT,                -- full prompt sent (may be large)
  output          TEXT,                -- full streamed response
  tokens_used     INTEGER,
  feedback        SMALLINT,            -- NULL | 1 (thumbs up) | -1 (thumbs down)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP G: Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id     ON opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_account_id  ON opportunities(account_id);
CREATE INDEX IF NOT EXISTS idx_documents_opportunity_id  ON documents(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_user_id        ON agent_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created_at     ON agent_runs(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_id       ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_user_agent_id  ON agent_runs(user_agent_id);
CREATE INDEX IF NOT EXISTS idx_user_agents_user_id       ON user_agents(user_id);


-- ============================================================
-- VERIFICATION — Run after migration to confirm
-- ============================================================
/*
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('accounts', 'documents', 'agents', 'opportunities', 'user_agents', 'agent_runs')
ORDER BY table_name, ordinal_position;

SELECT COUNT(*) AS migrated_user_agents FROM user_agents;
SELECT COUNT(*) AS platform_agents      FROM agents;
*/

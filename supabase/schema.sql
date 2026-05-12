-- ============================================================
-- CodeSnap Database Schema
-- Run this in the Supabase SQL Editor (one-time setup)
-- ============================================================


-- ------------------------------------------------------------
-- snippets table
-- ------------------------------------------------------------
CREATE TABLE snippets (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    code        TEXT        NOT NULL,
    language    VARCHAR(50) NOT NULL,
    description TEXT,
    tags        TEXT[]      DEFAULT '{}',
    is_public   BOOLEAN     DEFAULT false,
    is_favorite BOOLEAN     DEFAULT false,
    share_id    VARCHAR(20) UNIQUE,           -- generated when snippet is made public
    view_count  INTEGER     DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_snippets_user_id    ON snippets(user_id);
CREATE INDEX idx_snippets_share_id   ON snippets(share_id);
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX idx_snippets_tags       ON snippets USING GIN(tags);


-- ------------------------------------------------------------
-- Auto-update updated_at on row change
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER snippets_updated_at
    BEFORE UPDATE ON snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();


-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own snippets; anyone can read public ones
CREATE POLICY "Users can view own snippets"
    ON snippets FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

-- Users can only insert snippets for themselves
CREATE POLICY "Users can create snippets"
    ON snippets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own snippets
CREATE POLICY "Users can update own snippets"
    ON snippets FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can only delete their own snippets
CREATE POLICY "Users can delete own snippets"
    ON snippets FOR DELETE
    USING (auth.uid() = user_id);

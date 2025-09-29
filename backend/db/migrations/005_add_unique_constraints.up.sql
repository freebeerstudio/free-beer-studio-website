-- Add unique constraint to prevent duplicate ideas from same URL
ALTER TABLE ideas ADD CONSTRAINT unique_canonical_url UNIQUE (canonical_url);

-- Add index for better performance on URL lookups
CREATE INDEX idx_ideas_canonical_url ON ideas(canonical_url) WHERE canonical_url IS NOT NULL;
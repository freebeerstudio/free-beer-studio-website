-- Update style_guides table to support new structure
-- Drop existing table and recreate with new structure
DROP TABLE IF EXISTS style_guides;

CREATE TABLE style_guides (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('blog', 'substack_lead', 'substack_article', 'substack_mention', 'linkedin', 'x', 'shorts')),
  guidelines TEXT DEFAULT '',
  ai_prompt TEXT DEFAULT '',
  example_files JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform)
);

-- Create index for better performance
CREATE INDEX idx_style_guides_platform ON style_guides(platform);
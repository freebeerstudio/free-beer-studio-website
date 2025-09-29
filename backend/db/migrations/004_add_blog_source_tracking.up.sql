-- Add source tracking for blog posts to distinguish manual vs AI-generated
ALTER TABLE blog_posts ADD COLUMN source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai', 'idea_engine'));
ALTER TABLE blog_posts ADD COLUMN idea_id BIGINT REFERENCES ideas(id);

-- Add index for source filtering
CREATE INDEX idx_blog_posts_source ON blog_posts(source);
CREATE INDEX idx_blog_posts_idea_id ON blog_posts(idea_id);
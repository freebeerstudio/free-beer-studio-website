-- Add files table for uploaded content
CREATE TABLE files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  original_name TEXT NOT NULL,
  storage_name TEXT NOT NULL,
  url TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pricing', 'project', 'blog', 'profile')),
  uploaded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_files_category ON files(category);
CREATE INDEX idx_files_created_at ON files(created_at DESC);
CREATE INDEX idx_files_uploaded ON files(uploaded);
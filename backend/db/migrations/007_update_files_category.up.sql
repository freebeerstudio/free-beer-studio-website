-- Update files table category constraint to include 'styleguide'
ALTER TABLE files DROP CONSTRAINT IF EXISTS files_category_check;
ALTER TABLE files ADD CONSTRAINT files_category_check CHECK (category IN ('pricing', 'project', 'blog', 'profile', 'styleguide'));
-- CRM Database Schema

-- Contexts for organizing contacts
CREATE TABLE crm_contexts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contexts
INSERT INTO crm_contexts (name, description, color) VALUES
  ('Free Beer Studio', 'Free Beer Studio business contacts', '#F59E0B'),
  ('Omnissa', 'Omnissa related contacts', '#10B981'),
  ('Personal', 'Personal contacts and relationships', '#8B5CF6');

-- Companies/Organizations
CREATE TABLE crm_companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  size TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  logo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts
CREATE TABLE crm_contacts (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  title TEXT,
  company_id BIGINT REFERENCES crm_companies(id) ON DELETE SET NULL,
  context_id BIGINT REFERENCES crm_contexts(id) ON DELETE SET NULL,
  linkedin_url TEXT,
  twitter_url TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  birthday DATE,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect', 'customer', 'partner')),
  source TEXT,
  owner_user_id TEXT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags for categorizing contacts
CREATE TABLE crm_tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact to Tag mapping
CREATE TABLE crm_contact_tags (
  contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES crm_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (contact_id, tag_id)
);

-- Interaction types (calls, emails, meetings, etc.)
CREATE TABLE crm_interactions (
  id BIGSERIAL PRIMARY KEY,
  contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task', 'linkedin', 'other')),
  subject TEXT,
  description TEXT,
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER,
  outcome TEXT,
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes attached to contacts
CREATE TABLE crm_notes (
  id BIGSERIAL PRIMARY KEY,
  contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals/Opportunities
CREATE TABLE crm_deals (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_id BIGINT REFERENCES crm_contacts(id) ON DELETE SET NULL,
  company_id BIGINT REFERENCES crm_companies(id) ON DELETE SET NULL,
  value DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  stage TEXT NOT NULL CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  description TEXT,
  lost_reason TEXT,
  owner_user_id TEXT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects associated with contacts/companies
CREATE TABLE crm_projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  contact_id BIGINT REFERENCES crm_contacts(id) ON DELETE SET NULL,
  company_id BIGINT REFERENCES crm_companies(id) ON DELETE SET NULL,
  deal_id BIGINT REFERENCES crm_deals(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom fields for contacts (for future extensibility)
CREATE TABLE crm_custom_fields (
  id BIGSERIAL PRIMARY KEY,
  contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_company ON crm_contacts(company_id);
CREATE INDEX idx_crm_contacts_context ON crm_contacts(context_id);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_contacts_name ON crm_contacts(last_name, first_name);
CREATE INDEX idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_date ON crm_interactions(interaction_date DESC);
CREATE INDEX idx_crm_notes_contact ON crm_notes(contact_id);
CREATE INDEX idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX idx_crm_deals_company ON crm_deals(company_id);
CREATE INDEX idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX idx_crm_projects_contact ON crm_projects(contact_id);
CREATE INDEX idx_crm_projects_company ON crm_projects(company_id);
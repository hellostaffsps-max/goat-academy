-- GoatJourney Academy Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  description TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 4.5,
  tags TEXT[] DEFAULT '{}',
  read_time TEXT,
  difficulty TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cafes table
CREATE TABLE IF NOT EXISTS cafes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin settings table (for password)
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin password
INSERT INTO admin_settings (key, value)
VALUES ('admin_password', 'admin123')
ON CONFLICT (key) DO NOTHING;

-- Insert default categories data into lessons (for reference)
-- Categories remain as app constants, not DB table

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read lessons" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Allow public read cafes" ON cafes
  FOR SELECT USING (true);

-- Create policies for admin write access (using a simple check function)
CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN AS $$
BEGIN
  -- In production, you should use proper auth. 
  -- For now, we rely on API key validation in server actions.
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- For now, allow all operations (we'll secure via server actions)
CREATE POLICY "Allow all lessons" ON lessons
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all cafes" ON cafes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all admin_settings" ON admin_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_cafes_city ON cafes(city);

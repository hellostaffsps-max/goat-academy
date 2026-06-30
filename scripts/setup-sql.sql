-- 1. Add path column to lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS path text;

-- 2. Create images bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, '{image/jpeg,image/png,image/webp,image/gif}')
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Create policies (using DO blocks to handle duplicates gracefully)
DO $$ BEGIN
  CREATE POLICY "Allow public read from images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'Read policy already exists';
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow authenticated uploads to images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'Insert policy already exists';
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow authenticated delete from images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'Delete policy already exists';
END $$;

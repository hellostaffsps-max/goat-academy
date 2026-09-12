-- Run only against the verified Goat Journey project after assigning the intended
-- administrator app_metadata.role = admin using the trusted Supabase Auth Admin API.
BEGIN;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (((select auth.jwt())->'app_metadata'->>'role') = 'admin');
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);
-- A profile role is display data, never an authorization source.
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
 SELECT user_id = (select auth.uid()) AND ((select auth.jwt())->'app_metadata'->>'role') = 'admin';
$$;


-- Replace only policy names shipped by this repository. Review any other policies
-- using the preflight query below: permissive policies are ORed together.
DO $repair$
DECLARE t text; p text;
BEGIN
 FOREACH t IN ARRAY ARRAY['lessons','cafes','articles','learning_paths','success_stories','admin_settings'] LOOP
  IF to_regclass('public.' || t) IS NULL THEN CONTINUE; END IF;
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  FOREACH p IN ARRAY ARRAY['Allow all', 'Allow all ' || t, 'Admin manage ' || t, 'Public read ' || t, 'Public page copy'] LOOP
   EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p, t);
  END LOOP;
  EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (((select auth.jwt())->%L->>%L) = %L) WITH CHECK (((select auth.jwt())->%L->>%L) = %L)', 'Admin manage ' || t, t, 'app_metadata', 'role', 'admin', 'app_metadata', 'role', 'admin');
  IF t = 'admin_settings' THEN
   EXECUTE $policy$CREATE POLICY "Public page copy" ON public.admin_settings FOR SELECT TO anon, authenticated USING (key IN ('hero_section','founder_section','paths_section','success_stories','tools_section','resources_section'))$policy$;
   DELETE FROM public.admin_settings WHERE key = 'admin_password';
  ELSE
   EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)', 'Public read ' || t, t);
  END IF;
 END LOOP;
END $repair$;
DROP POLICY IF EXISTS "Allow authenticated upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;
CREATE POLICY "Admin upload images" ON storage.objects FOR INSERT TO authenticated
 WITH CHECK (bucket_id = 'images' AND ((select auth.jwt())->'app_metadata'->>'role') = 'admin');
CREATE POLICY "Admin delete images" ON storage.objects FOR DELETE TO authenticated
 USING (bucket_id = 'images' AND ((select auth.jwt())->'app_metadata'->>'role') = 'admin');
-- Disable the obsolete permissive helper in case external legacy code calls it.
CREATE OR REPLACE FUNCTION public.is_admin_request()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
 SELECT ((select auth.jwt())->'app_metadata'->>'role') = 'admin';
$$;
-- Ignore user-supplied role fields on signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.profiles (id,email,role,full_name) VALUES (NEW.id,NEW.email,'user',COALESCE(NEW.raw_user_meta_data->>'full_name',''));
 INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
 RETURN NEW;
END;
$$;
COMMIT;
-- Review the complete policy set after applying. Unknown permissive policies must
-- be assessed on the verified project; this script never wipes unrelated policies.
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname IN ('public','storage') ORDER BY schemaname,tablename,policyname;

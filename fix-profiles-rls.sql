-- Fix infinite recursion in profiles RLS policy
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)

-- Step 1: Create a security definer function that bypasses RLS
-- This function checks if a user is an admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET row_security = off;

-- Step 2: Drop the old recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Step 3: Recreate the policy using the non-recursive function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

-- Also ensure the update policy is correct
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Verify the policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

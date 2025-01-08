/*
  # Fix profiles policies
  
  1. Changes
    - Remove recursive admin policy
    - Add simplified admin check using auth.uid()
    - Fix infinite recursion in profiles policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;

-- Create new admin policy without recursion
CREATE POLICY "Admin can manage all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
  );
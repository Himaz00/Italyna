
-- Create admin user profile
-- First, we need to ensure the auth.users table has the admin user
-- This should be done by signing up normally, then we update the profile

-- Insert or update admin profile
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
  id,
  'admin@bellavista.com',
  'Admin',
  'User',
  'admin'
FROM auth.users 
WHERE email = 'admin@bellavista.com'
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  first_name = 'Admin',
  last_name = 'User';

-- If no user exists in auth.users with that email, create a placeholder profile
-- that will be updated when the user signs up
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
  gen_random_uuid(),
  'admin@bellavista.com',
  'Admin',
  'User',
  'admin'
)
ON CONFLICT (email) DO NOTHING;


-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Users can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;

-- Create new policies using security definer functions
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage menu items" ON public.menu_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view available menu items" ON public.menu_items
  FOR SELECT USING (is_available = true OR public.is_admin());

CREATE POLICY "Anyone can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view reservations" ON public.reservations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_admin_or_staff() OR 
    user_id IS NULL
  );

CREATE POLICY "Users can update reservations" ON public.reservations
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    public.is_admin_or_staff()
  );

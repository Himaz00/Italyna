
-- Add more detailed fields to menu_items table for the modal
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS ingredients TEXT[],
ADD COLUMN IF NOT EXISTS nutritional_info JSONB,
ADD COLUMN IF NOT EXISTS chef_notes TEXT,
ADD COLUMN IF NOT EXISTS spice_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cooking_method TEXT;

-- Create admin authentication function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update reservation status enum to include 'confirmed'
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
        CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    ELSE
        -- Add 'confirmed' if it doesn't exist
        BEGIN
            ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'confirmed';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- Create notification system for reservation confirmations
CREATE TABLE IF NOT EXISTS public.reservation_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on reservation_notifications
ALTER TABLE public.reservation_notifications ENABLE ROW LEVEL SECURITY;

-- Policy for reservation notifications
CREATE POLICY "Admins can manage reservation notifications" ON public.reservation_notifications
  FOR ALL USING (public.is_admin());

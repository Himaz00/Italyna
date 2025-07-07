
-- Create restaurant_settings table to store opening hours and capacity
CREATE TABLE public.restaurant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default restaurant settings
INSERT INTO public.restaurant_settings (setting_key, setting_value, description) VALUES
('opening_hours', '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "22:00"}, "saturday": {"open": "11:00", "close": "22:00"}, "sunday": {"open": "11:00", "close": "22:00"}}', 'Restaurant opening hours by day of week'),
('table_capacity', '{"total_seats": 80, "max_party_size": 8, "tables": [{"id": 1, "seats": 2}, {"id": 2, "seats": 2}, {"id": 3, "seats": 4}, {"id": 4, "seats": 4}, {"id": 5, "seats": 4}, {"id": 6, "seats": 4}, {"id": 7, "seats": 6}, {"id": 8, "seats": 6}, {"id": 9, "seats": 8}, {"id": 10, "seats": 8}]}', 'Restaurant table configuration and capacity');

-- Create RLS policies for restaurant_settings
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurant settings" ON public.restaurant_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage restaurant settings" ON public.restaurant_settings
  FOR ALL USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON public.restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

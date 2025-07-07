
-- Create enum types for better data integrity
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_vegetarian BOOLEAN DEFAULT false,
    allergens TEXT[],
    preparation_time INTEGER DEFAULT 15, -- minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
    status reservation_status DEFAULT 'pending',
    special_requests TEXT,
    table_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    guest_email TEXT,
    guest_phone TEXT,
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    special_instructions TEXT,
    delivery_address TEXT,
    order_type TEXT DEFAULT 'dine_in', -- dine_in, takeout, delivery
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to menu data
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view menu items" ON menu_items FOR SELECT USING (is_available = true);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for reservations
CREATE POLICY "Users can view own reservations" ON reservations FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Users can create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own reservations" ON reservations FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);

-- RLS Policies for order items
CREATE POLICY "Users can view order items" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders o 
        WHERE o.id = order_id 
        AND (o.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
    )
);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON notifications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for full CRUD access
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage menu items" ON menu_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert sample categories
INSERT INTO categories (name, description, image_url, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=400&q=80', 1),
('Pasta', 'Handmade pasta dishes with authentic Italian flavors', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=400&q=80', 2),
('Pizza', 'Wood-fired pizzas with fresh ingredients', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80', 3),
('Main Courses', 'Traditional Italian main dishes', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', 4),
('Desserts', 'Sweet endings to your perfect meal', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80', 5);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, is_vegetarian, allergens) VALUES
-- Appetizers
((SELECT id FROM categories WHERE name = 'Appetizers'), 'Bruschetta Trio', 'Three varieties of our signature bruschetta with fresh tomatoes, ricotta, and prosciutto', 16.00, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=400&q=80', true, false, '{"gluten"}'),
((SELECT id FROM categories WHERE name = 'Appetizers'), 'Antipasto Platter', 'Selection of cured meats, artisanal cheeses, olives, and roasted vegetables', 24.00, 'https://images.unsplash.com/photo-1559847844-d4421b175c8d?auto=format&fit=crop&w=400&q=80', false, false, '{"dairy", "nuts"}'),
((SELECT id FROM categories WHERE name = 'Appetizers'), 'Arancini Siciliani', 'Crispy risotto balls stuffed with mozzarella and served with marinara sauce', 14.00, 'https://images.unsplash.com/photo-1633504581786-316c8002a134?auto=format&fit=crop&w=400&q=80', false, true, '{"dairy", "gluten"}'),

-- Pasta
((SELECT id FROM categories WHERE name = 'Pasta'), 'Spaghetti Carbonara', 'Classic Roman pasta with eggs, pecorino cheese, pancetta, and black pepper', 22.00, 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=400&q=80', true, false, '{"dairy", "gluten", "eggs"}'),
((SELECT id FROM categories WHERE name = 'Pasta'), 'Lobster Ravioli', 'Handmade ravioli filled with lobster in a creamy tomato and cognac sauce', 32.00, 'https://images.unsplash.com/photo-1572441713132-51c75654db73?auto=format&fit=crop&w=400&q=80', false, false, '{"shellfish", "dairy", "gluten"}'),
((SELECT id FROM categories WHERE name = 'Pasta'), 'Pesto Genovese', 'Fresh linguine with homemade basil pesto, pine nuts, and parmesan', 19.00, 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80', true, true, '{"nuts", "dairy", "gluten"}'),

-- Pizza
((SELECT id FROM categories WHERE name = 'Pizza'), 'Margherita', 'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil', 18.00, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80', true, true, '{"dairy", "gluten"}'),
((SELECT id FROM categories WHERE name = 'Pizza'), 'Quattro Stagioni', 'Four seasons pizza with artichokes, ham, mushrooms, and olives', 24.00, 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=400&q=80', false, false, '{"dairy", "gluten"}'),
((SELECT id FROM categories WHERE name = 'Pizza'), 'Tartufo Bianco', 'White truffle pizza with ricotta, mozzarella, and arugula', 28.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', false, true, '{"dairy", "gluten"}'),

-- Main Courses
((SELECT id FROM categories WHERE name = 'Main Courses'), 'Osso Buco', 'Braised veal shanks with saffron risotto and gremolata', 38.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', false, false, '{"dairy"}'),
((SELECT id FROM categories WHERE name = 'Main Courses'), 'Branzino al Sale', 'Mediterranean sea bass baked in sea salt crust with roasted vegetables', 34.00, 'https://images.unsplash.com/photo-1559847844-d4421b175c8d?auto=format&fit=crop&w=400&q=80', false, false, '{"fish"}'),

-- Desserts
((SELECT id FROM categories WHERE name = 'Desserts'), 'Tiramisu', 'Classic Italian dessert with mascarpone, coffee, and cocoa', 12.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80', true, true, '{"dairy", "eggs", "gluten"}'),
((SELECT id FROM categories WHERE name = 'Desserts'), 'Cannoli Siciliani', 'Crispy shells filled with sweet ricotta and chocolate chips', 10.00, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80', true, true, '{"dairy", "gluten"}');

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

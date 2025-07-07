
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDataSeeding = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const seedDatabase = async () => {
    try {
      setLoading(true);
      console.log('Starting database seeding...');

      // First, check if we already have data
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .limit(1);

      if (existingCategories && existingCategories.length > 0) {
        console.log('Data already exists, skipping seeding');
        return { success: true };
      }

      // Seed categories
      const categories = [
        {
          name: 'Appetizers',
          description: 'Start your meal with our delicious appetizers',
          display_order: 1,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400'
        },
        {
          name: 'Main Courses',
          description: 'Our signature main dishes',
          display_order: 2,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
        },
        {
          name: 'Desserts',
          description: 'Sweet treats to end your meal',
          display_order: 3,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'
        }
      ];

      const { data: insertedCategories, error: categoriesError } = await supabase
        .from('categories')
        .insert(categories)
        .select();

      if (categoriesError) throw categoriesError;
      console.log('Categories seeded:', insertedCategories);

      // Seed menu items with detailed information
      const menuItems = [
        // Appetizers
        {
          name: 'Bruschetta Classica',
          description: 'Traditional Italian bruschetta with fresh tomatoes, basil, and garlic on toasted bread',
          price: 12.99,
          category_id: insertedCategories![0].id,
          image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
          is_popular: true,
          is_vegetarian: true,
          allergens: ['gluten'],
          ingredients: ['tomatoes', 'basil', 'garlic', 'olive oil', 'bread', 'balsamic vinegar'],
          nutritional_info: { calories: 180, protein: '5g', carbs: '22g', fat: '8g' },
          chef_notes: 'Best enjoyed immediately while bread is still warm',
          spice_level: 0,
          cooking_method: 'grilled',
          preparation_time: 10
        },
        {
          name: 'Calamari Fritti',
          description: 'Crispy fried squid rings served with marinara sauce and lemon',
          price: 16.99,
          category_id: insertedCategories![0].id,
          image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
          is_popular: false,
          is_vegetarian: false,
          allergens: ['seafood'],
          ingredients: ['squid', 'flour', 'breadcrumbs', 'marinara sauce', 'lemon'],
          nutritional_info: { calories: 280, protein: '18g', carbs: '16g', fat: '18g' },
          chef_notes: 'Squid is sourced fresh daily from local fishermen',
          spice_level: 0,
          cooking_method: 'fried',
          preparation_time: 15
        },
        // Main Courses
        {
          name: 'Osso Buco alla Milanese',
          description: 'Braised veal shanks in white wine with vegetables, served with saffron risotto',
          price: 34.99,
          category_id: insertedCategories![1].id,
          image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
          is_popular: true,
          is_vegetarian: false,
          allergens: [],
          ingredients: ['veal shanks', 'white wine', 'carrots', 'celery', 'onions', 'arborio rice', 'saffron'],
          nutritional_info: { calories: 650, protein: '45g', carbs: '32g', fat: '28g' },
          chef_notes: 'Slow-braised for 3 hours to achieve perfect tenderness',
          spice_level: 0,
          cooking_method: 'braised',
          preparation_time: 180
        },
        {
          name: 'Linguine alle Vongole',
          description: 'Fresh linguine pasta with clams in white wine and garlic sauce',
          price: 28.99,
          category_id: insertedCategories![1].id,
          image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
          is_popular: true,
          is_vegetarian: false,
          allergens: ['gluten', 'seafood'],
          ingredients: ['linguine', 'clams', 'white wine', 'garlic', 'parsley', 'olive oil'],
          nutritional_info: { calories: 480, protein: '28g', carbs: '58g', fat: '12g' },
          chef_notes: 'Pasta is made fresh daily in-house',
          spice_level: 1,
          cooking_method: 'sautéed',
          preparation_time: 20
        },
        // Desserts
        {
          name: 'Tiramisu',
          description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
          price: 9.99,
          category_id: insertedCategories![2].id,
          image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
          is_popular: true,
          is_vegetarian: true,
          allergens: ['eggs', 'dairy'],
          ingredients: ['mascarpone', 'ladyfingers', 'espresso', 'cocoa powder', 'eggs', 'sugar'],
          nutritional_info: { calories: 320, protein: '8g', carbs: '28g', fat: '20g' },
          chef_notes: 'Chilled for minimum 4 hours before serving',
          spice_level: 0,
          cooking_method: 'chilled',
          preparation_time: 30
        }
      ];

      const { error: menuItemsError } = await supabase
        .from('menu_items')
        .insert(menuItems);

      if (menuItemsError) throw menuItemsError;
      console.log('Menu items seeded successfully');

      toast({
        title: "Database Seeded",
        description: "Sample menu data has been added successfully!"
      });

      return { success: true };
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: "Seeding Failed",
        description: "Failed to seed database with sample data",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    seedDatabase,
    loading
  };
};

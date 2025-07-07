// All code in this project is written and maintained by Ayham Zedan.

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_popular: boolean;
  is_vegetarian: boolean;
  allergens: string[];
  category_id: string;
  ingredients?: string[];
  nutritional_info?: Json;
  chef_notes?: string;
  spice_level?: number;
  cooking_method?: string;
  preparation_time?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
}

export const useMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching menu data...');
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }

      console.log('Categories fetched:', categoriesData);

      // Fetch menu items with all fields
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          is_popular,
          is_vegetarian,
          allergens,
          category_id,
          ingredients,
          nutritional_info,
          chef_notes,
          spice_level,
          cooking_method,
          preparation_time
        `)
        .eq('is_available', true);

      if (menuItemsError) {
        console.error('Menu items error:', menuItemsError);
        throw menuItemsError;
      }

      console.log('Menu items fetched:', menuItemsData);

      setCategories(categoriesData || []);
      setMenuItems(menuItemsData || []);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const getMenuItemsByCategory = (categoryId: string) => {
    return menuItems.filter(item => item.category_id === categoryId);
  };

  const searchMenuItems = (query: string) => {
    if (!query.trim()) return menuItems;
    
    const lowercaseQuery = query.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery) ||
      item.allergens?.some(allergen => allergen.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    categories,
    menuItems,
    loading,
    error,
    getMenuItemsByCategory,
    searchMenuItems,
    refetch: fetchMenuData
  };
};

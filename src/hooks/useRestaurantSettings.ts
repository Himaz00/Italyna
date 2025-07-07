// All code in this project is written and maintained by Ayham Zedan.

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface TableCapacity {
  total_seats: number;
  max_party_size: number;
  tables: Array<{
    id: number;
    seats: number;
  }>;
}

interface RestaurantSettings {
  opening_hours: OpeningHours;
  table_capacity: TableCapacity;
}

export const useRestaurantSettings = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['opening_hours', 'table_capacity']);

      if (error) throw error;

      const settingsObj: Record<string, unknown> = {};
      data?.forEach((setting) => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching restaurant settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const isRestaurantOpen = (date: Date, time: string): boolean => {
    if (!settings?.opening_hours) return true;

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    const dayHours = settings.opening_hours[dayName];

    if (!dayHours) return false;

    const openTime = dayHours.open;
    const closeTime = dayHours.close;

    return time >= openTime && time <= closeTime;
  };

  const getAvailableTimeSlots = (date: Date): string[] => {
    if (!settings?.opening_hours) return [];

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    const dayHours = settings.opening_hours[dayName];

    if (!dayHours) return [];

    const slots: string[] = [];
    const openHour = parseInt(dayHours.open.split(':')[0]);
    const openMinute = parseInt(dayHours.open.split(':')[1]);
    const closeHour = parseInt(dayHours.close.split(':')[0]);
    const closeMinute = parseInt(dayHours.close.split(':')[1]);

    let currentHour = openHour;
    let currentMinute = openMinute;

    while (currentHour < closeHour || (currentHour === closeHour && currentMinute <= closeMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }

    return slots;
  };

  const checkTableAvailability = async (date: string, time: string, partySize: number): Promise<boolean> => {
    if (!settings?.table_capacity) return true;

    try {
      // Get existing reservations for the same date and time
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('party_size')
        .eq('reservation_date', date)
        .eq('reservation_time', time)
        .eq('status', 'confirmed');

      if (error) throw error;

      // Calculate total occupied seats
      const occupiedSeats = reservations?.reduce((total, reservation) => total + reservation.party_size, 0) || 0;
      
      // Check if we have enough total capacity
      const availableSeats = settings.table_capacity.total_seats - occupiedSeats;
      
      return availableSeats >= partySize && partySize <= settings.table_capacity.max_party_size;
    } catch (error) {
      console.error('Error checking table availability:', error);
      return false;
    }
  };

  return {
    settings,
    loading,
    isRestaurantOpen,
    getAvailableTimeSlots,
    checkTableAvailability,
    refetch: fetchSettings
  };
};

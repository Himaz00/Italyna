
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReservationData {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  special_requests?: string;
}

export const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createReservation = async (data: ReservationData) => {
    try {
      setLoading(true);
      console.log('Creating reservation with data:', data);

      // Insert reservation
      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert([{
          guest_name: data.guest_name,
          guest_email: data.guest_email,
          guest_phone: data.guest_phone,
          reservation_date: data.reservation_date,
          reservation_time: data.reservation_time,
          party_size: data.party_size,
          special_requests: data.special_requests || null,
          status: 'pending',
          user_id: null // Allow null for guest reservations
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Reservation created successfully:', reservation);

      toast({
        title: "Reservation Confirmed!",
        description: `Thank you ${data.guest_name}! Your table for ${data.party_size} on ${data.reservation_date} at ${data.reservation_time} has been reserved.`
      });

      return { success: true, data: reservation };
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Reservation Failed",
        description: "There was an error creating your reservation. Please try again or call us directly.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return { success: false, error };
    }
  };

  return {
    createReservation,
    getReservations,
    loading
  };
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ReservationStatus = Database['public']['Enums']['reservation_status'];

interface Reservation {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: ReservationStatus;
  special_requests?: string;
  table_number?: number;
  created_at: string;
}

const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // If confirming reservation, send confirmation email
      if (status === 'confirmed') {
        const reservation = reservations.find(r => r.id === id);
        if (reservation) {
          await sendConfirmationEmail(reservation);
        }
      }
      
      toast({
        title: "Success",
        description: `Reservation ${status} successfully`
      });
      
      fetchReservations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation",
        variant: "destructive"
      });
    }
  };

  const sendConfirmationEmail = async (reservation: Reservation) => {
    try {
      const response = await fetch('/functions/v1/send-reservation-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          guestEmail: reservation.guest_email,
          guestName: reservation.guest_name,
          reservationDate: reservation.reservation_date,
          reservationTime: reservation.reservation_time,
          partySize: reservation.party_size
        })
      });

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: `Confirmation email sent to ${reservation.guest_email}`,
        });
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      toast({
        title: "Email Error",
        description: "Failed to send confirmation email, but reservation was confirmed.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const variants = {
      pending: { variant: 'secondary' as const, color: 'text-yellow-600' },
      confirmed: { variant: 'default' as const, color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, color: 'text-red-600' },
      completed: { variant: 'outline' as const, color: 'text-gray-600' }
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reservation Management</h2>
        <p className="text-muted-foreground">Manage customer reservations and bookings</p>
      </div>

      <div className="grid gap-6">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {reservation.guest_name}
                    {getStatusBadge(reservation.status)}
                  </CardTitle>
                  <CardDescription>
                    Reservation #{reservation.id.slice(0, 8)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {reservation.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm & Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {reservation.status === 'confirmed' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => sendConfirmationEmail(reservation)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Resend Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{formatDate(reservation.reservation_date)}</p>
                      <p className="text-sm text-muted-foreground">Reservation Date</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{formatTime(reservation.reservation_time)}</p>
                      <p className="text-sm text-muted-foreground">Time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{reservation.party_size} guests</p>
                      <p className="text-sm text-muted-foreground">Party Size</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{reservation.guest_email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{reservation.guest_phone}</p>
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  
                  {reservation.table_number && (
                    <div>
                      <p className="font-medium">Table {reservation.table_number}</p>
                      <p className="text-sm text-muted-foreground">Assigned Table</p>
                    </div>
                  )}
                </div>
              </div>
              
              {reservation.special_requests && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium mb-2">Special Requests:</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {reservation.special_requests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {reservations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No reservations found</p>
              <p className="text-muted-foreground">Reservations will appear here when customers book tables</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;

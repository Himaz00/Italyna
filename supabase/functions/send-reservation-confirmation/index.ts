
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReservationConfirmationRequest {
  reservationId: string;
  guestEmail: string;
  guestName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { reservationId, guestEmail, guestName, reservationDate, reservationTime, partySize }: ReservationConfirmationRequest = await req.json();

    console.log('Sending confirmation email for reservation:', reservationId);

    // For now, we'll just log the email content
    // In a real implementation, you would integrate with Resend or another email service
    const emailContent = {
      to: guestEmail,
      subject: "Reservation Confirmed - Italyna Restaurant",
      html: `
        <h1>Reservation Confirmed!</h1>
        <p>Dear ${guestName},</p>
        <p>Your reservation at Italyna Restaurant has been confirmed!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Reservation Details:</h3>
          <p><strong>Date:</strong> ${reservationDate}</p>
          <p><strong>Time:</strong> ${reservationTime}</p>
          <p><strong>Party Size:</strong> ${partySize} guests</p>
          <p><strong>Reservation ID:</strong> ${reservationId}</p>
        </div>
        
        <p>We look forward to serving you at Italyna Restaurant!</p>
        <p>If you need to make any changes to your reservation, please contact us at (555) 123-4567.</p>
        
        <p>Best regards,<br>The Italyna Team</p>
      `
    };

    console.log('Email content prepared:', emailContent);

    // Record the notification in the database
    await supabase
      .from('reservation_notifications')
      .insert({
        reservation_id: reservationId,
        notification_type: 'confirmation',
        email_sent: true
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email prepared',
        emailContent 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reservation-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

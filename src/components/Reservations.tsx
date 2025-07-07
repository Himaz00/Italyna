// All code in this project is written and maintained by Ayham Zedan.

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users, Phone, User, Mail, AlertCircle } from 'lucide-react';
import { useReservations } from '@/hooks/useReservations';
import { useRestaurantSettings } from '@/hooks/useRestaurantSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

const Reservations = () => {
  const { t } = useTranslation();
  const { createReservation, loading } = useReservations();
  const { settings, isRestaurantOpen, getAvailableTimeSlots, checkTableAvailability } = useRestaurantSettings();
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    special_requests: ''
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string>('');

  useEffect(() => {
    if (formData.reservation_date) {
      const selectedDate = new Date(formData.reservation_date);
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableSlots(slots);
      
      // Clear selected time if it's no longer available
      if (formData.reservation_time && !slots.includes(formData.reservation_time)) {
        setFormData(prev => ({ ...prev, reservation_time: '' }));
      }
    }
  }, [formData.reservation_date, getAvailableTimeSlots]);

  useEffect(() => {
    if (formData.reservation_date && formData.reservation_time && formData.party_size) {
      checkAvailability();
    }
  }, [formData.reservation_date, formData.reservation_time, formData.party_size]);

  const checkAvailability = async () => {
    if (!formData.reservation_date || !formData.reservation_time || !formData.party_size) return;

    setAvailabilityChecking(true);
    setAvailabilityError('');

    try {
      const selectedDate = new Date(formData.reservation_date);
      
      // Check if restaurant is open
      if (!isRestaurantOpen(selectedDate, formData.reservation_time)) {
        setAvailabilityError(t('reservations.restaurantClosed', 'Restaurant is closed at the selected time.'));
        setAvailabilityChecking(false);
        return;
      }

      // Check table availability
      const isAvailable = await checkTableAvailability(
        formData.reservation_date,
        formData.reservation_time,
        formData.party_size
      );

      if (!isAvailable) {
        if (settings?.table_capacity && formData.party_size > settings.table_capacity.max_party_size) {
          setAvailabilityError(t('reservations.maxPartySize', { max: settings.table_capacity.max_party_size }));
        } else {
          setAvailabilityError(t('reservations.noTablesAvailable', 'No tables available for the selected time. Please choose a different time.'));
        }
      }
    } catch (error) {
      setAvailabilityError(t('reservations.unableToCheckAvailability', 'Unable to check availability. Please try again.'));
    } finally {
      setAvailabilityChecking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'party_size' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.guest_name || !formData.guest_email || !formData.guest_phone || !formData.reservation_date || !formData.reservation_time) {
      return;
    }

    // Check for availability errors
    if (availabilityError) {
      return;
    }

    const result = await createReservation({
      guest_name: formData.guest_name,
      guest_email: formData.guest_email,
      guest_phone: formData.guest_phone,
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      party_size: formData.party_size,
      special_requests: formData.special_requests
    });

    if (result.success) {
      // Reset form
      setFormData({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 2,
        special_requests: ''
      });
      setAvailabilityError('');
    }
  };

  const getMaxPartySize = () => {
    return settings?.table_capacity?.max_party_size || 8;
  };

  return (
    <section id="reservations" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              <span>{t('reservations.bookATable', 'Book a Table')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('reservations.reserveYour')}
              <span className="block text-primary font-serif italic">{t('reservations.perfectEvening')}</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('reservations.joinUs')}
            </p>

            {/* Info Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">{t('reservations.openingHours')}</div>
                  <div className="text-muted-foreground">{t('reservations.hours', 'Monday - Sunday: 11:00 AM - 10:00 PM')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">{t('reservations.callUs')}</div>
                  <div className="text-muted-foreground">+49 xxxx-xxx-xxxx</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">{t('reservations.groupReservations')}</div>
                  <div className="text-muted-foreground">{t('reservations.forParties', { size: getMaxPartySize() })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-card p-8 rounded-2xl shadow-lg border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_name" className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    {t('reservations.fullName')}
                  </Label>
                  <Input
                    id="guest_name"
                    name="guest_name"
                    value={formData.guest_name}
                    onChange={handleInputChange}
                    placeholder={t('reservations.yourFullName')}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="guest_email" className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    {t('reservations.email')}
                  </Label>
                  <Input
                    id="guest_email"
                    name="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guest_phone" className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  {t('reservations.phoneNumber')}
                </Label>
                <Input
                  id="guest_phone"
                  name="guest_phone"
                  type="tel"
                  value={formData.guest_phone}
                  onChange={handleInputChange}
                  placeholder="+49 xxxx-xxx-xxxx"
                  required
                />
              </div>

              {/* Reservation Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reservation_date" className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    {t('reservations.date')}
                  </Label>
                  <Input
                    id="reservation_date"
                    name="reservation_date"
                    type="date"
                    value={formData.reservation_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="reservation_time" className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    {t('reservations.time')}
                  </Label>
                  <select
                    id="reservation_time"
                    name="reservation_time"
                    value={formData.reservation_time}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">{t('reservations.selectTime')}</option>
                    {availableSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="party_size" className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  {t('reservations.numberOfGuests')}
                </Label>
                <select
                  id="party_size"
                  name="party_size"
                  value={formData.party_size}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Array.from({ length: getMaxPartySize() }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? t('reservations.guest') : t('reservations.guests')}
                    </option>
                  ))}
                </select>
              </div>

              {availabilityError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{availabilityError}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="special_requests" className="mb-2 block">
                  {t('reservations.specialRequests')}
                </Label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  placeholder={t('reservations.specialDietaryRequirements')}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                disabled={loading || availabilityChecking || !!availabilityError}
              >
                {loading ? t('reservations.processing') : availabilityChecking ? t('reservations.checkingAvailability') : t('reservations.confirmReservation')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservations;

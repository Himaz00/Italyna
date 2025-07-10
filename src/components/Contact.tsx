// All code in this project is written and maintained by Ayham Zedan.
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MapPin className="h-4 w-4" />
            <span>{t('contact.visitUs', 'Visit Us')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('contact.findUs', 'Find Us &')}
            <span className="block text-primary font-serif italic">{t('contact.getInTouch', 'Get in Touch')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.locationDesc', "Located in the heart of downtown, we're easy to find and always happy to welcome you.")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">{t('contact.contactInfo', 'Contact Information')}</h3>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('contact.address', 'Address')}</h4>
                  <p className="text-muted-foreground">
                    Risto Carmel Grco<br />
                    Ziegelhüttenwe 1-6<br />
                    60599 Frankfurt am Main, Germany
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('contact.phone', 'Phone')}</h4>
                  <p className="text-muted-foreground">
                    {t('contact.reservationsPhone', 'Reservations')}: +49 xxxx-xxx-xxxx<br />
                    {t('contact.takeoutPhone', 'Takeout')}: +49 xxxx-xxx-xxxx
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('contact.email', 'Email')}</h4>
                  <p className="text-muted-foreground">
                    info@bellavista.com<br />
                    reservations@bellavista.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('contact.hours', 'Opening Hours')}</h4>
                  <div className="text-muted-foreground space-y-1">
                    <p>{t('contact.hoursMonThu', 'Monday - Thursday: 11:00 AM - 9:30 PM')}</p>
                    <p>{t('contact.hoursFriSat', 'Friday - Saturday: 11:00 AM - 10:30 PM')}</p>
                    <p>{t('contact.hoursSun', 'Sunday: 12:00 PM - 9:00 PM')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">{t('contact.followUs', 'Follow Us')}</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden border shadow-lg">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=Ristorante+Carmelo+Greco+Frankfurt+Germany&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Floating Info Card */}
            <div className="absolute top-6 left-6 bg-white p-4 rounded-lg shadow-lg border max-w-64">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-foreground">{t('contact.currentlyOpen', 'Currently Open')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('contact.closesAt', 'Closes at 10:00 PM today')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

// All code in this project is written and maintained by Ayham Zedan.

import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <h3 className="text-3xl font-bold">Italyna</h3>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md leading-relaxed">
              {t('footer.intro', "Since 1985, we've been serving authentic Italian cuisine with passion and tradition. Every dish tells a story of our heritage, crafted with love for our community.")}
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-white border-0">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-white border-0">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-white border-0">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.quickLinks', 'Quick Links')}</h4>
            <nav className="space-y-3">
              <button 
                onClick={() => scrollToSection('home')}
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                {t('home', 'Home')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                {t('about', 'About Us')}
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                {t('menu', 'Our Menu')}
              </button>
              <button 
                onClick={() => scrollToSection('reservations')}
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                {t('reservations', 'Reservations')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                {t('contact', 'Contact')}
              </button>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.contactInfo', 'Contact Info')}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0 opacity-80" />
                <div className="text-primary-foreground/80">
                  <p>Ziegelhüttenweg 1-3</p>
                  <p>60598 Frankfurt am Main</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 opacity-80" />
                <span className="text-primary-foreground/80">+49 xxxx-xxx-xxxx</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 opacity-80" />
                <span className="text-primary-foreground/80">info@bellavista.com</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-primary-foreground/80 text-sm">
                <strong>{t('footer.hours', 'Hours')}:</strong><br />
                {t('footer.hoursMonThu', 'Mon-Thu: 11AM-9:30PM')}<br />
                {t('footer.hoursFriSat', 'Fri-Sat: 11AM-10:30PM')}<br />
                {t('footer.hoursSun', 'Sun: 12PM-9PM')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © 2025 Italyna. All rights reserved , made by Ayham Zedan.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

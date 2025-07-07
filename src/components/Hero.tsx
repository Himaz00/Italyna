// All code in this project is written and maintained by Ayham Zedan.

import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToReservations = () => {
    document.getElementById('reservations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-slow"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          <span className="block animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('welcomeTo', 'Welcome to')}
          </span>
          <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Italyna
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.6s' }}>
          {t('heroSubtitle', 'Experience authentic Italian cuisine in an elegant atmosphere with stunning city views')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.8s' }}>
          <Button 
            size="lg" 
            onClick={scrollToReservations}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {t('makeReservation', 'Make a Reservation')}
          </Button>
          <Button 
            size="lg" 
            onClick={scrollToMenu}
            className="bg-[hsl(var(--primary))] text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {t('viewMenu', 'View Menu')}
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      
    </section>
  );
};

export default Hero;

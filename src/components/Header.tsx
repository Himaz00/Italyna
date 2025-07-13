// Made by Ayham Zedan
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Clock, TrendingUp, Info } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// Header component renders the top navigation bar, logo, and mobile menu for the site.
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Tracks mobile menu open/close state
  const { t } = useTranslation();

  // scrollToSection: Scrolls smoothly to a section by id and closes mobile menu if open
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // scrollToTrending: Scrolls smoothly to the trending (new-to-menu) section and closes mobile menu if open
  const scrollToTrending = () => {
    const element = document.querySelector('.new-to-menu-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Bar: Shows phone and opening hours */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{t('header.phone', '+49 xxxx-xxx-xxxx')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t('openHours', 'Open Daily 11AM - 10PM')}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm md:text-base text-muted-foreground italic font-sans font-semibold">This project is a demo project and it's not a real restaurant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header: Logo, navigation, CTA, and mobile menu button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo: Navigates to home section when clicked */}
          <div className="flex items-center">
            <button onClick={() => scrollToSection('home')} className="focus:outline-none">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Italyna</h1>
            </button>
          </div>

          {/* Desktop Navigation: Main nav links for large screens */}
          <nav className="hidden lg:flex items-center space-x-6">
            <button onClick={() => scrollToSection('home')} className="hover:text-primary transition-colors">
              {t('home', 'Home')}
            </button>
            <button onClick={scrollToTrending} className="hover:text-primary transition-colors flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('trending', 'Trending')}</span>
            </button>
            <button onClick={() => scrollToSection('menu')} className="hover:text-primary transition-colors">
              {t('menu', 'Menu')}
            </button>
            
            <button onClick={() => scrollToSection('reservations')} className="hover:text-primary transition-colors">
              {t('reservations', 'Reservations')}
            </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">
              {t('contact', 'Contact')}
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">
              {t('about', 'About')}
            </button>
          </nav>

          {/* CTA Button: Book a Table, visible on md+ screens */}
          <div className="hidden md:flex items-center gap-2">
            <Button onClick={() => scrollToSection('reservations')} className="bg-primary hover:bg-primary/90">
              {t('bookTable', 'Book a Table')}
            </Button>
            {/* Language Switcher Button */}
            <LanguageSwitcher />
          </div>
          {/* Language Switcher for mobile */}
          <div className="flex md:hidden items-center ml-2">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button: Hamburger/X icon for mobile nav */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation: Shown when menu is open on mobile */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t">
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                {t('home', 'Home')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                {t('about', 'About')}
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                {t('menu', 'Menu')}
              </button>
              <button 
                onClick={scrollToTrending}
                className="flex items-center gap-2 text-left text-foreground hover:text-primary transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                {t('trending', 'Trending')}
              </button>
              <button 
                onClick={() => scrollToSection('reservations')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                {t('reservations', 'Reservations')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                {t('contact', 'Contact')}
              </button>
              <Button onClick={() => scrollToSection('reservations')} className="mt-4 w-full">
                {t('bookTable', 'Book a Table')}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

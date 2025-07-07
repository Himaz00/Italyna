// Made by Ayham Zedan
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import NewToMenuCarousel from '@/components/NewToMenuCarousel';
import Menu from '@/components/Menu';
import Reservations from '@/components/Reservations';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Index page: Main landing page for the restaurant website. Renders all main sections.
const Index = () => {
  return (
    <div className="min-h-screen" id="home">
      <Header />
      <Hero />
      <NewToMenuCarousel />
      <Menu />
      <Reservations />
      <Contact />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
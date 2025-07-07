// All code in this project is written and maintained by Ayham Zedan.

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Users, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Award,
      title: t('about.awardWinning', 'Award Winning'),
      description: t('about.awardDescription', 'Recognized for excellence in Italian cuisine and service')
    },
    {
      icon: Users,
      title: t('about.expertChefs', 'Expert Chefs'),
      description: t('about.chefsDescription', 'Our team brings decades of culinary experience from Italy')
    },
    {
      icon: Clock,
      title: t('about.freshDaily', 'Fresh Daily'),
      description: t('about.freshDescription', 'All ingredients sourced fresh daily from local markets')
    },
    {
      icon: MapPin,
      title: t('about.primeLocation', 'Prime Location'),
      description: t('about.locationDescription', 'Stunning city views from our elegant dining room')
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              {t('about.est1985', 'Est. 1985')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('about.tasteOf', 'A Taste of ')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                {t('about.authenticItaly', 'Authentic Italy')}
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('about.intro1', 'For over three decades, Italyna has been serving authentic Italian cuisine in the heart of the city. Our passion for traditional recipes, combined with the finest ingredients and warm hospitality, creates an unforgettable dining experience.')}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('about.intro2', 'From our handmade pasta to our wood-fired pizzas, every dish tells a story of Italian heritage and craftsmanship. Join us for a culinary journey through the regions of Italy, right here in our elegant dining room.')}
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Restaurant interior"
                className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="text-center border-0 shadow-lg hover-lift animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

// All code in this project is written and maintained by Ayham Zedan.

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles } from 'lucide-react';
import { useMenuData, MenuItem } from '@/hooks/useMenuData';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from 'react-i18next';

const NewToMenuCarousel = () => {
  const { t } = useTranslation();
  const { menuItems, loading } = useMenuData();
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const autoplayOptions = {
    delay: 1500, // Fast but not instant
    stopOnInteraction: false,
    stopOnMouseEnter: true, // Pause on hover
  };

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      // Filter for popular items or recent additions
      const popular = menuItems.filter(item => item.is_popular).slice(0, 8);
      setPopularItems(popular);
    }
  }, [menuItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!popularItems || popularItems.length === 0) {
    return null;
  }

  return (
    <section className="new-to-menu-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="h-4 w-4" />
            <span>{t('carousel.newAdditions', 'New Additions')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('carousel.newTo', 'New to')}
            <span className="block text-primary font-serif italic">{t('carousel.ourMenu', 'Our Menu')}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('carousel.discoverLatest', "Discover our latest culinary creations and chef's special recommendations")}
          </p>
        </div>
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Carousel
            plugins={[Autoplay(autoplayOptions)]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {popularItems.map((item) => (
                <CarouselItem key={item.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-2 h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div 
                          className="h-36 sm:h-40 md:h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                          style={{
                            backgroundImage: item.image_url ? `url(${item.image_url})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {!item.image_url && (
                            <div className="text-2xl sm:text-3xl md:text-4xl">🍽️</div>
                          )}
                        </div>
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-0 text-xs">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Popular
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 flex-1">
                          {item.description || "A delicious addition to our menu"}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                            ${item.price}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.is_vegetarian && (
                              <Badge variant="outline" className="text-xs">
                                🌱 Veg
                              </Badge>
                            )}
                          </div>
                        </div>
                        {item.spice_level && item.spice_level > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-muted-foreground">Spice:</span>
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < (item.spice_level || 0) ? 'bg-red-500' : 'bg-muted'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-6 lg:-left-12 bg-white/90 backdrop-blur-md shadow-lg border-0 hover:bg-white hover:shadow-xl transition-all duration-200 w-10 h-10 lg:w-12 lg:h-12" />
            <CarouselNext className="hidden sm:flex -right-6 lg:-right-12 bg-white/90 backdrop-blur-md shadow-lg border-0 hover:bg-white hover:shadow-xl transition-all duration-200 w-10 h-10 lg:w-12 lg:h-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default NewToMenuCarousel;

// All code in this project is written and maintained by Ayham Zedan.

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Leaf, AlertTriangle } from 'lucide-react';
import { useMenuData } from '@/hooks/useMenuData';
import MenuItemModal from './MenuItemModal';
import SearchBar from './SearchBar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useTranslation } from 'react-i18next';
import type { MenuItem } from '@/hooks/useMenuData';

const Menu = () => {
  const { t } = useTranslation();
  const { categories, menuItems, loading, error, getMenuItemsByCategory, searchMenuItems } = useMenuData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  console.log('Menu component - categories:', categories);
  console.log('Menu component - menuItems:', menuItems);

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">{t('menu.loading', 'Loading menu...')}</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{t('menu.error', 'Error loading menu')}: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const filteredItems = searchQuery 
    ? searchMenuItems(searchQuery)
    : selectedCategory === 'all' 
      ? menuItems 
      : getMenuItemsByCategory(selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <>
      <section id="menu" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('menu.ourMenu', 'Our Menu')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('menu.discover', 'Discover our carefully crafted dishes made with the finest ingredients')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder={t('menu.searchPlaceholder', 'Search our menu...')}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="transition-all duration-200 hover:-translate-y-0.5"
            >
              {t('menu.allItems', 'All Items')}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-200 hover:-translate-y-0.5"
              >
                {t(`menu.category.${category.id}`, category.name)}
              </Button>
            ))}
          </div>

          {/* Menu Items Carousel */}
          <Carousel
            opts={{ align: 'start', loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {filteredItems.map((item, index) => (
                <CarouselItem key={item.id} className="basis-full md:basis-1/2 lg:basis-1/3 px-2">
                  <Card 
                    className="overflow-hidden hover-lift cursor-pointer border-0 shadow-lg animate-scale-in" 
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => setSelectedMenuItem(item)}
                  >
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      {item.is_popular && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-xl font-bold text-amber-600">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.is_vegetarian && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Leaf className="h-3 w-3 mr-1" />
                              Vegetarian
                            </Badge>
                          )}
                          {item.allergens && item.allergens.length > 0 && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Allergens
                            </Badge>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6 lg:-left-12" />
            <CarouselNext className="-right-6 lg:-right-12" />
          </Carousel>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-gray-500 text-lg">
                {searchQuery 
                  ? t('menu.noItemsFound', 'No items found matching "{{searchQuery}}"', { searchQuery })
                  : t('menu.noItemsAvailable', 'No items available in this category')
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Menu Item Modal */}
      {selectedMenuItem && (
        <MenuItemModal
          item={selectedMenuItem}
          isOpen={!!selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
        />
      )}
    </>
  );
};

export default Menu;

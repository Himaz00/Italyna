// All code in this project is written and maintained by Ayham Zedan.

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Flame, ChefHat, Utensils } from 'lucide-react';
import type { MenuItem } from '@/hooks/useMenuData';

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemModal = ({ item, isOpen, onClose }: MenuItemModalProps) => {
  if (!item) return null;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getSpiceLevelIcon = (level: number) => {
    const flames = [];
    for (let i = 0; i < Math.min(level, 5); i++) {
      flames.push(<Flame key={i} className="h-4 w-4 text-red-500 fill-current" />);
    }
    return flames;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          {item.image_url && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Price and Badges */}
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">{formatPrice(item.price)}</span>
            <div className="flex flex-wrap gap-2">
              {item.is_popular && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Popular
                </Badge>
              )}
              {item.is_vegetarian && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Vegetarian
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>

          <Separator />

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Details */}
          <div className="grid md:grid-cols-2 gap-4">
            {item.preparation_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Prep time: {item.preparation_time} mins</span>
              </div>
            )}
            
            {item.cooking_method && (
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Method: {item.cooking_method}</span>
              </div>
            )}
          </div>
          
          {/* Chef's Notes */}
          {item.chef_notes && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Chef's Notes
              </h3>
              <p className="text-sm text-muted-foreground italic bg-muted p-3 rounded-md">
                "{item.chef_notes}"
              </p>
            </div>
          )}

          {/* Nutritional Info */}
          {item.nutritional_info && (
            <div>
              <h3 className="font-semibold mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(item.nutritional_info as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 bg-muted rounded">
                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Allergen Information</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;

// src/components/enneagram/TypeIcons.tsx

import { 
    Target, // Type 1: Precision, improvement
    Heart,  // Type 2: Love, helping
    Trophy, // Type 3: Achievement, success
    Palette, // Type 4: Creativity, uniqueness
    Search, // Type 5: Knowledge, investigation
    Shield, // Type 6: Security, loyalty
    Sparkles, // Type 7: Joy, adventure
    Swords, // Type 8: Power, protection
    Flower2 // Type 9: Peace, harmony
  } from 'lucide-react';
  
  export const TYPE_ICONS = {
    "1": Target,
    "2": Heart,
    "3": Trophy,
    "4": Palette,
    "5": Search,
    "6": Shield,
    "7": Sparkles,
    "8": Swords,
    "9": Flower2
  } as const;
  
  interface TypeIconProps {
    type: string;
    size?: number;
    color?: string;
    className?: string;
  }
  
  export const TypeIcon: React.FC<TypeIconProps> = ({ 
    type, 
    size = 24, 
    color,
    className = "" 
  }) => {
    const IconComponent = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
    
    if (!IconComponent) {
      console.warn(`No icon found for type ${type}`);
      return null;
    }
  
    return (
      <IconComponent 
        size={size} 
        color={color} 
        className={className}
      />
    );
  };
  
  export default TypeIcon;
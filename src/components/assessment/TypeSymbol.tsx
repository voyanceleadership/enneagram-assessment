import React from 'react';
import Image from 'next/image';

interface TypeSymbolProps {
  type: string;
  hasWing?: boolean;
  wingType?: string;
}

const TypeSymbol = ({ type, hasWing, wingType }: TypeSymbolProps) => {
  // Currently, we're only using the single type images
  // Wing combinations can be added later when those images are available
  const imagePath = `/images/enneagram/type${type}/VL Enneagram Type ${type} Related Types Names.png`;
  
  return (
    <div className="flex justify-center">
      <Image 
        src={imagePath}
        alt={hasWing 
          ? `Enneagram Type ${type} with Type ${wingType} wing symbol`
          : `Enneagram Type ${type} symbol`}
        width={300}
        height={300}
        className="object-contain mb-6"
        priority // Add priority since this is above the fold
      />
    </div>
  );
};

export default TypeSymbol;
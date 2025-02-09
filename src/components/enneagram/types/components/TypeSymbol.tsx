// src/components/enneagram/types/components/TypeSymbol.tsx
import React from 'react';
import Image from 'next/image';

interface TypeSymbolProps {
  type: string;
  size?: number;
}

// Component for displaying the Enneagram type symbol image
export default function TypeSymbol({ type, size = 200 }: TypeSymbolProps) {  // Increased default size
  // Construct the path to the type symbol image
  const imagePath = `/images/enneagram/type${type}/VL Enneagram Type ${type} Related Types Names.png`;

  return (
    <div className="flex items-center justify-center w-full mb-6">
      <Image
        src={imagePath}
        alt={`Enneagram Type ${type} Symbol`}
        width={size}
        height={size}
        style={{
          width: 'auto',  // Allow image to scale based on container
          height: 'auto',  // Maintain aspect ratio
          maxWidth: '100%', // Ensure it doesn't overflow container
          objectFit: 'contain'
        }}
        priority  // Load this image early since it's above the fold
      />
    </div>
  );
}
import React from 'react';
import { theme, styleUtils } from '@/styles/theme';
import InteractiveEnneagramDiagram from '../../symbol/InteractiveEnneagramDiagram';

interface TypeHeaderProps {
  typeNumber: string;
  typeName: string;
  typeDigit: string;
}

export default function TypeHeader({ typeNumber, typeName, typeDigit }: TypeHeaderProps) {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-48 mx-auto mb-6">
          <InteractiveEnneagramDiagram 
            defaultType={parseInt(typeNumber) as 1|2|3|4|5|6|7|8|9}
            defaultVariation="related-types"
            interactive={false}
          />
        </div>
        <h1 
          className="text-4xl mb-2"
          style={{ 
            ...styleUtils.headingStyles,
            color: theme.colors.accent3
          }}
        >
          Type {typeDigit}: {typeName}
        </h1>
      </div>
    </div>
  );
}
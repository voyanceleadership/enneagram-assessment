// src/components/enneagram/comparison/ComparisonColumnLabel.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import TypeIcon from '@/components/enneagram/TypeIcons';
import { TypeData } from '@/lib/enneagram/content';

interface ComparisonColumnLabelProps {
  type: string;
  data: TypeData;
}

const ComparisonColumnLabel: React.FC<ComparisonColumnLabelProps> = ({ 
  type, 
  data 
}) => {
  return (
    <div className="sticky top-0 z-10 pt-6">
      <Card className="bg-white shadow-md border-0">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-3 pt-4">
            <TypeIcon 
              type={type} 
              size={24}
              color={theme.colors.accent3}
            />
            <div className="text-center">
              <h3 
                className="text-lg mb-1"
                style={{
                  ...styleUtils.headingStyles,
                  color: theme.colors.accent3
                }}
              >
                Type {type}
              </h3>
              <p 
                className="text-sm"
                style={{
                  ...styleUtils.bodyStyles,
                  color: theme.colors.text
                }}
              >
                {data.typeName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonColumnLabel;
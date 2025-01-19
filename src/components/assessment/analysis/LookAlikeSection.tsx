import React from 'react';
import { GitCompare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionProps } from './types';

export default function LookAlikeSection({ theme, styleUtils, content }: SectionProps) {
  const processContent = (content: string): string => {
    return content.replace(
      /Type (\d)/g,
      `<a href="/types/$1" class="text-primary hover:text-primary/80 font-medium">Type $1</a>`
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-12">
        <div className="flex items-start gap-4">
          <div 
            className="rounded-full p-2 mt-1 flex-shrink-0" 
            style={{ backgroundColor: `${theme.colors.accent2}10` }}
          >
            <GitCompare className="h-5 w-5" style={{ color: theme.colors.accent2 }} />
          </div>
          <div className="flex-1">
            <h3 
              className="text-xl text-gray-900 font-medium mb-4"
              style={styleUtils.headingStyles}
            >
              Look-Alike Types
            </h3>
            <div
              className="text-gray-600 text-base leading-relaxed"
              style={styleUtils.bodyStyles}
              dangerouslySetInnerHTML={{ __html: processContent(content) }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
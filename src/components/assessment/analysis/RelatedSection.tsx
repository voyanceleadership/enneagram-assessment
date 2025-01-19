import React, { useState } from 'react';
import { Binary, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Theme, StyleUtils } from './types';

interface RelatedSectionProps {
  theme: Theme;
  styleUtils: StyleUtils;
  wingContent: string;
  lineContent: string;
}

export default function RelatedSection({ 
  theme, 
  styleUtils, 
  wingContent, 
  lineContent 
}: RelatedSectionProps) {
  const [showWingInfo, setShowWingInfo] = useState(false);
  const [showLineInfo, setShowLineInfo] = useState(false);

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
            style={{ backgroundColor: `${theme.colors.accent3}10` }}
          >
            <Binary className="h-5 w-5" style={{ color: theme.colors.accent3 }} />
          </div>
          <div className="flex-1">
            <h3 
              className="text-xl text-gray-900 font-medium mb-4"
              style={styleUtils.headingStyles}
            >
              Related Types
            </h3>

            <div className="space-y-6">
              {/* Wing Types Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 
                    className="text-lg text-gray-900"
                    style={styleUtils.headingStyles}
                  >
                    Wing Types
                  </h4>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 font-medium p-0 h-auto"
                    onClick={() => setShowWingInfo(!showWingInfo)}
                  >
                    What's a wing type?
                    <ChevronDown 
                      className={`ml-1 h-4 w-4 transition-transform duration-200 
                        ${showWingInfo ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </div>
                
                {showWingInfo && (
                  <div 
                    className="mb-4 p-4 bg-gray-50 rounded-lg text-gray-600"
                    style={styleUtils.bodyStyles}
                  >
                    A wing is one of the two types adjacent to your core type on the Enneagram symbol. 
                    Your wing adds important qualities to your personality.
                  </div>
                )}
                
                <div
                  className="text-gray-600 text-base leading-relaxed"
                  style={styleUtils.bodyStyles}
                  dangerouslySetInnerHTML={{ __html: processContent(wingContent) }}
                />
              </div>

              {/* Line Types Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 
                    className="text-lg text-gray-900"
                    style={styleUtils.headingStyles}
                  >
                    Line Types
                  </h4>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 font-medium p-0 h-auto"
                    onClick={() => setShowLineInfo(!showLineInfo)}
                  >
                    What's a line type?
                    <ChevronDown 
                      className={`ml-1 h-4 w-4 transition-transform duration-200 
                        ${showLineInfo ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </div>
                
                {showLineInfo && (
                  <div 
                    className="mb-4 p-4 bg-gray-50 rounded-lg text-gray-600"
                    style={styleUtils.bodyStyles}
                  >
                    Line types represent your paths of growth (integration) and stress (disintegration) 
                    on the Enneagram symbol.
                  </div>
                )}
                
                <div
                  className="text-gray-600 text-base leading-relaxed"
                  style={styleUtils.bodyStyles}
                  dangerouslySetInnerHTML={{ __html: processContent(lineContent) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
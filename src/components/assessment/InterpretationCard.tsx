import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { theme, styleUtils } from '@/styles/theme';
import Link from 'next/link';

const InterpretationCard = () => {
  return (
    <Card className="overflow-hidden bg-white">
      <div className="pt-8"> {/* Add top padding container */}
        <CardContent className="py-12 px-16">
          <div className="flex items-start gap-6">
            <div 
              className="rounded-full p-3 flex-shrink-0" 
              style={{ backgroundColor: `${theme.colors.accent2}15` }}
            >
              <AlertCircle 
                className="h-6 w-6" 
                style={{ color: theme.colors.accent2 }}
              />
            </div>
            <div className="flex-1">
              <h2 
                className="text-xl mb-3"
                style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
              >
                Important Note About Your Results
              </h2>
              <p
                className="mb-4 leading-relaxed"
                style={{ ...styleUtils.bodyStyles, color: theme.colors.text }}
              >
                The Voyance Enneagram Assessment is uniquely designed to provide less unambiguous results than other Enneagram assessments. For this reason, it's likely that your true personality type is one of your top two scores. We encourage you to read the profiles on these types and subjectively evaluate which one resonates the most.
              </p>
              <Link 
                href="/guide/interpreting-results"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                style={styleUtils.bodyStyles}
              >
                Learn more about interpreting your results
                <svg 
                  className="ml-1 h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default InterpretationCard;
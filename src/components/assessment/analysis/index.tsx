// src/components/assessment/analysis/index.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CoreSection from './CoreSection';
import LookAlikeSection from './LookAlikeSection';
import RelatedSection from './RelatedSection';

interface Theme {
  colors: {
    primary: string;
    background: string;
    text: string;
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  fontWeights: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  letterSpacing: {
    heading: string;
    body: string;
  };
}

interface StyleUtils {
  headingStyles: {
    fontFamily: string;
    letterSpacing: string;
    fontWeight: number;
  };
  bodyStyles: {
    fontFamily: string;
    letterSpacing: string;
    fontWeight: number;
  };
}

interface AnalysisProps {
  analysis: string;
  isAnalyzing: boolean;
  theme: Theme;
  styleUtils: StyleUtils;
}

export default function Analysis({ analysis, isAnalyzing, theme, styleUtils }: AnalysisProps) {
  const extractSection = (title: string): string => {
    const regex = new RegExp(`<h2>${title}<\/h2>(.*?)(?=<h2>|$)`, 's');
    const match = analysis.match(regex);
    return match ? match[1].trim() : '';
  };

  if (isAnalyzing) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600" style={styleUtils.bodyStyles}>
              Generating your personalized analysis...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-8 pb-10 px-16">
        <h2 
          className="text-2xl mb-8 text-center font-medium"
          style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
        >
          Your Personalized Analysis
        </h2>
        
        <div className="space-y-6">
          <CoreSection
            theme={theme}
            styleUtils={styleUtils}
            content={extractSection("Core Type Analysis")}
          />
          
          <LookAlikeSection
            theme={theme}
            styleUtils={styleUtils}
            content={extractSection("Look-Alike Types")}
          />
          
          <RelatedSection
            theme={theme}
            styleUtils={styleUtils}
            wingContent={extractSection("Wing Analysis")}
            lineContent={extractSection("Line Analysis")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
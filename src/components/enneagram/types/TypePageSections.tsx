import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const TypeSection = ({ title, children }: SectionProps) => (
  <Card className="overflow-hidden">
    <CardContent className="py-12 px-16">
      <h2 
        className="text-2xl mb-6"
        style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
      >
        {title}
      </h2>
      <div
        className="space-y-4"
        style={{ 
          ...styleUtils.bodyStyles, 
          color: theme.colors.text,
          lineHeight: '1.7'
        }}
      >
        {children}
      </div>
    </CardContent>
  </Card>
);

export const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-6 space-y-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export const LevelsSection = ({ levels }: { 
  levels: {
    healthy: string[];
    average: string[];
    unhealthy: string[];
  }
}) => (
  <div className="space-y-6">
    <div>
      <h3 
        className="text-xl mb-3"
        style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
      >
        Healthy Levels
      </h3>
      <BulletList items={levels.healthy} />
    </div>
    <div>
      <h3 
        className="text-xl mb-3"
        style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
      >
        Average Levels
      </h3>
      <BulletList items={levels.average} />
    </div>
    <div>
      <h3 
        className="text-xl mb-3"
        style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
      >
        Unhealthy Levels
      </h3>
      <BulletList items={levels.unhealthy} />
    </div>
  </div>
);

export const RelatedTypesSection = ({ wings, arrows }: {
  wings: {
    nine?: string;
    two?: string;
  };
  arrows: {
    integration: string;
    disintegration: string;
  };
}) => (
  <div className="space-y-6">
    <div>
      <h3 
        className="text-xl mb-3"
        style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
      >
        Wings
      </h3>
      <div className="space-y-2">
        {wings.nine && <p><strong>1w9:</strong> {wings.nine}</p>}
        {wings.two && <p><strong>1w2:</strong> {wings.two}</p>}
      </div>
    </div>
    <div>
      <h3 
        className="text-xl mb-3"
        style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
      >
        Arrows
      </h3>
      <div className="space-y-2">
        <p><strong>Integration (Type 7):</strong> {arrows.integration}</p>
        <p><strong>Disintegration (Type 4):</strong> {arrows.disintegration}</p>
      </div>
    </div>
  </div>
);
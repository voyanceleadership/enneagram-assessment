// src/components/enneagram/comparison/ComparisonRowLabel.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import TypeIcon from '@/components/enneagram/TypeIcons';
import {
  FileText, // Brief Description - document/overview
  Target, // Top Priority - target/goal
  ListChecks, // Secondary Desires - additional goals
  AlertTriangle, // Biggest Fear - warning/danger
  ShieldAlert, // Secondary Fears - protective concerns
  Star, // At Their Best - excellence/achievement
  CloudRain, // Under Stress - stormy weather
  Bell, // Wake-Up Call - alert/warning
  Brain, // Mental Habit - thinking patterns
  Ban, // Fundamental Flaw - core issue
  MessageSquareX, // False Narrative - incorrect story
  TrendingUp, // Key to Growth - upward progress
  ExternalLink // Learn More - external link
} from 'lucide-react';

const ROW_METADATA = {
  briefDescription: {
    icon: FileText,
    label: "Brief Description",
    description: "A quick overview of this type's core motivation and behavior"
  },
  topPriority: {
    icon: Target,
    label: "Top Priority",
    description: "The main driving force behind this type's decisions"
  },
  secondaryDesires: {
    icon: ListChecks,
    label: "Secondary Desires",
    description: "Additional motivations that influence this type"
  },
  biggestFear: {
    icon: AlertTriangle,
    label: "Biggest Fear",
    description: "The core fear that shapes this type's behavior"
  },
  secondaryFears: {
    icon: ShieldAlert,
    label: "Secondary Fears",
    description: "Additional concerns that influence this type's actions"
  },
  atTheirBest: {
    icon: Star,
    label: "At Their Best",
    description: "How this type shows up when healthy and balanced"
  },
  underStress: {
    icon: CloudRain,
    label: "Under Stress",
    description: "Common behaviors when this type is under pressure"
  },
  wakeUpCall: {
    icon: Bell,
    label: "Wake-Up Call",
    description: "Signs that this type is becoming unbalanced"
  },
  mentalHabit: {
    icon: Brain,
    label: "Mental Habit",
    description: "The typical thought patterns of this type"
  },
  fundamentalFlaw: {
    icon: Ban,
    label: "Fundamental Flaw",
    description: "The core challenge this type faces"
  },
  falseNarrative: {
    icon: MessageSquareX,
    label: "False Narrative",
    description: "The limiting belief this type tends to hold"
  },
  keyToGrowth: {
    icon: TrendingUp,
    label: "Key to Growth",
    description: "Essential practices for this type's development"
  },
  learnMore: {
    icon: ExternalLink,
    label: "Learn More",
    description: "View detailed information about this type"
  }
};

interface ComparisonRowLabelProps {
  field: string;
}

const ComparisonRowLabel: React.FC<ComparisonRowLabelProps> = ({ field }) => {
  const metadata = ROW_METADATA[field as keyof typeof ROW_METADATA];
  if (!metadata) return null;

  const { icon: Icon, label, description } = metadata;

  return (
    <Card className="bg-white shadow-md border-0">
      <CardContent className="p-6">
        <div className="pt-4">
          <Icon 
            size={24} 
            color={theme.colors.accent3}
          />
          <h3 
            className="text-lg mt-3"
            style={{ 
              ...styleUtils.headingStyles,
              color: theme.colors.accent3
            }}
          >
            {label}
          </h3>
          <p 
            className="text-sm mt-2"
            style={{
              ...styleUtils.bodyStyles,
              color: theme.colors.text
            }}
          >
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonRowLabel;
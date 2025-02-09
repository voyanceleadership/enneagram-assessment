// src/components/enneagram/types/sections/TypeSnapshot.tsx
import React from 'react';
import { TypeData } from '@/lib/types/types';
import SnapshotCard from '../components/SnapshotCard';
import ExpandableContent from '../components/ExpandableContent';
import {
  FileText, Target, ListChecks, AlertTriangle, ShieldAlert,
  Star, CloudRain, Bell, Brain, Ban, MessageSquareX, TrendingUp
} from 'lucide-react';

interface TypeSnapshotProps {
  typeData: TypeData;
}

// Configuration for snapshot sections with their icons and descriptions
const SNAPSHOT_SECTIONS = {
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
  characteristicVice: {
    icon: Ban,
    label: "Characteristic Vice",
    description: "The core challenge this type faces"
  },
  innerStory: {
    icon: MessageSquareX,
    label: "Inner Story",
    description: "The limiting belief this type tends to hold"
  },
  keyToGrowth: {
    icon: TrendingUp,
    label: "Key to Growth",
    description: "Essential practices for this type's development"
  }
} as const;

// Component for displaying the type snapshot section with expandable content
export default function TypeSnapshot({ typeData }: TypeSnapshotProps) {
  const renderContent = (key: keyof typeof SNAPSHOT_SECTIONS) => {
    const data = typeData[key as keyof TypeData];
    
    // Handle arrays (secondary desires and fears)
    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx}>
              {key === 'secondaryDesires' || key === 'secondaryFears' ? (
                <ExpandableContent 
                  summary={item.summary} 
                  explanation={item.explanation}
                />
              ) : (
                // Static card for other array items
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-white">
                    <span className="font-medium text-gray-800">{item.summary}</span>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-600">{item.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // Handle single items
    if (data && typeof data === 'object' && 'summary' in data && 'explanation' in data) {
      return (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-white">
            <span className="font-medium text-gray-800">{data.summary}</span>
          </div>
          <div className="p-4 bg-gray-50">
            <p className="text-gray-600">{data.explanation}</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {Object.entries(SNAPSHOT_SECTIONS).map(([key, section]) => (
        <SnapshotCard
          key={key}
          icon={section.icon}
          label={section.label}
          description={section.description}
        >
          {renderContent(key as keyof typeof SNAPSHOT_SECTIONS)}
        </SnapshotCard>
      ))}
    </div>
  );
}
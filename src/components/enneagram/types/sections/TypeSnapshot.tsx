/**
 * TypeSnapshot Component - With simplified anchor handling
 * 
 * A comprehensive overview section that displays key characteristics and attributes
 * of an Enneagram type. This component serves as a quick-reference guide,
 * presenting information in distinct, collapsible sections.
 */

import React from 'react';
import { TypeData } from '@/lib/enneagram/content/types';
import SnapshotCard from '../components/SnapshotCard';
import ExpandableContent from '../components/ExpandableContent';
import {
  FileText, Target, ListChecks, AlertTriangle, ShieldAlert,
  Star, CloudRain, Bell, Brain, Ban, MessageSquareX, TrendingUp
} from 'lucide-react';

interface TypeSnapshotProps {
  typeData: TypeData;
}

/**
 * Configuration for all snapshot sections
 * Each section defines:
 * - id: Unique identifier matching sidebar navigation
 * - title: Display name for the section
 * - icon: Lucide icon component to represent the section
 * - description: Tooltip/helper text explaining the section
 * - key: Reference to the corresponding data in TypeData
 */
const SNAPSHOT_SECTIONS = [
  {
    id: 'brief-description',
    title: 'Brief Description',
    icon: FileText,
    description: "A quick overview of this type's core motivation and behavior",
    key: 'briefDescription'
  },
  {
    id: 'top-priority',
    title: 'Top Priority',
    icon: Target,
    description: "The main driving force behind this type's decisions",
    key: 'topPriority'
  },
  {
    id: 'secondary-desires',
    title: 'Secondary Desires',
    icon: ListChecks,
    description: "Additional motivations that influence this type",
    key: 'secondaryDesires'
  },
  {
    id: 'biggest-fear',
    title: 'Biggest Fear',
    icon: AlertTriangle,
    description: "The core fear that shapes this type's behavior",
    key: 'biggestFear'
  },
  {
    id: 'secondary-fears',
    title: 'Secondary Fears',
    icon: ShieldAlert,
    description: "Additional concerns that influence this type's actions",
    key: 'secondaryFears'
  },
  {
    id: 'at-their-best',
    title: 'At Their Best',
    icon: Star,
    description: "How this type shows up when healthy and balanced",
    key: 'atTheirBest'
  },
  {
    id: 'under-stress',
    title: 'Under Stress',
    icon: CloudRain,
    description: "Common behaviors when this type is under pressure",
    key: 'underStress'
  },
  {
    id: 'wake-up-call',
    title: 'Wake-Up Call',
    icon: Bell,
    description: "Signs that this type is becoming unbalanced",
    key: 'wakeUpCall'
  },
  {
    id: 'mental-habit',
    title: 'Mental Habit',
    icon: Brain,
    description: "The typical thought patterns of this type",
    key: 'mentalHabit'
  },
  {
    id: 'characteristic-vice',
    title: 'Characteristic Vice',
    icon: Ban,
    description: "The core challenge this type faces",
    key: 'characteristicVice'
  },
  {
    id: 'inner-story',
    title: 'Inner Story',
    icon: MessageSquareX,
    description: "The limiting belief this type tends to hold",
    key: 'innerStory'
  },
  {
    id: 'key-to-growth',
    title: 'Key to Growth',
    icon: TrendingUp,
    description: "Essential practices for this type's development",
    key: 'keyToGrowth'
  }
] as const;

export default function TypeSnapshot({ typeData }: TypeSnapshotProps) {
  /**
   * Renders the content for a specific section based on its data type
   * Handles both array-based content (like secondary desires/fears)
   * and single-item content (like brief description)
   * 
   * @param key - The key to access the relevant data in typeData
   * @returns JSX for the rendered content
   */
  const renderContent = (key: typeof SNAPSHOT_SECTIONS[number]['key']) => {
    const data = typeData[key];
    
    // Handle array data (secondary desires and fears)
    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx}>
              {key === 'secondaryDesires' || key === 'secondaryFears' ? (
                // Use expandable content for secondary desires and fears
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
    
    // Handle single item data (objects with summary and explanation)
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
      {SNAPSHOT_SECTIONS.map((section) => (
        <div
          key={section.id}
          id={`section-${section.id}`}
        >
          <div id={`anchor-snapshot-${section.id}`}></div>
          <SnapshotCard
            icon={section.icon}
            label={section.title}
            description={section.description}
          >
            {renderContent(section.key)}
          </SnapshotCard>
        </div>
      ))}
    </div>
  );
}
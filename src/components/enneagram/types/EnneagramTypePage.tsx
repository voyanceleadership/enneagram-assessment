// src/components/enneagram/types/EnneagramTypePage.tsx
'use client';

import React, { useState } from 'react';
import { TypeSection, BulletList, LevelsSection, RelatedTypesSection } from './TypePageSections';
import { TypeData } from '@/lib/types/types';
import { TYPE_NUMBERS } from '@/lib/types/constants';
import { Card, CardContent } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import AssessmentNavbar from '@/components/assessment/AssessmentNavbar';
import TypeSymbol from '@/components/assessment/TypeSymbol';
import {
  FileText, Target, ListChecks, AlertTriangle, ShieldAlert,
  Star, CloudRain, Bell, Brain, Ban, MessageSquareX,
  TrendingUp, Users, GitBranch, Shuffle, Sparkles, CheckCircle2,
  AlertOctagon, ChevronDown, ChevronUp
} from 'lucide-react';

// ===== Types =====
interface EnneagramTypePageProps {
  typeData: TypeData;
  typeNumber: string;
}

interface SectionHeaderProps {
  sectionNumber: string;
  title: string;
  topOffset?: number;
}

interface ExpandableContentProps {
  summary: string;
  explanation: string;
}

// ===== Expandable Content Component =====
const ExpandableContent: React.FC<ExpandableContentProps> = ({ summary, explanation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p 
          className="text-lg"
          style={{ color: theme.colors.text }}
        >
          {summary}
        </p>
        {isExpanded ? 
          <ChevronUp className="flex-shrink-0" size={20} /> : 
          <ChevronDown className="flex-shrink-0" size={20} />
        }
      </div>
      {isExpanded && (
        <p
          className="text-base text-gray-600 mt-2"
          style={{ color: theme.colors.text }}
        >
          {explanation}
        </p>
      )}
    </div>
  );
};

// ===== Header Component =====
const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  sectionNumber, 
  title,
  topOffset = 0
}) => (
  <div 
    className="sticky w-full z-10 shadow-md"
    style={{ 
      backgroundColor: 'white',
      borderLeft: `4px solid ${theme.colors.accent1}`,
      top: `${topOffset}px` 
    }}
  >
    <div className="max-w-4xl mx-auto px-4">
      <div className="py-6">
        <h2 
          className="text-2xl font-medium"
          style={{ color: theme.colors.text }}
        >
          <span 
            className="text-sm uppercase tracking-wider block mb-1"
            style={{ color: theme.colors.accent1 }}
          >
            Section {sectionNumber}
          </span>
          {title}
        </h2>
      </div>
    </div>
  </div>
);

// ===== Configuration =====
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
};

const renderArrayContent = (items: Array<{ summary: string; explanation: string }>) => (
  <ul className="list-disc pl-6 space-y-4">
    {items.map((item, idx) => (
      <li key={idx} className="text-base">
        <ExpandableContent summary={item.summary} explanation={item.explanation} />
      </li>
    ))}
  </ul>
);

const SECTIONS = [
  {
    id: 'snapshot',
    title: 'Snapshot',
    content: (typeData: TypeData) => (
      <div className="space-y-6">
        {Object.entries(SNAPSHOT_SECTIONS).map(([key, section]) => (
          <div 
            key={key}
            style={{ 
              display: 'grid',
              gridTemplateColumns: '25% 75%',
              gap: '1.5rem'
            }}
          >
            {/* Label Card */}
            <Card className="bg-white shadow-md border-0">
              <div className="p-6">
                <div className="mb-4">
                  <section.icon size={24} color={theme.colors.accent3} />
                </div>
                <h3 
                  className="text-lg mb-2"
                  style={{ 
                    ...styleUtils.headingStyles, 
                    color: theme.colors.accent3
                  }}
                >
                  {section.label}
                </h3>
                <p 
                  className="text-sm text-gray-600"
                  style={styleUtils.bodyStyles}
                >
                  {section.description}
                </p>
              </div>
            </Card>

            {/* Content Card */}
            <Card className="bg-white shadow-md border-0">
              <div className="p-6">
              {(() => {
                const data = typeData[key as keyof typeof typeData];
                if (Array.isArray(data)) {
                  return (
                    <ul className="list-disc pl-6 space-y-2">
                      {data.map((item: any, idx: number) => (
                        <li 
                          key={idx} 
                          className="text-base"
                          style={{ color: theme.colors.text }}
                        >
                          {item.summary}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (data && typeof data === 'object' && 'summary' in data) {
                  return (
                    <div>
                      <p 
                        className="text-lg mb-2"
                        style={{ color: theme.colors.text }}
                      >
                        {data.summary}
                      </p>
                      <p
                        className="text-base text-gray-600"
                        style={{ color: theme.colors.text }}
                      >
                        {data.explanation}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
              </div>
            </Card>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'typeSummary',
    title: 'Type Summary',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <p style={{ color: theme.colors.text }}>
            {typeData.sections.typeSummary}
          </p>
        </div>
      </Card>
    )
  },
  {
    id: 'longDescription',
    title: 'Long Description',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <p style={{ color: theme.colors.text }}>
            {typeData.sections.longDescription}
          </p>
        </div>
      </Card>
    )
  },
  {
    id: 'youMightBe',
    title: 'You Might Be This Type If...',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <ul className="list-disc pl-6 space-y-2">
            {typeData.sections.mightBeType.map((item, idx) => (
              <li 
                key={idx} 
                className="text-base"
                style={{ color: theme.colors.text }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    )
  },
  {
    id: 'probablyNot',
    title: "You're Probably Not This Type If...",  // Changed to straight quotes
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <ul className="list-disc pl-6 space-y-2">
            {typeData.sections.probablyNotType.map((item, idx) => (
              <li 
                key={idx} 
                className="text-base"
                style={{ color: theme.colors.text }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    )
  },
  {
    id: 'levelsOfDevelopment',
    title: 'Levels of Development',
    content: (typeData: TypeData) => (
      <div className="space-y-6">
        <Card className="bg-white shadow-md border-0">
          <div className="p-6">
            <h3 
              className="text-xl mb-4"
              style={{ color: theme.colors.accent1 }}
            >
              Healthy Levels
            </h3>
            <p style={{ color: theme.colors.text }}>
              {typeData.sections.healthyLevel}
            </p>
          </div>
        </Card>
        <Card className="bg-white shadow-md border-0">
          <div className="p-6">
            <h3 
              className="text-xl mb-4"
              style={{ color: theme.colors.primary }}
            >
              Average Levels
            </h3>
            <p style={{ color: theme.colors.text }}>
              {typeData.sections.averageLevel}
            </p>
          </div>
        </Card>
        <Card className="bg-white shadow-md border-0">
          <div className="p-6">
            <h3 
              className="text-xl mb-4"
              style={{ color: theme.colors.accent2 }}
            >
              Unhealthy Levels
            </h3>
            <p style={{ color: theme.colors.text }}>
              {typeData.sections.unhealthyLevel}
            </p>
          </div>
        </Card>
      </div>
    )
  },
  {
    id: 'commonMisconceptions',
    title: 'Common Misconceptions',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <ul className="list-disc pl-6 space-y-4">
            {typeData.sections.misconceptions.map((item, idx) => (
              <li 
                key={idx} 
                className="text-base"
                style={{ color: theme.colors.text }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    )
  },
  {
    id: 'typesThatMayMisidentify',
    title: 'Types That May Misidentify as This Type',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          {typeData.sections.typesMisidentifyingAsThis.map((type, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="font-bold text-lg mb-3" style={{ color: theme.colors.text }}>
                {type.type}
              </h3>
              <div className="pl-4 space-y-4">
                <div>
                  <h4 className="font-bold mb-2" style={{ color: theme.colors.text }}>
                    Shared Traits:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {type.sharedTraits.map((trait, idx) => (
                      <li key={idx} className="font-medium" style={{ color: theme.colors.text }}>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2" style={{ color: theme.colors.text }}>
                    Key Differences:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <span className="font-bold">Core Motivation: </span>
                      <span style={{ color: theme.colors.text }}>{type.differences.coreMotivation}</span>
                    </li>
                    <li>
                      <span className="font-bold">Behavioral Differences: </span>
                      <span style={{ color: theme.colors.text }}>{type.differences.behavioral}</span>
                    </li>
                    <li>
                      <span className="font-bold">Stress Behavior: </span>
                      <span style={{ color: theme.colors.text }}>{type.differences.stress}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  },
  {
    id: 'mayMisidentifyAs',
    title: 'This Type May Misidentify as...',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          {typeData.sections.thisTypeMayMisidentifyAs.map((type, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="font-bold text-lg mb-3" style={{ color: theme.colors.text }}>
                {type.type}
              </h3>
              <div className="pl-4 space-y-4">
                <div>
                  <h4 className="font-bold mb-2" style={{ color: theme.colors.text }}>
                    Shared Traits:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {type.sharedTraits.map((trait, idx) => (
                      <li key={idx} className="font-medium" style={{ color: theme.colors.text }}>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2" style={{ color: theme.colors.text }}>
                    Key Differences:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <span className="font-bold">Core Motivation: </span>
                      <span style={{ color: theme.colors.text }}>{type.differences.coreMotivation}</span>
                    </li>
                    <li>
                      <span className="font-bold">Behavioral Differences: </span>
                      <span style={{ color: theme.colors.text }}>{type.differences.behavioral}</span>
                    </li>
                    <li>
                      <span className="font-bold">Stress Behavior: </span>
                      <span style={{ color: theme.colors.text }}>{type.differences.stress}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  },
  {
    id: 'wingTypes',
    title: 'Wing Types',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <div className="space-y-8">
            {Object.entries(typeData.sections.wingTypes).map(([type, description]) => {
              const wingNumber = type.split(' ')[1];
              return (
                <div key={type} className="flex gap-4">
                  <TypeSymbol type={wingNumber} />
                  <div>
                    <h3 
                      className="text-lg mb-2"
                      style={{ color: theme.colors.accent3 }}
                    >
                      {type}
                    </h3>
                    <p style={{ color: theme.colors.text }}>{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    )
  },
  {
    id: 'lineTypes',
    title: 'Line Types',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <div className="space-y-8">
            {Object.entries(typeData.sections.lineTypes).map(([type, description]) => {
              const lineNumber = type.split(' ')[1];
              return (
                <div key={type} className="flex gap-4">
                  <TypeSymbol type={lineNumber} />
                  <div>
                    <h3 
                      className="text-lg mb-2"
                      style={{ color: theme.colors.accent3 }}
                    >
                      {type}
                    </h3>
                    <p style={{ color: theme.colors.text }}>{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    )
  },
  {
    id: 'growthPractices',
    title: 'Growth Practices',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <ul className="list-disc pl-6 space-y-2">
            {typeData.sections.growthPractices.map((practice, idx) => (
              <li 
                key={idx} 
                className="text-base"
                style={{ color: theme.colors.text }}
              >
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    )
  },
  {
    id: 'famousExamples',
    title: 'Famous Examples',
    content: (typeData: TypeData) => (
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <ul className="list-disc pl-6 space-y-2">
            {typeData.sections.famousExamples.map((example, idx) => (
              <li 
                key={idx} 
                className="text-base"
                style={{ color: theme.colors.text }}
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    )
  }
];

// ===== Main Component =====
export default function EnneagramTypePage({ typeData, typeNumber }: EnneagramTypePageProps) {
  const typeNumberWord = TYPE_NUMBERS[typeNumber];

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* ----- Navigation ----- */}
      <div className="w-full border-b" style={{ borderColor: `${theme.colors.text}10` }}>
        <AssessmentNavbar />
      </div>
      
      <div>
        {/* ----- Header with Type Symbol ----- */}
        <div className="py-12 max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <TypeSymbol type={typeNumber} />
            <h1 
              className="text-4xl mb-2"
              style={{ 
                ...styleUtils.headingStyles,
                color: theme.colors.accent3
              }}
            >
              Type {typeData.typeDigit}: {typeData.typeName}
            </h1>
          </div>
        </div>

        {/* ----- Content Sections ----- */}
        {SECTIONS.map((section, index) => (
          <div key={section.id} className="mb-12">
            <SectionHeader 
              sectionNumber={`0${index + 1}`}
              title={section.title}
              topOffset={0}  // Adjust if needed based on navbar height
            />
            <div className="py-8 max-w-4xl mx-auto px-4">
              {section.content(typeData)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
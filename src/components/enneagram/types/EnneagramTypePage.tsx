'use client';

import React from 'react';
import { TypeData } from '@/lib/types/types';
import { theme } from '@/styles/theme';
import Navbar from '@/components/navigation/Navbar';

// Import all section components
import TypeHeader from './sections/TypeHeader';
import TypeSnapshot from './sections/TypeSnapshot';
import TypeSummary from './sections/TypeSummary';
import TypeDescription from './sections/TypeDescription';
import TypeIdentification from './sections/TypeIdentification';
import DevelopmentLevels from './sections/DevelopmentLevels';
import Misconceptions from './sections/Misconceptions';
import RelatedTypes from './sections/RelatedTypes';
import GrowthPractices from './sections/GrowthPractices';
import FamousExamples from './sections/FamousExamples';
import Misidentifications from './sections/Misidentifications';

// Import shared components
import SectionHeader from './components/SectionHeader';

interface EnneagramTypePageProps {
  typeData: TypeData;
  typeNumber: string;
}

// Configuration for all sections that will appear on the page
const SECTIONS = [
  {
    id: 'snapshot',
    title: 'Type Snapshot',
    Component: TypeSnapshot
  },
  {
    id: 'summary',
    title: 'Type Summary',
    Component: TypeSummary
  },
  {
    id: 'description',
    title: 'Type Description',
    Component: TypeDescription
  },
  {
    id: 'identification',
    title: 'Type Identification',
    Component: TypeIdentification
  },
  {
    id: 'misidentifications',
    title: ' Misidentifications',
    Component: Misidentifications
  },
  {
    id: 'levels',
    title: 'Levels of Development',
    Component: DevelopmentLevels
  },
  {
    id: 'misconceptions',
    title: 'Common Misconceptions',
    Component: Misconceptions
  },
  {
    id: 'relatedTypes',
    title: 'Related Types',
    Component: RelatedTypes
  },
  {
    id: 'growth',
    title: 'Growth Practices',
    Component: GrowthPractices
  },
  {
    id: 'examples',
    title: 'Famous Examples',
    Component: FamousExamples
  }
] as const;

export default function EnneagramTypePage({ typeData, typeNumber }: EnneagramTypePageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Navigation */}
      <div className="w-full border-b" style={{ borderColor: `${theme.colors.text}10` }}>
        <Navbar />
      </div>

      {/* Header */}
      <TypeHeader 
        typeNumber={typeNumber} 
        typeName={typeData.typeName} 
        typeDigit={typeData.typeDigit} 
      />

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4">
        {SECTIONS.map((section, index) => (
          <div key={section.id} className="mb-12 relative">
            <SectionHeader 
              sectionNumber={`0${index + 1}`}
              title={section.title}
              topOffset={64}
              containerId={`section-${section.id}`}
            />
            
            <div className="pt-6" id={`section-${section.id}`}>
              <section.Component typeData={typeData} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { TypeData } from '@/lib/types/types';
import { theme } from '@/styles/theme';
import Navbar from '@/components/navigation/Navbar';
import TypeSidebar from './components/TypeSidebar';
import SectionHeader from './components/SectionHeader';
import { TYPE_SECTIONS } from '@/lib/types/constants'

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

interface EnneagramTypePageProps {
  typeData: TypeData;
  typeNumber: string;
}

export default function EnneagramTypePage({ typeData, typeNumber }: EnneagramTypePageProps) {
  const [activeSection, setActiveSection] = useState(TYPE_SECTIONS[0].id);

  const handleSectionClick = (sectionId: string, subsectionId?: string) => {
    if (subsectionId) {
      // Find the parent section element
      const sectionElement = document.getElementById(`section-${sectionId}`);
      if (!sectionElement) return;

      // Find the section header height
      const sectionHeader = sectionElement.querySelector('[data-section-header]');
      const headerHeight = sectionHeader?.getBoundingClientRect().height || 0;

      // Find the tabs container
      const tabsContainer = sectionElement.querySelector('[data-tabs-container]');
      const tabsHeight = tabsContainer?.getBoundingClientRect().height || 0;

      // Find the content for this specific subsection
      const subsectionContent = sectionElement.querySelector(`[data-subsection-id="${subsectionId}"]`);
      if (!subsectionContent) return;

      // Calculate total offset
      const navbarHeight = 64; // Height of main navigation
      const padding = 24; // Additional padding
      const totalOffset = navbarHeight + headerHeight + tabsHeight + padding;

      // First switch to the correct tab
      const tabElement = sectionElement.querySelector(`[data-tab-id="${subsectionId}"]`);
      if (tabElement instanceof HTMLElement) {
        tabElement.click();
      }

      // Then scroll after a small delay to allow for tab switch animation
      setTimeout(() => {
        const elementPosition = subsectionContent.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      // Handle regular section clicks
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const offset = 100;
      
      // Find all section elements
      const sectionElements = TYPE_SECTIONS.flatMap(section => {
        const mainElement = document.getElementById(`section-${section.id}`);
        const subElements = section.subsections?.map(sub => 
          document.getElementById(`section-${sub.id}`)
        ) || [];
        return [mainElement, ...subElements].filter(Boolean) as HTMLElement[];
      });

      // Find the current section in view
      for (const element of sectionElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          const sectionId = element.id.replace('section-', '');
          if (sectionId !== activeSection) {
            setActiveSection(sectionId);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Navigation */}
      <div className="w-full border-b fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" 
        style={{ borderColor: `${theme.colors.text}10` }}
      >
        <Navbar />
      </div>

      <TypeSidebar 
        sections={TYPE_SECTIONS}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        typeNumber={typeNumber}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20">
        {/* Header */}
        <TypeHeader 
          typeNumber={typeNumber} 
          typeName={typeData.typeName} 
          typeDigit={typeData.typeDigit} 
        />

        {/* Content Sections */}
        <div className="space-y-12">
          <div id="section-snapshot">
            <SectionHeader 
              sectionNumber="01"
              title="Type Snapshot"
              topOffset={64}
              containerId="section-snapshot"
            />
            <div className="pt-6">
              <TypeSnapshot typeData={typeData} />
            </div>
          </div>

          <div id="section-summary">
            <SectionHeader 
              sectionNumber="02"
              title="Type Summary"
              topOffset={64}
              containerId="section-summary"
            />
            <div className="pt-6">
              <TypeSummary typeData={typeData} />
            </div>
          </div>

          <div id="section-description">
            <SectionHeader 
              sectionNumber="03"
              title="Type Description"
              topOffset={64}
              containerId="section-description"
            />
            <div className="pt-6">
              <TypeDescription typeData={typeData} />
            </div>
          </div>

          <div id="section-identification">
            <SectionHeader 
              sectionNumber="04"
              title="Type Identification"
              topOffset={64}
              containerId="section-identification"
            />
            <div className="pt-6">
              <TypeIdentification typeData={typeData} />
            </div>
          </div>

          <div id="section-misidentifications">
            <SectionHeader 
              sectionNumber="05"
              title="Misidentifications"
              topOffset={64}
              containerId="section-misidentifications"
            />
            <div className="pt-6">
              <Misidentifications typeData={typeData} />
            </div>
          </div>

          <div id="section-levels">
            <SectionHeader 
              sectionNumber="06"
              title="Levels of Development"
              topOffset={64}
              containerId="section-levels"
            />
            <div className="pt-6">
              <DevelopmentLevels typeData={typeData} />
            </div>
          </div>

          <div id="section-misconceptions">
            <SectionHeader 
              sectionNumber="07"
              title="Common Misconceptions"
              topOffset={64}
              containerId="section-misconceptions"
            />
            <div className="pt-6">
              <Misconceptions typeData={typeData} />
            </div>
          </div>

          <div id="section-related-types">
            <SectionHeader 
              sectionNumber="08"
              title="Related Types"
              topOffset={64}
              containerId="section-related-types"
            />
            <div className="pt-6">
              <RelatedTypes typeData={typeData} />
            </div>
          </div>

          <div id="section-growth">
            <SectionHeader 
              sectionNumber="09"
              title="Growth Practices"
              topOffset={64}
              containerId="section-growth"
            />
            <div className="pt-6">
              <GrowthPractices typeData={typeData} />
            </div>
          </div>

          <div id="section-examples">
            <SectionHeader 
              sectionNumber="10"
              title="Famous Examples"
              topOffset={64}
              containerId="section-examples"
            />
            <div className="pt-6">
              <FamousExamples typeData={typeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
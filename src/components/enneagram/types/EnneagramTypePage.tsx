'use client';

/**
 * EnneagramTypePage Component
 * 
 * A comprehensive page component for displaying detailed information about a specific Enneagram type.
 * This component serves as the main container for all type-specific content and manages the layout,
 * navigation, and scroll behavior for the various sections of type information.
 * 
 * Key Responsibilities:
 * - Manages the overall layout and structure of type pages
 * - Handles scroll-based navigation and section highlighting
 * - Coordinates between the sidebar navigation and main content
 * - Manages the interactive Enneagram symbol display
 * 
 * Dependencies:
 * - Navbar: Global navigation component
 * - TypeSidebar: Section navigation component
 * - SectionHeader: Section title component
 * - DynamicEnneagramSymbol: Interactive Enneagram diagram
 * - Various section components (TypeSnapshot, TypeSummary, etc.)
 * 
 * Data Flow:
 * - Receives typeData and typeNumber as props
 * - Passes relevant data to child components
 * - Manages active section state based on scroll position
 * 
 * Usage:
 * ```tsx
 * <EnneagramTypePage 
 *   typeData={typeData} 
 *   typeNumber="1"
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { TypeData } from '@/lib/enneagram/content/types';
import { theme } from '@/styles/theme';
import Navbar from '@/components/navigation/Navbar';
import TypeSidebar from './components/TypeSidebar';
import SectionHeader from './components/SectionHeader';
import { TYPE_SECTIONS } from '@/lib/enneagram/constants/sections';
import DynamicEnneagramSymbol from '../symbol/DynamicEnneagramSymbol';

// Import all section components
import TypeHeader from './sections/TypeHeader';
import TypeSnapshot from './sections/TypeSnapshot';
import TypeSummary from './sections/TypeSummary';
import TypeDescription from './sections/TypeDescription';
import TypeIdentification from './sections/TypeIdentification';
import DevelopmentLevels from './sections/DevelopmentLevels';
import Misconceptions from './sections/Misconceptions';
import RelatedTypes from './sections/RelatedTypes/RelatedTypesMain';
import GrowthPractices from './sections/GrowthPractices';
import FamousExamples from './sections/FamousExamples';
import Misidentifications from './sections/Misidentifications';

interface EnneagramTypePageProps {
  typeData: TypeData;
  typeNumber: string;
}

/**
 * Title component for the navbar
 * Displays the current type name and number in the center of the navigation bar
 */
const TypeTitle = ({ typeNumber, typeName }: { typeNumber: string; typeName: string }) => (
  <h2 
    className="text-lg font-semibold"
    style={{ color: theme.colors.accent3 }}
  >
    Type {typeNumber}: {typeName}
  </h2>
);

export default function EnneagramTypePage({ typeData, typeNumber }: EnneagramTypePageProps) {
  // Track the currently active section for navigation highlighting
  const [activeSection, setActiveSection] = useState(TYPE_SECTIONS[0].id);

  // Configuration for the Enneagram diagram
  const initialVariation = 'type-only';

  /**
   * Handles clicking on a section in the sidebar navigation
   * Manages smooth scrolling to the target section and subsection handling
   */
  const handleSectionClick = (sectionId: string, subsectionId?: string) => {
    if (subsectionId) {
      // Find the parent section element
      const sectionElement = document.getElementById(`section-${sectionId}`);
      if (!sectionElement) return;
  
      // Find the section header height (for both main section and subsection)
      const mainSectionHeader = sectionElement.querySelector('[data-section-header]');
      const mainHeaderHeight = mainSectionHeader?.getBoundingClientRect().height || 0;
  
      // Find the tabs container
      const tabsContainer = sectionElement.querySelector('[data-tabs-container]');
      const tabsHeight = tabsContainer?.getBoundingClientRect().height || 0;
  
      // Find the subsection content
      const subsectionContent = sectionElement.querySelector(`[data-subsection-id="${subsectionId}"]`);
      if (!subsectionContent) return;
  
      // Calculate total offset including main section header
      const navbarHeight = 64; // Height of main navigation
      const padding = 24; // Additional padding
      const totalOffset = navbarHeight + mainHeaderHeight + tabsHeight + padding;
  
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

  /**
   * Track active section based on scroll position
   * Updates the active section state as the user scrolls through the page
   */
  useEffect(() => {
    const handleScroll = () => {
      const offset = 100;
      
      // Find all section elements including subsections
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
      {/* Global Navigation */}
      <Navbar 
        centerContent={
          <TypeTitle 
            typeNumber={typeNumber} 
            typeName={typeData.typeName} 
          />
        }
      />

      {/* Sidebar Navigation */}
      <TypeSidebar 
        sections={TYPE_SECTIONS}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        typeNumber={typeNumber}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Enneagram Diagram */}
        <div className="w-2/3 mx-auto">
          <DynamicEnneagramSymbol 
            defaultType={parseInt(typeNumber) as 1|2|3|4|5|6|7|8|9}
            defaultVariation="related-types"
            interactive={false}
          />
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Each section is wrapped in a div with a unique ID for navigation */}
          <div id="section-snapshot">
          <SectionHeader 
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
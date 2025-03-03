'use client';

/**
 * EnneagramTypePage Component - Phase 1 Improvements
 * 
 * Changes:
 * - Increased container width for better content display
 * - Added visual type identifier at the top
 * - FIXED: Added proper hydration handling for the Enneagram symbol
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
import TypeDescription from './sections/TypeDescription';
import DevelopmentLevels from './sections/DevelopmentLevels';
import RelatedTypes from './sections/RelatedTypes/RelatedTypesMain';
import GrowthPractices from './sections/GrowthPractices';
import FamousExamples from './sections/FamousExamples';

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
  
  // Add hydration safety for client-side rendering
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Handles clicking on a section in the sidebar navigation
   * Manages smooth scrolling to the target section and subsection handling
   */
  const handleSectionClick = (sectionId: string, subsectionId?: string) => {
    if (!isMounted) return;
    
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
    if (!isMounted) return;
    
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
  }, [activeSection, isMounted]);

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

      {/* Sidebar Navigation - Only render on client */}
      {isMounted && (
        <TypeSidebar 
          sections={TYPE_SECTIONS}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          typeNumber={typeNumber}
        />
      )}

      {/* Main Content - Increased max width */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Enneagram Diagram */}
        <div className="w-2/3 mx-auto">
          <DynamicEnneagramSymbol 
            defaultType={parseInt(typeNumber) as 1|2|3|4|5|6|7|8|9}
            defaultVariation="related-types"
            interactive={false}
          />
        </div>

        {/* Content Sections - With updated max width */}
        <div className="space-y-12">
          {/* 1. Type Snapshot */}
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

          {/* 2. Type Description */}
          <div id="section-description">
            <SectionHeader 
              title="Type Description"
              topOffset={64}
              containerId="section-description"
            />
            <div className="pt-6">
              <TypeDescription typeData={typeData} />
            </div>
          </div>

          {/* 3. Levels of Development */}
          <div id="section-levels">
            <SectionHeader 
              title="Levels of Development"
              topOffset={64}
              containerId="section-levels"
            />
            <div className="pt-6">
              <DevelopmentLevels typeData={typeData} />
            </div>
          </div>

          {/* 4. Related Types */}
          <div id="section-related-types">
            <SectionHeader 
              title="Related Types"
              topOffset={64}
              containerId="section-related-types"
            />
            <div className="pt-6">
              <RelatedTypes typeData={typeData} />
            </div>
          </div>

          {/* 5. Growth Practices */}
          <div id="section-growth">
            <SectionHeader 
              title="Growth Practices"
              topOffset={64}
              containerId="section-growth"
            />
            <div className="pt-6">
              <GrowthPractices typeData={typeData} />
            </div>
          </div>

          {/* 6. Famous Examples */}
          <div id="section-examples">
            <SectionHeader 
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
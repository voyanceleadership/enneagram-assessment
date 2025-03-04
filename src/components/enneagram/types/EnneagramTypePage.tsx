'use client';

/**
 * EnneagramTypePage Component - Improved for correct tab highlighting
 * 
 * Changes:
 * - Added hash-based navigation to support direct links to subsections
 * - Fixed stacking of header and subheader components
 * - Unified scrolling approach using anchor-based navigation
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
    
    // Set root element id for "back to top" functionality
    const rootElement = document.getElementById('__next') || document.documentElement;
    rootElement.id = 'root';
    
    // Check for hash in URL on initial load
    if (window.location.hash) {
      const hash = window.location.hash.substring(1); // remove the #
      const parts = hash.split('-');
      
      // Check if this is an anchor hash with format anchor-sectionId-subsectionId
      if (parts.length >= 2 && parts[0] === 'anchor') {
        const sectionId = parts[1];
        const subsectionId = parts.length >= 3 ? parts[2] : null;
        
        // Update active section state
        setActiveSection(subsectionId || sectionId);
      }
    }
  }, []);

  /**
   * Handles clicking on a section in the sidebar navigation
   * Updates hash for direct linking and browser history
   */
  const handleSectionClick = (sectionId: string, subsectionId?: string) => {
    if (!isMounted) return;
    
    // Update active section in state
    setActiveSection(subsectionId || sectionId);
    
    // Create appropriate hash for the URL
    let hash: string;
    if (subsectionId) {
      hash = `#anchor-${sectionId}-${subsectionId}`;
    } else {
      hash = `#anchor-${sectionId}`;
    }
    
    // Update the URL hash without reloading the page
    if (window.history.pushState) {
      window.history.pushState(null, '', hash);
    } else {
      // Fallback for older browsers
      window.location.hash = hash;
    }
    
    // Find and scroll to the element
    const element = document.getElementById(hash.substring(1));
    if (element) {
      // Calculate proper offset for scrolling
      const navbarHeight = 64; // Height of the fixed navbar
      
      // Check if this is a subsection that needs more offset (for tabs)
      let additionalOffset = 0;
      if (subsectionId && (sectionId === 'levels' || sectionId === 'related-types')) {
        // Get the tab container height
        const tabsContainer = document.querySelector(`#section-${sectionId} [data-tabs-container]`);
        if (tabsContainer) {
          additionalOffset = tabsContainer.getBoundingClientRect().height;
        }
      }
      
      // Scroll with appropriate offset
      const offset = navbarHeight + additionalOffset + 16; // Some extra padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Track active section based on URL hash changes
   */
  useEffect(() => {
    if (!isMounted) return;
    
    const handleHashChange = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('-');
        
        if (parts.length >= 2 && parts[0] === 'anchor') {
          const sectionId = parts[1];
          const subsectionId = parts.length >= 3 ? parts[2] : null;
          
          setActiveSection(subsectionId || sectionId);
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isMounted]);

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
        {/* Create a root anchor for the page */}
        <div id="root"></div>
        
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
            <div id="anchor-snapshot"></div>
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
            <div id="anchor-description"></div>
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
            <div id="anchor-levels"></div>
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
            <div id="anchor-related-types"></div>
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
            <div id="anchor-growth"></div>
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
            <div id="anchor-examples"></div>
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
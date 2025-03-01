/**
 * WingTypesSection Component
 * 
 * Displays information about the potential wing types for an Enneagram type.
 * Shows an interactive Enneagram symbol and detailed cards for both possible wing types.
 * 
 * Features:
 * - Expandable/collapsible Enneagram symbol visualization
 * - Detailed cards for each wing type with description, strengths, and challenges
 * - Height matching between corresponding sections for visual consistency
 * - Responsive layout that adapts to different screen sizes
 */
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../../symbol/DynamicEnneagramSymbol';
import Link from 'next/link';
import { CheckCircle2, XCircle, ChevronLast, ChevronFirst, Maximize2, Minimize2, ChevronsRightLeft } from 'lucide-react';

// Props interface definition
interface WingTypesSectionProps {
  typeDigit: string;           // The number of the core Enneagram type (1-9)
  sectionColor: string;        // Primary color for the section styling
  wingTypes: {                 // Information about both possible wing types
    left: {                    // The wing type that comes before the core type (or 9 for type 1)
      number: string;          // The number of this wing type
      name: string;            // The name of this wing type (e.g., "The Reformer")
      data: any;               // Additional data for this wing type including alias, description, and traits
    };
    right: {                   // The wing type that comes after the core type (or 1 for type 9)
      number: string;          // The number of this wing type
      name: string;            // The name of this wing type
      data: any;               // Additional data for this wing type
    };
  };
  typeData?: {                 // Information about the core type
    typeName: string;          // The name of the core type (e.g., "The Reformer")
  };
}

export default function WingTypesSection({
  typeDigit,
  sectionColor,
  wingTypes,
  typeData
}: WingTypesSectionProps) {
  // State to track the expanded/collapsed state of the symbol
  const [symbolExpanded, setSymbolExpanded] = useState(false);
  
  // Direct DOM refs for the content containers to enable height matching
  const leftDescContainer = useRef<HTMLDivElement>(null);
  const rightDescContainer = useRef<HTMLDivElement>(null);
  const leftPersonalityContainer = useRef<HTMLDivElement>(null);
  const rightPersonalityContainer = useRef<HTMLDivElement>(null);
  const leftStrengthsContainer = useRef<HTMLDivElement>(null);
  const rightStrengthsContainer = useRef<HTMLDivElement>(null);
  const leftChallengesContainer = useRef<HTMLDivElement>(null);
  const rightChallengesContainer = useRef<HTMLDivElement>(null);

  // Toggle symbol expansion
  const toggleSymbolSize = () => {
    setSymbolExpanded(!symbolExpanded);
  };

  /**
   * Styled button link component for consistent button styling
   * Creates a link to the detailed page for a specific Enneagram type
   */
  const StyledButtonLink = ({ typeNumber, typeName }: { typeNumber: string, typeName: string }) => (
    <Link
      href={`/enneagram/types/type${typeNumber}`}
      className="inline-flex items-center justify-center rounded-md font-medium transition-colors"
      style={{ 
        backgroundColor: `${theme.colors.primary}20`,
        color: theme.colors.primary,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.fontWeights.medium,
        textDecoration: 'none',
        padding: '12px 24px',
        height: '45px'
      }}
    >
      Learn more
    </Link>
  );

  /**
   * Function to match heights between corresponding left and right card sections
   * This ensures visual consistency when content lengths differ between cards
   */
  const matchHeights = () => {
    // Helper function to match heights between two elements
    const matchPairHeights = (leftEl: HTMLDivElement | null, rightEl: HTMLDivElement | null) => {
      if (!leftEl || !rightEl) return;
      
      // Reset heights first to get natural content height
      leftEl.style.minHeight = '';
      rightEl.style.minHeight = '';
      
      // Get the content height
      const leftHeight = leftEl.scrollHeight;
      const rightHeight = rightEl.scrollHeight;
      
      // Use the maximum height plus a small buffer
      const maxHeight = Math.max(leftHeight, rightHeight) + 2;
      
      // Apply the height to both elements
      leftEl.style.minHeight = `${maxHeight}px`;
      rightEl.style.minHeight = `${maxHeight}px`;
    };
    
    // Match heights for each section pair
    matchPairHeights(leftDescContainer.current, rightDescContainer.current);
    matchPairHeights(leftPersonalityContainer.current, rightPersonalityContainer.current);
    matchPairHeights(leftStrengthsContainer.current, rightStrengthsContainer.current);
    matchPairHeights(leftChallengesContainer.current, rightChallengesContainer.current);
  };

  // Apply height matching after component mounts and when wingTypes changes
  useEffect(() => {
    // Initial matchHeights call
    matchHeights();
    
    // Call again after content has likely rendered
    const timer1 = setTimeout(matchHeights, 300);
    const timer2 = setTimeout(matchHeights, 800); // Additional call for reliability
    
    // Call if window is resized
    window.addEventListener('resize', matchHeights);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', matchHeights);
    };
  }, [wingTypes]);

  /**
   * Renders the type title with appropriate fallback handling
   * Only displays the type name if it exists in the data
   */
  function renderTypeTitle() {
    // If typeData exists and typeName exists, show full title
    if (typeData && typeData.typeName) {
      return (
        <p className="text-gray-600">
          for Type {typeDigit}: {typeData.typeName}
        </p>
      );
    }
    
    // Fallback if typeName missing but we have typeDigit
    return (
      <p className="text-gray-600">
        for Type {typeDigit}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Symbol container with toggle button */}
      <div className="relative bg-white p-4 rounded-lg shadow-md border-0 mb-8">
        {/* Toggle button */}
        <button 
          onClick={toggleSymbolSize}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label={symbolExpanded ? "Minimize symbol" : "Maximize symbol"}
        >
          {symbolExpanded ? (
            <Minimize2 className="h-5 w-5 text-gray-600" />
          ) : (
            <Maximize2 className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Symbol title and heading */}
        <div className="text-center" style={{ marginTop: '16px', marginBottom: '12px' }}>
          <div className="flex justify-center mb-2">
            <div className="rounded-full p-2 bg-purple-50 flex items-center justify-center">
              <ChevronsRightLeft className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <h4 className="text-xl font-medium" style={{ color: theme.colors.accent3 }}>
            Potential Wing Types
          </h4>
          {/* Use the renderTypeTitle function for resilient rendering */}
          {renderTypeTitle()}
        </div>
        
        {/* Symbol container - Using optimized dimensions with transform animation */}
        <div className="relative mx-auto" style={{ 
          paddingBottom: symbolExpanded ? '67%' : '40%', 
          width: '100%', 
          maxWidth: symbolExpanded ? '600px' : '350px', 
          marginTop: symbolExpanded ? '-10px' : '18px', 
          marginBottom: symbolExpanded ? '0px' : '56px', 
          transition: 'all 0.5s cubic-bezier(0.33, 1, 0.68, 1)' // Smoother easing curve
        }}>
          <div className="absolute inset-0" style={{
            transition: 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
            transform: symbolExpanded ? 'scale(1)' : 'scale(1)',
            transformOrigin: 'center center'
          }}>
            <DynamicEnneagramSymbol 
              defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
              defaultVariation="both-wings"
              interactive={false}
            />
          </div>
        </div>
        
        {/* Help text - positioned closer to the symbol */}
        {!symbolExpanded && (
          <div className="text-center absolute left-0 right-0" style={{ bottom: "20px" }}>
            <span className="text-sm text-gray-500">
              Click to expand for better visibility
            </span>
          </div>
        )}
      </div>

      {/* Wing Type Cards - Side by side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Wing Card */}
        <div id="section-left-wing" data-subsection-id="left-wing">
          <Card className="bg-white shadow-md border-0 overflow-hidden h-full flex flex-col">
            <div className="pt-3 pb-6 px-6 prose prose-gray max-w-none flex-grow">
              {/* Header */}
              <div className="flex items-center mb-8">
                <div className="rounded-full p-2 bg-purple-50 mr-3 flex items-center justify-center">
                  {/* Conditionally flip the icon direction for certain types to match the symbol visual */}
                  {parseInt(typeDigit) >= 3 && parseInt(typeDigit) <= 6 
                    ? <ChevronFirst className="h-5 w-5 text-purple-500" />
                    : <ChevronLast className="h-5 w-5 text-purple-500" />
                  }
                </div>
                <div>
                  <h4 className="text-xl font-medium" style={{ color: theme.colors.accent3, marginBottom: '4px' }}>
                    Type {wingTypes.left.number}: {wingTypes.left.name}
                  </h4>
                  <span className="inline-block px-3 py-0.5 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: `${theme.colors.accent3}15`, color: theme.colors.accent3 }}>
                    {wingTypes.left.data?.alias}
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div 
                ref={leftDescContainer}
                className="bg-gray-50 rounded-lg p-4 mb-8"
              >
                <p className="text-base m-0" style={{ color: theme.colors.text }}>
                  {wingTypes.left.data?.description}
                </p>
              </div>
              
              {/* Personality Blend */}
              <div className="mb-8">
                <h5 className="text-lg font-medium mb-3 flex items-center" 
                    style={{ color: theme.colors.accent3 }}>
                  <div className="rounded-full h-8 w-8 bg-purple-50 flex items-center justify-center mr-3">
                    <span className="text-purple-500 font-medium">{typeDigit}w{wingTypes.left.number}</span>
                  </div>
                  Personality Blend
                </h5>
                <div 
                  ref={leftPersonalityContainer}
                  className="bg-white border rounded-lg p-4" 
                  style={{ borderColor: `${theme.colors.accent3}30` }}
                >
                  <p className="text-gray-700 m-0">{wingTypes.left.data?.combination.personality}</p>
                </div>
              </div>
              
              {/* Strengths */}
              <div className="mb-8">
                <h5 className="text-lg font-medium mb-3 flex items-center" 
                    style={{ color: theme.colors.accent1 }}>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Strengths
                </h5>
                <div 
                  ref={leftStrengthsContainer}
                  className="bg-white border rounded-lg p-4" 
                  style={{ borderColor: `${theme.colors.accent1}30` }}
                >
                  <ul className="space-y-2 m-0 p-0 list-none">
                    {wingTypes.left.data?.combination.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block h-5 w-5 text-green-500 mr-2 flex-shrink-0">•</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Challenges */}
              <div className="mb-5">
                <h5 className="text-lg font-medium mb-3 flex items-center" 
                    style={{ color: theme.colors.accent2 }}>
                  <XCircle className="h-5 w-5 mr-2" />
                  Challenges
                </h5>
                <div 
                  ref={leftChallengesContainer}
                  className="bg-white border rounded-lg p-4" 
                  style={{ borderColor: `${theme.colors.accent2}30` }}
                >
                  <ul className="space-y-2 m-0 p-0 list-none">
                    {wingTypes.left.data?.combination.challenges.map((challenge: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block h-5 w-5 text-red-500 mr-2 flex-shrink-0">•</span>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Button - Moved up slightly by reducing margin and padding */}
            <div className="flex justify-center px-4 pb-5">
              <StyledButtonLink
                typeNumber={wingTypes.left.number}
                typeName={wingTypes.left.name}
              />
            </div>
          </Card>
        </div>

        {/* Right Wing Card */}
        <div id="section-right-wing" data-subsection-id="right-wing">
          <Card className="bg-white shadow-md border-0 overflow-hidden h-full flex flex-col">
            <div className="pt-3 pb-6 px-6 prose prose-gray max-w-none flex-grow">
              {/* Header */}
              <div className="flex items-center mb-8">
                <div className="rounded-full p-2 bg-purple-50 mr-3 flex items-center justify-center">
                  {/* Conditionally flip the icon direction for certain types to match the symbol visual */}
                  {parseInt(typeDigit) >= 3 && parseInt(typeDigit) <= 6 
                    ? <ChevronLast className="h-5 w-5 text-purple-500" /> 
                    : <ChevronFirst className="h-5 w-5 text-purple-500" />
                  }
                </div>
                <div>
                  <h4 className="text-xl font-medium" style={{ color: theme.colors.accent3, marginBottom: '4px' }}>
                    Type {wingTypes.right.number}: {wingTypes.right.name}
                  </h4>
                  <span className="inline-block px-3 py-0.5 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: `${theme.colors.accent3}15`, color: theme.colors.accent3 }}>
                    {wingTypes.right.data?.alias}
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div 
                ref={rightDescContainer}
                className="bg-gray-50 rounded-lg p-4 mb-8"
              >
                <p className="text-base m-0" style={{ color: theme.colors.text }}>
                  {wingTypes.right.data?.description}
                </p>
              </div>
              
              {/* Personality Blend */}
              <div className="mb-8">
                <h5 className="text-lg font-medium mb-3 flex items-center" 
                    style={{ color: theme.colors.accent3 }}>
                  <div className="rounded-full h-8 w-8 bg-purple-50 flex items-center justify-center mr-3">
                    <span className="text-purple-500 font-medium">{typeDigit}w{wingTypes.right.number}</span>
                  </div>
                  Personality Blend
                </h5>
                <div 
                  ref={rightPersonalityContainer}
                  className="bg-white border rounded-lg p-4" 
                  style={{ borderColor: `${theme.colors.accent3}30` }}
                >
                  <p className="text-gray-700 m-0">{wingTypes.right.data?.combination.personality}</p>
                </div>
              </div>
              
              {/* Strengths */}
              <div className="mb-8">
                <h5 className="text-lg font-medium mb-3 flex items-center" 
                    style={{ color: theme.colors.accent1 }}>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Strengths
                </h5>
                <div 
                  ref={rightStrengthsContainer}
                  className="bg-white border rounded-lg p-4" 
                  style={{ borderColor: `${theme.colors.accent1}30` }}
                >
                  <ul className="space-y-2 m-0 p-0 list-none">
                    {wingTypes.right.data?.combination.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block h-5 w-5 text-green-500 mr-2 flex-shrink-0">•</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Challenges */}
              <div className="mb-5">
                <h5 className="text-lg font-medium mb-3 flex items-center" 
                    style={{ color: theme.colors.accent2 }}>
                  <XCircle className="h-5 w-5 mr-2" />
                  Challenges
                </h5>
                <div 
                  ref={rightChallengesContainer}
                  className="bg-white border rounded-lg p-4" 
                  style={{ borderColor: `${theme.colors.accent2}30` }}
                >
                  <ul className="space-y-2 m-0 p-0 list-none">
                    {wingTypes.right.data?.combination.challenges.map((challenge: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block h-5 w-5 text-red-500 mr-2 flex-shrink-0">•</span>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Button - Moved up slightly by reducing margin and padding */}
            <div className="flex justify-center px-4 pb-5">
              <StyledButtonLink
                typeNumber={wingTypes.right.number}
                typeName={wingTypes.right.name}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
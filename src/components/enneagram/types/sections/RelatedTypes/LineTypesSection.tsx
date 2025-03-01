/**
 * LineTypesSection Component
 * 
 * Displays information about the stress and growth line types
 * for a specific Enneagram type, with an interactive symbol and detailed cards.
 * 
 * Key features:
 * - Interactive Enneagram symbol showing line type connections
 * - Detailed cards for both stress and growth lines
 * - Dynamic tooltips with contextual information
 * - Height-matched sections between cards for visual consistency
 * - Responsive grid layout
 */
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../../symbol/DynamicEnneagramSymbol';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Sparkles,
  MoveHorizontal,
  MoveDownRight, 
  MoveUpRight, 
  Share2,
  Maximize2, 
  Minimize2,
  HelpCircle
} from 'lucide-react';

// Props interface definition
interface LineTypesSectionProps {
  typeDigit: string;          // The number of the core Enneagram type (1-9)
  sectionColor: string;       // Primary color for the section styling
  lineTypes: {                // Information about both line connections
    stress: {                 // Information about the stress line type
      number: string;         // The number of the stress type
      name: string;           // The name of the stress type
      description: string;    // General description of this type
      dynamics: {             // How this type manifests at different levels
        healthy: string;      // Healthy behaviors when moving to this type
        average: string;      // Average behaviors when moving to this type
        unhealthy: string;    // Unhealthy behaviors when moving to this type
      };
    };
    growth: {                 // Information about the growth line type
      number: string;         // The number of the growth type
      name: string;           // The name of the growth type
      description: string;    // General description of this type
      dynamics: {             // How this type manifests at different levels
        healthy: string;      // Healthy behaviors when moving to this type
        average: string;      // Average behaviors when moving to this type
        unhealthy: string;    // Unhealthy behaviors when moving to this type
      };
    };
  };
  typeData: {                 // Information about the core type
    typeName: string;         // The name of the core type (e.g., "The Reformer")
    typeDigit: string;        // The number of the core type (redundant with the top-level typeDigit)
  };
}

export default function LineTypesSection({
  typeDigit,
  sectionColor,
  lineTypes,
  typeData
}: LineTypesSectionProps) {
  // State to track the expanded/collapsed state of the symbol
  const [symbolExpanded, setSymbolExpanded] = useState(false);
  
  // Direct DOM refs for content containers to enable height matching
  const stressDescContainer = useRef<HTMLDivElement>(null);
  const growthDescContainer = useRef<HTMLDivElement>(null);
  const stressHealthyContainer = useRef<HTMLDivElement>(null);
  const growthHealthyContainer = useRef<HTMLDivElement>(null);
  const stressAverageContainer = useRef<HTMLDivElement>(null);
  const growthAverageContainer = useRef<HTMLDivElement>(null);
  const stressUnhealthyContainer = useRef<HTMLDivElement>(null);
  const growthUnhealthyContainer = useRef<HTMLDivElement>(null);

  // Get the core type name without "The" prefix for use in tooltips and pluralization
  const coreTypeNameWithoutPrefix = typeData?.typeName?.replace(/^The\s+/, '');
  
  /**
   * Return a pluralized version of the type name for dynamic text generation
   * Handles common English pluralization patterns
   */
  const pluralizedTypeName = () => {
    const name = coreTypeNameWithoutPrefix;
    // Handle special cases or return early if no name
    if (!name) return '';
    if (name.endsWith('er')) return name + 's';
    if (name.endsWith('ist')) return name + 's';
    if (name.endsWith('or')) return name + 's';
    // Default case
    return name + 's';
  };

  /**
   * Convert digit to spelled out word (e.g., 1 to "One")
   * Used for generating grammatically correct tooltip text
   */
  const digitToWord = (digit: string): string => {
    const words = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const num = parseInt(digit);
    return num >= 1 && num <= 9 ? words[num - 1] : digit;
  };

  /**
   * Generate dynamic tooltip text based on the context
   * Provides educational information about line dynamics specific to this type
   */
  const generateTooltipText = (type: 'stress' | 'growth', section?: 'healthy' | 'average' | 'unhealthy') => {
    const coreTypeDigit = typeDigit;
    const coreTypeName = digitToWord(coreTypeDigit); 
    const coreShortName = pluralizedTypeName();
    
    const lineTypeDigit = type === 'stress' ? lineTypes.stress.number : lineTypes.growth.number;
    const lineTypeName = digitToWord(lineTypeDigit);
    
    // For the type badge tooltips (no section specified)
    if (!section) {
      if (type === 'stress') {
        return `Type ${lineTypeDigit} is referred to as the "Stress Line" for Type ${coreTypeDigit} because ${coreShortName} most commonly exhibit the average or unhealthy traits of Type ${lineTypeDigit} when under pressure or stress.`;
      } else { // growth
        return `Type ${lineTypeDigit} is referred to as the "Growth Line" for Type ${coreTypeDigit} because ${coreShortName} naturally tend to display the healthy traits of Type ${lineTypeDigit} during times of growth.`;
      }
    }
    
    // For specific level tooltips (healthy, average, unhealthy)
    if (type === 'stress' && section === 'healthy') {
      return `Though Type ${lineTypeDigit} is typically referred to as the "Stress Line" for Type ${coreTypeDigit}, it's also possible for ${coreShortName} to integrate the healthy traits of Type ${lineTypeDigit} through deliberate growth and practice. In academic circles, this is called "integration" and represents psychological maturity.`;
    } else if (type === 'growth' && section === 'average') {
      return `While traits of Type ${lineTypeDigit} usually show up for ${coreShortName} in times of growth - hence the term "Growth Line" - it's also possible for ${coreShortName} to display average behaviors of Type ${lineTypeDigit}. In academic circles, this is referred to as the "Security Point," because ${coreShortName} typically only demonstrate the average-level traits of Type ${lineTypeDigit} around people they feel comfortable with.`;
    } else if (type === 'growth' && section === 'unhealthy') {
      return `${coreShortName} may occasionally display the unhealthy traits of Type ${lineTypeDigit}, typically around people they deeply trust. In academic circles, this is called the "Security Point" because the unhealthy behaviors of Type ${lineTypeDigit} only emerge when ${coreShortName} feel secure enough to let their guard down.`;
    }
    
    // Default fallback
    return "";
  };

  // Toggle symbol expansion
  const toggleSymbolSize = () => {
    setSymbolExpanded(!symbolExpanded);
  };

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

  /**
   * Styled button link component
   * Creates a consistent button style for navigating to type detail pages
   * Updated to match the style in WingTypesSection
   */
  const StyledButtonLink = ({ 
    typeNumber, 
    typeName
  }: { 
    typeNumber: string, 
    typeName: string
  }) => (
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
   * Function to match heights between corresponding sections in the two cards
   * This ensures visual consistency when content lengths differ
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
    matchPairHeights(stressDescContainer.current, growthDescContainer.current);
    matchPairHeights(stressHealthyContainer.current, growthHealthyContainer.current);
    matchPairHeights(stressAverageContainer.current, growthAverageContainer.current);
    matchPairHeights(stressUnhealthyContainer.current, growthUnhealthyContainer.current);
  };

  // Apply height matching after component mounts and when lineTypes changes
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
  }, [lineTypes]);

  // State for tooltip visibility
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  /**
   * Custom Tooltip component
   * Provides contextual information in a popup when clicking the help icon
   */
  const Tooltip = ({ 
    id, 
    text, 
    position = 'top',
    color = 'gray'
  }: { 
    id: string; 
    text: string; 
    position?: 'top' | 'bottom' | 'left' | 'right';
    color?: string;
  }) => {
    const isActive = activeTooltip === id;
    const tooltipRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Effect to calculate tooltip position
    useEffect(() => {
      if (isActive && tooltipRef.current && buttonRef.current) {
        const tooltip = tooltipRef.current;
        const button = buttonRef.current;
        const buttonRect = button.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Ensure tooltip is fully visible
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let top = 0;
        let left = 0;
        
        switch (position) {
          case 'bottom':
            top = buttonRect.bottom + 8;
            left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
            break;
          case 'left':
            top = buttonRect.top + (buttonRect.height / 2) - (tooltipRect.height / 2);
            left = buttonRect.left - tooltipRect.width - 8;
            break;
          case 'right':
            top = buttonRect.top + (buttonRect.height / 2) - (tooltipRect.height / 2);
            left = buttonRect.right + 8;
            break;
          default: // top
            top = buttonRect.top - tooltipRect.height - 8;
            left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
        }
        
        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewportWidth - 10) {
          left = viewportWidth - tooltipRect.width - 10;
        }
        
        if (top < 10) top = 10;
        if (top + tooltipRect.height > viewportHeight - 10) {
          top = viewportHeight - tooltipRect.height - 10;
        }
        
        // Apply calculated position
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.zIndex = '100';
      }
    }, [isActive, position]);
    
    // Close tooltip when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isActive && 
          tooltipRef.current && 
          buttonRef.current &&
          !tooltipRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setActiveTooltip(null);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isActive]);
    
    // Determine the accent color based on the provided color
    const getAccentColor = () => {
      switch(color) {
        case 'red':
          return theme.colors.accent2;
        case 'green':
          return theme.colors.accent1;
        case 'blue':
          return theme.colors.primary;
        default:
          return '#64748b'; // Tailwind gray-500
      }
    };

    return (
      <div className="inline-flex items-center">
        <button
          ref={buttonRef}
          type="button"
          aria-label="Help"
          className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltip(isActive ? null : id);
          }}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        
        {isActive && (
          <div 
            ref={tooltipRef}
            className="rounded-lg shadow-lg p-3 max-w-xs"
            style={{ 
              backgroundColor: 'white',
              border: `1px solid ${getAccentColor()}30`,
              width: '260px'
            }}
          >
            <p className="text-sm m-0 text-gray-700">{text}</p>
          </div>
        )}
      </div>
    );
  };

  /**
   * Custom DynamicsSection component with refs for height matching
   * Provides a consistent layout for each dynamics section (healthy, average, unhealthy)
   */
  const DynamicsSection = ({ 
    title, 
    content, 
    color, 
    icon: Icon,
    containerRef,
    tooltipId,
    tooltipText,
    tooltipColor
  }: { 
    title: string, 
    content: string, 
    color: string,
    icon: React.ElementType,
    containerRef: React.RefObject<HTMLDivElement>,
    tooltipId?: string,
    tooltipText?: string,
    tooltipColor?: string
  }) => (
    <div className="mb-8">
      <h5 className="text-lg font-medium mb-3 flex items-center" 
          style={{ color: color }}>
        <Icon className="h-5 w-5 mr-2" />
        {title}
        {tooltipId && tooltipText && (
          <Tooltip 
            id={tooltipId} 
            text={tooltipText} 
            color={tooltipColor}
          />
        )}
      </h5>
      <div 
        ref={containerRef}
        className="bg-white border rounded-lg p-4" 
        style={{ borderColor: `${color}30` }}
      >
        <p className="text-gray-700 m-0">{content}</p>
      </div>
    </div>
  );

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
            <div className="rounded-full p-2 bg-blue-50 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <h4 className="text-xl font-medium" style={{ color: theme.colors.primary }}>
            Line Types
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
              defaultVariation="both-lines"
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

      {/* Line Type Cards - Side by side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stress Line Card */}
        <div id="section-stress-line" data-subsection-id="stress-line">
          <Card className="bg-white shadow-md border-0 overflow-hidden h-full flex flex-col">
            <div className="pt-3 pb-6 px-6 prose prose-gray max-w-none flex-grow">
              {/* Header - updated to match wing type card style */}
              <div className="flex items-center mb-8">
                <div className="rounded-full p-2 bg-red-50 mr-3 flex items-center justify-center">
                  <MoveDownRight className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xl font-medium" style={{ color: theme.colors.accent2, marginBottom: '4px' }}>
                    Type {lineTypes.stress.number}: {lineTypes.stress.name}
                  </h4>
                  <div className="flex items-center">
                    <span className="inline-block px-3 py-0.5 rounded-full text-sm font-medium" 
                          style={{ backgroundColor: `${theme.colors.accent2}15`, color: theme.colors.accent2 }}>
                      Stress Line
                    </span>
                    <Tooltip 
                      id="stress-line-info" 
                      text={generateTooltipText('stress')} 
                      color="red"
                    />
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div 
                ref={stressDescContainer}
                className="bg-gray-50 rounded-lg p-4 mb-8"
              >
                <p className="text-base m-0" style={{ color: theme.colors.text }}>
                  {lineTypes.stress.description}
                </p>
              </div>
              
              {/* Line Type Dynamics */}
              <DynamicsSection 
                title="Healthy Level" 
                content={lineTypes.stress.dynamics.healthy}
                color={theme.colors.accent1}
                icon={Sparkles}
                containerRef={stressHealthyContainer}
                tooltipId="stress-healthy-tooltip"
                tooltipText={generateTooltipText('stress', 'healthy')}
                tooltipColor="green"
              />
              
              <DynamicsSection 
                title="Average Level" 
                content={lineTypes.stress.dynamics.average}
                color={theme.colors.primary}
                icon={MoveHorizontal}
                containerRef={stressAverageContainer}
                tooltipColor="blue"
              />
              
              <DynamicsSection 
                title="Unhealthy Level" 
                content={lineTypes.stress.dynamics.unhealthy}
                color={theme.colors.accent2}
                icon={AlertTriangle}
                containerRef={stressUnhealthyContainer}
                tooltipColor="red"
              />
            </div>
            
            {/* Button - Updated to match wing types styling and moved up slightly */}
            <div className="flex justify-center px-4 pb-5">
              <StyledButtonLink
                typeNumber={lineTypes.stress.number}
                typeName={lineTypes.stress.name}
              />
            </div>
          </Card>
        </div>

        {/* Growth Line Card */}
        <div id="section-growth-line" data-subsection-id="growth-line">
          <Card className="bg-white shadow-md border-0 overflow-hidden h-full flex flex-col">
            <div className="pt-3 pb-6 px-6 prose prose-gray max-w-none flex-grow">
              {/* Header - updated to match wing type card style */}
              <div className="flex items-center mb-8">
                <div className="rounded-full p-2 bg-green-50 mr-3 flex items-center justify-center">
                  <MoveUpRight className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-xl font-medium" style={{ color: theme.colors.accent1, marginBottom: '4px' }}>
                    Type {lineTypes.growth.number}: {lineTypes.growth.name}
                  </h4>
                  <div className="flex items-center">
                    <span className="inline-block px-3 py-0.5 rounded-full text-sm font-medium" 
                          style={{ backgroundColor: `${theme.colors.accent1}15`, color: theme.colors.accent1 }}>
                      Growth Line
                    </span>
                    <Tooltip 
                      id="growth-line-info" 
                      text={generateTooltipText('growth')} 
                      color="green"
                    />
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div 
                ref={growthDescContainer}
                className="bg-gray-50 rounded-lg p-4 mb-8"
              >
                <p className="text-base m-0" style={{ color: theme.colors.text }}>
                  {lineTypes.growth.description}
                </p>
              </div>
              
              {/* Line Type Dynamics */}
              <DynamicsSection 
                title="Healthy Level" 
                content={lineTypes.growth.dynamics.healthy}
                color={theme.colors.accent1}
                icon={Sparkles}
                containerRef={growthHealthyContainer}
                tooltipColor="green"
              />
              
              <DynamicsSection 
                title="Average Level" 
                content={lineTypes.growth.dynamics.average}
                color={theme.colors.primary}
                icon={MoveHorizontal}
                containerRef={growthAverageContainer}
                tooltipId="growth-average-tooltip"
                tooltipText={generateTooltipText('growth', 'average')}
                tooltipColor="blue"
              />
              
              <DynamicsSection 
                title="Unhealthy Level" 
                content={lineTypes.growth.dynamics.unhealthy}
                color={theme.colors.accent2}
                icon={AlertTriangle}
                containerRef={growthUnhealthyContainer}
                tooltipId="growth-unhealthy-tooltip"
                tooltipText={generateTooltipText('growth', 'unhealthy')}
                tooltipColor="red"
              />
            </div>
            
            {/* Button - Updated to match wing types styling and moved up slightly */}
            <div className="flex justify-center px-4 pb-5">
              <StyledButtonLink
                typeNumber={lineTypes.growth.number}
                typeName={lineTypes.growth.name}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
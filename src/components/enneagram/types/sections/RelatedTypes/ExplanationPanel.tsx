// src/components/enneagram/types/sections/RelatedTypes/ExplanationPanel.tsx
/**
 * ExplanationPanel Component
 * 
 * This component renders detailed explanations for different variations of the Enneagram symbol,
 * focusing on related types connections including wings and lines.
 * 
 * Key Features:
 * - Provides context-specific explanations based on the selected symbol variation
 * - Shows relationships between core type and wing/line types
 * - Offers navigation to more detailed sections
 * - Uses consistent styling and iconography for different relationship types
 * - Dynamically displays type-specific content for stress and growth lines
 * 
 * The component adjusts its content dynamically based on the selected variation (related-types,
 * both-wings, left-wing, right-wing, both-lines, stress-line, growth-line).
 */

import React from 'react';
import { 
  ArrowRight, 
  Network, 
  Activity, 
  BookOpen, 
  ChevronRight, 
  Lightbulb, 
  Users, 
  Star, 
  AlertTriangle, 
  ChevronFirst,
  ChevronLast,
  Component,
  ChevronsRightLeft,
  Share2,
  MoveDownRight,
  MoveUpRight,
  ArrowLeft
} from 'lucide-react';
import { theme } from '@/styles/theme';
import { SymbolVariation } from './explorer';

// Props definition for the component
interface ExplanationPanelProps {
  selectedVariation: SymbolVariation;
  typeData: {
    typeDigit: string;
    typeName: string;
  };
  wingTypes: {
    left: {
      number: string;
      name: string;
      data: any;
    };
    right: {
      number: string;
      name: string;
      data: any;
    };
  };
  lineTypes: {
    stress: {
      number: string;
      name: string;
      description: string;
      dynamics: {
        healthy: string;
        average: string;
        unhealthy: string;
      };
    };
    growth: {
      number: string;
      name: string;
      description: string;
      dynamics: {
        healthy: string;
        average: string;
        unhealthy: string;
      };
    };
  };
  onScrollToSection: (sectionId: string, subsectionId?: string) => void;
}

export function ExplanationPanel({ 
  selectedVariation, 
  typeData, 
  wingTypes, 
  lineTypes, 
  onScrollToSection 
}: ExplanationPanelProps) {
  // Format the core type name for consistent use throughout the component
  const coreTypeName = `Type ${typeData.typeDigit}: ${typeData.typeName}`;
  
  /**
   * Get accent color based on the selected variation
   * This ensures consistent color coding across the application
   */
  const getAccentColor = () => {
    switch(selectedVariation) {
      case 'left-wing':
      case 'right-wing':
      case 'both-wings':
        return theme.colors.accent3; // Purple for wings
      case 'stress-line':
        return theme.colors.accent2; // Red for stress
      case 'growth-line':
        return theme.colors.accent1; // Green for growth
      default:
        return theme.colors.primary; // Default blue
    }
  };
  
  /**
   * Get appropriate icon based on the selected variation
   * Each relationship type has a distinctive icon for visual recognition
   */
  const getVariationIcon = () => {
    // Determine if we need to visually flip the wing icons for types 3-6
    // For these types, what's "left" in the data is visually on the right side of the symbol
    const typeNumber = parseInt(typeData.typeDigit);
    const shouldFlipWingIcons = typeNumber >= 3 && typeNumber <= 6;
    
    switch(selectedVariation) {
      case 'left-wing':
        // For types 3-6, flip the icon direction to match visual position
        return shouldFlipWingIcons 
          ? <ChevronFirst className="h-5 w-5" style={{ color: getAccentColor() }} />
          : <ChevronLast className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'right-wing':
        // For types 3-6, flip the icon direction to match visual position
        return shouldFlipWingIcons
          ? <ChevronLast className="h-5 w-5" style={{ color: getAccentColor() }} />
          : <ChevronFirst className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'both-wings':
        return <ChevronsRightLeft className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'stress-line':
        return <MoveDownRight className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'growth-line':
        return <MoveUpRight className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'both-lines':
        return <Share2 className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'related-types':
        return <Component className="h-5 w-5" style={{ color: getAccentColor() }} />;
      default:
        return <Lightbulb className="h-5 w-5" style={{ color: getAccentColor() }} />;
    }
  };
  
  /**
   * Get title text based on the selected variation
   * Provides context-appropriate headings for each view
   */
  const getVariationTitle = () => {
    switch(selectedVariation) {
      case 'related-types':
        return "Related Types Overview";
      case 'both-wings':
        return "Wing Types";
      case 'left-wing':
        return `Type ${wingTypes.left.number}: ${wingTypes.left.name}`;
      case 'right-wing':
        return `Type ${wingTypes.right.number}: ${wingTypes.right.name}`;
      case 'both-lines':
        return "Line Types";
      case 'stress-line':
        return `Stress Line`;
      case 'growth-line':
        return `Growth Line`;
      default:
        return "Type Connections";
    }
  };
  
  // Common styles for the learn more button for consistent UI
  const buttonStyle = {
    backgroundColor: `${getAccentColor()}10`,
    color: getAccentColor(),
    fontWeight: theme.fontWeights.medium,
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s ease-in-out',
    marginTop: '20px', // Moved down slightly as requested
    cursor: 'pointer',
    border: 'none',
    fontSize: '14px'
  };

  /**
   * Get the unhealthy dynamics description for stress behavior
   * or use a default if not available
   */
  const getStressBehaviorDescription = () => {
    if (!lineTypes.stress.dynamics.unhealthy) {
      return "exhibiting behaviors characteristic of this type under pressure.";
    }
    
    // Return the full unhealthy dynamics description
    return lineTypes.stress.dynamics.unhealthy;
  };

  /**
   * Get the healthy dynamics description for growth behavior
   * or use a default if not available
   */
  const getGrowthBehaviorDescription = () => {
    if (!lineTypes.growth.dynamics.healthy) {
      return "integrating positive qualities of this type during personal growth.";
    }
    
    // Return the full healthy dynamics description
    return lineTypes.growth.dynamics.healthy;
  };
  
  // Render different content based on the selected variation
  switch (selectedVariation) {
    // RELATED TYPES OVERVIEW
    case 'related-types':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              {getVariationTitle()}
            </h4>
          </div>
          
          <p className="text-gray-700">
            {coreTypeName} connects to four other types in the Enneagram symbol:
          </p>
          
          {/* Wing and Line connections */}
          <div className="space-y-3 my-4">
            {/* Wing types box */}
            <div className="flex items-start p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.accent3}10` }}>
              <ChevronsRightLeft className="h-4 w-4 mr-3 mt-1" style={{ color: theme.colors.accent3 }} />
              <span className="font-medium w-24" style={{ color: theme.colors.accent3 }}>Wing Types</span>
              <div className="text-gray-700 flex flex-col">
                <span>Type {wingTypes.left.number}: {wingTypes.left.name.replace('The ', '')}</span>
                <span>Type {wingTypes.right.number}: {wingTypes.right.name.replace('The ', '')}</span>
              </div>
            </div>
            
            {/* Line types box */}
            <div className="flex items-start p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.accent1}10` }}>
              <Share2 className="h-4 w-4 mr-3 mt-1" style={{ color: theme.colors.accent1 }} />
              <span className="font-medium w-24" style={{ color: theme.colors.accent1 }}>Line Types</span>
              <div className="text-gray-700 flex flex-col">
                <span>Type {lineTypes.stress.number}: {lineTypes.stress.name.replace('The ', '')}</span>
                <span>Type {lineTypes.growth.number}: {lineTypes.growth.name.replace('The ', '')}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700">
            These connections form a unique pattern that influences how {coreTypeName} manifests and evolves.
          </p>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('category-intro')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // BOTH WINGS VIEW
    case 'both-wings':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              {getVariationTitle()}
            </h4>
          </div>
          
          <p className="text-gray-700">
            The wing types for {coreTypeName} are:
          </p>
          
          {/* Wing type buttons for navigation */}
          <div className="space-y-3 my-4">
            {/* Left wing button */}
            <button
              onClick={() => onScrollToSection('wings', 'left-wing')}
              className="w-full flex items-center justify-between p-3 rounded-lg border cursor-pointer" 
              style={{ borderColor: `${theme.colors.accent3}30`, backgroundColor: `${theme.colors.accent3}05` }}>
              <div className="flex items-center">
                <div className="rounded-full flex items-center justify-center h-6 w-6 mr-2" 
                     style={{ backgroundColor: theme.colors.accent3, color: 'white' }}>
                  {wingTypes.left.number}
                </div>
                <span className="text-gray-800">{wingTypes.left.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Right wing button */}
            <button
              onClick={() => onScrollToSection('wings', 'right-wing')}
              className="w-full flex items-center justify-between p-3 rounded-lg border cursor-pointer" 
              style={{ borderColor: `${theme.colors.accent3}30`, backgroundColor: `${theme.colors.accent3}05` }}>
              <div className="flex items-center">
                <div className="rounded-full flex items-center justify-center h-6 w-6 mr-2" 
                     style={{ backgroundColor: theme.colors.accent3, color: 'white' }}>
                  {wingTypes.right.number}
                </div>
                <span className="text-gray-800">{wingTypes.right.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          <p className="text-gray-700">
            While most people have one dominant wing type, it's also possible to relate to both wing types - or neither. Having influence from both wings creates a more nuanced personality blend.
          </p>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('wing-intro')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // LEFT WING DETAILS
    case 'left-wing':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              {getVariationTitle()}
            </h4>
          </div>
          
          {/* Type alias badge - precisely positioned */}
          <div className="inline-block px-3 py-1 mt-0 mb-4 rounded text-sm font-medium"
               style={{ 
                 backgroundColor: `${theme.colors.accent3}15`, 
                 color: theme.colors.accent3, 
                 marginLeft: "47px",
                 marginTop: "10px",
                 position: "relative",
                 top: "-5px"
               }}>
            {wingTypes.left.data?.alias}
          </div>
          
          {/* Description */}
          <p className="text-gray-700">
            {wingTypes.left.data?.description}
          </p>
          
          {/* Key influence section */}
          <div className="mt-3 border-t pt-3" style={{ borderColor: `${theme.colors.accent3}20` }}>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2" style={{ color: theme.colors.accent3 }} />
              <span className="font-medium text-gray-800">Key Influence:</span>
            </div>
            <p className="mt-1 text-gray-700 ml-6">
              Brings {typeData.typeName.split(' ')[1]}s qualities of {wingTypes.left.data?.combination.strengths[0]?.toLowerCase()}.
            </p>
          </div>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('wings', 'left-wing')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // RIGHT WING DETAILS
    case 'right-wing':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              {getVariationTitle()}
            </h4>
          </div>
          
          {/* Type alias badge - precisely positioned */}
          <div className="inline-block px-3 py-1 mt-0 mb-4 rounded text-sm font-medium"
               style={{ 
                 backgroundColor: `${theme.colors.accent3}15`, 
                 color: theme.colors.accent3, 
                 marginLeft: "47px",
                 marginTop: "10px",
                 position: "relative",
                 top: "-5px"
               }}>
            {wingTypes.right.data?.alias}
          </div>
          
          {/* Description */}
          <p className="text-gray-700">
            {wingTypes.right.data?.description}
          </p>
          
          {/* Key influence section */}
          <div className="mt-3 border-t pt-3" style={{ borderColor: `${theme.colors.accent3}20` }}>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2" style={{ color: theme.colors.accent3 }} />
              <span className="font-medium text-gray-800">Key Influence:</span>
            </div>
            <p className="mt-1 text-gray-700 ml-6">
              Brings {typeData.typeName.split(' ')[1]}s qualities of {wingTypes.right.data?.combination.strengths[0]?.toLowerCase()}.
            </p>
          </div>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('wings', 'right-wing')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // BOTH LINES VIEW
    case 'both-lines':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              {getVariationTitle()}
            </h4>
          </div>
          
          <p className="text-gray-700">
            The dynamics of line types show how your personality may shift under different conditions. {coreTypeName} has lines to:
          </p>
          
          {/* Line type buttons for navigation */}
          <div className="space-y-3 my-4">
            {/* Stress line button */}
            <button
              onClick={() => onScrollToSection('lines', 'stress-line')}
              className="w-full flex items-center justify-between p-3 rounded-lg border cursor-pointer" 
              style={{ borderColor: `${theme.colors.accent2}30`, backgroundColor: `${theme.colors.accent2}05`, height: "80px" }}>
              <div className="w-full">
                {/* Label positioned at the top with absolute positioning */}
                <div style={{ position: "absolute", left: "37px", marginTop: "-3px" }}>
                  <span className="text-sm font-medium" style={{ color: theme.colors.accent2 }}>
                    Stress Line
                  </span>
                </div>
                {/* Container for number and text - moved down */}
                <div className="flex items-center" style={{ marginTop: "30px" }}>
                  <div className="rounded-full flex items-center justify-center h-6 w-6 mr-2" 
                      style={{ backgroundColor: theme.colors.accent2, color: 'white' }}>
                    {lineTypes.stress.number}
                  </div>
                  <span className="text-gray-800">{lineTypes.stress.name}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Growth line button - identical structure */}
            <button
              onClick={() => onScrollToSection('lines', 'growth-line')}
              className="w-full flex items-center justify-between p-3 rounded-lg border cursor-pointer" 
              style={{ borderColor: `${theme.colors.accent1}30`, backgroundColor: `${theme.colors.accent1}05`, height: "80px" }}>
              <div className="w-full">
                {/* Label positioned at the top with absolute positioning */}
                <div style={{ position: "absolute", left: "37px", marginTop: "-3px" }}>
                  <span className="text-sm font-medium" style={{ color: theme.colors.accent1 }}>
                    Growth Line
                  </span>
                </div>
                {/* Container for number and text - moved down */}
                <div className="flex items-center" style={{ marginTop: "30px" }}>
                  <div className="rounded-full flex items-center justify-center h-6 w-6 mr-2" 
                      style={{ backgroundColor: theme.colors.accent1, color: 'white' }}>
                    {lineTypes.growth.number}
                  </div>
                  <span className="text-gray-800">{lineTypes.growth.name}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          <p className="text-gray-700">
            These connections reveal how your personality adapts at your best and under pressure.
          </p>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('line-intro')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // STRESS LINE DETAILS
    case 'stress-line':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              Type {lineTypes.stress.number}: {lineTypes.stress.name}
            </h4>
          </div>
          
          {/* Line type label - precisely positioned */}
          <div className="inline-block px-3 py-1 mt-0 mb-4 rounded text-sm font-medium"
               style={{ 
                 backgroundColor: `${theme.colors.accent2}15`, 
                 color: theme.colors.accent2, 
                 marginLeft: "47px",
                 marginTop: "10px",
                 position: "relative",
                 top: "-5px"
               }}>
            Stress Line
          </div>
          
          {/* Description */}
          <p className="text-gray-700">
            Type {lineTypes.stress.number} is typically referred to as the stress line for Type {typeData.typeDigit}. This connection shows how {typeData.typeName.split(' ')[1]}s may behave under pressure or during challenging times.
          </p>
          
          {/* Under stress behavior box */}
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.accent2}10` }}>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" style={{ color: theme.colors.accent2 }} />
              <span className="font-medium text-gray-800">Under Stress</span>
            </div>
                          <p className="mt-1 text-gray-700 ml-6">
              {getStressBehaviorDescription()}
            </p>
          </div>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('lines', 'stress-line')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // GROWTH LINE DETAILS
    case 'growth-line':
      return (
        <div className="space-y-4">
          {/* Panel header with icon and title */}
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h4 className="text-lg font-medium" style={{ color: getAccentColor() }}>
              Type {lineTypes.growth.number}: {lineTypes.growth.name}
            </h4>
          </div>
          
          {/* Line type label - precisely positioned */}
          <div className="inline-block px-3 py-1 mt-0 mb-4 rounded text-sm font-medium"
               style={{ 
                 backgroundColor: `${theme.colors.accent1}15`, 
                 color: theme.colors.accent1, 
                 marginLeft: "47px",
                 marginTop: "10px",
                 position: "relative",
                 top: "-5px"
               }}>
            Growth Line
          </div>
          
          {/* Description */}
          <p className="text-gray-700">
            Type {lineTypes.growth.number} is typically referred to as the growth line for Type {typeData.typeDigit}. This connection reveals the positive qualities {typeData.typeName.split(' ')[1]}s can integrate during personal growth.
          </p>
          
          {/* At their best box */}
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.accent1}10` }}>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2" style={{ color: theme.colors.accent1 }} />
              <span className="font-medium text-gray-800">At Their Best</span>
            </div>
                          <p className="mt-1 text-gray-700 ml-6">
              {getGrowthBehaviorDescription()}
            </p>
          </div>
          
          {/* Navigation button */}
          <button 
            onClick={() => onScrollToSection('lines', 'growth-line')} 
            style={buttonStyle}
            className="hover:bg-opacity-20"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
    
    // DEFAULT STATE
    default:
      return (
        <div className="space-y-4">
          {/* Default panel header */}
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${theme.colors.primary}15` }}>
              <Lightbulb className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <h4 className="text-lg font-medium" style={{ color: theme.colors.primary }}>
              Explore Connections
            </h4>
          </div>
          
          {/* Default instructions */}
          <p className="text-gray-700">
            Select a variation to see how your type connects with others in the Enneagram system.
          </p>
          
          <p className="text-gray-700 mt-2">
            The symbol highlights different relationships between types, showing how each type is influenced by its wings and lines.
          </p>
        </div>
      );
  }
}

export default ExplanationPanel;
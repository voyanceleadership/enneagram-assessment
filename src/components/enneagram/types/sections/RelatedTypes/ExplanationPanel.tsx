// src/components/enneagram/types/sections/RelatedTypes/ExplanationPanel.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { theme } from '@/styles/theme';
import { SymbolVariation } from './explorer';

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
      dynamics: any;
    };
    growth: {
      number: string;
      name: string;
      description: string;
      dynamics: any;
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
  const coreTypeName = `Type ${typeData.typeDigit}: ${typeData.typeName}`;
  
  // Common styles for buttons
  const buttonStyle = {
    color: theme.colors.accent1,
    fontWeight: theme.fontWeights.medium
  };
  
  switch (selectedVariation) {
    case 'related-types':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.primary }}>Related Types Overview</h4>
          <p>
            {coreTypeName} connects to four other types in the Enneagram symbol:
          </p>
          <div className="space-y-2">
            <p>
              <strong style={{ color: theme.colors.accent3 }}>Wing Types:</strong> Type {wingTypes.left.number} ({wingTypes.left.name.replace('The ', '')}) and Type {wingTypes.right.number} ({wingTypes.right.name.replace('The ', '')})
            </p>
            <p>
              <strong style={{ color: theme.colors.accent3 }}>Line Types:</strong> Type {lineTypes.stress.number} ({lineTypes.stress.name.replace('The ', '')}) and Type {lineTypes.growth.number} ({lineTypes.growth.name.replace('The ', '')})
            </p>
          </div>
          <p>
            These connections form a unique pattern that influences how {coreTypeName} manifests and evolves.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'explorer')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            Explore all sections <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    case 'both-wings':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.primary }}>Wing Types</h4>
          <p>
            The wing types for {coreTypeName} are:
          </p>
          <ul className="space-y-2 pl-0">
            <li className="list-none">
              <span style={{ color: theme.colors.accent3 }}>•</span> Type {wingTypes.left.number}: {wingTypes.left.name}
            </li>
            <li className="list-none">
              <span style={{ color: theme.colors.accent3 }}>•</span> Type {wingTypes.right.number}: {wingTypes.right.name}
            </li>
          </ul>
          <p>
            While most people have one dominant wing type, it's also possible to relate to both wing types - or neither. Having influence from both wings creates a more nuanced personality blend.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'wings')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            Learn more about wing types <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    case 'left-wing':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.primary }}>
            Type {wingTypes.left.number}: {wingTypes.left.name}
          </h4>
          <p className="text-sm italic" style={{ color: theme.colors.accent3 }}>
            {wingTypes.left.data?.alias}
          </p>
          <p>
            {wingTypes.left.data?.description.slice(0, 150)}...
          </p>
          <p>
            This wing type brings Type {typeData.typeDigit}s qualities of {wingTypes.left.data?.combination.strengths[0].toLowerCase()}.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'left-wing')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            See full wing details <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    case 'right-wing':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.primary }}>
            Type {wingTypes.right.number}: {wingTypes.right.name}
          </h4>
          <p className="text-sm italic" style={{ color: theme.colors.accent3 }}>
            {wingTypes.right.data?.alias}
          </p>
          <p>
            {wingTypes.right.data?.description.slice(0, 150)}...
          </p>
          <p>
            This wing type brings Type {typeData.typeDigit}s qualities of {wingTypes.right.data?.combination.strengths[0].toLowerCase()}.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'right-wing')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            See full wing details <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    case 'both-lines':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.primary }}>Line Types</h4>
          <p>
            The dynamics of line types show how your personality may shift under different conditions. {coreTypeName} has lines to:
          </p>
          <ul className="space-y-2 pl-0">
            <li className="list-none">
              <strong style={{ color: theme.colors.accent2 }}>Stress Line</strong> Type {lineTypes.stress.number}: {lineTypes.stress.name}
            </li>
            <li className="list-none">
              <strong style={{ color: theme.colors.accent1 }}>Growth Line</strong> Type {lineTypes.growth.number}: {lineTypes.growth.name}
            </li>
          </ul>
          <p>
            These connections reveal how your personality adapts at your best and under pressure.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'lines')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            Learn more about line types <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    case 'stress-line':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.accent2 }}>Stress Line</h4>
          <h5 className="text-base font-medium">Type {lineTypes.stress.number}: {lineTypes.stress.name}</h5>
          <p>
            The line to Type {lineTypes.stress.number} gives {typeData.typeDigit}s access to {lineTypes.stress.description.slice(0, 25).toLowerCase()}...
          </p>
          <p>
            Under stress, Type {typeData.typeDigit}s may display characteristics of Type {lineTypes.stress.number}.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'stress-line')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            See full stress line details <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    case 'growth-line':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium" style={{ color: theme.colors.accent1 }}>Growth Line</h4>
          <h5 className="text-base font-medium">Type {lineTypes.growth.number}: {lineTypes.growth.name}</h5>
          <p>
            The line to Type {lineTypes.growth.number} gives {typeData.typeDigit}s access to {lineTypes.growth.description.slice(0, 25).toLowerCase()}...
          </p>
          <p>
            At their best, Type {typeData.typeDigit}s may integrate positive aspects of Type {lineTypes.growth.number}.
          </p>
          <button 
            onClick={() => onScrollToSection('related-types', 'growth-line')} 
            className="inline-flex items-center hover:underline mt-2"
            style={buttonStyle}
          >
            See full growth line details <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      );
      
    default:
      return (
        <div className="space-y-4">
          <p>
            Select a variation to see how your type connects with others in the Enneagram system.
          </p>
        </div>
      );
  }
}

export default ExplanationPanel;
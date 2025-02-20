// src/lib/enneagram/data/utils/parser.ts

/**
 * This file handles the parsing of markdown content into structured data for the Enneagram system.
 * It works in conjunction with several other files:
 * 
 * - typeContentSchema.ts: Defines the structure that this parser validates against
 * - typeContentDisplay.md: Contains display text that this parser uses for section identification
 * - loader.ts: Uses this parser to load and cache the parsed content
 * - queries.ts: Uses the parsed data structures to provide type-safe data access
 * 
 * The parser handles two main types of content:
 * 1. Type-specific content (type*.md files) - Contains the actual content for each type
 * 2. Display content (typeContentDisplay.md) - Contains shared presentation text
 * 
 * Key responsibilities:
 * - Parse markdown frontmatter and content
 * - Validate content structure against schema
 * - Convert raw content into typed data structures
 * - Handle different section formats (text, lists, development levels, etc.)
 */

import matter from 'gray-matter';
import { EnneagramType } from '../../models/symbolStructures';
import { TypeSectionId, TypeSubsectionId, TYPE_CONTENT_SCHEMA } from '../content/types/schema/typeContentSchema';
import { loadAllTypes, loadTypeContentDisplay } from './loader';

/**
 * Core Data Structures
 * These interfaces define the shape of parsed content and are used throughout the application.
 */

// Basic content block with summary and detailed explanation
export interface ContentBlock {
  summary: string;
  explanation: string;
}

// Structure for development level traits and their explanations
export interface DevelopmentLevel {
  trait: string;
  explanation: string;
}

// Structure for type misidentification information
export interface Misidentification {
  type: string;
  sharedTraits: string[];
  differences: {
    coreMotivation: string;
    behavioral: string;
    stress: string;
  };
}

/**
 * Type Content Metadata
 * Defines the structure of the frontmatter data in type markdown files.
 * This data provides the core characteristics and snapshot information for each type.
 */
export interface TypeContentMetadata {
  typeDigit: string;
  typeNumber: string;
  typeName: string;
  essenceQuality: ContentBlock;
  briefDescription: ContentBlock;
  topPriority: ContentBlock;
  secondaryDesires: ContentBlock[];
  biggestFear: ContentBlock;
  secondaryFears: ContentBlock[];
  atTheirBest: ContentBlock;
  underStress: ContentBlock;
  wakeUpCall: ContentBlock;
  mentalHabit: ContentBlock;
  characteristicVice: ContentBlock;
  innerStory: ContentBlock;
  keyToGrowth: ContentBlock;
}

/**
 * Complete Type Content
 * Combines metadata with section content to form the complete
 * structured data for a type.
 */
export interface TypeContent extends TypeContentMetadata {
  sections: {
    typeSummary: string;
    longDescription: string;
    mightBeType: string[];
    probablyNotType: string[];
    healthyLevel: DevelopmentLevel[];
    averageLevel: DevelopmentLevel[];
    unhealthyLevel: DevelopmentLevel[];
    misconceptions: string[];
    typesMisidentifyingAsThis: Misidentification[];
    thisTypeMayMisidentifyAs: Misidentification[];
    wingTypes: Record<string, { description: string; alias: string }>;
    lineTypes: Record<string, string>;
    growthPractices: string[];
    famousExamples: string[];
  };
}

/**
 * Display Content Structure
 * Defines the structure of the shared presentation text used across type pages.
 * This content provides consistent labeling and text patterns for the UI.
 */
export interface DisplayContent {
  sections: Record<TypeSectionId, string>;
  subsections: Record<TypeSubsectionId, string>;
  typeNames: Record<string, string>;
  typeNumberWords: Record<string, string>;
  patterns: {
    mightBeType: string;
    probablyNotType: string;
    typesMisidentifyingAs: string;
    typeMayMisidentifyAs: string;
    wingType: string;
    lineConnection: string;
    healthyDescription: string;
    averageDescription: string;
    unhealthyDescription: string;
  };
}

/**
 * Main Parser Functions
 * These functions handle the primary parsing operations for different content types.
 */

/**
 * Parses a type-specific markdown file into structured TypeContent.
 * Handles both frontmatter metadata and markdown sections.
 */
export async function parseTypeContent(content: string): Promise<TypeContent> {
  const { data: frontmatter, content: markdownContent } = matter(content);
  validateFrontmatter(frontmatter);
  
  const sections = parseSections(markdownContent);
  
  // First create a type-safe metadata object
  const metadata: TypeContentMetadata = {
    typeDigit: frontmatter.typeDigit,
    typeNumber: frontmatter.typeNumber,
    typeName: frontmatter.typeName,
    essenceQuality: frontmatter.essenceQuality,
    briefDescription: frontmatter.briefDescription,
    topPriority: frontmatter.topPriority,
    secondaryDesires: frontmatter.secondaryDesires,
    biggestFear: frontmatter.biggestFear,
    secondaryFears: frontmatter.secondaryFears,
    atTheirBest: frontmatter.atTheirBest,
    underStress: frontmatter.underStress,
    wakeUpCall: frontmatter.wakeUpCall,
    mentalHabit: frontmatter.mentalHabit,
    characteristicVice: frontmatter.characteristicVice,
    innerStory: frontmatter.innerStory,
    keyToGrowth: frontmatter.keyToGrowth
  };
  
  // Then combine it with the sections
  return {
    ...metadata,
    sections: {
      typeSummary: parseTextSection(sections['Type Summary']),
      longDescription: parseTextSection(sections['Long Description']),
      mightBeType: parseListSection(sections['You Might Be This Type If...']),
      probablyNotType: parseListSection(sections["You're Probably Not This Type If..."]),
      healthyLevel: parseDevelopmentLevel(sections['Healthy Level of Development']),
      averageLevel: parseDevelopmentLevel(sections['Average Level of Development']),
      unhealthyLevel: parseDevelopmentLevel(sections['Unhealthy Level of Development']),
      misconceptions: parseMisconceptions(sections['Common Misconceptions']),
      typesMisidentifyingAsThis: parseMisidentifications(sections['Types That May Misidentify as This Type']),
      thisTypeMayMisidentifyAs: parseMisidentifications(sections['This Type May Misidentify as...']),
      wingTypes: parseWingTypes(sections['Wing Types']),
      lineTypes: parseLineTypes(sections['Line Types']),
      growthPractices: parseListSection(sections['Growth Practices']),
      famousExamples: parseListSection(sections['Famous Examples'])
    }
  };
}

/**
 * Parses the display content markdown file that contains shared presentation text.
 * This content is used for consistent labeling and text patterns across the application.
 */
export async function parseDisplayContent(content: string): Promise<DisplayContent> {
  const { data } = matter(content);
  
  // Validate the display content structure
  if (!data.sections || !data.subsections || !data.typeNames || 
      !data.typeNumberWords || !data.patterns) {
    throw new Error('Invalid display content structure');
  }

  return {
    sections: data.sections,
    subsections: data.subsections,
    typeNames: data.typeNames,
    typeNumberWords: data.typeNumberWords,
    patterns: data.patterns
  };
}

/**
 * Section-Specific Parsers
 * These functions handle parsing specific types of content sections,
 * each with their own format and structure.
 */

/**
 * Parses development level sections (healthy, average, unhealthy)
 * Format: "- trait: explanation"
 */
function parseDevelopmentLevel(content: string[]): DevelopmentLevel[] {
  const levels: DevelopmentLevel[] = [];
  let currentTrait = '';
  let currentExplanation = '';

  for (const line of content) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      if (currentTrait) {
        levels.push({
          trait: currentTrait,
          explanation: currentExplanation.trim()
        });
      }
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex !== -1) {
        currentTrait = trimmed.substring(2, colonIndex).trim();
        currentExplanation = trimmed.substring(colonIndex + 1).trim();
      }
    } else if (trimmed && currentTrait) {
      currentExplanation += ' ' + trimmed;
    }
  }

  if (currentTrait) {
    levels.push({
      trait: currentTrait,
      explanation: currentExplanation.trim()
    });
  }

  return levels;
}

/**
 * Parses misidentification sections
 * Handles both "Types That May Misidentify as..." and "This Type May Misidentify as..."
 */
function parseMisidentifications(content: string[]): Misidentification[] {
  const types: Misidentification[] = [];
  let currentType: Misidentification = {
    type: '',
    sharedTraits: [],
    differences: {
      coreMotivation: '',
      behavioral: '',
      stress: ''
    }
  };
  let currentSection = '';

  for (const line of content) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('• Type')) {
      if (currentType.type) {
        types.push({...currentType});
      }
      currentType = {
        type: trimmed.substring(2),
        sharedTraits: [],
        differences: {
          coreMotivation: '',
          behavioral: '',
          stress: ''
        }
      };
    } 
    else if (trimmed.startsWith('- Shared Traits')) {
      currentSection = 'sharedTraits';
    } 
    else if (trimmed.startsWith('- Key Differences')) {
      currentSection = 'differences';
    } 
    else if (trimmed.startsWith('•')) {
      const trait = trimmed.substring(1).trim();
      
      if (currentSection === 'sharedTraits') {
        currentType.sharedTraits.push(trait);
      } 
      else if (currentSection === 'differences') {
        if (trait.startsWith('Core Motivation:')) {
          currentType.differences.coreMotivation = trait.substring('Core Motivation:'.length).trim();
        } 
        else if (trait.startsWith('Behavioral Differences:')) {
          currentType.differences.behavioral = trait.substring('Behavioral Differences:'.length).trim();
        } 
        else if (trait.startsWith('Stress Behavior:')) {
          currentType.differences.stress = trait.substring('Stress Behavior:'.length).trim();
        }
      }
    }
  }

  if (currentType.type) {
    types.push({...currentType});
  }

  return types;
}

/**
 * Parses wing type descriptions
 * Format: "Type N: Name Wing (alias): description"
 */
function parseWingTypes(content: string[]): Record<string, { description: string; alias: string }> {
  const wings: Record<string, { description: string; alias: string }> = {};
  
  for (const line of content) {
    const match = line.match(/Type (\d+): (.+?) Wing (\([^)]+\)): (.+)/);
    if (match) {
      const [, typeNum, name, alias, description] = match;
      const key = `Type ${typeNum}: ${name}`;
      wings[key] = {
        description: description.trim(),
        alias: alias
      };
    }
  }

  return wings;
}

/**
 * Parses line type descriptions
 * Format: "Type N: Name: description"
 */
function parseLineTypes(content: string[]): Record<string, string> {
  const lineTypes: Record<string, string> = {};
  
  for (const line of content) {
    const match = line.match(/Type (\d+): ([^:]+): (.+)/);
    if (match) {
      const [, typeNum, name, description] = match;
      const key = `Type ${typeNum}: ${name}`;
      lineTypes[key] = description.trim();
    }
  }

  return lineTypes;
}

/**
 * Helper Functions
 * These utility functions support the main parsing operations.
 */

/**
 * Splits markdown content into sections based on [Section Name] headers
 */
function parseSections(content: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = '';
  
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.match(/^\[.*\]$/)) {
      currentSection = line.slice(1, -1);
      sections[currentSection] = [];
    } else if (currentSection && line.trim()) {
      sections[currentSection].push(line);
    }
  }
  
  return sections;
}

/**
 * Parses a section that contains plain text
 */
function parseTextSection(lines: string[] = []): string {
  return lines.join('\n').trim();
}

/**
 * Parses a section that contains a bullet-point list
 * Format: "- item"
 */
function parseListSection(lines: string[] = []): string[] {
  return lines
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.trim().slice(2));
}

/**
 * Parses numbered misconceptions
 * Format: "1. **misconception**"
 */
function parseMisconceptions(lines: string[] = []): string[] {
  return lines
    .filter(line => line.trim().match(/^\d+\.\s\*\*/))
    .map(line => line.trim());
}

/**
 * Validates that all required fields are present in frontmatter
 */
function validateFrontmatter(frontmatter: any): void {
  const required = [
    'typeDigit',
    'typeNumber',
    'typeName',
    'essenceQuality',
    'briefDescription',
    'topPriority',
    'secondaryDesires',
    'biggestFear',
    'secondaryFears',
    'atTheirBest',
    'underStress',
    'wakeUpCall',
    'mentalHabit',
    'characteristicVice',
    'innerStory',
    'keyToGrowth'
  ];

  const missing = required.filter(field => !frontmatter[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required frontmatter fields: ${missing.join(', ')}`);
  }
}

/**
 * Parses and consolidates Enneagram type metadata.
 * Now dynamically loads type names and number words from markdown.
 *
 * @returns {object} - A record of type numbers mapped to their metadata.
 */
export function parseTypeMetadata() {
  const typeData = loadAllTypes(); // Load all type metadata (existing function)
  const contentDisplay = loadTypeContentDisplay(); // Load type names & number words

  if (!contentDisplay) {
    console.warn('Could not load type content display.');
    return typeData; // Return only type data if display data is missing
  }

  // Merge dynamically loaded type names and type number words
  Object.keys(typeData).forEach((key) => {
    const typeNumber = parseInt(key, 10);
    if (contentDisplay.typeNames[typeNumber]) {
      typeData[typeNumber].typeName = contentDisplay.typeNames[typeNumber];
    }
    if (contentDisplay.typeNumberWords[typeNumber]) {
      typeData[typeNumber].typeNumberWord = contentDisplay.typeNumberWords[typeNumber];
    }
  });

  return typeData;
}
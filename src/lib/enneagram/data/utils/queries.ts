// src/lib/enneagram/data/utils/queries.ts

/**
 * This file provides the query interface for accessing Enneagram type content.
 * It works in conjunction with:
 * 
 * - loader.ts: Provides cached content access
 * - parser.ts: Defines content data structures
 * - typeContentSchema.ts: Defines content organization
 * 
 * This is the top-level API that components use to access content.
 * It provides:
 * - Type-safe access to content
 * - Efficient data loading through caching
 * - Granular access to specific content pieces
 * - Content search capabilities
 */

import { cache } from 'react';
import { 
  loadTypeContent, 
  loadTypeMetadata, 
  loadTypeSection, 
  loadDisplayContent 
} from './loader';
import { EnneagramType } from '../../models/symbolStructures';
import { TypeSectionId, TypeSubsectionId } from '../content/types/schema/typeContentSchema';
import type { 
  TypeContent, 
  TypeContentMetadata, 
  ContentBlock, 
  DevelopmentLevel, 
  Misidentification,
  DisplayContent,
  parseTypeMetadata 
} from './parser';

/**
 * Basic Type Information
 * These queries provide access to fundamental type information.
 */

/**
 * Gets the display name for a type (e.g., "Reformer" for Type 1)
 */
export const getTypeName = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return metadata.typeName;
});

/**
 * Gets the brief description/alias for a type
 */
export const getTypeAlias = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return metadata.briefDescription.summary;
});

/**
 * Gets a map of all type numbers to their names
 */
export const getTypeNames = cache(async () => {
  const types = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const names = await Promise.all(types.map(type => getTypeName(type)));
  return Object.fromEntries(types.map((type, i) => [type, names[i]]));
});

/**
 * Display Text Queries
 * These queries access shared presentation text.
 */

/**
 * Gets all display text used across type pages
 */
// src/lib/enneagram/data/utils/queries.ts

export const getDisplayContent = cache(async () => {
  try {
    console.log('getDisplayContent: Starting to load...');
    const filePath = '@/lib/enneagram/data/content/types/display/typeContentDisplay.md';
    console.log('getDisplayContent: Attempting to read from:', filePath);
    
    const content = await window.fs.readFile(filePath, { encoding: 'utf8' });
    if (!content) {
      console.error('getDisplayContent: No content loaded');
      throw new Error('No content loaded from file');
    }
    
    console.log('getDisplayContent: Raw content loaded, first 100 chars:', content.substring(0, 100));

    // Parse the display content
    const parsedContent = await parseDisplayContent(content);
    console.log('getDisplayContent: Successfully parsed content:', parsedContent);

    if (!parsedContent || !parsedContent.typeNames) {
      console.error('getDisplayContent: Invalid parsed content structure:', parsedContent);
      throw new Error('Invalid content structure after parsing');
    }

    return parsedContent;
  } catch (error: any) {
    console.error('Error in getDisplayContent:', {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
});

/**
 * Gets display text for a specific section
 */
export const getSectionTitle = cache(async (sectionId: TypeSectionId) => {
  const display = await loadDisplayContent();
  return display.sections[sectionId];
});

/**
 * Gets display text for a specific subsection
 */
export const getSubsectionTitle = cache(async (subsectionId: TypeSubsectionId) => {
  const display = await loadDisplayContent();
  return display.subsections[subsectionId];
});

/**
 * Core Type Information
 * These queries provide access to essential type characteristics.
 */

/**
 * Gets the full description for a type
 */
export const getTypeDescription = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return metadata.briefDescription;
});

/**
 * Gets the essence quality for a type
 */
export const getTypeEssence = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return metadata.essenceQuality;
});

/**
 * Core Motivations and Fears
 * These queries provide access to type drivers and concerns.
 */

/**
 * Gets primary and secondary motivations for a type
 */
export const getTypeMotivations = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return {
    primary: metadata.topPriority,
    secondary: metadata.secondaryDesires
  };
});

/**
 * Gets primary and secondary fears for a type
 */
export const getTypeFears = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return {
    primary: metadata.biggestFear,
    secondary: metadata.secondaryFears
  };
});

/**
 * Development Levels
 * These queries access information about different levels of type development.
 */

/**
 * Gets all development levels for a type
 */
export const getTypeDevelopmentLevels = cache(async (type: EnneagramType) => {
  const [healthy, average, unhealthy] = await Promise.all([
    loadTypeSection(type, 'healthyLevel'),
    loadTypeSection(type, 'averageLevel'),
    loadTypeSection(type, 'unhealthyLevel')
  ]);
  
  return { healthy, average, unhealthy };
});

/**
 * Type Identification
 * These queries help users identify their type.
 */

/**
 * Gets identification indicators for a type
 */
export const getTypeIdentification = cache(async (type: EnneagramType) => {
  const [mightBe, probablyNot] = await Promise.all([
    loadTypeSection(type, 'mightBeType'),
    loadTypeSection(type, 'probablyNotType')
  ]);
  
  return { mightBe, probablyNot };
});

/**
 * Gets misidentification patterns for a type
 */
export const getTypeMisidentifications = cache(async (type: EnneagramType) => {
  const [others, self] = await Promise.all([
    loadTypeSection(type, 'typesMisidentifyingAsThis'),
    loadTypeSection(type, 'thisTypeMayMisidentifyAs')
  ]);
  
  return {
    othersAs: others,
    selfAs: self
  };
});

/**
 * Type Patterns
 * These queries access information about type behaviors and tendencies.
 */

/**
 * Gets behavioral patterns for a type
 */
export const getTypePatterns = cache(async (type: EnneagramType) => {
  const metadata = await loadTypeMetadata(type);
  return {
    atBest: metadata.atTheirBest,
    underStress: metadata.underStress,
    wakeUpCall: metadata.wakeUpCall,
    mentalHabit: metadata.mentalHabit,
    characteristicVice: metadata.characteristicVice,
    innerStory: metadata.innerStory
  };
});

/**
 * Growth and Development
 * These queries access information about type growth.
 */

/**
 * Gets growth-related content for a type
 */
export const getTypeGrowth = cache(async (type: EnneagramType) => {
  const [metadata, practices] = await Promise.all([
    loadTypeMetadata(type),
    loadTypeSection(type, 'growthPractices')
  ]);
  
  return {
    key: metadata.keyToGrowth,
    practices
  };
});

/**
 * Related Types
 * These queries access information about type relationships.
 */

/**
 * Gets wing and line connections for a type
 */
export const getTypeConnections = cache(async (type: EnneagramType) => {
  const [wings, lines] = await Promise.all([
    loadTypeSection(type, 'wingTypes'),
    loadTypeSection(type, 'lineTypes')
  ]);
  
  return { wings, lines };
});

/**
 * Examples
 * These queries access example information.
 */

/**
 * Gets famous examples for a type
 */
export const getTypeFamousExamples = cache(async (type: EnneagramType) => {
  return loadTypeSection(type, 'famousExamples');
});

/**
 * Search
 * These queries provide search functionality across type content.
 */

/**
 * Searches across all type content
 * Returns matches with their context
 */
export const searchTypeContent = cache(async (query: string) => {
  if (!query.trim()) {
    return [];
  }

  const types = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const results = await Promise.all(
    types.map(async type => {
      const content = await loadTypeContent(type);
      const matches = [];
      
      // Search metadata
      const metadataMatches = searchMetadata(content, query.toLowerCase());
      if (metadataMatches.length > 0) {
        matches.push(...metadataMatches);
      }
      
      // Search sections
      const sectionMatches = searchSections(content.sections, query.toLowerCase());
      if (sectionMatches.length > 0) {
        matches.push(...sectionMatches);
      }
      
      return matches.length > 0 ? {
        type,
        matches
      } : null;
    })
  );
  
  return results.filter((result): result is { type: EnneagramType; matches: any[] } => 
    result !== null
  );
});

/**
 * Helper function to search metadata fields
 */
function searchMetadata(
  content: TypeContentMetadata, 
  query: string
): Array<{ section: string; content: string }> {
  const matches: Array<{ section: string; content: string }> = [];
  
  Object.entries(content).forEach(([key, value]) => {
    if (typeof value === 'string' && value.toLowerCase().includes(query)) {
      matches.push({ section: key, content: value });
    } else if (typeof value === 'object' && 'summary' in value) {
      const block = value as ContentBlock;
      if (block.summary.toLowerCase().includes(query) || 
          block.explanation.toLowerCase().includes(query)) {
        matches.push({ 
          section: key, 
          content: `${block.summary}\n${block.explanation}` 
        });
      }
    }
  });
  
  return matches;
}

/**
 * Helper function to search section content
 */
function searchSections(
  sections: TypeContent['sections'], 
  query: string
): Array<{ section: string; content: string }> {
  const matches: Array<{ section: string; content: string }> = [];
  
  Object.entries(sections).forEach(([section, content]) => {
    if (Array.isArray(content)) {
      content.forEach(item => {
        if (typeof item === 'string' && item.toLowerCase().includes(query)) {
          matches.push({ section, content: item });
        }
      });
    } else if (typeof content === 'string' && content.toLowerCase().includes(query)) {
      matches.push({ section, content });
    }
  });
  
  return matches;
}

/**
 * Retrieves the dynamically loaded type name for a given Enneagram type.
 *
 * @param {number} typeNumber - The Enneagram type number (1-9).
 * @returns {string | null} - The localized name of the type.
 */
export function getTypeName(typeNumber: number) {
  const metadata = parseTypeMetadata();
  return metadata[typeNumber]?.typeName || null;
}

/**
 * Retrieves the dynamically loaded type number word (e.g., "One", "Two").
 *
 * @param {number} typeNumber - The Enneagram type number (1-9).
 * @returns {string | null} - The localized word for the number.
 */
export function getTypeNumberWord(typeNumber: number) {
  const metadata = parseTypeMetadata();
  return metadata[typeNumber]?.typeNumberWord || null;
}
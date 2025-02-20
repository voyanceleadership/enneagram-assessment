// lib/enneagram/data/content/types/schema/typeContentSchema.ts

/**
 * This file defines the schema for Enneagram type content organization.
 * It provides the structural foundation for how type information is organized,
 * stored, and accessed throughout the application. The schema is used to:
 * 
 * 1. Define the structure of markdown content
 * 2. Validate content organization
 * 3. Provide type-safe keys for accessing content
 * 4. Structure UI organization across different views (profile pages, comparisons)
 * 
 * IMPORTANT: This schema only defines the structure and relationships of content,
 * NOT the content itself. All user-facing text should come from markdown files
 * to support localization.
 */

/**
 * Core section identifiers that define the main content blocks
 * for each type's information.
 */
export const TYPE_SECTION_IDS = {
    snapshot: 'snapshot',
    summary: 'summary',
    description: 'description',
    identification: 'identification',
    misidentifications: 'misidentifications',
    levels: 'levels',
    misconceptions: 'misconceptions',
    relatedTypes: 'related-types',
    growth: 'growth',
    examples: 'examples'
  } as const;
  
  /**
   * Subsection identifiers that define the specific components
   * within each main section.
   */
  export const TYPE_SUBSECTION_IDS = {
    briefDescription: 'brief-description',
    topPriority: 'top-priority',
    secondaryDesires: 'secondary-desires',
    biggestFear: 'biggest-fear',
    secondaryFears: 'secondary-fears',
    atTheirBest: 'at-their-best',
    underStress: 'under-stress',
    wakeUpCall: 'wake-up-call',
    mentalHabit: 'mental-habit',
    characteristicVice: 'characteristic-vice',
    innerStory: 'inner-story',
    keyToGrowth: 'key-to-growth',
    mightBe: 'might-be',
    probablyNot: 'probably-not',
    healthy: 'healthy',
    average: 'average',
    unhealthy: 'unhealthy',
    wings: 'wings',
    lines: 'lines'
  } as const;
  
  // Type definitions for type-safe access to the schema
  export type TypeSectionId = keyof typeof TYPE_SECTION_IDS;
  export type TypeSubsectionId = keyof typeof TYPE_SUBSECTION_IDS;
  
  interface SectionSchema {
    subsections: TypeSubsectionId[];
  }
  
  /**
   * Schema definition for the hierarchical structure of sections and their subsections.
   */
  export const TYPE_CONTENT_SCHEMA: Record<TypeSectionId, SectionSchema> = {
    snapshot: {
      subsections: [
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
      ]
    },
    summary: {
      subsections: []
    },
    description: {
      subsections: []
    },
    identification: {
      subsections: [
        'mightBe',
        'probablyNot'
      ]
    },
    misidentifications: {
      subsections: []
    },
    levels: {
      subsections: [
        'healthy',
        'average',
        'unhealthy'
      ]
    },
    misconceptions: {
      subsections: []
    },
    relatedTypes: {
      subsections: [
        'wings',
        'lines'
      ]
    },
    growth: {
      subsections: []
    },
    examples: {
      subsections: []
    }
  };
  
  /**
   * Helper function to get all subsections defined for a given section
   */
  export function getSectionSubsections(sectionId: TypeSectionId): TypeSubsectionId[] {
    return TYPE_CONTENT_SCHEMA[sectionId].subsections;
  }
  
  /**
   * Helper function to validate if a subsection belongs to a section
   */
  export function isSubsectionOfSection(
    sectionId: TypeSectionId,
    subsectionId: TypeSubsectionId
  ): boolean {
    return TYPE_CONTENT_SCHEMA[sectionId].subsections.includes(subsectionId);
  }
// src/lib/enneagram/data/utils/loader.ts

/**
 * This file handles loading and caching of content for the Enneagram system.
 * It works in conjunction with:
 * 
 * - parser.ts: Provides parsing functionality for loaded content
 * - queries.ts: Uses this loader to efficiently access cached content
 * - typeContentSchema.ts: Defines the structure of content being loaded
 * - typeContentDisplay.md: Shared display text that needs to be loaded
 * 
 * Key responsibilities:
 * - Load markdown files from the filesystem
 * - Cache parsed content for efficient access
 * - Provide both full and partial content loading
 * - Handle loading of both type content and display content
 * - Manage cache invalidation
 */

import { cache } from 'react';
import { parseTypeContent, parseDisplayContent } from './parser';
import { EnneagramType } from '../../models/symbolStructures';
import type { TypeContent, TypeContentMetadata, DisplayContent } from './parser';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Declare the window.fs API type
declare global {
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<string>;
    };
  }
}

/**
 * Custom error for content loading failures
 */
class ContentLoadError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
    this.name = 'ContentLoadError';
  }
}

/**
 * Cache Structure
 * Defines the shape of our caching system for different types of content.
 */
interface ContentCache {
  // Full type content cache
  fullContent: Record<EnneagramType, TypeContent>;
  // Metadata-only cache for quicker access to common fields
  metadata: Record<EnneagramType, TypeContentMetadata>;
  // Section-specific cache for granular access
  sections: Record<string, any>;
  // Display content cache
  display: DisplayContent | null;
}

/**
 * Initialize Cache
 * Creates an empty cache structure with proper typing.
 */
const contentCache: ContentCache = {
  fullContent: {} as Record<EnneagramType, TypeContent>,
  metadata: {} as Record<EnneagramType, TypeContentMetadata>,
  sections: {},
  display: null
};

/**
 * Content Loading Functions
 * These functions handle the actual loading of content from files.
 */

/**
 * Loads and parses the full content for a specific type.
 * Caches the result for subsequent access.
 */
export const loadTypeContent = cache(async (type: EnneagramType): Promise<TypeContent> => {
  // Check full content cache first
  if (contentCache.fullContent[type]) {
    return contentCache.fullContent[type];
  }

  try {
    // Load the markdown file from the new structure
    const content = await window.fs.readFile(
      `types/content/typeContent/type${type}.md`,
      { encoding: 'utf8' }
    );

    // Parse the content
    const parsedContent = await parseTypeContent(content);

    // Cache the full content
    contentCache.fullContent[type] = parsedContent;

    // Cache the metadata separately for quick access
    contentCache.metadata[type] = {
      typeDigit: parsedContent.typeDigit,
      typeNumber: parsedContent.typeNumber,
      typeName: parsedContent.typeName,
      essenceQuality: parsedContent.essenceQuality,
      briefDescription: parsedContent.briefDescription,
      topPriority: parsedContent.topPriority,
      secondaryDesires: parsedContent.secondaryDesires,
      biggestFear: parsedContent.biggestFear,
      secondaryFears: parsedContent.secondaryFears,
      atTheirBest: parsedContent.atTheirBest,
      underStress: parsedContent.underStress,
      wakeUpCall: parsedContent.wakeUpCall,
      mentalHabit: parsedContent.mentalHabit,
      characteristicVice: parsedContent.characteristicVice,
      innerStory: parsedContent.innerStory,
      keyToGrowth: parsedContent.keyToGrowth
    };

    return parsedContent;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new ContentLoadError(`Failed to load content for type ${type}: ${message}`, error);
  }
});

/**
 * Loads and parses the display content used across type pages.
 * Caches the result for subsequent access.
 */
export const loadDisplayContent = cache(async (): Promise<DisplayContent> => {
  // Check display content cache
  if (contentCache.display) {
    return contentCache.display;
  }

  try {
    // Load the display content markdown file
    const content = await window.fs.readFile(
      'types/content/display/typeContentDisplay.md',
      { encoding: 'utf8' }
    );

    // Parse the display content
    const parsedContent = await parseDisplayContent(content);

    // Cache the result
    contentCache.display = parsedContent;

    return parsedContent;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new ContentLoadError('Failed to load display content', error);
  }
});

/**
 * Metadata Loading Functions
 * These functions provide efficient access to commonly needed metadata.
 */

/**
 * Loads just the metadata for a specific type.
 * Uses the metadata cache for efficient access.
 */
export const loadTypeMetadata = cache(async (type: EnneagramType) => {
  // Check metadata cache
  if (contentCache.metadata[type]) {
    return contentCache.metadata[type];
  }

  // Load full content if metadata isn't cached
  const content = await loadTypeContent(type);
  return contentCache.metadata[type];
});

/**
 * Loads metadata for all types.
 * Useful for navigation and type selection interfaces.
 */
export const loadAllTypeMetadata = cache(async () => {
  const types = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const metadata = await Promise.all(
    types.map(type => loadTypeMetadata(type))
  );
  
  return Object.fromEntries(
    metadata.map(meta => [meta.typeDigit, meta])
  );
});

/**
 * Section Loading Functions
 * These functions provide granular access to specific sections of content.
 */

/**
 * Loads a specific section for a type.
 * Uses section-specific caching for efficiency.
 */
export const loadTypeSection = cache(async (
  type: EnneagramType,
  sectionName: keyof TypeContent['sections']
) => {
  const cacheKey = `${type}-${sectionName}`;
  if (contentCache.sections[cacheKey]) {
    return contentCache.sections[cacheKey];
  }

  const content = await loadTypeContent(type);
  const sectionContent = content.sections[sectionName];
  contentCache.sections[cacheKey] = sectionContent;
  
  return sectionContent;
});

/**
 * Cache Management Functions
 * These functions help maintain cache integrity.
 */

/**
 * Clears all cached content.
 * Useful when content files have been updated.
 */
export function clearContentCache() {
  contentCache.fullContent = {} as Record<EnneagramType, TypeContent>;
  contentCache.metadata = {} as Record<EnneagramType, TypeContentMetadata>;
  contentCache.sections = {};
  contentCache.display = null;
}

/**
 * Clears cached content for a specific type.
 * Useful when a single type's content has been updated.
 */
export function clearTypeCache(type: EnneagramType) {
  delete contentCache.fullContent[type];
  delete contentCache.metadata[type];
  Object.keys(contentCache.sections)
    .filter(key => key.startsWith(`${type}-`))
    .forEach(key => delete contentCache.sections[key]);
}

/**
 * Loads and parses the Type Content Display file (typeContentDisplay.md).
 * This file contains localized text for type names, number words, and section titles.
 *
 * @returns {object | null} - Extracted metadata from the markdown file.
 */
export function loadTypeContentDisplay() {
  const filePath = path.join(__dirname, '../content/typeContentDisplay.md');

  if (!fs.existsSync(filePath)) {
    console.warn(`Type content display file not found: ${filePath}`);
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContents);
  
  return {
    typeNames: data.typeNames || {},
    typeNumberWords: data.typeNumberWords || {},
  };
}
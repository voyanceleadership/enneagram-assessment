/**
 * @file queries.ts
 * @description Functions for loading and processing Enneagram type data
 * 
 * This file contains the core functionality for:
 * - Loading markdown content from the file system
 * - Parsing structured data from markdown files
 * - Validating content against the expected schema
 * - Handling errors that may occur during content loading
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { TypeData, TypeDataMap, TypeDataSchema, TypeDataError, ValidationError } from './types';
import { SectionParser } from './parsers';
import { SECTION_NAMES } from './constants';
import { getTypeFilePath, contentFileExists } from '../content-paths';

/**
 * Extract sections from the raw markdown content
 * 
 * @param content Raw markdown content
 * @returns A record of section name to array of lines in that section
 */
function extractSections(content: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = '';
  const lines = content.split('\n');

  console.log(`\nStarting section extraction`);
  console.log('Raw content length:', content.length);
  console.log('Number of lines:', lines.length);
  console.log('Found sections:');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.match(/^\[.*\]$/)) {
      currentSection = trimmedLine.slice(1, -1);
      console.log(`  Found section: "${currentSection}"`);
      sections[currentSection] = [];
    } else if (currentSection && trimmedLine) {
      sections[currentSection].push(trimmedLine);
    }
  }

  // Debug log the content of each section
  Object.entries(sections).forEach(([name, content]) => {
    console.log(`\nSection "${name}" has ${content.length} lines`);
    if (content.length > 0) {
      console.log('First few lines:', content.slice(0, 2));
    }
  });

  return sections;
}

/**
 * Parse a TypeData object from markdown content
 * 
 * @param typeDigit The enneagram type number (1-9)
 * @param content The raw markdown content
 * @returns A parsed TypeData object
 */
async function parseTypeContent(typeDigit: string, content: string): Promise<Partial<TypeData['sections']>> {
  const parser = new SectionParser(typeDigit);
  
  try {
    // Parse the content using the SectionParser
    const parsedData = await parser.parseContent(content);
    return parsedData.sections;
  } catch (error) {
    if (error instanceof TypeDataError) {
      throw error;
    }
    throw new TypeDataError(
      'Failed to parse type content',
      typeDigit,
      undefined,
      error
    );
  }
}

/**
 * Load and parse data for a specific Enneagram type
 * 
 * @param digit The enneagram type number (1-9) as a string
 * @returns A fully parsed and validated TypeData object
 */
export const getTypeData = cache(async (digit: string): Promise<TypeData> => {
  // Get the full path to the type's markdown file using the helper
  const fullPath = getTypeFilePath(digit);
  
  try {
    // Add debug logging
    console.log(`Attempting to read file: type${digit}.md`);
    console.log(`Full path: ${fullPath}`);
    
    // Check if the file exists
    if (!contentFileExists(fullPath)) {
      console.error(`File does not exist: ${fullPath}`);
      throw new TypeDataError(
        `Failed to load type ${digit}: File does not exist at ${fullPath}`,
        digit
      );
    }
    
    // Read the file contents
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    console.log(`File contents for type${digit}.md:`, fileContents.substring(0, 200)); // Log first 200 chars

    // Parse frontmatter and get content
    const { data: frontmatter, content } = matter(fileContents);
    console.log(`Frontmatter for type${digit}.md:`, frontmatter); // Log frontmatter

    // Validate frontmatter exists and has required fields before continuing
    if (!frontmatter || typeof frontmatter !== 'object') {
      throw new TypeDataError(
        `Invalid or missing frontmatter in type${digit}.md`,
        digit
      );
    }

    // Add validation for required frontmatter fields
    const requiredFields = [
      'typeDigit',
      'typeNumber',
      'typeName',
      'essenceQuality',
      'briefDescription'
    ];
    
    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        throw new TypeDataError(
          `Missing required frontmatter field: ${field} in type${digit}.md`,
          digit
        );
      }
    }

    // Create a parser instance and parse the content
    const parser = new SectionParser(digit);
    const parsedData = await parser.parseContent(fileContents);
    
    // Validate the parsed data against the schema
    const validationResult = TypeDataSchema.safeParse(parsedData);
    if (!validationResult.success) {
      throw new ValidationError(digit, validationResult.error);
    }

    return parsedData as TypeData;
  } catch (error) {
    if (error instanceof TypeDataError || error instanceof ValidationError) {
      throw error;
    }
    
    // Improve error message with file path
    throw new TypeDataError(
      `Failed to load type ${digit} from ${fullPath}`,
      digit,
      undefined,
      error instanceof Error ? error : new Error('Unknown error')
    );
  }
});

/**
 * Load and parse data for all nine Enneagram types
 * 
 * @returns A map of all types' data, keyed by type number
 */
export const getAllTypesData = cache(async (): Promise<TypeDataMap> => {
  const typeData: TypeDataMap = {};
  const errors: TypeDataError[] = [];
  
  // Load all types in parallel
  await Promise.all(
    Array.from({ length: 9 }, async (_, i) => {
      const typeDigit = (i + 1).toString();
      try {
        typeData[typeDigit] = await getTypeData(typeDigit);
      } catch (error) {
        console.error(`Error loading type ${typeDigit}:`, error);
        if (error instanceof TypeDataError) {
          errors.push(error);
        } else {
          errors.push(new TypeDataError(
            'Unknown error loading type',
            typeDigit,
            undefined,
            error instanceof Error ? error : new Error('Unknown error')
          ));
        }
      }
    })
  );

  // If any errors occurred, log them and throw
  if (errors.length > 0) {
    console.error('Errors loading type data:', errors);
    throw new Error('Failed to load all type data. Check console for details.');
  }

  return typeData;
});

/**
 * Load and parse any generic content file from the content directory
 * 
 * @param category The content category (e.g., 'insights')
 * @param fileName The file name including extension
 * @returns The parsed frontmatter and content
 */
export const getContentFile = cache(async (
  category: keyof typeof import('../content-paths').CONTENT_PATHS, 
  fileName: string
): Promise<{ data: any; content: string }> => {
  // Import dynamically to avoid circular dependencies
  const { getContentFilePath } = await import('../content-paths');
  const fullPath = getContentFilePath(category, fileName);
  
  try {
    console.log(`Attempting to read content file: ${fileName} from ${category}`);
    
    if (!contentFileExists(fullPath)) {
      throw new Error(`File does not exist: ${fullPath}`);
    }
    
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    return matter(fileContents);
  } catch (error) {
    console.error(`Error loading content from ${fullPath}:`, error);
    throw error;
  }
});
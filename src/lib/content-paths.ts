/**
 * @file content-paths.ts
 * @description Centralized configuration for all content file paths
 * 
 * This file provides a single source of truth for accessing content files
 * across the application. It abstracts away the physical file structure,
 * making it easier to reorganize content without changing code everywhere.
 */

import path from 'path';
// Import fs using the Node.js compatibility layer in Next.js
import fs from 'fs';

/**
 * Base content paths for different content types
 */
export const CONTENT_PATHS = {
  // Root content directory
  base: path.join(process.cwd(), 'src', 'content'),
  
  // Enneagram type descriptions
  types: path.join(process.cwd(), 'src', 'content', 'types'),
  
  // Insights, explanations, guides
  insights: path.join(process.cwd(), 'src', 'content', 'typing'),
  
  // Add more content categories as needed
};

/**
 * Gets the full file path for a specific Enneagram type's markdown file
 * 
 * @param digit The Enneagram type number (1-9)
 * @returns The absolute file path to the type's markdown file
 * 
 * @example
 * // Returns '/path/to/project/src/content/types/type3.md'
 * getTypeFilePath('3')
 */
export function getTypeFilePath(digit: string): string {
  return path.join(CONTENT_PATHS.types, `type${digit}.md`);
}

/**
 * Gets the full file path for any content file by category and filename
 * 
 * @param category The content category (must be a key in CONTENT_PATHS)
 * @param fileName The file name including extension
 * @returns The absolute file path to the content file
 * 
 * @example
 * // Returns '/path/to/project/src/content/typing/typingInsights.md'
 * getContentFilePath('insights', 'typingInsights.md')
 */
export function getContentFilePath(category: keyof typeof CONTENT_PATHS, fileName: string): string {
  return path.join(CONTENT_PATHS[category], fileName);
}

/**
 * Checks if a content file exists
 * This function must only be called in server components or API routes
 * 
 * @param filePath The full path to the content file
 * @returns boolean indicating if the file exists
 */
export function contentFileExists(filePath: string): boolean {
  // This will only work in a server context
  if (typeof process === 'undefined') {
    console.warn('contentFileExists called in browser context');
    return false;
  }
  
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error checking if file exists: ${filePath}`, error);
    return false;
  }
}
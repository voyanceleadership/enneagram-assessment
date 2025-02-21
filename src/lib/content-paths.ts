/**
 * @file content-paths.ts
 * @description Centralized configuration for all content file paths
 * 
 * This file provides a single source of truth for accessing content files
 * across the application. It abstracts away the physical file structure,
 * making it easier to reorganize content without changing code everywhere.
 */

import path from 'path';

/**
 * Base content paths for different content types
 */
export const CONTENT_PATHS = {
  // Root content directory
  base: path.join(process.cwd(), 'src', 'content'),
  
  // Enneagram type descriptions
  types: path.join(process.cwd(), 'src', 'content', 'types'),
  
  // Insights, explanations, guides
  insights: path.join(process.cwd(), 'src', 'content', 'insights'),
  
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
 * // Returns '/path/to/project/src/content/insights/typing-guide.md'
 * getContentFilePath('insights', 'typing-guide.md')
 */
export function getContentFilePath(category: keyof typeof CONTENT_PATHS, fileName: string): string {
  return path.join(CONTENT_PATHS[category], fileName);
}

/**
 * Checks if a content file exists
 * 
 * @param filePath The full path to the content file
 * @returns boolean indicating if the file exists
 */
export function contentFileExists(filePath: string): boolean {
  const fs = require('fs');
  return fs.existsSync(filePath);
}
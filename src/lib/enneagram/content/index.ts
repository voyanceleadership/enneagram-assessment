/**
 * @file index.ts
 * @description Main exports for the Enneagram content handling system
 * 
 * This file centralizes all exports from the content module, making it easier
 * to import from elsewhere in the codebase. It provides access to types,
 * query functions, and parsing utilities related to Enneagram content.
 */

// Re-export types
export * from './types';

// Re-export query functions
export * from './queries';

// Export the parser class
export { SectionParser } from './parsers';

// Add utility functions
export const formatTypeName = (digit: string, name: string): string => {
  return `Type ${digit}: ${name}`;
};

export const getTypeSlug = (digit: string): string => {
  return `type${digit}`;
};
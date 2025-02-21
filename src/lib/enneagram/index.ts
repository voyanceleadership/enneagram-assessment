/**
 * @file index.ts
 * @description Root export file for the Enneagram module
 * 
 * This file serves as the main entry point for all Enneagram-related exports,
 * including types, constants, styles, content, and utilities. It allows for 
 * cleaner imports throughout the application.
 * 
 * Example usage:
 * import { EnneagramType, TYPE_NAMES, getTypeData } from '@/lib/enneagram';
 */

// Core types
export * from './types';

// Constants
export * from './constants';

// Styles and style-related types
export * from './styles';

// Content handling (new)
export * from './content';

// Utilities
export * from './utils/symbolUtils';
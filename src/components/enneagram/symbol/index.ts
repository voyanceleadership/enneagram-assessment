'use client';

/**
 * @file index.ts
 * @description Barrel file for the Enneagram symbol components
 * 
 * This file provides a centralized export point for the main symbol
 * components. Individual SVG elements are not exported here as they
 * are internal implementation details of DynamicEnneagramSymbol.
 * 
 * Example usage:
 * import { DynamicEnneagramSymbol } from '@/components/enneagram/symbol';
 */

export { default as DynamicEnneagramSymbol } from './DynamicEnneagramSymbol';
export { default as EnneagramControls } from './EnneagramControls';
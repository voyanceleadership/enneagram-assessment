'use client';

/**
 * @file index.ts
 * @description Barrel file for SVG element components
 * 
 * This file provides a centralized export point for all SVG elements
 * that make up the Enneagram symbol. Using this barrel file allows for
 * cleaner imports in the parent component.
 * 
 * Example usage:
 * import { TypeNames, Circles, Connections } from './elements';
 */

export { default as TypeNames } from './TypeNames';
export { default as Circles } from './Circles';
export { default as Connections } from './Connections';
export { default as Arrowheads } from './Arrowheads';
export { default as TypeNumbers } from './TypeNumbers';
export { default as OuterRing } from './OuterRing';
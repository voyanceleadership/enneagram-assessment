// src/lib/enneagram/utils/validation.ts

/**
 * This file provides validation utilities for the Enneagram symbol system.
 * It ensures data integrity by validating:
 * - Type numbers are valid
 * - Required geometry exists for each type
 * - Type relationships are correct and reciprocal
 * - All required visual elements are present
 */

import { EnneagramType } from '../models/symbolStructures';
import { ENNEAGRAM_RELATIONSHIPS } from '../data/constants/relationships';
import { SYMBOL_GEOMETRY } from '../data/constants/geometry';

type ArrowheadType = 'stress' | 'growth';

// Validate that a number is a valid Enneagram type
export function isValidType(type: number): type is EnneagramType {
  return Number.isInteger(type) && type >= 1 && type <= 9;
}

// Validate that all required geometry exists for a type
export function validateTypeGeometry(type: EnneagramType): string[] {
  const errors: string[] = [];

  // Check type positions
  if (!SYMBOL_GEOMETRY.typePositions[type]) {
    errors.push(`Missing type position for Type ${type}`);
  }

  // Check number positions
  if (!SYMBOL_GEOMETRY.numberPositions[type]) {
    errors.push(`Missing number position for Type ${type}`);
  }

  // Check type name angle
  if (!SYMBOL_GEOMETRY.typeNames.angles[type]) {
    errors.push(`Missing name angle for Type ${type}`);
  }

  return errors;
}

// Validate relationship consistency
export function validateTypeRelationships(type: EnneagramType): string[] {
  const errors: string[] = [];
  const relationships = ENNEAGRAM_RELATIONSHIPS[type];

  if (!relationships) {
    errors.push(`No relationships defined for Type ${type}`);
    return errors;
  }

  // Validate wing connections are adjacent numbers
  const validLeftWing = (type === 1 && relationships.left === 9) || 
                       relationships.left === type - 1;
  const validRightWing = (type === 9 && relationships.right === 1) || 
                        relationships.right === type + 1;

  if (!validLeftWing) {
    errors.push(`Invalid left wing for Type ${type}: ${relationships.left}`);
  }
  if (!validRightWing) {
    errors.push(`Invalid right wing for Type ${type}: ${relationships.right}`);
  }

  // Validate that stress/growth points are valid types
  if (!isValidType(relationships.stress)) {
    errors.push(`Invalid stress point for Type ${type}: ${relationships.stress}`);
  }
  if (!isValidType(relationships.growth)) {
    errors.push(`Invalid growth point for Type ${type}: ${relationships.growth}`);
  }

  // Validate that related types list includes all connected types
  const shouldInclude = [
    relationships.left,
    relationships.right,
    relationships.stress,
    relationships.growth
  ];

  shouldInclude.forEach(relatedType => {
    if (!relationships.related.includes(relatedType)) {
      errors.push(`Type ${relatedType} missing from related types list for Type ${type}`);
    }
  });

  // Validate reciprocal relationships
  const reciprocalErrors = validateReciprocalRelationships(type);
  errors.push(...reciprocalErrors);

  return errors;
}

// Validate that relationships are reciprocal
function validateReciprocalRelationships(type: EnneagramType): string[] {
  const errors: string[] = [];
  const relationships = ENNEAGRAM_RELATIONSHIPS[type];

  // Check wing relationships
  const leftWing = ENNEAGRAM_RELATIONSHIPS[relationships.left];
  const rightWing = ENNEAGRAM_RELATIONSHIPS[relationships.right];

  if (leftWing.right !== type) {
    errors.push(`Non-reciprocal left wing relationship: ${type} and ${relationships.left}`);
  }
  if (rightWing.left !== type) {
    errors.push(`Non-reciprocal right wing relationship: ${type} and ${relationships.right}`);
  }

  // Check stress/growth relationships
  const stressPoint = ENNEAGRAM_RELATIONSHIPS[relationships.stress];
  const growthPoint = ENNEAGRAM_RELATIONSHIPS[relationships.growth];

  if (stressPoint.growth !== type) {
    errors.push(`Non-reciprocal stress relationship: ${type} and ${relationships.stress}`);
  }
  if (growthPoint.stress !== type) {
    errors.push(`Non-reciprocal growth relationship: ${type} and ${relationships.growth}`);
  }

  return errors;
}

// Validate geometry has all required paths and arrowheads
export function validateGeometryCompleteness(): string[] {
  const errors: string[] = [];

  // Check all wing connections exist
  for (let i = 1; i <= 9; i++) {
    const type = i as EnneagramType;
    const relationships = ENNEAGRAM_RELATIONSHIPS[type];
    
    // Check wing paths
    [
      `${type}-${relationships.right}`,
      `${relationships.left}-${type}`
    ].forEach(connection => {
      const key = connection as keyof typeof SYMBOL_GEOMETRY.wingPaths;
      if (!SYMBOL_GEOMETRY.wingPaths[key]) {
        errors.push(`Missing wing path for connection ${connection}`);
      }
    });

    // Check stress/growth line paths and arrowheads
    [
      { point: relationships.stress, type: 'stress' as ArrowheadType },
      { point: relationships.growth, type: 'growth' as ArrowheadType }
    ].forEach(({ point, type }) => {
      const connection = `${type}-${point}`;
      const lineKey = connection as keyof typeof SYMBOL_GEOMETRY.lineConnections;
      if (!SYMBOL_GEOMETRY.lineConnections[lineKey]) {
        errors.push(`Missing line connection for ${connection}`);
      }
      
      const arrowKey = connection as keyof typeof SYMBOL_GEOMETRY.arrowheads[typeof type];
      if (!SYMBOL_GEOMETRY.arrowheads[type][arrowKey]) {
        errors.push(`Missing ${type} arrowhead for ${connection}`);
      }
    });
  }

  return errors;
}
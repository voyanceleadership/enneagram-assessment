import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { TypeData, TypeDataMap, TypeDataSchema, TypeDataError, ValidationError } from './types';
import { SectionParser } from './parsers';
import { SECTION_NAMES } from './constants';

function extractSections(content: string): string[][] {
  const sections: Record<string, string[]> = {};
  let currentSection = '';
  const lines = content.split('\n');
  const sectionContent: string[][] = [];
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      if (currentLines.length > 0) {
        sectionContent.push(currentLines);
      }
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }

  if (currentLines.length > 0) {
    sectionContent.push(currentLines);
  }

  return sectionContent;
}

async function parseTypeContent(typeDigit: string, content: string): Promise<Partial<TypeData['sections']>> {
  const parser = new SectionParser(typeDigit);
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  try {
    const sections = parser.extractSections(markdownContent);

    // Get the section content safely
    const getSection = (name: string) => sections[name] || [];
    
    return {
      typeSummary: parser.parseTextSection(getSection(SECTION_NAMES.summary), SECTION_NAMES.summary),
      longDescription: parser.parseTextSection(getSection(SECTION_NAMES.longDescription), SECTION_NAMES.longDescription),
      mightBeType: parser.parseListSection(getSection(SECTION_NAMES.mightBeType), SECTION_NAMES.mightBeType),
      probablyNotType: parser.parseListSection(getSection(SECTION_NAMES.probablyNotType), SECTION_NAMES.probablyNotType),
      healthyLevel: parser.parseTextSection(getSection(SECTION_NAMES.healthyLevel), SECTION_NAMES.healthyLevel),
      averageLevel: parser.parseTextSection(getSection(SECTION_NAMES.averageLevel), SECTION_NAMES.averageLevel),
      unhealthyLevel: parser.parseTextSection(getSection(SECTION_NAMES.unhealthyLevel), SECTION_NAMES.unhealthyLevel),
      misconceptions: parser.parseListSection(getSection(SECTION_NAMES.misconceptions), SECTION_NAMES.misconceptions),
      typesMisidentifyingAsThis: parser.parseTextSection(getSection(SECTION_NAMES.typesMisidentifyingAsThis), SECTION_NAMES.typesMisidentifyingAsThis),
      thisTypeMayMisidentifyAs: parser.parseTextSection(getSection(SECTION_NAMES.thisTypeMayMisidentifyAs), SECTION_NAMES.thisTypeMayMisidentifyAs),
      wingTypes: parser.parseWingTypes(getSection(SECTION_NAMES.wingTypes)),
      lineTypes: parser.parseLineTypes(getSection(SECTION_NAMES.lineTypes)),
      growthPractices: parser.parseListSection(getSection(SECTION_NAMES.growthPractices), SECTION_NAMES.growthPractices),
      famousExamples: parser.parseListSection(getSection(SECTION_NAMES.famousExamples), SECTION_NAMES.famousExamples)
    };
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

export const getTypeData = cache(async (digit: string): Promise<TypeData> => {
  const fullPath = path.join(process.cwd(), 'data', 'types', `type${digit}.md`);
  
  try {
    // Add debug logging
    console.log(`Attempting to read file: type${digit}.md`);
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    console.log(`File contents for type${digit}.md:`, fileContents.substring(0, 200)); // Log first 200 chars

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

    const parsedContent = await parseTypeContent(digit, content);
    const typeData = {
      ...frontmatter,
      sections: parsedContent
    };

    const validationResult = TypeDataSchema.safeParse(typeData);
    if (!validationResult.success) {
      throw new ValidationError(digit, validationResult.error);
    }

    return typeData as TypeData;
  } catch (error) {
    if (error instanceof TypeDataError || error instanceof ValidationError) {
      throw error;
    }
    
    // Improve error message with file path
    throw new TypeDataError(
      `Failed to load type ${digit} from ${fullPath}`,
      digit,
      undefined,
      error
    );
  }
});

export const getAllTypesData = cache(async (): Promise<TypeDataMap> => {
  const typeData: TypeDataMap = {};
  const errors: TypeDataError[] = [];
  
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
            error
          ));
        }
      }
    })
  );

  if (errors.length > 0) {
    console.error('Errors loading type data:', errors);
    throw new Error('Failed to load all type data. Check console for details.');
  }

  return typeData;
});
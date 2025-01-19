import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { TypeData, TypeDataSchema, TypeDataError } from '@/lib/types/types';
import { SectionParser } from '@/lib/types/parsers';

async function loadTypeData(typeNumber: string): Promise<TypeData> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'types', `type${typeNumber}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    const parser = new SectionParser(typeNumber);
    const sections = await parser.parseContent(content);

    // Construct the type data object exactly matching the TypeData interface
    const typeData = {
      typeDigit: typeNumber,
      typeNumber: frontmatter.typeNumber,
      typeName: frontmatter.typeName,
      essenceQuality: frontmatter.essenceQuality,
      briefDescription: frontmatter.briefDescription,
      // Comparison fields
      topPriority: frontmatter.topPriority,
      secondaryDesires: frontmatter.secondaryDesires,
      biggestFear: frontmatter.biggestFear,
      secondaryFears: frontmatter.secondaryFears,
      atTheirBest: frontmatter.atTheirBest,
      underStress: frontmatter.underStress,
      wakeUpCall: frontmatter.wakeUpCall,
      mentalHabit: frontmatter.mentalHabit,
      fundamentalFlaw: frontmatter.fundamentalFlaw,
      falseNarrative: frontmatter.falseNarrative,
      keyToGrowth: frontmatter.keyToGrowth,
      // Section content
      sections: {
        typeSummary: sections.typeSummary || '',
        longDescription: sections.longDescription || '',
        mightBeType: sections.mightBeType || [],
        probablyNotType: sections.probablyNotType || [],
        healthyLevel: sections.healthyLevel || '',
        averageLevel: sections.averageLevel || '',
        unhealthyLevel: sections.unhealthyLevel || '',
        misconceptions: sections.misconceptions || [],
        typesMisidentifyingAsThis: sections.typesMisidentifyingAsThis || '',
        thisTypeMayMisidentifyAs: sections.thisTypeMayMisidentifyAs || '',
        wingTypes: sections.wingTypes || {},
        lineTypes: sections.lineTypes || {},
        growthPractices: sections.growthPractices || [],
        famousExamples: sections.famousExamples || []
      }
    };

    // Add debug logging
    console.log(`Loading type ${typeNumber}:`, {
      frontmatter,
      sections: Object.keys(sections),
      typeData: Object.keys(typeData)
    });

    // Validate the data against our schema
    const validationResult = TypeDataSchema.safeParse(typeData);
    if (!validationResult.success) {
      console.error('Validation failed for type', typeNumber, validationResult.error);
      throw new TypeDataError(
        `Invalid type data for type ${typeNumber}: ${validationResult.error.message}`,
        typeNumber,
        undefined,
        validationResult.error
      );
    }

    return typeData as TypeData;
  } catch (error) {
    console.error(`Error loading type ${typeNumber}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    const typeData: Record<string, TypeData> = {};
    const errors: Error[] = [];
    
    // Load all 9 types in parallel
    await Promise.all(
      Array.from({ length: 9 }, async (_, i) => {
        const typeNumber = (i + 1).toString();
        try {
          typeData[typeNumber] = await loadTypeData(typeNumber);
        } catch (error) {
          console.error(`Error loading type ${typeNumber}:`, error);
          errors.push(error instanceof Error ? error : new Error(`Unknown error loading type ${typeNumber}`));
        }
      })
    );

    // If we have any errors, return them
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to load some types',
          errors: errors.map(e => e.message)
        },
        { status: 500 }
      );
    }

    // All types loaded successfully
    return NextResponse.json({ 
      success: true, 
      data: typeData 
    });
  } catch (error) {
    console.error('Error loading types:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof TypeDataError 
          ? error.message 
          : 'Failed to load types data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
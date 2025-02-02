import { TypeDataError } from './types';
import { SECTION_NAMES } from './constants';
import matter from 'gray-matter';
import type { MisidentificationType } from './types';

export class SectionParser {
  private currentSection: string = '';
  private currentSubsection: string = '';
  private sections: Record<string, any> = {};

  constructor(private typeDigit: string) {}

  private parseMisidentificationSection(lines: string[]): MisidentificationType[] {
    console.log('\nParsing misidentification section');
    console.log(`Input lines: ${lines.length}`);
    
    const types: MisidentificationType[] = [];
    let currentType: MisidentificationType = {
      type: '',
      sharedTraits: [],
      differences: {
        coreMotivation: '',
        behavioral: '',
        stress: ''
      }
    };
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      console.log(`Processing misidentification line: "${trimmed}"`);
      
      if (trimmed.match(/^• Type \d+:/)) {
        // If we already have a type in progress, save it
        if (currentType.type) {
          console.log(`Adding type: ${JSON.stringify(currentType)}`);
          types.push({...currentType});
        }
        // Start a new type
        currentType = {
          type: trimmed,
          sharedTraits: [],
          differences: {
            coreMotivation: '',
            behavioral: '',
            stress: ''
          }
        };
        console.log(`Started new type: ${trimmed}`);
      } 
      else if (trimmed === '- Shared Traits:') {
        currentSection = 'sharedTraits';
        console.log('Switched to shared traits section');
      } 
      else if (trimmed === '- Key Differences:') {
        currentSection = 'differences';
        console.log('Switched to differences section');
      } 
      else if (trimmed.startsWith('•')) {
        const trait = trimmed.replace(/^•\s*/, '').trim();
        
        if (currentSection === 'sharedTraits') {
          currentType.sharedTraits.push(trait);
          console.log(`Added shared trait: ${trait}`);
        } 
        else if (currentSection === 'differences') {
          if (trait.startsWith('Core Motivation:')) {
            currentType.differences.coreMotivation = trait.substring(15).trim();
            console.log(`Added core motivation: ${trait.substring(15).trim()}`);
          } 
          else if (trait.startsWith('Behavioral Differences:')) {
            currentType.differences.behavioral = trait.substring(22).trim();
            console.log(`Added behavioral differences: ${trait.substring(22).trim()}`);
          } 
          else if (trait.startsWith('Stress Behavior:')) {
            currentType.differences.stress = trait.substring(15).trim();
            console.log(`Added stress behavior: ${trait.substring(15).trim()}`);
          }
        }
      }
    }

    // Add the last type if it exists
    if (currentType.type) {
      console.log(`Adding final type: ${JSON.stringify(currentType)}`);
      types.push({...currentType});
    }

    console.log(`Parsed ${types.length} misidentification types`);
    return types;
  }

  private handleListItem(line: string, section: string): string {
    const trimmed = line.trim();
    
    // Handle both bullet points and numbered lists
    if (section === SECTION_NAMES.misconceptions && trimmed.match(/^\d+\.\s\*\*/)) {
      return trimmed;
    }

    if (!trimmed.startsWith('- ') && !trimmed.match(/^\d+\.\s/)) {
      console.log(`Invalid list item format in ${section}:`, trimmed);
      throw new TypeDataError(
        `Invalid list item format in ${section}`,
        this.typeDigit,
        section
      );
    }

    const result = trimmed.replace(/^-\s/, '').replace(/^\d+\.\s/, '').trim();
    console.log(`Processed list item: "${result}"`);
    return result;
  }

  private validateRequiredFrontmatter(frontmatter: any) {
    console.log('Validating frontmatter:', frontmatter);
    const requiredFields = [
      'typeDigit',
      'typeNumber',
      'typeName',
      'essenceQuality',
      'briefDescription',
      'topPriority',
      'secondaryDesires',
      'biggestFear',
      'secondaryFears',
      'atTheirBest',
      'underStress',
      'wakeUpCall',
      'mentalHabit',
      'fundamentalFlaw',
      'falseNarrative',
      'keyToGrowth'
    ];

    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        console.error(`Missing required field: ${field}`);
        throw new TypeDataError(
          `Missing required frontmatter field: ${field}`,
          this.typeDigit
        );
      }
    }

    // Validate array fields
    const arrayFields = ['secondaryDesires', 'secondaryFears'];
    for (const field of arrayFields) {
      if (!Array.isArray(frontmatter[field])) {
        console.error(`Field ${field} must be an array`);
        throw new TypeDataError(
          `Field ${field} must be an array in frontmatter`,
          this.typeDigit
        );
      }
    }
  }

  parseMisconceptions(lines: string[]): string[] {
    console.log('\nParsing misconceptions section');
    console.log(`Input lines: ${lines.length}`);
    
    const misconceptions: string[] = [];
    let currentMisconception = '';

    for (const line of lines) {
      const trimmed = line.trim();
      console.log(`Processing misconception line: "${trimmed}"`);
      
      if (trimmed.match(/^\d+\.\s\*\*/)) {
        // Start of new misconception
        if (currentMisconception) {
          console.log(`Adding misconception: "${currentMisconception.trim()}"`);
          misconceptions.push(currentMisconception.trim());
        }
        currentMisconception = trimmed;
      } else if (trimmed && currentMisconception) {
        // Continuation of current misconception
        currentMisconception += ' ' + trimmed;
      }
    }

    // Add the last misconception if there is one
    if (currentMisconception) {
      console.log(`Adding final misconception: "${currentMisconception.trim()}"`);
      misconceptions.push(currentMisconception.trim());
    }

    console.log(`Found ${misconceptions.length} misconceptions`);
    return misconceptions;
  }

  parseWingTypes(lines: string[]): Record<string, string> {
    console.log('\nParsing wing types section');
    console.log(`Input lines: ${lines.length}`);
    
    const wings: Record<string, string> = {};
    
    for (const line of lines) {
      console.log(`Processing wing line: "${line.trim()}"`);
      if (line.trim().startsWith('- **')) {
        const match = line.match(/- \*\*Type \d+: .+? Wing.+?\*\*:(.*)/);
        if (match) {
          const [, description] = match;
          const key = line.match(/\*\*(.+?)\*\*/)[1];
          console.log(`Found wing type: "${key}" with description: "${description.trim()}"`);
          wings[key] = description.trim();
        }
      }
    }

    console.log(`Parsed ${Object.keys(wings).length} wing types`);
    return wings;
  }

  parseLineTypes(lines: string[]): Record<string, string> {
    console.log('\nParsing line types section');
    console.log(`Input lines: ${lines.length}`);
    
    const lineTypes: Record<string, string> = {};
    
    for (const line of lines) {
      console.log(`Processing line type: "${line.trim()}"`);
      if (line.trim().startsWith('- **')) {
        const match = line.match(/- \*\*Type \d+: .+?\*\*:(.*)/);
        if (match) {
          const [, description] = match;
          const key = line.match(/\*\*(.+?)\*\*/)[1];
          console.log(`Found line type: "${key}" with description: "${description.trim()}"`);
          lineTypes[key] = description.trim();
        }
      }
    }

    console.log(`Parsed ${Object.keys(lineTypes).length} line types`);
    return lineTypes;
  }

  parseListSection(lines: string[], sectionName: string): string[] {
    console.log(`\nParsing list section: ${sectionName}`);
    console.log(`Input lines: ${lines.length}`);
    
    if (sectionName === SECTION_NAMES.misconceptions) {
      return this.parseMisconceptions(lines);
    }

    const items: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      console.log(`Processing line: "${trimmedLine}"`);
      if (trimmedLine && (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\.\s/))) {
        items.push(this.handleListItem(line, sectionName));
      }
    }

    console.log(`Found ${items.length} items in section ${sectionName}`);
    if (items.length === 0) {
      console.log(`WARNING: No items found in section ${sectionName}`);
      return [];
    }

    return items;
  }

  parseTextSection(lines: string[], sectionName: string): string {
    console.log(`\nParsing text section: ${sectionName}`);
    console.log(`Input lines: ${lines.length}`);
    
    const text = lines.filter(line => line.trim()).join('\n').trim();
    
    console.log(`Parsed text length: ${text.length}`);
    if (!text) {
      console.log(`WARNING: Empty text in section ${sectionName}`);
      return '';
    }

    return text;
  }

  private extractSections(content: string): Record<string, string[]> {
    const sections: Record<string, string[]> = {};
    let currentSection = '';
    const lines = content.split('\n');

    console.log(`\nStarting section extraction for type ${this.typeDigit}`);
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

  async parseContent(content: string) {
    try {
      console.log('Starting content parse');
      const { data: frontmatter, content: markdownContent } = matter(content);
      const sections = this.extractSections(markdownContent);
      
      // Debug the sections
      console.log('\nAll section names found:', Object.keys(sections));
      
      // Debug misidentification sections specifically
      const misidentifyingSectionName = SECTION_NAMES.typesMisidentifyingAsThis;
      const mayMisidentifyAsSectionName = SECTION_NAMES.thisTypeMayMisidentifyAs;
      
      console.log('\nLooking for sections:', {
        misidentifyingSectionName,
        mayMisidentifyAsSectionName
      });

      const misidentifyingSection = sections[misidentifyingSectionName];
      const mayMisidentifyAsSection = sections[mayMisidentifyAsSectionName];

      console.log('\nFound section content:', {
        misidentifyingSection: misidentifyingSection?.length,
        mayMisidentifyAsSection: mayMisidentifyAsSection?.length,
      });

      const parsedData = {
        ...frontmatter,
        sections: {
          typeSummary: this.parseTextSection(sections[SECTION_NAMES.summary] || [], SECTION_NAMES.summary),
          longDescription: this.parseTextSection(sections[SECTION_NAMES.longDescription] || [], SECTION_NAMES.longDescription),
          mightBeType: this.parseListSection(sections[SECTION_NAMES.mightBeType] || [], SECTION_NAMES.mightBeType),
          probablyNotType: this.parseListSection(sections[SECTION_NAMES.probablyNotType] || [], SECTION_NAMES.probablyNotType),
          healthyLevel: this.parseTextSection(sections[SECTION_NAMES.healthyLevel] || [], SECTION_NAMES.healthyLevel),
          averageLevel: this.parseTextSection(sections[SECTION_NAMES.averageLevel] || [], SECTION_NAMES.averageLevel),
          unhealthyLevel: this.parseTextSection(sections[SECTION_NAMES.unhealthyLevel] || [], SECTION_NAMES.unhealthyLevel),
          misconceptions: this.parseListSection(sections[SECTION_NAMES.misconceptions] || [], SECTION_NAMES.misconceptions),
          typesMisidentifyingAsThis: this.parseMisidentificationSection(
            sections[SECTION_NAMES.typesMisidentifyingAsThis] || []
          ),
          thisTypeMayMisidentifyAs: this.parseMisidentificationSection(
            sections[SECTION_NAMES.thisTypeMayMisidentifyAs] || []
          ),
          wingTypes: this.parseWingTypes(sections[SECTION_NAMES.wingTypes] || []),
          lineTypes: this.parseLineTypes(sections[SECTION_NAMES.lineTypes] || []),
          growthPractices: this.parseListSection(sections[SECTION_NAMES.growthPractices] || [], SECTION_NAMES.growthPractices),
          famousExamples: this.parseListSection(sections[SECTION_NAMES.famousExamples] || [], SECTION_NAMES.famousExamples)
        }
      };

      // Debug final structure
      console.log('\nFinal section types:', {
        typesMisidentifyingAsThis: Array.isArray(parsedData.sections.typesMisidentifyingAsThis),
        thisTypeMayMisidentifyAs: Array.isArray(parsedData.sections.thisTypeMayMisidentifyAs)
      });

      return parsedData;
    } catch (error) {
      console.error('Error in parseContent:', error);
      if (error instanceof TypeDataError) {
        throw error;
      }
      throw new TypeDataError(
        'Failed to parse content',
        this.typeDigit,
        undefined,
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  }
}
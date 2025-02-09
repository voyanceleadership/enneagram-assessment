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
      console.log(`Processing line: "${trimmed}"`);
      
      // Look for type header with bullet point
      if (trimmed.startsWith('• Type')) {
        // If we already have a type in progress, save it
        if (currentType.type) {
          console.log(`Adding completed type: ${JSON.stringify(currentType)}`);
          types.push({...currentType});
        }
        // Start a new type, preserving the full type string (e.g., "• Type 3: The Achiever")
        currentType = {
          type: trimmed.substring(2), // Remove the bullet point
          sharedTraits: [],
          differences: {
            coreMotivation: '',
            behavioral: '',
            stress: ''
          }
        };
        console.log(`Started new type: ${currentType.type}`);
      } 
      // Look for section headers
      else if (trimmed.startsWith('- Shared Traits')) {
        currentSection = 'sharedTraits';
        console.log('Switched to shared traits section');
      } 
      else if (trimmed.startsWith('- Key Differences')) {
        currentSection = 'differences';
        console.log('Switched to differences section');
      } 
      // Handle bulleted items
      else if (trimmed.startsWith('•')) {
        const trait = trimmed.substring(1).trim(); // Remove the bullet point
        console.log(`Processing trait: ${trait}`);
        
        if (currentSection === 'sharedTraits') {
          currentType.sharedTraits.push(trait);
          console.log(`Added shared trait: ${trait}`);
        } 
        else if (currentSection === 'differences') {
          if (trait.startsWith('Core Motivation:')) {
            currentType.differences.coreMotivation = trait.substring('Core Motivation:'.length).trim();
            console.log(`Added core motivation: ${currentType.differences.coreMotivation}`);
          } 
          else if (trait.startsWith('Behavioral Differences:')) {
            currentType.differences.behavioral = trait.substring('Behavioral Differences:'.length).trim();
            console.log(`Added behavioral difference: ${currentType.differences.behavioral}`);
          } 
          else if (trait.startsWith('Stress Behavior:')) {
            currentType.differences.stress = trait.substring('Stress Behavior:'.length).trim();
            console.log(`Added stress behavior: ${currentType.differences.stress}`);
          }
        }
      }
    }
  
    // Don't forget to add the last type
    if (currentType.type) {
      console.log(`Adding final type: ${JSON.stringify(currentType)}`);
      types.push({...currentType});
    }
  
    console.log(`Parsed ${types.length} types:`, types);
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

  private parseLevelTraits(lines: string[]): Array<{ trait: string; explanation: string }> {
    const traits: Array<{ trait: string; explanation: string }> = [];
    let currentTrait = '';
    let currentExplanation = '';
  
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        // If we have a previous trait, save it
        if (currentTrait) {
          traits.push({
            trait: currentTrait,
            explanation: currentExplanation.trim()
          });
        }
        // Start new trait, splitting on the colon
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex !== -1) {
          currentTrait = trimmed.substring(2, colonIndex).trim();
          currentExplanation = trimmed.substring(colonIndex + 1).trim();
        }
      } else if (trimmed && currentTrait) {
        // Add to current explanation
        currentExplanation += ' ' + trimmed;
      }
    }
  
    // Don't forget to add the last trait
    if (currentTrait) {
      traits.push({
        trait: currentTrait,
        explanation: currentExplanation.trim()
      });
    }
  
    return traits;
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
    console.log('\n========== DEBUG WING TYPES ==========');
    console.log('Input lines:', lines);
    console.log('Number of lines:', lines.length);
    
    const wings: Record<string, string> = {};
    
    for (const line of lines) {
      console.log('Processing line:', line);
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Type')) {
        console.log('Found wing type line:', trimmedLine);
        // Capture everything between parentheses as a single group
        const match = trimmedLine.match(/Type (\d+): (.+?) Wing (\([^)]+\)): (.+)/);
        console.log('Match result:', match);
        if (match) {
          const [, typeNum, name, fullAlias, description] = match;
          const key = `Type ${typeNum}: ${name}`;
          console.log('Parsed wing type:', {
            key,
            typeNum,
            name,
            fullAlias,
            description: description.trim()
          });
          // Store the full alias with the description
          wings[key] = {
            description: description.trim(),
            alias: fullAlias
          };
        } else {
          console.log('No match found for line:', trimmedLine);
        }
      }
    }

    console.log('Final wings object:', wings);
    console.log('=====================================\n');
    return wings;
  }

  parseLineTypes(lines: string[]): Record<string, string> {
    console.log('\n========== DEBUG LINE TYPES ==========');
    console.log('Input lines:', lines);
    console.log('Number of lines:', lines.length);
    
    const lineTypes: Record<string, string> = {};
    
    for (const line of lines) {
      console.log('Processing line:', line);
      const trimmedLine = line.trim();
      // Match the exact format from your markdown
      if (trimmedLine.startsWith('Type')) {
        console.log('Found line type line:', trimmedLine);
        const match = trimmedLine.match(/Type (\d+): ([^:]+): (.+)/);
        console.log('Match result:', match);
        if (match) {
          const [, typeNum, name, description] = match;
          const key = `Type ${typeNum}: ${name}`;
          console.log('Parsed line type:', {
            key,
            typeNum,
            name,
            description: description.trim()
          });
          lineTypes[key] = description.trim();
        } else {
          console.log('No match found for line:', trimmedLine);
        }
      }
    }

    console.log('Final lineTypes object:', lineTypes);
    console.log('=====================================\n');
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
          healthyLevel: this.parseLevelTraits(sections[SECTION_NAMES.healthyLevel] || []),
          averageLevel: this.parseLevelTraits(sections[SECTION_NAMES.averageLevel] || []),
          unhealthyLevel: this.parseLevelTraits(sections[SECTION_NAMES.unhealthyLevel] || []),
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
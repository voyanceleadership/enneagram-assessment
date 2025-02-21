import { TypeDataError } from './types';
import { SECTION_NAMES } from '../constants/sections';
import matter from 'gray-matter';

export class SectionParser {
  private currentSection: string = '';
  private currentSubsection: string = '';
  private sections: Record<string, any> = {};

  constructor(private typeDigit: string) {}

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
      'characteristicVice',
      'innerStory',
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
  }

  private parseWingTypes(lines: string[]): Record<string, any> {
    console.log('\n========== DEBUG WING TYPES ==========');
    console.log('Input lines:', lines);
    
    const wings: Record<string, any> = {};
    let currentType = '';
    let currentSection = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Match type header
      const typeMatch = trimmedLine.match(/Type (\d+): (.+?) Wing (\([^)]+\)): (.+)/);
      if (typeMatch) {
        const [, typeNum, name, fullAlias, description] = typeMatch;
        currentType = `Type ${typeNum}: ${name}`;
        wings[currentType] = {
          description: description.trim(),
          alias: fullAlias,
          combination: {
            personality: '',
            strengths: [],
            challenges: []
          }
        };
        currentSection = '';
      }
      // Match section headers
      else if (trimmedLine.startsWith('Personality:')) {
        currentSection = 'personality';
        if (currentType) {
          wings[currentType].combination.personality = trimmedLine.replace('Personality:', '').trim();
        }
      }
      else if (trimmedLine.startsWith('Strengths:')) {
        currentSection = 'strengths';
      }
      else if (trimmedLine.startsWith('Challenges:')) {
        currentSection = 'challenges';
      }
      // Match bullet points for strengths and challenges
      else if (trimmedLine.startsWith('• ') && currentType && currentSection) {
        const content = trimmedLine.replace('• ', '').trim();
        if (currentSection === 'strengths') {
          wings[currentType].combination.strengths.push(content);
        } else if (currentSection === 'challenges') {
          wings[currentType].combination.challenges.push(content);
        }
      }
      // Add continuation lines to personality section
      else if (trimmedLine && currentType && currentSection === 'personality') {
        wings[currentType].combination.personality += ' ' + trimmedLine;
      }
    }

    console.log('Parsed wing types:', wings);
    return wings;
  }

  private parseLineTypes(lines: string[]): Record<string, any> {
    console.log('\n========== DEBUG LINE TYPES ==========');
    console.log('Input lines:', lines);
    
    const lineTypes: Record<string, any> = {};
    let currentType = '';
    let currentSection = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Match type header
      const typeMatch = trimmedLine.match(/Type (\d+): ([^:]+): (.+)/);
      if (typeMatch) {
        const [, typeNum, name, description] = typeMatch;
        currentType = `Type ${typeNum}: ${name}`;
        lineTypes[currentType] = {
          description: description.trim(),
          dynamics: {
            healthy: '',
            average: '',
            unhealthy: ''
          }
        };
        currentSection = '';
      }
      // Match dynamics sections
      else if (trimmedLine.startsWith('Healthy:')) {
        currentSection = 'healthy';
        if (currentType) {
          lineTypes[currentType].dynamics.healthy = trimmedLine.replace('Healthy:', '').trim();
        }
      }
      else if (trimmedLine.startsWith('Average:')) {
        currentSection = 'average';
        if (currentType) {
          lineTypes[currentType].dynamics.average = trimmedLine.replace('Average:', '').trim();
        }
      }
      else if (trimmedLine.startsWith('Unhealthy:')) {
        currentSection = 'unhealthy';
        if (currentType) {
          lineTypes[currentType].dynamics.unhealthy = trimmedLine.replace('Unhealthy:', '').trim();
        }
      }
      // Add continuation lines to current section
      else if (trimmedLine && currentType && currentSection) {
        lineTypes[currentType].dynamics[currentSection] += ' ' + trimmedLine;
      }
    }

    console.log('Parsed line types:', lineTypes);
    return lineTypes;
  }

  private parseMisidentificationSection(lines: string[]): Array<any> {
    console.log('\nParsing misidentification section');
    console.log(`Input lines: ${lines.length}`);
    
    const types: Array<any> = [];
    let currentType: any = {
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
      
      if (trimmed.startsWith('• Type')) {
        if (currentType.type) {
          types.push({...currentType});
        }
        currentType = {
          type: trimmed.substring(2),
          sharedTraits: [],
          differences: {
            coreMotivation: '',
            behavioral: '',
            stress: ''
          }
        };
        currentSection = '';
      } 
      else if (trimmed.startsWith('- Shared Traits')) {
        currentSection = 'sharedTraits';
      } 
      else if (trimmed.startsWith('- Key Differences')) {
        currentSection = 'differences';
      } 
      else if (trimmed.startsWith('•')) {
        const trait = trimmed.substring(1).trim();
        
        if (currentSection === 'sharedTraits') {
          currentType.sharedTraits.push(trait);
        } 
        else if (currentSection === 'differences') {
          if (trait.startsWith('Core Motivation:')) {
            currentType.differences.coreMotivation = trait.substring('Core Motivation:'.length).trim();
          } 
          else if (trait.startsWith('Behavioral Differences:')) {
            currentType.differences.behavioral = trait.substring('Behavioral Differences:'.length).trim();
          } 
          else if (trait.startsWith('Stress Behavior:')) {
            currentType.differences.stress = trait.substring('Stress Behavior:'.length).trim();
          }
        }
      }
    }
  
    if (currentType.type) {
      types.push({...currentType});
    }
  
    console.log(`Parsed ${types.length} types:`, types);
    return types;
  }

  private parseLevelTraits(lines: string[]): Array<{ trait: string; explanation: string }> {
    const traits: Array<{ trait: string; explanation: string }> = [];
    let currentTrait = '';
    let currentExplanation = '';
  
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (currentTrait) {
          traits.push({
            trait: currentTrait,
            explanation: currentExplanation.trim()
          });
        }
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex !== -1) {
          currentTrait = trimmed.substring(2, colonIndex).trim();
          currentExplanation = trimmed.substring(colonIndex + 1).trim();
        }
      } else if (trimmed && currentTrait) {
        currentExplanation += ' ' + trimmed;
      }
    }
  
    if (currentTrait) {
      traits.push({
        trait: currentTrait,
        explanation: currentExplanation.trim()
      });
    }
  
    return traits;
  }

  private handleListItem(line: string, section: string): string {
    const trimmed = line.trim();
    
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

  private parseListSection(lines: string[], sectionName: string): string[] {
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

  private parseMisconceptions(lines: string[]): string[] {
    console.log('\nParsing misconceptions section');
    console.log(`Input lines: ${lines.length}`);
    
    const misconceptions: string[] = [];
    let currentMisconception = '';

    for (const line of lines) {
      const trimmed = line.trim();
      console.log(`Processing misconception line: "${trimmed}"`);
      
      if (trimmed.match(/^\d+\.\s\*\*/)) {
        if (currentMisconception) {
          misconceptions.push(currentMisconception.trim());
        }
        currentMisconception = trimmed;
      } else if (trimmed && currentMisconception) {
        currentMisconception += ' ' + trimmed;
      }
    }

    if (currentMisconception) {
      misconceptions.push(currentMisconception.trim());
    }

    console.log(`Found ${misconceptions.length} misconceptions`);
    return misconceptions;
  }

  private parseTextSection(lines: string[], sectionName: string): string {
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
      
      this.validateRequiredFrontmatter(frontmatter);
      
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
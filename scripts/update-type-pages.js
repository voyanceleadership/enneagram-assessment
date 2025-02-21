/**
 * This script updates all type pages to use the new server component pattern
 * Run with: node scripts/update-type-pages.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TYPE_PAGES_DIR = path.join(ROOT_DIR, 'src', 'app', 'enneagram', 'types');

// Convert number to written form for the function name
function getTypeName(digit) {
  const names = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  return names[parseInt(digit) - 1];
}

// Template for the new type page component
function createTypePageContent(typeDigit, isTypeScript) {
  const typeName = getTypeName(typeDigit);
  
  // Remove TypeScript annotation if not a TypeScript file
  const metadataReturn = isTypeScript 
    ? 'export async function generateMetadata(): Promise<Metadata>' 
    : 'export async function generateMetadata()';
  
  return `/**
 * @file page.${isTypeScript ? 'tsx' : 'js'}
 * @description Server Component that renders the Enneagram Type ${typeDigit} page
 */

import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';
import { getTypeData } from '@/lib/enneagram/content/queries';
import { Metadata } from 'next';

// This makes Next.js understand this is a Server Component
export const dynamic = 'force-dynamic';

// Generate metadata for this page
${metadataReturn} {
  const typeData = await getTypeData('${typeDigit}');
  
  return {
    title: \`Type ${typeDigit}: \${typeData.typeName} | Enneacademy\`,
    description: typeData.briefDescription.summary
  };
}

// Server Component that loads and renders the Type ${typeDigit} page
export default async function Type${typeName}Page() {
  // Fetch the data for Type ${typeDigit}
  const typeData = await getTypeData('${typeDigit}');
  
  // Render the type page with the fetched data
  return <EnneagramTypePage typeData={typeData} typeNumber="${typeDigit}" />;
}
`;
}

console.log('Starting update of type pages...');

// Process all type directories
for (let digit = 1; digit <= 9; digit++) {
  const typeDir = path.join(TYPE_PAGES_DIR, `type${digit}`);
  
  // Check both .tsx and .js extensions
  let pageFile;
  let isTypeScript = false;
  
  if (fs.existsSync(path.join(typeDir, 'page.tsx'))) {
    pageFile = path.join(typeDir, 'page.tsx');
    isTypeScript = true;
  } else if (fs.existsSync(path.join(typeDir, 'page.js'))) {
    pageFile = path.join(typeDir, 'page.js');
    isTypeScript = false;
  } else {
    console.log(`Warning: No page file found for type${digit}`);
    continue;
  }
  
  if (fs.existsSync(typeDir) && fs.existsSync(pageFile)) {
    console.log(`Updating type${digit} page (${isTypeScript ? 'TypeScript' : 'JavaScript'})...`);
    
    // Create a backup of the original file
    const backupFile = pageFile + '.bak';
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(pageFile, backupFile);
      console.log(`  Created backup: ${backupFile}`);
    }
    
    // Write the new content with the proper formatting for the file type
    fs.writeFileSync(pageFile, createTypePageContent(digit.toString(), isTypeScript));
    console.log(`  Updated: ${pageFile}`);
  } else {
    console.log(`Warning: Type${digit} directory or page file not found`);
  }
}

console.log('Done updating type pages!');
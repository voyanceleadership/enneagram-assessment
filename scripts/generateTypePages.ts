// scripts/generateTypePages.ts
import fs from 'fs';
import path from 'path';
import { TYPE_NUMBERS } from '../src/lib/types/constants';

const baseDir = path.join(process.cwd(), 'src', 'app', 'enneagram', 'types');

// Template for the page content
const generatePageContent = (typeNumber: keyof typeof TYPE_NUMBERS, typeWord: string) => `import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function Type${typeWord}Page() {
  const typeData = await getTypeData('${typeNumber}');
  return <EnneagramTypePage typeData={typeData} typeNumber="${typeNumber}" />;
}`;

async function generatePages() {
  // Generate for types 2-9 (skip 1 since it exists)
  for (let i = 2; i <= 9; i++) {
    const typeNumber = i.toString() as keyof typeof TYPE_NUMBERS;
    const typeWord = TYPE_NUMBERS[typeNumber];
    const folderPath = path.join(baseDir, `type${typeNumber}`);
    const filePath = path.join(folderPath, 'page.tsx');

    try {
      // Check if folder exists
      if (!fs.existsSync(folderPath)) {
        console.log(`Creating directory: type${typeNumber}`);
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Check if page.tsx already exists
      if (fs.existsSync(filePath)) {
        console.log(`Warning: page.tsx already exists for type ${typeNumber}, skipping...`);
        continue;
      }

      // Generate the page content
      const content = generatePageContent(typeNumber, typeWord);
      
      // Write the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully created page.tsx for type ${typeNumber}`);
    } catch (error) {
      console.error(`Error generating page for type ${typeNumber}:`, error);
    }
  }
}

// Run the generator
generatePages().then(() => {
  console.log('Page generation complete!');
}).catch((error) => {
  console.error('Error during page generation:', error);
  process.exit(1);
});
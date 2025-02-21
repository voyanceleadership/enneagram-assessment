/**
 * This script helps update import paths throughout the codebase
 * to point to the new locations after reorganization.
 * 
 * Run with: node scripts/update-imports.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Mapping of old imports to new imports
const IMPORT_REPLACEMENTS = [
  {
    find: /from ['"]@\/lib\/types['"]|from ['"]\.\.?\/\.\.?\/lib\/types['"]/g,
    replace: 'from \'@/lib/enneagram/content\''
  },
  {
    find: /from ['"]@\/lib\/types\/constants['"]|from ['"]\.\.?\/\.\.?\/lib\/types\/constants['"]/g,
    replace: 'from \'@/lib/enneagram/constants/sections\''
  },
  {
    find: /from ['"]@\/lib\/types\/queries['"]|from ['"]\.\.?\/\.\.?\/lib\/types\/queries['"]/g,
    replace: 'from \'@/lib/enneagram/content/queries\''
  },
  {
    find: /from ['"]@\/lib\/types\/parsers['"]|from ['"]\.\.?\/\.\.?\/lib\/types\/parsers['"]/g,
    replace: 'from \'@/lib/enneagram/content/parsers\''
  },
  {
    find: /from ['"]@\/lib\/types\/types['"]|from ['"]\.\.?\/\.\.?\/lib\/types\/types['"]/g,
    replace: 'from \'@/lib/enneagram/content/types\''
  }
];

// Find all TypeScript files in the src directory
console.log('Finding TypeScript files...');
const findCommand = 'find ' + SRC_DIR + ' -type f -name "*.ts" -o -name "*.tsx"';
const files = execSync(findCommand, { encoding: 'utf8' }).trim().split('\n');
console.log(`Found ${files.length} TypeScript files`);

// Process each file
let changedFiles = 0;
files.forEach(filePath => {
  // Skip files in the new location
  if (filePath.includes('/lib/enneagram/content/') || 
      filePath.includes('/lib/enneagram/constants/')) {
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply all replacements
    IMPORT_REPLACEMENTS.forEach(replacement => {
      content = content.replace(replacement.find, replacement.replace);
    });
    
    // If content changed, write it back
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in: ${filePath}`);
      changedFiles++;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

console.log(`\nDone! Updated imports in ${changedFiles} files`);
console.log('\nNext steps:');
console.log('1. Run the app to test everything works');
console.log('2. If all tests pass, you can safely remove the src/lib/types directory');
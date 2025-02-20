// src/app/enneagram/guide/enneagram-symbol/page.tsx
import React from 'react';
import fs from 'fs';
import path from 'path';
import { parseDisplayContent } from '@/lib/enneagram/data/utils/parser';
import DynamicEnneagramSymbol from '@/components/enneagram/symbol/DynamicEnneagramSymbol';

// This is a server component by default in Next.js 14 app directory
async function EnneagramSymbolPage() {
  // Get the absolute path to the content directory
  const contentPath = path.join(process.cwd(), 'src', 'lib', 'enneagram', 'data', 'content', 'types', 'display', 'typeContentDisplay.md');
  
  try {
    // Read the markdown file
    const content = await fs.promises.readFile(contentPath, 'utf8');
    
    // Parse the content
    const displayContent = await parseDisplayContent(content);

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Enneagram Symbol</h1>
        <div className="w-full max-w-4xl mx-auto">
          <DynamicEnneagramSymbol displayContent={displayContent} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading Enneagram content:', error);
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Error Loading Enneagram Symbol</h1>
        <p className="text-red-500">
          There was an error loading the Enneagram content. Please try again later.
        </p>
      </div>
    );
  }
}

export default EnneagramSymbolPage;
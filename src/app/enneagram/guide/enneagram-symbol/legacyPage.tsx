'use client';
import React from 'react';
import DynamicEnneagramSymbol from '@/components/enneagram/symbol/DynamicEnneagramSymbol';
import { Card } from '@/components/ui/card';

export default function EnneagramSymbolPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-2">Interactive Enneagram Symbol</h1>
        <p className="mb-4">
          Use this interactive diagram to explore the connections between different Enneagram types.
          Select a type and use the dropdown to view different relationship patterns:
        </p>
        <ul className="list-disc pl-8 mb-6 text-sm text-gray-700">
          <li><strong>All Types</strong> - View the complete Enneagram symbol</li>
          <li><strong>Core Type Only</strong> - Focus on a single type</li>
          <li><strong>Related Types</strong> - See all types connected to the selected type</li>
          <li><strong>Wings</strong> - Explore adjacent types that influence the selected type</li>
          <li><strong>Lines</strong> - View stress and growth connections</li>
        </ul>
        <div className="h-[800px] w-full max-w-[800px] mx-auto">
          <DynamicEnneagramSymbol interactive={true} />
        </div>
        <div className="mt-6 text-sm text-gray-600">
          <h2 className="font-semibold text-lg mb-2">About the Enneagram Symbol</h2>
          <p>
            The Enneagram symbol illustrates the dynamic interconnections between the nine personality types.
            Each type is connected to others through wing relationships (adjacent numbers) and
            stress/growth lines that show how types behave under different conditions.
          </p>
        </div>
      </Card>
    </div>
  );
}
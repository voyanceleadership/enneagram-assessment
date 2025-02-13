'use client';
import React from 'react';
import InteractiveEnneagramDiagram from '@/components/enneagram/symbol/InteractiveEnneagramDiagram';
import { Card } from '@/components/ui/card';

export default function EnneagramSymbolPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-2">Enneagram Symbol</h1>
        <p className="mb-2">
          Use this interactive diagram to explore the connections between different Enneagram types. 
          Select a type and view its various relationships with other types.
        </p>
        <div className="h-[800px]">
          <InteractiveEnneagramDiagram />
        </div>
      </Card>
    </div>
  );
}
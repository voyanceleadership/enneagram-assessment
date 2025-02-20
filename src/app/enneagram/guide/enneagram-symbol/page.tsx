'use client';

/**
 * @file EnneagramSymbolPage.tsx
 * @description Page component for displaying the interactive Enneagram symbol
 * 
 * This page provides an interactive interface for exploring the Enneagram symbol
 * and its relationships. It uses the modular DynamicEnneagramSymbol component
 * which provides a cleaner, more maintainable implementation.
 */

import React from 'react';
import { DynamicEnneagramSymbol } from '@/components/enneagram/symbol';
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
          <DynamicEnneagramSymbol
            interactive={true}
            defaultVariation="all"
          />
        </div>
      </Card>
    </div>
  );
}
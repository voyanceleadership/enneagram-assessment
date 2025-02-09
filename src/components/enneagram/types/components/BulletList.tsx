// src/components/enneagram/types/components/BulletList.tsx
import React from 'react';

interface BulletListProps {
  items: string[];
}

// A reusable component for displaying bullet-pointed lists
// Used across multiple sections for consistent list styling
export default function BulletList({ items }: BulletListProps) {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
// src/components/ui/scroll-anchor.tsx
'use client';

import React from 'react';

interface ScrollAnchorProps {
  id: string;
  offset?: number;
}

/**
 * Simplified ScrollAnchor Component
 * 
 * Rather than adding absolute divs that can interfere with layout,
 * this simpler version just creates an invisible anchor point with an ID
 */
export function ScrollAnchor({
  id,
  offset = 0
}: ScrollAnchorProps) {
  return (
    <div 
      id={id} 
      style={{ 
        position: 'relative',
        visibility: 'hidden',
        height: 0,
        width: 0,
        margin: 0,
        padding: 0
      }}
      aria-hidden="true"
    />
  );
}
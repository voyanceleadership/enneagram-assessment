//src/components/enneagram/types/components/ExpandableContent.tsx
import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableContentProps {
  summary: string;
  explanation: string;
}

export default function ExpandableContent({ summary, explanation }: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors border-b
          ${isExpanded ? 'hover:bg-white' : ''}`}
      >
        <span className="font-medium text-gray-800">{summary}</span>
        <ChevronDown 
          className={`transform transition-transform duration-300 text-gray-500 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="transition-[height,opacity] duration-300 ease-out"
        style={{
          height: isExpanded ? contentRef.current?.scrollHeight + 'px' : '0',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden'
        }}
      >
        <div className="p-4 bg-gray-50">
          <p className="text-gray-600">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
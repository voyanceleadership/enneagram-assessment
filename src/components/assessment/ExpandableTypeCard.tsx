// src/components/assessment/ExpandableTypeCard.tsx
import React from 'react';
import Link from 'next/link';
import { TypeData } from '@/lib/enneagram/content/types';
import { ChevronDown } from 'lucide-react';

interface ExpandableTypeCardProps {
  type: string;
  score: number;
  typeData: TypeData;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandableTypeCard = ({ type, score, typeData, isExpanded, onToggle }: ExpandableTypeCardProps) => {
  return (
    <div 
      className={`bg-white rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50`}
      onClick={onToggle}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-lg text-gray-900">
            Type {type}: {typeData.name}
          </span>
          <span className="text-lg font-medium text-gray-600">
            {Math.round(score)}
          </span>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <p className="text-gray-600 text-base mb-4">
            {typeData.briefDescription}
          </p>
          <Link 
            href={`/types/${type}`}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Learn more about Type {type}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExpandableTypeCard;
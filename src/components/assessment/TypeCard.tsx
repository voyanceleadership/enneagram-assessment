import React from 'react';
import Link from 'next/link';
import { Target } from 'lucide-react';

interface TypeData {
  number: string;
  name: string;
  briefDescription: string;
}

interface TypeCardProps {
  typeData: TypeData;
  accentColor: string;
  wing?: {
    number: string;
    name: string;
  };
}

const TypeCard = ({ typeData, accentColor, wing }: TypeCardProps) => {
  if (!typeData) {
    return null;
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border"
      style={{ borderColor: `${accentColor}30` }}
    >
      <div className="p-10">
        <div className="flex items-start gap-6">
          <div 
            className="rounded-full p-3 mt-1 flex-shrink-0" 
            style={{ backgroundColor: `${accentColor}10` }}
          >
            <Target className="h-6 w-6" style={{ color: accentColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl text-gray-900 font-medium mb-3">
              Type {typeData.number}: {typeData.name}
              {wing && (
                <span className="text-gray-600">
                  {` with Type ${wing.number}: ${wing.name} wing`}
                </span>
              )}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              {typeData.briefDescription}
            </p>
            <Link 
              href={`/types/${typeData.number}`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Learn more about Type {typeData.number}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeCard;
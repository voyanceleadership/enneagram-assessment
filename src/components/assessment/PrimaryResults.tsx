import React from 'react';
import TypeSymbol from './TypeSymbol';
import TypeCard from './TypeCard';

interface TypeData {
  number: string;
  name: string;
  briefDescription: string;
}

interface PrimaryResultsProps {
  sortedResults: [string, number][];
  accentColor: string;
  typesData: Record<string, TypeData>;
}

const PrimaryResults = ({ sortedResults, accentColor, typesData }: PrimaryResultsProps) => {
  const [type1, score1] = sortedResults[0];
  const [type2, score2] = sortedResults[1];
  const scoreGap = score1 - score2;
  const areAdjacent = Math.abs(parseInt(type1) - parseInt(type2)) === 1 || 
    (type1 === '1' && type2 === '9') || 
    (type1 === '9' && type2 === '1');

  // Single clear type
  if (scoreGap > 10) {
    return (
      <div className="pt-6"> {/* Added top padding to container */}
        <div className="space-y-8"> {/* Increased space between symbol and card */}
          <div className="py-4"> {/* Added padding around symbol */}
            <TypeSymbol type={type1} />
          </div>
          <TypeCard
            typeData={typesData[type1]}
            accentColor={accentColor}
          />
        </div>
      </div>
    );
  }

  // Type with wing
  if (areAdjacent) {
    return (
      <div className="pt-6"> {/* Added top padding to container */}
        <div className="space-y-8"> {/* Increased space between symbol and card */}
          <div className="py-4"> {/* Added padding around symbol */}
            <TypeSymbol 
              type={type1} 
              hasWing={true} 
              wingType={type2}
            />
          </div>
          <TypeCard
            typeData={typesData[type1]}
            accentColor={accentColor}
            wing={{
              number: type2,
              name: typesData[type2].name
            }}
          />
        </div>
      </div>
    );
  }

  // Two possible types
  return (
    <div className="pt-6"> {/* Added top padding to container */}
      <div className="space-y-12"> {/* Increased space between sections */}
        <div className="space-y-8"> {/* Space between symbol and card */}
          <div className="py-4"> {/* Added padding around symbol */}
            <TypeSymbol type={type1} />
          </div>
          <TypeCard
            typeData={typesData[type1]}
            accentColor={accentColor}
          />
        </div>
        <div className="flex justify-center">
          <span className="text-2xl text-gray-400 font-medium">or</span>
        </div>
        <div className="space-y-8"> {/* Space between symbol and card */}
          <div className="py-4"> {/* Added padding around symbol */}
            <TypeSymbol type={type2} />
          </div>
          <TypeCard
            typeData={typesData[type2]}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryResults;
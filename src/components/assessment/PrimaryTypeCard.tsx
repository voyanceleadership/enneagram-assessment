import React from 'react';
import { Target } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const TYPE_NAMES = {
  '1': 'The Reformer',
  '2': 'The Helper',
  '3': 'The Achiever',
  '4': 'The Individualist',
  '5': 'The Investigator',
  '6': 'The Loyalist',
  '7': 'The Enthusiast',
  '8': 'The Challenger',
  '9': 'The Peacemaker'
};

const WingTypeInfo = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button 
        variant="link" 
        className="text-primary hover:text-primary/80 px-0 h-auto font-normal"
      >
        What's a wing type?
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Understanding Wing Types</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <DialogDescription className="text-base leading-relaxed">
          While everyone has one core or dominant type, many people also relate to aspects of one or both of the types adjacent to their dominant type on the symbol. This type is essentially a secondary type, and in the Enneagram framework it's called a "wing" type.
        </DialogDescription>
        <DialogDescription className="text-base leading-relaxed">
          Most people have one wing type, but it's possible to have both wings or no wings.
        </DialogDescription>
      </div>
    </DialogContent>
  </Dialog>
);

interface PrimaryTypeCardProps {
  sortedResults: [string, number][];
  accentColor: string;
}

const PrimaryTypeCard = ({ sortedResults, accentColor }: PrimaryTypeCardProps) => {
  const [type1, score1] = sortedResults[0];
  const [type2, score2] = sortedResults[1];
  const scoreGap = score1 - score2;
  const areAdjacent = Math.abs(parseInt(type1) - parseInt(type2)) === 1 || 
    (type1 === '1' && type2 === '9') || 
    (type1 === '9' && type2 === '1');

  let headerText;
  let message;
  
  if (scoreGap > 10) {
    headerText = `Type ${type1}: ${TYPE_NAMES[type1]}`;
    message = `Based on your scores, your core type is most likely Type ${type1}: ${TYPE_NAMES[type1]}.`;
  } else if (areAdjacent) {
    headerText = `Type ${type1}: ${TYPE_NAMES[type1]} with a Type ${type2}: ${TYPE_NAMES[type2]} wing`;
    message = `Because you have close scores in these two types, it's also possible you're a Type ${type2}: ${TYPE_NAMES[type2]} with a Type ${type1}: ${TYPE_NAMES[type1]} wing.`;
  } else {
    headerText = `Type ${type1}: ${TYPE_NAMES[type1]} or Type ${type2}: ${TYPE_NAMES[type2]}`;
    message = `Based on your scores, your core type is most likely either Type ${type1}: ${TYPE_NAMES[type1]} or Type ${type2}: ${TYPE_NAMES[type2]}.`;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border" style={{ borderColor: `${accentColor}30` }}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full p-2 mt-1" style={{ backgroundColor: `${accentColor}10` }}>
            <Target className="h-5 w-5" style={{ color: accentColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
              Primary Type
            </h3>
            <h4 className="text-xl text-gray-900 font-medium mb-3">
              {headerText}
            </h4>
            <p className="text-gray-600 text-base leading-relaxed">
              {message}
            </p>
            {areAdjacent && (
              <div className="mt-3">
                <WingTypeInfo />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryTypeCard;
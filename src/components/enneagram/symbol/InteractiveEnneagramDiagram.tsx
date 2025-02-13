import React, { useState } from 'react';

type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SymbolVariation = 
  | 'all' 
  | 'type-only'
  | 'related-types'
  | 'left-wing'
  | 'right-wing'
  | 'both-wings'
  | 'both-lines'
  | 'stress-line'
  | 'growth-line';

interface TypeRelationships {
  left: EnneagramType; 
  right: EnneagramType; 
  stress: EnneagramType;
  growth: EnneagramType;
  related: EnneagramType[];
}

const ENNEAGRAM_RELATIONSHIPS: Record<EnneagramType, TypeRelationships> = {
  1: { left: 9, right: 2, stress: 4, growth: 7, related: [9, 2, 4, 7] },
  2: { left: 1, right: 3, stress: 8, growth: 4, related: [1, 3, 8, 4] },
  3: { left: 2, right: 4, stress: 9, growth: 6, related: [2, 4, 9, 6] },
  4: { left: 3, right: 5, stress: 2, growth: 1, related: [3, 5, 2, 1] },
  5: { left: 4, right: 6, stress: 7, growth: 8, related: [4, 6, 7, 8] },
  6: { left: 5, right: 7, stress: 3, growth: 9, related: [5, 7, 3, 9] },
  7: { left: 6, right: 8, stress: 1, growth: 5, related: [6, 8, 1, 5] },
  8: { left: 7, right: 9, stress: 5, growth: 2, related: [7, 9, 5, 2] },
  9: { left: 8, right: 1, stress: 6, growth: 3, related: [8, 1, 6, 3] }
};

const TYPE_NAMES = {
  1: 'Reformer',
  2: 'Helper',
  3: 'Achiever',
  4: 'Individualist',
  5: 'Investigator',
  6: 'Loyalist',
  7: 'Enthusiast',
  8: 'Challenger',
  9: 'Peacemaker'
};

const VARIATIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'type-only', label: 'Core Type Only' },
  { value: 'related-types', label: 'All Related Types' },
  { value: 'both-wings', label: 'Both Wings' },
  { value: 'left-wing', label: 'Left Wing' },
  { value: 'right-wing', label: 'Right Wing' },
  { value: 'both-lines', label: 'Both Lines' },
  { value: 'stress-line', label: 'Stress Line' },
  { value: 'growth-line', label: 'Growth Line' }
];

const EnneagramControls: React.FC<{
    selectedType: EnneagramType | null;
    setSelectedType: (type: EnneagramType | null) => void;
    variation: SymbolVariation;
    setVariation: (variation: SymbolVariation) => void;
    variations: Array<{ value: string; label: string }>;
  }> = ({ selectedType, setSelectedType, variation, setVariation, variations }) => {
    return (
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            value={selectedType?.toString() || ''}
            onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) as EnneagramType : null)}
          >
            <option value="">Select Type</option>
            {Object.entries(TYPE_NAMES).map(([type, name]) => (
              <option key={type} value={type}>
                Type {type}: {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            value={variation}
            onChange={(e) => setVariation(e.target.value as SymbolVariation)}
            disabled={!selectedType}
          >
            {variations.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

const InteractiveEnneagramDiagram: React.FC = () => {
    const [selectedType, setSelectedType] = useState<EnneagramType | null>(null);
    const [variation, setVariation] = useState<SymbolVariation>('all');
  
    // Helper function to determine if wings should be swapped
    const shouldSwapWings = (type: EnneagramType | null): boolean => {
      return type ? [3, 4, 5, 6].includes(type) : false;
    };
  
    // Helper function to get the correct wing label
    const getWingLabel = (isLeftWing: boolean): string => {
      if (!selectedType) return isLeftWing ? 'Left Wing' : 'Right Wing';
      return shouldSwapWings(selectedType)
        ? isLeftWing ? 'Right Wing' : 'Left Wing'
        : isLeftWing ? 'Left Wing' : 'Right Wing';
    };
  
    // Dynamic variations array that updates based on selectedType
    const variations = [
      { value: 'all', label: 'All Types' },
      { value: 'type-only', label: 'Core Type Only' },
      { value: 'related-types', label: 'All Related Types' },
      { value: 'both-wings', label: 'Both Wings' },
      { value: 'left-wing', label: getWingLabel(true) },
      { value: 'right-wing', label: getWingLabel(false) },
      { value: 'both-lines', label: 'Both Lines' },
      { value: 'stress-line', label: 'Stress Line' },
      { value: 'growth-line', label: 'Growth Line' }
    ];

  // Base styles
  const styles = {
    st0: { fill: 'none' },
    st1: { fill: 'none', stroke: 'aqua', strokeWidth: '2px', strokeMiterlimit: 10 },
    st2: { 
      fill: 'none', 
      stroke: 'aqua', 
      strokeMiterlimit: 10,
      strokeDasharray: '12 6 12 6 12 6'
    },
    st3: { 
      display: 'none',
      stroke: '#000',
      strokeWidth: '3px',
      strokeMiterlimit: 10,
      fill: 'none'
    },
    st4: { 
      fill: 'none',
      stroke: '#000',
      strokeWidth: '3px',
      strokeMiterlimit: 10
    },
    st5: { fill: '#e6e6e6' },
    st6: { 
      fill: '#fff',
      stroke: '#000',
      strokeWidth: '3px',
      strokeMiterlimit: 10
    },
    st7: {
      fontFamily: "'niveau-grotesk', sans-serif",
      fontSize: '60px',
      fontWeight: 300
    }
  };

  const isTypeHighlighted = (type: EnneagramType): boolean => {
    if (!selectedType) return true;
    if (variation === 'all') return true;
    if (type === selectedType) return true;
    
    const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
    
    switch (variation) {
      case 'type-only':
        return type === selectedType;
      case 'related-types':
        return relationships.related.includes(type);
      case 'left-wing':
        return type === relationships.left;
      case 'right-wing':
        return type === relationships.right;
      case 'both-wings':
        return type === relationships.left || type === relationships.right;
      case 'both-lines':
        return type === relationships.stress || type === relationships.growth;
      case 'stress-line':
        return type === relationships.stress;
      case 'growth-line':
        return type === relationships.growth;
      default:
        return false;
    }
  };

  const isConnectionHighlighted = (from: EnneagramType, to: EnneagramType): boolean => {
    if (!selectedType) return true;
    if (variation === 'all') return true;
    
    const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
    
    switch (variation) {
      case 'type-only':
        return false;
      case 'related-types':
        return (selectedType === from && relationships.related.includes(to)) ||
               (selectedType === to && relationships.related.includes(from));
      case 'left-wing':
        return (selectedType === from && to === relationships.left) ||
               (selectedType === to && from === relationships.left);
      case 'right-wing':
        return (selectedType === from && to === relationships.right) ||
               (selectedType === to && from === relationships.right);
      case 'both-wings':
        return (selectedType === from && (to === relationships.left || to === relationships.right)) ||
               (selectedType === to && (from === relationships.left || from === relationships.right));
      case 'both-lines':
        return (selectedType === from && (to === relationships.stress || to === relationships.growth)) ||
               (selectedType === to && (from === relationships.stress || from === relationships.growth));
      case 'stress-line':
        return (selectedType === from && to === relationships.stress) ||
               (selectedType === to && from === relationships.stress);
      case 'growth-line':
        return (selectedType === from && to === relationships.growth) ||
               (selectedType === to && from === relationships.growth);
      default:
        return false;
    }
  };

const getTypeLabelStyle = (typeNumber: number) => ({
    fontFamily: "'niveau-grotesk', sans-serif",
    fontSize: typeNumber === selectedType ? '72px' : '60px',
    fontWeight: typeNumber === selectedType ? '400' : '300',
    fill: isTypeHighlighted(typeNumber as EnneagramType) ? '#000' : '#fff',
    transition: 'all 0.3s ease'
  });
  
  const getTypeNumberStyle = (typeNumber: number) => ({
    fontFamily: "'niveau-grotesk', sans-serif",
    fontSize: typeNumber === selectedType ? '72px' : '60px',
    fontWeight: typeNumber === selectedType ? '400' : '300',
    fill: isTypeHighlighted(typeNumber as EnneagramType) ? '#000' : '#e6e6e6',
    transition: 'all 0.3s ease'
  });

  const getCircleStyle = (typeNumber: number) => ({
    fill: '#fff',
    stroke: isTypeHighlighted(typeNumber as EnneagramType) ? '#000' : '#e6e6e6',
    strokeWidth: typeNumber === selectedType ? '5px' : '3px',
    strokeMiterlimit: 10,
    r: typeNumber === selectedType ? '50' : '42.5',
    transition: 'all 0.3s ease'
  });

  const getLineStyle = (from: EnneagramType, to: EnneagramType) => ({
    ...styles.st4,
    stroke: isConnectionHighlighted(from, to) ? '#000' : '#e6e6e6'
  });

  return (
    <div className="flex flex-col w-full">
      <EnneagramControls
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        variation={variation}
        setVariation={setVariation}
        variations={variations}
      />
      <div className="w-full aspect-square">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          version="1.1" 
          viewBox="0 0 2048 2048"
          className="w-full h-full"
        >
          <defs>
            <path id="textCirclePath" d="M 1024,263.5 A 760.5,760.5 0 1 1 1023.9,263.5 A 760.5,760.5 0 1 1 1024,263.5" />
          </defs>

          {/* Outer Ring */}
          <g id="Outer_Ring">
            <circle style={styles.st3} cx="1024" cy="1024" r="839"/>
            <path 
              id="Grey_Ring" 
              style={styles.st5} 
              d="M1705.77,1024c0,376.84-304.93,681.77-681.77,681.77s-681.77-304.93-681.77-681.77,304.93-681.77,681.77-681.77,681.77,304.93,681.77,681.77ZM1024,185c-463.74,0-839,375.26-839,839s375.26,839,839,839,839-375.26,839-839S1487.74,185,1024,185Z"
            />
          </g>

          {/* Type Names */}
          <g id="Type_Names">
            {[
              { text: 'Peacemaker', angle: 0, type: 9 },
              { text: 'Reformer', angle: 20, type: 1 },
              { text: 'Helper', angle: 40, type: 2 },
              { text: 'Achiever', angle: 60, type: 3 },
              { text: 'Individualist', angle: 80, type: 4 },
              { text: 'Investigator', angle: 100, type: 5 },
              { text: 'Loyalist', angle: 120, type: 6 },
              { text: 'Enthusiast', angle: 140, type: 7 },
              { text: 'Challenger', angle: 160, type: 8 },
              { text: 'Peace', angle: selectedType === 9 ? 176.4 : 177, type: 9 },  // Adjust angle when type 9 is selected
            ].map(({ text, angle, type }) => {
              const needsFlip = angle >= 60 && angle <= 120;
              
              return (
                <text key={text}>
                  <textPath 
                    xlinkHref="#textCirclePath"
                    startOffset={`${((angle % 360) / 360) * 100}%`}
                    style={{
                        ...getTypeLabelStyle(type),
                        textAnchor: 'middle',
                        dominantBaseline: 'central'
                    }}
                  >
                    {needsFlip ? (
                      <tspan rotate="180">
                        {text.split('').reverse().join('')}
                      </tspan>
                    ) : text}
                  </textPath>
                </text>
              );
            })}
          </g>

          {/* Non-highlighted lines rendered first */}
          <g id="Background_Connections">
            {/* Wing Connections */}
            {!isConnectionHighlighted(1, 2) && <path style={getLineStyle(1, 2)} d="M1417.71,554.79 A612.5,612.5 0 0,1 1627.38,917.62"/>}
            {!isConnectionHighlighted(2, 3) && <path style={getLineStyle(2, 3)} d="M1627.38,917.62 A612.5,612.5 0 0,1 1554.52,1330.3"/>}
            {!isConnectionHighlighted(3, 4) && <path style={getLineStyle(3, 4)} d="M1554.52,1330.3 A612.5,612.5 0 0,1 1233.54,1599.71"/>}
            {!isConnectionHighlighted(4, 5) && <path style={getLineStyle(4, 5)} d="M1233.54,1599.71 A612.5,612.5 0 0,1 814.46,1599.71"/>}
            {!isConnectionHighlighted(5, 6) && <path style={getLineStyle(5, 6)} d="M814.46,1599.71 A612.5,612.5 0 0,1 493.48,1330.3"/>}
            {!isConnectionHighlighted(6, 7) && <path style={getLineStyle(6, 7)} d="M493.48,1330.3 A612.5,612.5 0 0,1 420.71,917.62"/>}
            {!isConnectionHighlighted(7, 8) && <path style={getLineStyle(7, 8)} d="M420.71,917.62 A612.5,612.5 0 0,1 630.29,554.79"/>}
            {!isConnectionHighlighted(8, 9) && <path style={getLineStyle(8, 9)} d="M630.29,554.79 A612.5,612.5 0 0,1 1024,411.5"/>}
            {!isConnectionHighlighted(9, 1) && <path style={getLineStyle(9, 1)} d="M1024,411.5 A612.5,612.5 0 0,1 1417.71,554.79"/>}

            {/* Integration/Stress Lines */}
            {!isConnectionHighlighted(1, 4) && <line style={getLineStyle(1, 4)} x1="1417.71" y1="554.79" x2="1233.54" y2="1599.71"/>}
            {!isConnectionHighlighted(1, 7) && <line style={getLineStyle(1, 7)} x1="1417.71" y1="554.79" x2="420.71" y2="917.62"/>}
            {!isConnectionHighlighted(2, 4) && <line style={getLineStyle(2, 4)} x1="1627.38" y1="917.62" x2="1233.54" y2="1599.71"/>}
            {!isConnectionHighlighted(2, 8) && <line style={getLineStyle(2, 8)} x1="1627.38" y1="917.62" x2="630.29" y2="554.79"/>}
            {!isConnectionHighlighted(3, 6) && <line style={getLineStyle(3, 6)} x1="1554.52" y1="1330.3" x2="493.48" y2="1330.3"/>}
            {!isConnectionHighlighted(3, 9) && <line style={getLineStyle(3, 9)} x1="1554.52" y1="1330.3" x2="1024" y2="411.5"/>}
            {!isConnectionHighlighted(4, 1) && <line style={getLineStyle(4, 1)} x1="1233.54" y1="1599.71" x2="1417.71" y2="554.79"/>}
            {!isConnectionHighlighted(4, 2) && <line style={getLineStyle(4, 2)} x1="1233.54" y1="1599.71" x2="1627.38" y2="917.62"/>}
            {!isConnectionHighlighted(5, 7) && <line style={getLineStyle(5, 7)} x1="814.46" y1="1599.71" x2="420.71" y2="917.62"/>}
            {!isConnectionHighlighted(5, 8) && <line style={getLineStyle(5, 8)} x1="814.46" y1="1599.71" x2="630.29" y2="554.79"/>}
            {!isConnectionHighlighted(6, 3) && <line style={getLineStyle(6, 3)} x1="493.48" y1="1330.3" x2="1554.52" y2="1330.3"/>}
            {!isConnectionHighlighted(6, 9) && <line style={getLineStyle(6, 9)} x1="493.48" y1="1330.3" x2="1024" y2="411.5"/>}
            {!isConnectionHighlighted(7, 1) && <line style={getLineStyle(7, 1)} x1="420.71" y1="917.62" x2="1417.71" y2="554.79"/>}
            {!isConnectionHighlighted(7, 5) && <line style={getLineStyle(7, 5)} x1="420.71" y1="917.62" x2="814.46" y2="1599.71"/>}
            {!isConnectionHighlighted(8, 2) && <line style={getLineStyle(8, 2)} x1="630.29" y1="554.79" x2="1627.38" y2="917.62"/>}
            {!isConnectionHighlighted(8, 5) && <line style={getLineStyle(8, 5)} x1="630.29" y1="554.79" x2="814.46" y2="1599.71"/>}
            {!isConnectionHighlighted(9, 3) && <line style={getLineStyle(9, 3)} x1="1024" y1="411.5" x2="1554.52" y2="1330.3"/>}
            {!isConnectionHighlighted(9, 6) && <line style={getLineStyle(9, 6)} x1="1024" y1="411.5" x2="493.48" y2="1330.3"/>}
          </g>

          {/* Highlighted lines rendered last */}
          <g id="Highlighted_Connections">
            {/* Wing Connections */}
            {isConnectionHighlighted(1, 2) && <path style={getLineStyle(1, 2)} d="M1417.71,554.79 A612.5,612.5 0 0,1 1627.38,917.62"/>}
            {isConnectionHighlighted(2, 3) && <path style={getLineStyle(2, 3)} d="M1627.38,917.62 A612.5,612.5 0 0,1 1554.52,1330.3"/>}
            {isConnectionHighlighted(3, 4) && <path style={getLineStyle(3, 4)} d="M1554.52,1330.3 A612.5,612.5 0 0,1 1233.54,1599.71"/>}
            {isConnectionHighlighted(4, 5) && <path style={getLineStyle(4, 5)} d="M1233.54,1599.71 A612.5,612.5 0 0,1 814.46,1599.71"/>}
            {isConnectionHighlighted(5, 6) && <path style={getLineStyle(5, 6)} d="M814.46,1599.71 A612.5,612.5 0 0,1 493.48,1330.3"/>}
            {isConnectionHighlighted(6, 7) && <path style={getLineStyle(6, 7)} d="M493.48,1330.3 A612.5,612.5 0 0,1 420.71,917.62"/>}
            {isConnectionHighlighted(7, 8) && <path style={getLineStyle(7, 8)} d="M420.71,917.62 A612.5,612.5 0 0,1 630.29,554.79"/>}
            {isConnectionHighlighted(8, 9) && <path style={getLineStyle(8, 9)} d="M630.29,554.79 A612.5,612.5 0 0,1 1024,411.5"/>}
            {isConnectionHighlighted(9, 1) && <path style={getLineStyle(9, 1)} d="M1024,411.5 A612.5,612.5 0 0,1 1417.71,554.79"/>}

            {/* Integration/Stress Lines */}
            {isConnectionHighlighted(1, 4) && <line style={getLineStyle(1, 4)} x1="1417.71" y1="554.79" x2="1233.54" y2="1599.71"/>}
            {isConnectionHighlighted(1, 7) && <line style={getLineStyle(1, 7)} x1="1417.71" y1="554.79" x2="420.71" y2="917.62"/>}
            {isConnectionHighlighted(2, 4) && <line style={getLineStyle(2, 4)} x1="1627.38" y1="917.62" x2="1233.54" y2="1599.71"/>}
            {isConnectionHighlighted(2, 8) && <line style={getLineStyle(2, 8)} x1="1627.38" y1="917.62" x2="630.29" y2="554.79"/>}
            {isConnectionHighlighted(3, 6) && <line style={getLineStyle(3, 6)} x1="1554.52" y1="1330.3" x2="493.48" y2="1330.3"/>}
            {isConnectionHighlighted(3, 9) && <line style={getLineStyle(3, 9)} x1="1554.52" y1="1330.3" x2="1024" y2="411.5"/>}
            {isConnectionHighlighted(4, 1) && <line style={getLineStyle(4, 1)} x1="1233.54" y1="1599.71" x2="1417.71" y2="554.79"/>}
            {isConnectionHighlighted(4, 2) && <line style={getLineStyle(4, 2)} x1="1233.54" y1="1599.71" x2="1627.38" y2="917.62"/>}
            {isConnectionHighlighted(5, 7) && <line style={getLineStyle(5, 7)} x1="814.46" y1="1599.71" x2="420.71" y2="917.62"/>}
            {isConnectionHighlighted(5, 8) && <line style={getLineStyle(5, 8)} x1="814.46" y1="1599.71" x2="630.29" y2="554.79"/>}
            {isConnectionHighlighted(6, 3) && <line style={getLineStyle(6, 3)} x1="493.48" y1="1330.3" x2="1554.52" y2="1330.3"/>}
            {isConnectionHighlighted(6, 9) && <line style={getLineStyle(6, 9)} x1="493.48" y1="1330.3" x2="1024" y2="411.5"/>}
            {isConnectionHighlighted(7, 1) && <line style={getLineStyle(7, 1)} x1="420.71" y1="917.62" x2="1417.71" y2="554.79"/>}
            {isConnectionHighlighted(7, 5) && <line style={getLineStyle(7, 5)} x1="420.71" y1="917.62" x2="814.46" y2="1599.71"/>}
            {isConnectionHighlighted(8, 2) && <line style={getLineStyle(8, 2)} x1="630.29" y1="554.79" x2="1627.38" y2="917.62"/>}
            {isConnectionHighlighted(8, 5) && <line style={getLineStyle(8, 5)} x1="630.29" y1="554.79" x2="814.46" y2="1599.71"/>}
            {isConnectionHighlighted(9, 3) && <line style={getLineStyle(9, 3)} x1="1024" y1="411.5" x2="1554.52" y2="1330.3"/>}
            {isConnectionHighlighted(9, 6) && <line style={getLineStyle(9, 6)} x1="1024" y1="411.5" x2="493.48" y2="1330.3"/>}
          </g>

          {/* Type Numbers and Circles (rendered last to be on top) */}
          <g id="Type_Numbers_And_Circles">
            {/* Circles */}
            <g id="Circles">
              <circle style={getCircleStyle(9)} cx="1024" cy="411.5" r={selectedType === 9 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(8)} cx="630.29" cy="554.79" r={selectedType === 8 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(7)} cx="420.71" cy="917.62" r={selectedType === 7 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(6)} cx="493.48" cy="1330.3" r={selectedType === 6 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(5)} cx="814.46" cy="1599.71" r={selectedType === 5 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(4)} cx="1233.54" cy="1599.71" r={selectedType === 4 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(3)} cx="1554.52" cy="1330.3" r={selectedType === 3 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(2)} cx="1627.38" cy="917.62" r={selectedType === 2 ? "50" : "42.5"}/>
              <circle style={getCircleStyle(1)} cx="1417.71" cy="554.79" r={selectedType === 1 ? "50" : "42.5"}/>
            </g>

            {/* Numbers */}
            <g id="Numbers">
                {[
                    { num: 9, cx: 1024, cy: 411.5 },
                    { num: 8, cx: 630.29, cy: 554.79 },
                    { num: 7, cx: 420.71, cy: 917.62 },
                    { num: 6, cx: 493.48, cy: 1330.3 },
                    { num: 5, cx: 814.46, cy: 1599.71 },
                    { num: 4, cx: 1233.54, cy: 1599.71 },
                    { num: 3, cx: 1554.52, cy: 1330.3 },
                    { num: 2, cx: 1627.38, cy: 917.62 },
                    { num: 1, cx: 1417.71, cy: 554.79 }
                ].map(({ num, cx, cy }) => (
                    <text 
                        key={num}
                        style={getTypeNumberStyle(num)}
                        transform={
                            num === selectedType
                                ? `translate(${cx} ${cy})`  // Center in the type's circle
                                : `translate(${
                                    // Original positions
                                    num === 9 ? "1007.56 430.25" :
                                    num === 8 ? "614.45 573.54" :
                                    num === 7 ? "408.68 936.37" :
                                    num === 6 ? "477.04 1349.05" :
                                    num === 5 ? "799.73 1618.46" :
                                    num === 4 ? "1217.49 1618.46" :
                                    num === 3 ? "1540.57 1349.05" :
                                    num === 2 ? "1613.67 936.37" :
                                    "1404.27 573.54"  // num === 1
                                })`
                        }
                        textAnchor={num === selectedType ? "middle" : "start"}
                        dominantBaseline={num === selectedType ? "central" : "auto"}
                        dy={num === selectedType ? "-0.025em" : "0"}  // Fine-tune vertical centering for selected numbers
                    >
                        {num}
                    </text>
                ))}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default InteractiveEnneagramDiagram;
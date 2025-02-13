import React from 'react';

const EnneagramDiagram = () => {
  // Define the styles from the original SVG
  // Import Niveau Grotesk font
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
        fontFamily: "'niveau-grotesk', sans-serif", // Correct name
        fontSize: '60px',
        fontWeight: 300
      },
    st8: { display: 'none' }
};

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        version="1.1" 
        viewBox="0 0 2048 2048"
        className="w-full h-full"
      >
        <defs>
          {/* Paths for text curves */}
          <path id="path" d="M1784.5,1024.27c-.15,420.35-340.41,760.38-760.76,760.23-420.35-.15-760.38-340.41-760.23-760.76.15-420.35,340.41-760.38,760.76-760.23,420.35.15,760.38,340.41,760.23,760.76Z"/>
          <path id="path1" d="M1784.49,1020.28c2.05,420.35-336.43,762.15-756.78,764.21-420.35,2.05-762.15-336.43-764.21-756.78-2.05-420.35,336.43-762.15,756.78-764.21,420.35-2.05,762.15,336.43,764.21,756.78Z"/>
          <path id="path2" d="M1784.46,1016.3c4.26,420.33-332.43,763.9-752.76,768.16-420.33,4.26-763.9-332.43-768.16-752.76-4.26-420.33,332.43-763.9,752.76-768.16,420.33-4.26,763.9,332.43,768.16,752.76Z"/>
          <path id="path3" d="M1784.49,1019.49c-2.49-420.35-344.65-758.47-765-755.97-420.35,2.49-758.47,344.65-755.97,765,2.49,420.35,344.65,758.47,765,755.97,420.35-2.49,758.47-344.65,755.97-765Z"/>
          <path id="path4" d="M1784.5,1022.21c-.99-420.35-341.94-759.7-762.29-758.71-420.35.99-759.7,341.94-758.71,762.29.99,420.35,341.94,759.7,762.29,758.71,420.35-.99,759.7-341.94,758.71-762.29Z"/>
          <path id="path5" d="M1784.5,1025.86c1.03-420.35-338.29-761.33-758.64-762.36-420.35-1.03-761.33,338.29-762.36,758.64-1.03,420.35,338.29,761.33,758.64,762.36,420.35,1.03,761.33-338.29,762.36-758.64Z"/>
          <path id="path6" d="M1784.49,1028.65c2.57-420.35-335.49-762.56-755.84-765.13-420.35-2.57-762.56,335.49-765.13,755.84-2.57,420.35,335.49,762.56,755.84,765.13,420.35,2.57,762.56-335.49,765.13-755.84Z"/>
          <path id="path7" d="M1784.47,1030.37c-3.52,420.34-346.5,757.62-766.84,754.1-420.34-3.52-757.62-346.5-754.1-766.84,3.52-420.34,346.5-757.62,766.84-754.1,420.34,3.52,757.62,346.5,754.1,766.84Z"/>
          <path id="path8" d="M1784.48,1029.11c-2.82,420.34-345.25,758.2-765.59,755.37-420.34-2.82-758.2-345.25-755.37-765.59,2.82-420.34,345.25-758.2,765.59-755.37,420.34,2.82,758.2,345.25,755.37,765.59Z"/>
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
        <defs>
            <path
            id="textCirclePath"
            d="M 1024,263.5 A 760.5,760.5 0 1 1 1023.9,263.5 A 760.5,760.5 0 1 1 1024,263.5"
            />
        </defs>
        
        {[
            { text: 'Peacemaker', angle: 0 },
            { text: 'Reformer', angle: 20 },
            { text: 'Helper', angle: 40 },
            { text: 'Achiever', angle: 60 },
            { text: 'Individualist', angle: 80 },
            { text: 'Investigator', angle: 100 },
            { text: 'Loyalist', angle: 120 },
            { text: 'Enthusiast', angle: 140 },
            { text: 'Challenger', angle: 160},
            { text: 'Peace', angle: 177},
        ].map(({ text, angle }) => {
            const needsFlip = angle >= 60 && angle <= 120;
            
            return (
            <text key={text}>
                <textPath 
                xlinkHref="#textCirclePath"
                startOffset={`${((angle % 360) / 360) * 100}%`}
                style={{
                    ...styles.st7,
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

        {/* Symbol Group */}
        <g id="Symbol">
          {/* Hexad */}
          <g id="Hexad">
            <line style={styles.st4} x1="420.5" y1="917.5" x2="1417.5" y2="554.5"/>
            <line style={styles.st4} x1="814.5" y1="1599.5" x2="420.5" y2="917.5"/>
            <line style={styles.st4} x1="630.5" y1="554.5" x2="814.5" y2="1599.5"/>
            <line style={styles.st4} x1="1627.5" y1="917.5" x2="630.5" y2="554.5"/>
            <line style={styles.st4} x1="1233.5" y1="1599.5" x2="1627.5" y2="917.5"/>
            <line style={styles.st4} x1="1417.5" y1="554.5" x2="1233.5" y2="1599.5"/>
          </g>

          {/* Circle */}
          <g id="Circle">
            <path style={styles.st4} d="M630.28,554.79c106.46-89.43,243.8-143.29,393.72-143.29"/>
            <path style={styles.st4} d="M420.7,917.62c25.36-144.81,101.58-272.12,209.58-362.84"/>
            <path style={styles.st4} d="M493.47,1330.3c-52.13-90.1-81.97-194.72-81.97-306.3,0-36.28,3.15-71.83,9.2-106.38"/>
            <path style={styles.st4} d="M814.46,1599.72c-135.97-49.5-249.46-145.8-320.98-269.42"/>
            <path style={styles.st4} d="M1233.54,1599.72c-65.37,23.8-135.94,36.78-209.54,36.78s-144.17-12.98-209.54-36.78"/>
            <path style={styles.st4} d="M1554.53,1330.3c-71.52,123.62-185.01,219.92-320.98,269.42"/>
            <path style={styles.st4} d="M1627.3,917.62c6.05,34.55,9.2,70.09,9.2,106.38,0,111.58-29.84,216.2-81.97,306.3"/>
            <path style={styles.st4} d="M1417.72,554.79c108,90.71,184.22,218.02,209.58,362.84"/>
            <path style={styles.st4} d="M1024,411.5c149.92,0,287.25,53.86,393.72,143.29"/>
            <circle style={styles.st0} cx="1024" cy="1024" r="612.5"/>
          </g>

          {/* Triangle */}
          <g id="Triangle">
            <line style={styles.st4} x1="1023.5" y1="411.5" x2="1554.5" y2="1330.5"/>
            <line style={styles.st4} x1="493.5" y1="1330.5" x2="1554.5" y2="1330.5"/>
            <line style={styles.st4} x1="1023.5" y1="411.5" x2="493.5" y2="1330.5"/>
          </g>

          {/* Type Numbers */}
          <g id="Type_Numbers">
            {/* Circles */}
            <g id="Circles">
              <circle style={styles.st6} cx="1024" cy="411.5" r="42.5"/>
              <circle style={styles.st6} cx="630.29" cy="554.79" r="42.5"/>
              <circle style={styles.st6} cx="420.71" cy="917.62" r="42.5"/>
              <circle style={styles.st6} cx="493.48" cy="1330.3" r="42.5"/>
              <circle style={styles.st6} cx="814.46" cy="1599.71" r="42.5"/>
              <circle style={styles.st6} cx="1233.54" cy="1599.71" r="42.5"/>
              <circle style={styles.st6} cx="1554.52" cy="1330.3" r="42.5"/>
              <circle style={styles.st6} cx="1627.38" cy="917.62" r="42.5"/>
              <circle style={styles.st6} cx="1417.71" cy="554.79" r="42.5"/>
            </g>

            {/* Numbers */}
            <g id="Numbers">
              <text style={styles.st7} transform="translate(1007.56 430.25)">9</text>
              <text style={styles.st7} transform="translate(614.45 573.54)">8</text>
              <text style={styles.st7} transform="translate(408.68 936.37)">7</text>
              <text style={styles.st7} transform="translate(477.04 1349.05)">6</text>
              <text style={styles.st7} transform="translate(799.73 1618.46)">5</text>
              <text style={styles.st7} transform="translate(1217.49 1618.46)">4</text>
              <text style={styles.st7} transform="translate(1540.57 1349.05)">3</text>
              <text style={styles.st7} transform="translate(1613.67 936.37)">2</text>
              <text style={styles.st7} transform="translate(1404.27 573.54)">1</text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default EnneagramDiagram;


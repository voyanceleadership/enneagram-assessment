import React from 'react';

interface ResultsPDFProps {
  userInfo: {
    firstName: string;
    lastName: string;
    submissionDate: string;
  };
  scores: Record<string, number>;
  analysis: string;
}

const ResultsPDFTemplate: React.FC<ResultsPDFProps> = ({ userInfo, scores, analysis }) => {
  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.5' }}>
      {/* Cover Page */}
      <section style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Discovering Your Personality Type</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
          with the Voyance Enneagram Assessment
        </h2>
        <p style={{ fontSize: '1rem', color: '#555' }}>
          Copyright © 2024 Raena Hubbell
          <br />
          www.voyanceleadership.com
        </p>
      </section>

      {/* Results Page */}
      <section>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Enneagram Assessment Results</h2>
        <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
        <p><strong>Date:</strong> {userInfo.submissionDate}</p>
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Type</th>
              <th style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #ccc' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map(([type, score]) => (
              <tr key={type}>
                <td style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>
                  {`Type ${type}: ${getTypeName(type)}`}
                </td>
                <td style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #ccc' }}>
                  {score.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '20px' }}>
          Thank you for taking the Voyance Enneagram Assessment! We hope you enjoyed this process of self-reflection.
        </p>
      </section>

      {/* Analysis Page */}
      <section style={{ marginTop: '40px', pageBreakBefore: 'always' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Analysis</h2>
        <div dangerouslySetInnerHTML={{ __html: analysis }} style={{ fontSize: '1rem', color: '#333' }} />
      </section>
    </div>
  );
};

function getTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    '1': 'The Reformer',
    '2': 'The Helper',
    '3': 'The Achiever',
    '4': 'The Individualist',
    '5': 'The Investigator',
    '6': 'The Loyalist',
    '7': 'The Enthusiast',
    '8': 'The Challenger',
    '9': 'The Peacemaker',
  };
  return typeNames[type] || 'Unknown';
}

export default ResultsPDFTemplate;
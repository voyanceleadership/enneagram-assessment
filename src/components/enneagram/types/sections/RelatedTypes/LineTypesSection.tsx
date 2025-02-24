// src/components/enneagram/types/sections/RelatedTypes/LineTypesSection.tsx

import React from 'react';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../../symbol/DynamicEnneagramSymbol';
import Link from 'next/link';

interface LineTypesSectionProps {
  typeDigit: string;
  sectionColor: string;
  lineTypes: {
    stress: {
      number: string;
      name: string;
      description: string;
      dynamics: {
        healthy: string;
        average: string;
        unhealthy: string;
      };
    };
    growth: {
      number: string;
      name: string;
      description: string;
      dynamics: {
        healthy: string;
        average: string;
        unhealthy: string;
      };
    };
  };
}

export default function LineTypesSection({
  typeDigit,
  sectionColor,
  lineTypes
}: LineTypesSectionProps) {
  // Helper for styled button links
  const StyledButtonLink = ({ typeNumber, typeName }: { typeNumber: string, typeName: string }) => (
    <Link
      href={`/enneagram/types/type${typeNumber}`}
      className="inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors"
      style={{ 
        backgroundColor: theme.colors.primary,
        color: 'white',
        fontFamily: theme.fonts.heading,
        fontWeight: theme.fontWeights.medium,
        textDecoration: 'none' // Remove underline
      }}
    >
      Learn more about Type {typeNumber}: {typeName}
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Line Types Introduction */}
      <Card className="bg-white shadow-md border-0">
        <div className="p-6 prose prose-gray max-w-none">
          <h3 className="text-xl font-medium mb-4" style={{ color: sectionColor }}>
            Line Types
          </h3>
          <p>
            The types connected to your type by a line across the circle are referred to as your line types. The
            characteristics of these two types may tend to show up in your personality in certain situations. Most
            commonly, the traits of these related types will show up when you're at your very best or under
            significant stress.
          </p>
          <p>
            When you display traits, behaviors, or thought patterns of your line types, it's called "going along your
            line." When you go along one of your lines, you demonstrate the behavior of your line type that aligns 
            with your current level of functioning.
          </p>
        </div>
      </Card>

      {/* Stress Line Card */}
      <div id="section-stress-line" data-subsection-id="stress-line">
        <Card className="bg-white shadow-md border-0">
          <div className="p-6 prose prose-gray max-w-none">
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                Line to Type {lineTypes.stress.number}: {lineTypes.stress.name}
              </h4>
              <div className="w-2/3 mx-auto mb-6">
                <DynamicEnneagramSymbol 
                  defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
                  defaultVariation="stress-line"
                  interactive={false}
                />
              </div>
              <div className="text-left mb-8">
                <p className="text-base" style={{ color: theme.colors.text }}>
                  {lineTypes.stress.description}
                </p>
              </div>
              
              {/* Line Type Details */}
              <div className="text-left space-y-6 mb-8">
                <div>
                  <h5 className="text-xl mb-4" style={{ color: theme.colors.accent1, fontWeight: theme.fontWeights.medium }}>
                    Healthy Level
                  </h5>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{lineTypes.stress.dynamics.healthy}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xl mb-4" style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.medium }}>
                    Average Level
                  </h5>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{lineTypes.stress.dynamics.average}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xl mb-4" style={{ color: theme.colors.accent2, fontWeight: theme.fontWeights.medium }}>
                    Unhealthy Level
                  </h5>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{lineTypes.stress.dynamics.unhealthy}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <StyledButtonLink
                  typeNumber={lineTypes.stress.number}
                  typeName={lineTypes.stress.name}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Line Card */}
      <div id="section-growth-line" data-subsection-id="growth-line">
        <Card className="bg-white shadow-md border-0">
          <div className="p-6 prose prose-gray max-w-none">
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                Line to Type {lineTypes.growth.number}: {lineTypes.growth.name}
              </h4>
              <div className="w-2/3 mx-auto mb-6">
                <DynamicEnneagramSymbol 
                  defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
                  defaultVariation="growth-line"
                  interactive={false}
                />
              </div>
              <div className="text-left mb-8">
                <p className="text-base" style={{ color: theme.colors.text }}>
                  {lineTypes.growth.description}
                </p>
              </div>
              
              {/* Line Type Details */}
              <div className="text-left space-y-6 mb-8">
                <div>
                  <h5 className="text-xl mb-4" style={{ color: theme.colors.accent1, fontWeight: theme.fontWeights.medium }}>
                    Healthy Level
                  </h5>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{lineTypes.growth.dynamics.healthy}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xl mb-4" style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.medium }}>
                    Average Level
                  </h5>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{lineTypes.growth.dynamics.average}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xl mb-4" style={{ color: theme.colors.accent2, fontWeight: theme.fontWeights.medium }}>
                    Unhealthy Level
                  </h5>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{lineTypes.growth.dynamics.unhealthy}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <StyledButtonLink
                  typeNumber={lineTypes.growth.number}
                  typeName={lineTypes.growth.name}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
// src/components/enneagram/types/sections/RelatedTypes/WingTypesSection.tsx

import React from 'react';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../../symbol/DynamicEnneagramSymbol';
import Link from 'next/link';
import { WingTypeDetails } from './WingTypeDetails';

interface WingTypesSectionProps {
  typeDigit: string;
  sectionColor: string;
  wingTypes: {
    left: {
      number: string;
      name: string;
      data: any;
    };
    right: {
      number: string;
      name: string;
      data: any;
    };
  };
}

export default function WingTypesSection({
  typeDigit,
  sectionColor,
  wingTypes
}: WingTypesSectionProps) {
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
      {/* Wing Types Introduction */}
      <Card className="bg-white shadow-md border-0">
        <div className="p-6 prose prose-gray max-w-none">
          <h3 className="text-xl font-medium mb-4" style={{ color: sectionColor }}>
            Wing Types
          </h3>
          <p>
            The types adjacent to your type on the circle (its "next-door neighbors") are referred to as your
            potential wing types. A wing type can be thought of as a secondary personality type. While your dominant Enneagram
            type drives most of your behavior, you might also relate strongly to many of the aspects of one (or
            both) of these neighboring types.
          </p>
          <p>
            Most people have one wing type, but it's also possible to have both wing types or no wing type.
            Your wing type may show up as one of your top two scores on the assessment, but it doesn't always.
            We encourage you to evaluate how much you resonate with each of your potential wing types
            subjectively.
          </p>
        </div>
      </Card>

      {/* Left Wing Card */}
      <div id="section-left-wing" data-subsection-id="left-wing">
        <Card className="bg-white shadow-md border-0">
          <div className="p-6 prose prose-gray max-w-none">
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                Type {wingTypes.left.number}: {wingTypes.left.name}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {wingTypes.left.data?.alias}
              </p>
              <div className="w-2/3 mx-auto mb-6">
                <DynamicEnneagramSymbol 
                  defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
                  defaultVariation="left-wing"
                  interactive={false}
                />
              </div>
              <div className="text-left mb-8">
                <p className="text-base" style={{ color: theme.colors.text }}>
                  {wingTypes.left.data?.description}
                </p>
              </div>
              
              {/* Wing Type Details */}
              <div className="text-left mb-8">
                <WingTypeDetails details={{
                  personality: wingTypes.left.data?.combination.personality,
                  strengths: wingTypes.left.data?.combination.strengths,
                  challenges: wingTypes.left.data?.combination.challenges
                }} />
              </div>
              
              <div className="mb-3">
                <StyledButtonLink
                  typeNumber={wingTypes.left.number}
                  typeName={wingTypes.left.name}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Wing Card */}
      <div id="section-right-wing" data-subsection-id="right-wing">
        <Card className="bg-white shadow-md border-0">
          <div className="p-6 prose prose-gray max-w-none">
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                Type {wingTypes.right.number}: {wingTypes.right.name}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {wingTypes.right.data?.alias}
              </p>
              <div className="w-2/3 mx-auto mb-6">
                <DynamicEnneagramSymbol 
                  defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
                  defaultVariation="right-wing"
                  interactive={false}
                />
              </div>
              <div className="text-left mb-8">
                <p className="text-base" style={{ color: theme.colors.text }}>
                  {wingTypes.right.data?.description}
                </p>
              </div>
              
              {/* Wing Type Details */}
              <div className="text-left mb-8">
                <WingTypeDetails details={{
                  personality: wingTypes.right.data?.combination.personality,
                  strengths: wingTypes.right.data?.combination.strengths,
                  challenges: wingTypes.right.data?.combination.challenges
                }} />
              </div>
              
              <div className="mb-3">
                <StyledButtonLink
                  typeNumber={wingTypes.right.number}
                  typeName={wingTypes.right.name}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
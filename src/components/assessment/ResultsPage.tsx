// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  Mail, 
  Target, 
  Binary,
  GitCompare,
  Sprout,
  AlertCircle, 
  ChevronDown,
  GitCompareArrows,
} from 'lucide-react';
import EmailDialog from './EmailDialog';
import PrimaryResults from './PrimaryResults';
import Analysis from '@/components/assessment/analysis';
import { theme, styleUtils } from '@/styles/theme';
import InterpretationCard from './InterpretationCard';
import Link from 'next/link';
import AssessmentNavbar from '@/components/assessment/AssessmentNavbar';
import { useRouter } from 'next/navigation';

// Define TypeData interface for Enneagram type information
interface TypeData {
  number: string;
  name: string;
  briefDescription: string;
  topPriority: string;
  secondaryDesires: string[];
  biggestFear: string;
  secondaryFears: string[];
  atTheirBest: string;
  underStress: string;
  wakeUpCall: string;
  mentalHabit: string;
  fundamentalFlaw: string;
  falseNarrative: string;
  keyToGrowth: string;
  sections: {
    shortDescription: string;
    longDescription: string;
    mightBeType: string[];
    probablyNotType: string[];
    levelsOfDevelopment: {
      healthy: string[];
      average: string[];
      unhealthy: string[];
    };
    commonMisconceptions: string[];
    commonMisidentifications: string;
    relatedTypes: {
      wings: Record<string, string>;
      lines: Record<string, string>;
    };
    growthPractices: string[];
    famousExamples: string[];
  };
}

// Interface for analysis section props
interface AnalysisSection {
  title: string;
  icon: React.ReactNode;
  content: string;
}

// Constants for Enneagram type names
const TYPE_NAMES = {
  '1': 'Type 1: The Reformer',
  '2': 'Type 2: The Helper',
  '3': 'Type 3: The Achiever',
  '4': 'Type 4: The Individualist',
  '5': 'Type 5: The Investigator',
  '6': 'Type 6: The Loyalist',
  '7': 'Type 7: The Enthusiast',
  '8': 'Type 8: The Challenger',
  '9': 'Type 9: The Peacemaker'
};

// Footer component that appears when types are selected for comparison
const TypeSelectionFooter = ({ selectedTypes, onTypeSelect }) => {
  const router = useRouter();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p 
              className="text-sm mb-1"
              style={styleUtils.bodyStyles}
            >
              {selectedTypes.length === 0 
                ? "Check the box for up to 3 types to compare them side-by-side"
                : `${selectedTypes.length} ${selectedTypes.length === 1 ? 'type' : 'types'} selected`
              }
            </p>
            <div className="flex gap-2">
              {selectedTypes.map(type => (
                <span
                  key={type}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.colors.primary}10`,
                    color: theme.colors.primary
                  }}
                >
                  Type {type}
                </span>
              ))}
            </div>
          </div>
          <Button
            onClick={() => router.push(`/enneagram/compare?types=${selectedTypes.join(',')}`)}
            disabled={selectedTypes.length === 0}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <GitCompareArrows className="h-4 w-4 mr-2" />
            Compare Types
          </Button>
        </div>
      </div>
    </div>
  );
};

// Component for displaying individual type cards with expansion functionality
const ExpandableTypeCard = ({ type, score, typeData, isSelected, onSelect, disabled, isComparing }) => {
  const [isExpanded, setIsExpanded] = useState(false);
 
  return (
    <div className="relative">
      {/* Checkbox for type comparison - only visible in comparison mode */}
      {isComparing && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6">
          <Checkbox
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled || isSelected) {
                onSelect(type);
              }
            }}
            disabled={disabled && !isSelected}
          />
        </div>
      )}
      <div 
        className={`bg-white rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-50 cursor-pointer
          ${isExpanded ? 'shadow-md' : 'shadow-sm'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          borderLeft: `4px solid ${theme.colors.accent3}`,
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span 
              className="text-lg"
              style={styleUtils.bodyStyles}
            >
              {TYPE_NAMES[type]}
            </span>
            <div className="flex items-center gap-4">
              <span 
                className="text-lg font-medium"
                style={styleUtils.headingStyles}
              >
                {Math.round(score)}
              </span>
              <ChevronDown 
                className={`h-5 w-5 text-gray-400 transition-transform duration-300
                  ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          </div>
          <div 
            className={`grid transition-all duration-300 ease-in-out
              ${isExpanded ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <div className="pt-4 border-t border-gray-100">
                <p 
                  className="text-gray-600 mb-3 leading-relaxed"
                  style={styleUtils.bodyStyles}
                >
                  {typeData?.briefDescription}
                </p>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto hover:text-primary/80 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  asChild
                >
                  <Link href={`/enneagram/types/type${type}`}>
                    Learn more about Type {type}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying analysis sections with icons
const AnalysisSectionCard = ({ section }: { section: AnalysisSection }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div 
          className="rounded-full p-2 mt-1 flex-shrink-0" 
          style={{ backgroundColor: `${theme.colors.accent1}10` }}
        >
          {section.icon}
        </div>
        <div className="flex-1">
          <h3 
            className="text-xl mb-4"
            style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
          >
            {section.title}
          </h3>
          <div
            className="prose max-w-none text-gray-600"
            style={styleUtils.bodyStyles}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main ResultsPage component
export default function ResultsPage({
  userInfo,
  analysis,
  isAnalyzing,
  analysisTimedOut,
  sortedResults,
  onBack,
  assessmentId,
  onSendEmail,
  isSendingEmail,
  emailSent,
  emailError,
  typesData
}: {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  analysis: string;
  isAnalyzing: boolean;
  analysisTimedOut: boolean;
  sortedResults: [string, number][];
  onBack: () => void;
  assessmentId: string;
  onSendEmail: (emails?: string[], message?: string) => void;
  isSendingEmail: boolean;
  emailSent: boolean;
  emailError: string | null;
  typesData: Record<string, TypeData>;
}) {
  // State management
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Handler for type selection in comparison mode
  const handleTypeSelect = (type: string) => {
    setSelectedTypes(current => {
      if (current.includes(type)) {
        return current.filter(t => t !== type);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, type];
    });
  };

  // Function to handle PDF generation and download
  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    
    try {
      const response = await fetch('/api/assessment/results/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo,
          scores: Object.fromEntries(sortedResults),
          analysis
        })
      });
    
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enneagram-assessment-${userInfo.firstName.toLowerCase()}-${userInfo.lastName.toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Return the JSX for the ResultsPage component
  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: theme.colors.background }}>
      {/* Top navigation bar */}
      <AssessmentNavbar />

      {/* Main content container */}
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Title Card - Shows the main heading */}
        <Card className="overflow-hidden">
          <CardContent className="pt-8 pb-10 px-16 text-center">
            <h1 
              className="text-4xl mb-6"
              style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
            >
              Enneagram Assessment Results
            </h1>
            <p
              className="text-lg"
              style={{ ...styleUtils.bodyStyles, color: theme.colors.text }}
            >
              Based on your scores, your primary type is most likely...
            </p>
          </CardContent>
        </Card>

        {/* Primary Results Card - Shows main type result */}
        <Card className="overflow-hidden">
          <CardContent className="py-12 px-16">
            <PrimaryResults 
              sortedResults={sortedResults} 
              accentColor={theme.colors.accent1}
              typesData={typesData}
            />
          </CardContent>
        </Card>

        {/* Interpretation Guide Card */}
        <InterpretationCard />

        {/* Scores Card - Shows all type scores and comparison functionality */}
        <Card className="overflow-hidden">
          <CardContent className="pt-8 pb-10 px-16">
            <div className="space-y-8">
              {/* Header section with title and actions */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 
                    className="text-2xl mb-1"
                    style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
                  >
                    Your Scores
                  </h2>
                  {/* Comparison toggle section */}
                  <div className="flex items-center gap-3">
                    <p
                      className="text-sm text-gray-600"
                      style={styleUtils.bodyStyles}
                    >
                      Want to compare different types?
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setIsComparing(prev => !prev)}
                      className="text-primary p-0 h-auto text-sm hover:text-primary/80"
                    >
                      {isComparing ? 'Cancel Comparison' : 'Compare Types'}
                    </Button>
                  </div>
                </div>
                {/* Action buttons for sharing and downloading */}
                <div className="flex gap-4">
                  {!isAnalyzing && analysis && !analysisTimedOut && (
                    <Button
                      onClick={() => setIsEmailDialogOpen(true)}
                      disabled={isSendingEmail}
                      className="bg-primary hover:bg-primary/90 text-white px-6"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {isSendingEmail ? 'Sending...' : 'Share Results'}
                    </Button>
                  )}
                  {(!isAnalyzing || analysisTimedOut) && (
                    <Button
                      onClick={downloadPDF}
                      disabled={isGeneratingPDF}
                      className="bg-primary hover:bg-primary/90 text-white px-6"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                    </Button>
                  )}
                </div>
              </div>

              {/* List of type cards */}
              <div className="grid gap-3 mt-8">
                {sortedResults.map(([type, score]) => (
                  <ExpandableTypeCard
                    key={type}
                    type={type}
                    score={score}
                    typeData={typesData[type]}
                    isSelected={selectedTypes.includes(type)}
                    onSelect={handleTypeSelect}
                    disabled={selectedTypes.length >= 3 && !selectedTypes.includes(type)}
                    isComparing={isComparing}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Section - Shows AI-generated analysis */}
        <Analysis 
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          theme={theme}
          styleUtils={styleUtils}
        />

        {/* Error alerts */}
        {(pdfError || emailError) && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {pdfError || emailError}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Email sharing dialog */}
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        defaultEmail={userInfo.email}
        onSendEmail={async (emails, message) => {
          await onSendEmail(emails, message);
          setIsEmailDialogOpen(false);
        }}
        isSending={isSendingEmail}
      />

      {/* Type comparison footer - Only shows when comparing and types are selected */}
      {isComparing && selectedTypes.length > 0 && (
        <TypeSelectionFooter
          selectedTypes={selectedTypes}
          onTypeSelect={handleTypeSelect}
        />
      )}
    </div>
  );
}
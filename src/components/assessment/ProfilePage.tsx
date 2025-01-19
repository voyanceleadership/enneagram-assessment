'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit2, Share2, ChevronRight, AlertCircle } from 'lucide-react';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/types/types';

interface TypeSelectionData {
  id: string;
  userId: string;
  selectedType: string;
  createdAt: string;
  updatedAt: string;
}

const ProfileSetup = ({ 
  onComplete, 
  typesData 
}: { 
  onComplete: (type: string) => Promise<void>;
  typesData: Record<string, TypeData>;
}) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onComplete(selectedType);
    } catch (err) {
      setError('Failed to save your selection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Select Your Enneagram Type",
      content: (
        <div className="space-y-6">
          <p style={styleUtils.bodyStyles}>
            Take time to reflect on what resonates most with you. Your Enneagram type
            reflects your core motivations and patterns, not just your behaviors.
          </p>
          <Button 
            onClick={() => setStep(2)}
            className="w-full md:w-auto"
          >
            Begin Selection
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    {
      title: "Choose Your Type",
      content: (
        <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your type is based on your core motivations, fears, and desires.
              Consider what drives you at a deep level.
            </AlertDescription>
          </Alert>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4">
            {Object.entries(typesData).map(([number, typeInfo]) => (
              <button
                key={number}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedType === number 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setSelectedType(number)}
              >
                <h3 
                  className="text-lg mb-2"
                  style={styleUtils.headingStyles}
                >
                  Type {number}: {typeInfo.name}
                </h3>
                <p 
                  className="text-gray-600"
                  style={styleUtils.bodyStyles}
                >
                  {typeInfo.briefDescription}
                </p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!selectedType || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Confirm Selection'}
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 
          className="text-2xl"
          style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
        >
          {steps[step - 1].title}
        </h2>
      </CardHeader>
      <CardContent>
        {steps[step - 1].content}
      </CardContent>
    </Card>
  );
};

const ProfileView = ({ 
  selectedType,
  typeData,
  onEdit 
}: { 
  selectedType: string;
  typeData: TypeData;
  onEdit: () => void;
}) => {
  const prioritySection = typeData.sections.find(
    section => section.title === 'Priority'
  );
  const wantsSection = typeData.sections.find(
    section => section.title === 'Wants'
  );
  const fearsSection = typeData.sections.find(
    section => section.title === 'Fears'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 
            className="text-2xl"
            style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
          >
            My Enneagram Profile
          </h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 hover:bg-primary/5"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Change Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 hover:bg-primary/5"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 
              className="text-xl mb-4"
              style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
            >
              Type {selectedType}: {typeData.name}
            </h3>
            <div 
              className="space-y-4"
              style={styleUtils.bodyStyles}
            >
              <p className="text-gray-600">
                {typeData.briefDescription}
              </p>
              
              {prioritySection && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 
                    className="text-lg mb-2"
                    style={styleUtils.headingStyles}
                  >
                    Core Priority
                  </h4>
                  <p className="text-gray-600">{prioritySection.content}</p>
                </div>
              )}

              {wantsSection && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 
                    className="text-lg mb-2"
                    style={styleUtils.headingStyles}
                  >
                    Key Motivations
                  </h4>
                  <div 
                    className="prose prose-gray max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: wantsSection.content }}
                  />
                </div>
              )}

              {fearsSection && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 
                    className="text-lg mb-2"
                    style={styleUtils.headingStyles}
                  >
                    Core Fears
                  </h4>
                  <div 
                    className="prose prose-gray max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: fearsSection.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProfilePage() {
    const [selectedTypeData, setSelectedTypeData] = useState<TypeSelectionData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [typesData, setTypesData] = useState<Record<string, TypeData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // Load both types data and user's selection
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch types data
          const typesResponse = await fetch('/api/types');
          const typesResult = await typesResponse.json();
          if (typesResult.success) {
            setTypesData(typesResult.data);
          }
  
          // Fetch user's type selection
          const selectionResponse = await fetch('/api/profile/type-selection');
          const selectionResult = await selectionResponse.json();
          if (selectionResult.success && selectionResult.data) {
            setSelectedTypeData(selectionResult.data);
          }
        } catch (err) {
          console.error('Error loading data:', err);
          setError('Failed to load profile data');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleTypeSelection = async (type: string) => {
      try {
        const response = await fetch('/api/profile/type-selection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedType: type }),
        });
  
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error);
        }
  
        setSelectedTypeData(result.data);
        setIsEditing(false);
      } catch (err) {
        console.error('Error saving type selection:', err);
        throw err; // Let the ProfileSetup component handle the error
      }
    };
  
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
  
    if (isLoading) {
      return (
        <div className="text-center py-8">Loading...</div>
      );
    }
  
    if (!selectedTypeData?.selectedType || isEditing) {
      return (
        <ProfileSetup 
          onComplete={handleTypeSelection}
          typesData={typesData}
        />
      );
    }
  
    return (
      <ProfileView
        selectedType={selectedTypeData.selectedType}
        typeData={typesData[selectedTypeData.selectedType]}
        onEdit={() => setIsEditing(true)}
      />
    );
  }
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfilePage from '@/components/assessment/ProfilePage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TypeData {
  number: string;
  name: string;
  briefDescription: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export default function Profile() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [typesData, setTypesData] = useState<Record<string, TypeData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch types data
  useEffect(() => {
    const loadTypesData = async () => {
      try {
        const response = await fetch('/api/types');
        const data = await response.json();
        if (data.success) {
          setTypesData(data.data);
        } else {
          console.error('Failed to load types data:', data.error);
          setError('Failed to load type information');
        }
      } catch (error) {
        console.error('Error loading types data:', error);
        setError('Failed to load type information');
      } finally {
        setIsLoading(false);
      }
    };
  
    loadTypesData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          Loading profile data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProfilePage
          typesData={typesData}
        />
      </div>
    </div>
  );
}
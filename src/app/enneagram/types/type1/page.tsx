'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { theme, styleUtils } from '@/styles/theme';

const AssessmentNavbar = () => {
  const pathname = usePathname();

  const getNavigation = () => {
    if (pathname.includes('/enneagram/types/')) {
      return {
        backLink: {
          href: '/assessment/results',
          text: 'Back to Results'
        }
      };
    }
    if (pathname === '/assessment/results') {
      return {
        backLink: {
          href: '/assessment',
          text: 'Back to Assessment'
        }
      };
    }
    return null;
  };

  const navigation = getNavigation();

  if (!navigation) return null;

  return (
    <div 
      className="w-full py-4 px-4 mb-8 bg-white border-b"
      style={{ borderColor: `${theme.colors.text}10` }}
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/80 hover:bg-primary/5"
          asChild
        >
          <Link href={navigation.backLink.href} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {navigation.backLink.text}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AssessmentNavbar;
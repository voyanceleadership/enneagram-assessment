import { theme, styleUtils } from '@/styles/theme';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enneagram Guide',
  description: 'Learn about the Enneagram types and their relationships',
  icons: {
    icon: '/favicon.ico',
  }
};

export const viewport = {
  themeColor: theme.colors.background,
};

/**
 * EnneagramLayout Component
 * 
 * This layout component provides a consistent container for all Enneagram content pages.
 * It uses a constrained width with maximum limits to ensure consistent design
 * while still providing enough space for content with sidebars.
 * 
 * The layout uses max-w-6xl (72rem/1152px) which provides a good balance between
 * having enough space for sidebar content while still maintaining readability.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within this layout
 */
export default function EnneagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen py-12" 
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* 
        Width-constrained container with centered alignment
        - max-w-6xl (72rem/1152px) provides moderate width constraint
        - mx-auto centers the container
        - Responsive padding ensures good spacing at different screen sizes
      */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
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
      <div className="max-w-4xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
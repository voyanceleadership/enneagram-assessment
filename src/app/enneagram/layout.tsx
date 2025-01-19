import { theme, styleUtils } from '@/styles/theme';

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
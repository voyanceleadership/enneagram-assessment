// src/components/enneagram/types/components/SnapshotCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import { LucideIcon } from 'lucide-react';

interface SnapshotCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  children: React.ReactNode;
}

// A reusable card component used in the TypeSnapshot section
// Displays an icon, label, description, and content in a consistent format
export default function SnapshotCard({ 
  icon: Icon, 
  label, 
  description, 
  children 
}: SnapshotCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Label Card */}
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <div className="mb-4">
            <Icon size={24} color={theme.colors.accent3} />
          </div>
          <h3 
            className="text-lg mb-2"
            style={{ ...styleUtils.headingStyles, color: theme.colors.accent3 }}
          >
            {label}
          </h3>
          <p 
            className="text-sm text-gray-600"
            style={styleUtils.bodyStyles}
          >
            {description}
          </p>
        </div>
      </Card>

      {/* Content Card */}
      <Card className="md:col-span-3 bg-white shadow-md border-0">
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
}
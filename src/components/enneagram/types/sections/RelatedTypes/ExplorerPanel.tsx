// src/components/enneagram/types/sections/RelatedTypes/ExplorerPanel.tsx

import React from 'react';
import { WingTypeDetails } from './WingTypeDetails';
import { LineTypeDetails } from './LineTypeDetails';
import { ExplorerContent } from './explorer';
import { X } from 'lucide-react';

interface ExplorerPanelProps {
  content: ExplorerContent;
  onClose: () => void;
}

export function ExplorerPanel({ content, onClose }: ExplorerPanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-medium">{content.title}</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-6">
          {content.mainDescription}
        </p>

        {content.typeSpecificContent && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-3">Your Type's Connection</h4>
            <p className="text-gray-700 mb-6">
              {content.typeSpecificContent.description}
            </p>

            {content.typeSpecificContent.details && (
              <>
                {/* Wing Type Details */}
                {content.typeSpecificContent.details.personality && (
                  <WingTypeDetails details={content.typeSpecificContent.details} />
                )}

                {/* Line Type Details */}
                {content.typeSpecificContent.details.dynamics && (
                  <LineTypeDetails details={content.typeSpecificContent.details} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorerPanel;
import React from 'react';

interface SurveyPreviewProps {
      isOpen: boolean;
      onClose: () => void;
}

const SurveyPreview: React.FC<SurveyPreviewProps> = ({ isOpen }) => {
      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl">
                        {/* Header */}
                       

                        {/* Content */}
                        <div className="p-6">
                              <p className="text-gray-600">Survey content will be displayed here...</p>
                        </div>
                  </div>
            </div>
      );
};

export default SurveyPreview;
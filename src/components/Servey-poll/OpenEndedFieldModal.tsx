import React, { useState } from 'react';
import { X } from 'lucide-react';

interface OpenEndedFieldModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSave: (fieldData: OpenEndedFieldData) => void;
      initialData?: OpenEndedFieldData;
}

interface OpenEndedFieldData {
      question: string;
      description: string;
      placeholder: string;
      required: boolean;
      locationStampCapture: boolean;
}

const OpenEndedFieldModal: React.FC<OpenEndedFieldModalProps> = ({
      isOpen,
      onClose,
      onSave,
      initialData
}) => {
      const [fieldData, setFieldData] = useState<OpenEndedFieldData>({
            question: initialData?.question || '',
            description: initialData?.description || '',
            placeholder: initialData?.placeholder || 'Type here',
            required: initialData?.required || false,
            locationStampCapture: initialData?.locationStampCapture || false
      });

      const handleCheckboxChange = (field: keyof OpenEndedFieldData, value: boolean) => {
            setFieldData(prev => ({
                  ...prev,
                  [field]: value
            }));
      };

      const handleConfirm = () => {
            onSave(fieldData);
            onClose();
      };

      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">

                  <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                    {/* <List size={16} className="text-gray-600" /> */}
                                    <img src="../src/assets/subject.png" alt="Edit" className="w-5 h-5 " />

                                    <h2 className="text-lg ml-2 font-medium text-gray-900">Open ended</h2>
                              </div>
                              <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                    <X size={20} className="text-gray-500" />
                              </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                              {/* Question Field */}
                              <div>
                                    <input
                                          type="text"
                                          value={fieldData.question}
                                          onChange={(e) => setFieldData(prev => ({ ...prev, question: e.target.value }))}
                                          placeholder="Question"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2  text-gray-700 placeholder-gray-500"
                                    />
                              </div>

                              {/* Description Field */}
                              <div>
                                    <input
                                          type="text"
                                          value={fieldData.description}
                                          onChange={(e) => setFieldData(prev => ({ ...prev, description: e.target.value }))}
                                          placeholder="Description"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2  text-gray-700 placeholder-gray-500"
                                    />
                              </div>

                              {/* Answer Section */}
                              <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                          Answer
                                    </label>
                                    <input
                                          type="text"
                                          value={fieldData.placeholder}
                                          onChange={(e) => setFieldData(prev => ({ ...prev, placeholder: e.target.value }))}
                                          placeholder="Type here"
                                          className="w-full p-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2   placeholder-gray-400"
                                    />
                              </div>

                              {/* Checkboxes */}
                              <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                          <input
                                                type="checkbox"
                                                checked={fieldData.required}
                                                onChange={(e) => handleCheckboxChange('required', e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded "
                                          />
                                          <span className="text-sm text-gray-700">Required</span>
                                    </label>

                                    <label className="flex items-center gap-3">
                                          <input
                                                type="checkbox"
                                                checked={fieldData.locationStampCapture}
                                                onChange={(e) => handleCheckboxChange('locationStampCapture', e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded "
                                          />
                                          <span className="text-sm text-gray-700">Location stamp capture</span>
                                    </label>
                              </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0 border-t border-gray-300">
                              <button
                                    onClick={handleConfirm}
                                    className="w-24 py-2 mt-3  bg-[rgba(78,83,177,1)] text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                              >
                                    Confirm
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default OpenEndedFieldModal;
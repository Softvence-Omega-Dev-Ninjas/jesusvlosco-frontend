import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface DropdownFieldModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSave: (fieldData: DropdownFieldData) => void;
      initialData?: DropdownFieldData;
}

interface DropdownFieldData {
      question: string;
      description: string;
      options: string[];
      required: boolean;
      locationStampCapture: boolean;
      multipleSelection: boolean;
}

const DropdownFieldModal: React.FC<DropdownFieldModalProps> = ({
      isOpen,
      onClose,
      onSave,
      initialData
}) => {
      const [fieldData, setFieldData] = useState<DropdownFieldData>({
            question: initialData?.question || '',
            description: initialData?.description || '',
            options: initialData?.options || ['', ''],
            required: initialData?.required || false,
            locationStampCapture: initialData?.locationStampCapture || false,
            multipleSelection: initialData?.multipleSelection || false
      });

      const handleAddOption = () => {
            setFieldData(prev => ({
                  ...prev,
                  options: [...prev.options, '']
            }));
      };

      const handleOptionChange = (index: number, value: string) => {
            setFieldData(prev => ({
                  ...prev,
                  options: prev.options.map((option, i) => i === index ? value : option)
            }));
      };

      const handleRemoveOption = (index: number) => {
            if (fieldData.options.length > 2) {
                  setFieldData(prev => ({
                        ...prev,
                        options: prev.options.filter((_, i) => i !== index)
                  }));
            }
      };

      const handleCheckboxChange = (field: keyof DropdownFieldData, value: boolean) => {
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
                                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
                                          <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                                    </div>
                                    <h2 className="text-lg font-medium text-gray-900">Dropdown</h2>
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
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                              </div>

                              {/* Description Field */}
                              <div>
                                    <input
                                          type="text"
                                          value={fieldData.description}
                                          onChange={(e) => setFieldData(prev => ({ ...prev, description: e.target.value }))}
                                          placeholder="Description"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                              </div>

                              {/* Answer Options */}
                              <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                          Answer
                                    </label>
                                    <div className="space-y-3">
                                          {fieldData.options.map((option, index) => (
                                                <div key={index} className="relative">
                                                      <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            placeholder={`option ${index + 1}`}
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                                      />
                                                      {fieldData.options.length > 2 && (
                                                            <button
                                                                  onClick={() => handleRemoveOption(index)}
                                                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                  <X size={16} />
                                                            </button>
                                                      )}
                                                </div>
                                          ))}
                                    </div>

                                    {/* Add Field Button */}
                                    <button
                                          onClick={handleAddOption}
                                          className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                    >
                                          <Plus size={16} />
                                          Add field
                                    </button>
                              </div>

                              {/* Checkboxes */}
                              <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                          <input
                                                type="checkbox"
                                                checked={fieldData.required}
                                                onChange={(e) => handleCheckboxChange('required', e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                          />
                                          <span className="text-sm text-gray-700">Required</span>
                                    </label>

                                    <label className="flex items-center gap-3">
                                          <input
                                                type="checkbox"
                                                checked={fieldData.locationStampCapture}
                                                onChange={(e) => handleCheckboxChange('locationStampCapture', e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                          />
                                          <span className="text-sm text-gray-700">Location stamp capture</span>
                                    </label>

                                    <label className="flex items-center gap-3">
                                          <input
                                                type="checkbox"
                                                checked={fieldData.multipleSelection}
                                                onChange={(e) => handleCheckboxChange('multipleSelection', e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                          />
                                          <span className="text-sm text-gray-700">Multiple selection</span>
                                    </label>
                              </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0">
                              <button
                                    onClick={handleConfirm}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                              >
                                    Confirm
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default DropdownFieldModal;
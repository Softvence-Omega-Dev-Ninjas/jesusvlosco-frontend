import React, { useState } from 'react';
import { X, Plus, Minus, Star } from 'lucide-react';

interface RatingFieldModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSave: (fieldData: RatingFieldData) => void;
      initialData?: RatingFieldData;
}

interface RatingFieldData {
      question: string;
      description: string;
      minLabel: string;
      maxLabel: string;
      scale: number;
      required: boolean;
      locationStampCapture: boolean;
}

const RatingFieldModal: React.FC<RatingFieldModalProps> = ({
      isOpen,
      onClose,
      onSave,
      initialData
}) => {
      const [fieldData, setFieldData] = useState<RatingFieldData>({
            question: initialData?.question || '',
            description: initialData?.description || '',
            minLabel: initialData?.minLabel || 'Very bad',
            maxLabel: initialData?.maxLabel || 'Very Good',
            scale: initialData?.scale || 5,
            required: initialData?.required || false,
            locationStampCapture: initialData?.locationStampCapture || false
      });

      const handleScaleChange = (increment: boolean) => {
            setFieldData(prev => ({
                  ...prev,
                  scale: increment
                        ? Math.min(prev.scale + 1, 10)
                        : Math.max(prev.scale - 1, 2)
            }));
      };

      const handleCheckboxChange = (field: keyof RatingFieldData, value: boolean) => {
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

                  <div className="bg-white rounded-lg w-full max-w-xl shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                    <Star size={16} className="text-gray-600" />
                                    <h2 className="text-lg font-medium text-gray-900">Rating</h2>
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

                              {/* Answer Section */}
                              <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                          Answer
                                    </label>

                                    {/* Rating Scale Controls */}
                                    <div className="flex items-center justify-between mb-4">
                                          <input
                                                type="text"
                                                value={fieldData.minLabel}
                                                onChange={(e) => setFieldData(prev => ({ ...prev, minLabel: e.target.value }))}
                                                placeholder="Very bad"
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                          />

                                          <div className="flex items-center mx-4 gap-2">
                                                <button
                                                      onClick={() => handleScaleChange(false)}
                                                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                                                      disabled={fieldData.scale <= 2}
                                                >
                                                      <Minus size={14} className="text-gray-600" />
                                                </button>

                                                <div className="flex items-center gap-1 px-2">
                                                      <span className="text-lg font-medium text-gray-900">{fieldData.scale}</span>
                                                      <Star size={16} className="text-gray-400" />
                                                </div>

                                                <button
                                                      onClick={() => handleScaleChange(true)}
                                                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                                                      disabled={fieldData.scale >= 10}
                                                >
                                                      <Plus size={14} className="text-gray-600" />
                                                </button>
                                          </div>

                                          <input
                                                type="text"
                                                value={fieldData.maxLabel}
                                                onChange={(e) => setFieldData(prev => ({ ...prev, maxLabel: e.target.value }))}
                                                placeholder="Very Good"
                                                className="flex-1 p-2 border  border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                          />
                                    </div>

                                    {/* Rating Preview */}
                                    <div className="flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-lg">
                                          {Array.from({ length: fieldData.scale }, (_, index) => (
                                                <Star
                                                      key={index}
                                                      size={24}
                                                      className="text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                                                />
                                          ))}
                                    </div>
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
                              </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0">
                              <button
                                    onClick={handleConfirm}
                                    className="w-full py-3 bg-[rgba(78,83,177,1)] text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                              >
                                    Confirm
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default RatingFieldModal;
import React, { useState } from 'react';
import { TEducation } from '@/types/usertype';
import { UpdateEducationData } from '@/types/updateUserTypes';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationUpdateFormProps {
  educations: TEducation[];
  onUpdate: (educations: Partial<UpdateEducationData>[]) => void;
  isEditing: boolean;
}

const EducationUpdateForm: React.FC<EducationUpdateFormProps> = ({
  educations,
  onUpdate,
  isEditing
}) => {
  const [formEducations, setFormEducations] = useState<Partial<UpdateEducationData>[]>(
    educations.map(edu => ({
      id: edu.id,
      program: edu.program,
      institution: edu.institution,
      year: edu.year
    }))
  );

  const [dirtyIndexes, setDirtyIndexes] = useState<Set<number>>(new Set());

  const handleFieldChange = (index: number, field: keyof UpdateEducationData, value: string | number) => {
    const updatedEducations = [...formEducations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value
    };
    
    setFormEducations(updatedEducations);
    setDirtyIndexes(prev => new Set(prev).add(index));
    
    // Send only dirty fields to parent
    const dirtyEducations = updatedEducations.filter((_, idx) => dirtyIndexes.has(idx) || idx === index);
    onUpdate(dirtyEducations);
  };

  const addEducation = () => {
    const newEducation: Partial<UpdateEducationData> = {
      program: '',
      institution: '',
      year: new Date().getFullYear()
    };
    
    const updatedEducations = [...formEducations, newEducation];
    setFormEducations(updatedEducations);
    setDirtyIndexes(prev => new Set(prev).add(updatedEducations.length - 1));
    onUpdate([newEducation]);
  };

  const removeEducation = (index: number) => {
    const updatedEducations = formEducations.filter((_, idx) => idx !== index);
    setFormEducations(updatedEducations);
    
    // Update dirty indexes
    const newDirtyIndexes = new Set<number>();
    dirtyIndexes.forEach(dirtyIdx => {
      if (dirtyIdx < index) {
        newDirtyIndexes.add(dirtyIdx);
      } else if (dirtyIdx > index) {
        newDirtyIndexes.add(dirtyIdx - 1);
      }
    });
    setDirtyIndexes(newDirtyIndexes);
    
    const dirtyEducations = updatedEducations.filter((_, idx) => newDirtyIndexes.has(idx));
    onUpdate(dirtyEducations);
  };

  // Generate year options for the dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = [];
  for (let year = currentYear; year >= currentYear - 50; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        {isEditing && (
          <button
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#4E53B1] text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        )}
      </div>

      {formEducations.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No education information added yet.
        </div>
      ) : (
        <div className="space-y-6">
          {formEducations.map((education, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#4E53B1]" />
                  <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree/Program *
                  </label>
                  <input
                    type="text"
                    value={education.program || ''}
                    onChange={(e) => handleFieldChange(index, 'program', e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100' : ''
                    }`}
                    placeholder="e.g., Bachelor of Computer Science"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={education.institution || ''}
                    onChange={(e) => handleFieldChange(index, 'institution', e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100' : ''
                    }`}
                    placeholder="e.g., University of California"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year *
                  </label>
                  {isEditing ? (
                    <select
                      value={education.year || currentYear}
                      onChange={(e) => handleFieldChange(index, 'year', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={education.year || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationUpdateForm;

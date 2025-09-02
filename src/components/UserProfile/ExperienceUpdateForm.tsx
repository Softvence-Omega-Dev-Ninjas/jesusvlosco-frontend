import React, { useState } from 'react';
import { TExperience } from '@/types/usertype';
import { UpdateExperienceData } from '@/types/updateUserTypes';
import { Plus, Trash2, Calendar } from 'lucide-react';

// Employment types from AddUserProfile
const employmentTypes = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERN" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Freelance", value: "FREELANCE" },
];

interface ExperienceUpdateFormProps {
  experiences: TExperience[];
  onUpdate: (experiences: Partial<UpdateExperienceData>[]) => void;
  isEditing: boolean;
}

const ExperienceUpdateForm: React.FC<ExperienceUpdateFormProps> = ({
  experiences,
  onUpdate,
  isEditing
}) => {
  const [formExperiences, setFormExperiences] = useState<Partial<UpdateExperienceData>[]>(
    experiences.map(exp => ({
      id: exp.id,
      designation: exp.designation,
      companyName: exp.companyName,
      jobType: exp.jobType,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      isCurrentlyWorking: exp.isCurrentlyWorking
    }))
  );

  const [dirtyIndexes, setDirtyIndexes] = useState<Set<number>>(new Set());

  const handleFieldChange = (index: number, field: keyof UpdateExperienceData, value: string | boolean) => {
    const updatedExperiences = [...formExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    // If currently working is checked, clear end date
    if (field === 'isCurrentlyWorking' && value === true) {
      updatedExperiences[index].endDate = null;
    }
    
    setFormExperiences(updatedExperiences);
    setDirtyIndexes(prev => new Set(prev).add(index));
    
    // Send only dirty fields to parent
    const dirtyExperiences = updatedExperiences.filter((_, idx) => dirtyIndexes.has(idx) || idx === index);
    onUpdate(dirtyExperiences);
  };

  const addExperience = () => {
    const newExperience: Partial<UpdateExperienceData> = {
      designation: '',
      companyName: '',
      jobType: 'FULL_TIME',
      startDate: '',
      endDate: null,
      description: '',
      isCurrentlyWorking: false
    };
    
    const updatedExperiences = [...formExperiences, newExperience];
    setFormExperiences(updatedExperiences);
    setDirtyIndexes(prev => new Set(prev).add(updatedExperiences.length - 1));
    onUpdate([newExperience]);
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = formExperiences.filter((_, idx) => idx !== index);
    setFormExperiences(updatedExperiences);
    
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
    
    const dirtyExperiences = updatedExperiences.filter((_, idx) => newDirtyIndexes.has(idx));
    onUpdate(dirtyExperiences);
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Convert ISO string to YYYY-MM-DD
  };

  const formatDateForSubmission = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        {isEditing && (
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#4E53B1] text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        )}
      </div>

      {formExperiences.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No work experience added yet.
        </div>
      ) : (
        <div className="space-y-6">
          {formExperiences.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                {isEditing && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={experience.designation || ''}
                    onChange={(e) => handleFieldChange(index, 'designation', e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100' : ''
                    }`}
                    placeholder="Enter job title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={experience.companyName || ''}
                    onChange={(e) => handleFieldChange(index, 'companyName', e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100' : ''
                    }`}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                  </label>
                  <select
                    value={experience.jobType || 'FULL_TIME'}
                    onChange={(e) => handleFieldChange(index, 'jobType', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100' : ''
                    }`}
                  >
                    {employmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formatDateForInput(experience.startDate || '')}
                      onChange={(e) => handleFieldChange(index, 'startDate', formatDateForSubmission(e.target.value))}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                        !isEditing ? 'bg-gray-100' : ''
                      }`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={experience.isCurrentlyWorking ? '' : formatDateForInput(experience.endDate || '')}
                      onChange={(e) => handleFieldChange(index, 'endDate', formatDateForSubmission(e.target.value))}
                      readOnly={!isEditing || experience.isCurrentlyWorking}
                      disabled={experience.isCurrentlyWorking}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                        !isEditing || experience.isCurrentlyWorking ? 'bg-gray-100' : ''
                      }`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={experience.isCurrentlyWorking || false}
                      onChange={(e) => handleFieldChange(index, 'isCurrentlyWorking', e.target.checked)}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-[#4E53B1] focus:ring-[#4E53B1]"
                    />
                    <span className="text-sm text-gray-700">I currently work here</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={experience.description || ''}
                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                    readOnly={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100' : ''
                    }`}
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceUpdateForm;

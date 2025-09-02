import React, { useState } from 'react';
import { TPayroll } from '@/types/shared';
import { UpdatePayrollData } from '@/types/updateUserTypes';
import { DollarSign, Clock, Calendar } from 'lucide-react';

// Break time options from AddUserProfile
const breakTimeOptions = [
  { label: "None", value: "NONE" },
  { label: "Half Hour", value: "HALF_HOUR" },
  { label: "One Hour", value: "ONE_HOUR" },
  { label: "Two Hour", value: "TWO_HOUR" },
  { label: "Three Hour", value: "THREE_HOUR" },
];

interface PayrollUpdateFormProps {
  payroll: TPayroll | null;
  onUpdate: (payroll: Partial<UpdatePayrollData>) => void;
  isEditing: boolean;
}

const PayrollUpdateForm: React.FC<PayrollUpdateFormProps> = ({
  payroll,
  onUpdate,
  isEditing
}) => {
  const [formPayroll, setFormPayroll] = useState<Partial<UpdatePayrollData>>({
    regularPayRate: payroll?.regularPayRate || 0,
    regularPayRateType: (payroll?.regularPayRateType as "HOUR" | "DAY" | "MONTH") || 'HOUR',
    overTimePayRate: payroll?.overTimePayRate || 0,
    overTimePayRateType: (payroll?.overTimePayRateType as "HOUR" | "DAY" | "MONTH") || 'HOUR',
    casualLeave: payroll?.casualLeave || 0,
    sickLeave: payroll?.sickLeave || 0,
    timeOff: payroll?.timeOff || 0,
    offDay: payroll?.offDay || [],
    breakTimePerDay: (payroll?.breakTimePerDay as "NONE" | "HALF_HOUR" | "ONE_HOUR" | "TWO_HOUR" | "THREE_HOUR") || 'ONE_HOUR'
  });

  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  const handleFieldChange = (field: keyof UpdatePayrollData, value: string | number | string[]) => {
    const updatedPayroll = {
      ...formPayroll,
      [field]: value
    };
    
    setFormPayroll(updatedPayroll);
    setDirtyFields(prev => new Set(prev).add(field));
    
    // Send only dirty fields to parent
    const dirtyPayrollData: Record<string, string | number | string[]> = {};
    dirtyFields.forEach(dirtyField => {
      const key = dirtyField as keyof UpdatePayrollData;
      const value = updatedPayroll[key];
      if (value !== undefined) {
        dirtyPayrollData[key] = value;
      }
    });
    dirtyPayrollData[field] = value; // Add current field
    
    onUpdate(dirtyPayrollData as Partial<UpdatePayrollData>);
  };

  const handleOffDayChange = (day: string, isChecked: boolean) => {
    const currentOffDays = formPayroll.offDay || [];
    let newOffDays: string[];
    
    if (isChecked) {
      newOffDays = [...currentOffDays, day];
    } else {
      newOffDays = currentOffDays.filter(d => d !== day);
    }
    
    handleFieldChange('offDay', newOffDays);
  };

  const daysOfWeek = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payroll Information</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pay Rates Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-[#4E53B1]" />
            <h4 className="font-medium text-gray-900">Pay Rates</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regular Pay Rate
              </label>
              <input
                type="number"
                value={formPayroll.regularPayRate || ''}
                onChange={(e) => handleFieldChange('regularPayRate', parseFloat(e.target.value) || 0)}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Rate Type
              </label>
              <select
                value={formPayroll.regularPayRateType || 'HOUR'}
                onChange={(e) => handleFieldChange('regularPayRateType', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              >
                <option value="HOUR">Per Hour</option>
                <option value="DAY">Per Day</option>
                <option value="MONTH">Per Month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Pay Rate
              </label>
              <input
                type="number"
                value={formPayroll.overTimePayRate || ''}
                onChange={(e) => handleFieldChange('overTimePayRate', parseFloat(e.target.value) || 0)}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Rate Type
              </label>
              <select
                value={formPayroll.overTimePayRateType || 'HOUR'}
                onChange={(e) => handleFieldChange('overTimePayRateType', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              >
                <option value="HOUR">Per Hour</option>
                <option value="DAY">Per Day</option>
                <option value="MONTH">Per Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leave & Time Off Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-[#4E53B1]" />
            <h4 className="font-medium text-gray-900">Leave & Time Off</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Casual Leave (days)
              </label>
              <input
                type="number"
                value={formPayroll.casualLeave || ''}
                onChange={(e) => handleFieldChange('casualLeave', parseInt(e.target.value) || 0)}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sick Leave (days)
              </label>
              <input
                type="number"
                value={formPayroll.sickLeave || ''}
                onChange={(e) => handleFieldChange('sickLeave', parseInt(e.target.value) || 0)}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Off (days)
              </label>
              <input
                type="number"
                value={formPayroll.timeOff || ''}
                onChange={(e) => handleFieldChange('timeOff', parseInt(e.target.value) || 0)}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Work Schedule Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-[#4E53B1]" />
          <h4 className="font-medium text-gray-900">Work Schedule</h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Break Time Per Day
            </label>
            <select
              value={formPayroll.breakTimePerDay || 'ONE_HOUR'}
              onChange={(e) => handleFieldChange('breakTimePerDay', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent ${
                !isEditing ? 'bg-gray-100' : ''
              }`}
            >
              {breakTimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Off Days
            </label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map(day => (
                <label key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formPayroll.offDay || []).includes(day.value)}
                    onChange={(e) => handleOffDayChange(day.value, e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-[#4E53B1] focus:ring-[#4E53B1]"
                  />
                  <span className="text-sm text-gray-700">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollUpdateForm;

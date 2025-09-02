import React from 'react';
import { UpdateUserFormData } from '@/types/updateUserTypes';

interface UpdateDemoProps {
  updateData: UpdateUserFormData;
}

const UpdateDemo: React.FC<UpdateDemoProps> = ({ updateData }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border">
      <h4 className="font-semibold text-gray-800 mb-2">Update Preview</h4>
      <pre className="text-xs text-gray-600 overflow-auto max-h-40">
        {JSON.stringify(updateData, null, 2)}
      </pre>
      <p className="text-xs text-gray-500 mt-2">
        ↑ This shows only the fields that have been modified
      </p>
    </div>
  );
};

export default UpdateDemo;

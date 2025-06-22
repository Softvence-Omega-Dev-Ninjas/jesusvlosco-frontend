// src/components/UserDetails/NotesModal.tsx
import React from "react";
import { X } from "lucide-react";

interface NotesModalProps {
  managerNotes: string;
  employeeNotes: string;
  onClose: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({
  managerNotes,
  employeeNotes,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative z-50 mx-4 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Notes</h2>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Manager Notes:</p>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
            {managerNotes || "No manager notes."}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Employee Notes:</p>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
            {employeeNotes || "No employee notes."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;

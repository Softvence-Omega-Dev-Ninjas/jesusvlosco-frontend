import React from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <RiCloseCircleLine className="text-red-500 w-14 h-14" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Do you really want to delete these record? This process cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

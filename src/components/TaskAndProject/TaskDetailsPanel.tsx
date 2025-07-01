import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const TaskDetailsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Trigger */}
      <p
        className="text-sm underline text-[#4E53B1] cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Task Details
      </p>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Task Panel */}
      {isOpen && (
        <div className="fixed right-10 top-10 bg-white rounded-xl p-6 w-96 z-50 shadow-lg">
          {/* Tabs */}
          <div className="flex gap-6 border-b pb-2">
            <p className="text-sm text-[#4E53B1] font-medium border-b-2 border-[#4E53B1]">Task Details</p>
            <p className="text-sm text-gray-500">Comments</p>
          </div>

          {/* Title */}
          <h2 className="text-lg font-medium mt-4 mb-3">City Bridge Renovations</h2>

          {/* Assigned to */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600 font-medium w-24">Assigned to</span>
            <div className="flex items-center gap-2">
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">Jane Cooper</span>
            </div>
          </div>

          {/* Frequency */}
          <div className="flex mb-3">
            <span className="text-sm text-gray-600 font-medium w-24">Freequency</span>
            <span className="text-sm text-gray-700">One off task</span>
          </div>

          {/* Start Dates */}
          <div className="flex mb-3">
            <span className="text-sm text-gray-600 font-medium w-24">Start date</span>
            <span className="text-sm text-gray-700">22/06/25 at 10:00 am</span>
          </div>
          <div className="flex mb-3">
            <span className="text-sm text-gray-600 font-medium w-24">Start date</span>
            <span className="text-sm text-gray-700">23/06/25 at 10:00 am</span>
          </div>

          {/* Labels */}
          <div className="flex mb-4">
            <span className="text-sm text-gray-600 font-medium w-24">Labels</span>
            <span className="bg-[#E0E7FF] text-[#4E53B1] px-3 py-1 rounded-full text-sm">General Tasks</span>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-md">Mark task as done</button>
            <div className="flex items-center gap-3">
              <button className="border border-[#4E53B1] text-[#4E53B1] px-4 py-1.5 text-sm rounded-md">Edit</button>
              <Trash2 size={18} className="text-red-500 cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPanel;

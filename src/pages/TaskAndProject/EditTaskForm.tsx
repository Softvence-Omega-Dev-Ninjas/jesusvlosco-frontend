import { ChevronDown, Paperclip, Trash2, X } from "lucide-react";
import { useState } from "react";

interface EditTaskFormProps {
  onCancel: () => void;
}

export default function EditTaskForm({ onCancel }: EditTaskFormProps) {
  const [taskTitle, setTaskTitle] = useState("City Bridge Renovations");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("22/06/2025");
  const [startTime, setStartTime] = useState("10:00 am");
  const [dueDate, setDueDate] = useState("23/06/2025");
  const [dueTime, setDueTime] = useState("10:00 am");
  const [labels, setLabels] = useState(["General Tasks"]);
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  const timeOptions = [
    "12:00 am",
    "12:30 am",
    "1:00 am",
    "1:30 am",
    "2:00 am",
    "2:30 am",
    "3:00 am",
    "3:30 am",
    "4:00 am",
    "4:30 am",
    "5:00 am",
    "5:30 am",
    "6:00 am",
    "6:30 am",
    "7:00 am",
    "7:30 am",
    "8:00 am",
    "8:30 am",
    "9:00 am",
    "9:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "12:00 pm",
    "12:30 pm",
    "1:00 pm",
    "1:30 pm",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm",
    "4:00 pm",
    "4:30 pm",
    "5:00 pm",
    "5:30 pm",
    "6:00 pm",
    "6:30 pm",
    "7:00 pm",
    "7:30 pm",
    "8:00 pm",
    "8:30 pm",
    "9:00 pm",
    "9:30 pm",
    "10:00 pm",
    "10:30 pm",
    "11:00 pm",
    "11:30 pm",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <button onClick={onCancel}>
              <img src="../src/assets/arrow_back.png" alt="" />
            </button>
            <h1 className="text-lg font-medium text-[#4E53B1]">Edit Task</h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Task Details Section */}
          <div>
            <h2 className="text-sm font-medium text-[#4E53B1] underline mb-4">Task Details</h2>

            {/* Task Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <div>
                <label className="text-sm text-gray-700 font-medium">Description</label>
                <textarea
                  placeholder="Type here..."
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
                ></textarea>
                <div className="text-right text-xs text-gray-500 pt-1">
                  <Paperclip className="inline-block w-4 h-4 mr-1" /> Attachment
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type location"
              />
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="relative">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="appearance-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white pr-8"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="relative">
                  <select
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="appearance-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white pr-8"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Labels */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between"
                  onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
                >
                  <div className="flex flex-wrap gap-1">
                    {labels.map((label, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {label}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLabel(label);
                          }}
                          className="ml-1 hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-[#4E53B1] cursor-pointer text-white rounded-md hover:bg-[#373a77] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Update Task
            </button>
            <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

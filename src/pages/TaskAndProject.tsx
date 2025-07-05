/* eslint-disable @typescript-eslint/no-explicit-any */

import OptionsDropdownButton from "@/components/TaskAndProject/Action";
import ActivityLog from "@/components/TaskAndProject/ActivityLog";
import CalendarDropdown from "@/components/TaskAndProject/CalendarDropdown";
import LabelSelector from "@/components/TaskAndProject/LabelSelector";
import OverdueTasks from "@/components/TaskAndProject/OverdueTasks";
import TaskPage from "@/components/TaskAndProject/TaskPage";
import {
  Calendar,
  ChevronDown,
  List,
  Paperclip,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { FaSortDown } from "react-icons/fa";

interface Task {
  id: string;
  name: string;
  status: "Open" | "Draft" | "Done";
  label: string;
  startTime: string;
  dueDate: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

const projects: Project[] = [
  {
    id: "1",
    name: "Metro Shopping Center",
    tasks: [
      {
        id: "1-1",
        name: "Metro Shopping Center",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "1-2",
        name: "Metro Shopping Center",
        status: "Draft",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "1-3",
        name: "Metro Shopping Center",
        status: "Done",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
    ],
  },
  {
    id: "2",
    name: "Riverside Apartments",
    tasks: [
      {
        id: "2-1",
        name: "Riverside Apartments",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "2-2",
        name: "Riverside Apartments",
        status: "Done",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Wade Warren", avatar: "WW" },
      },
      {
        id: "2-3",
        name: "Riverside Apartments",
        status: "Done",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
    ],
  },
  {
    id: "3",
    name: "Tech Campus Phase 2",
    tasks: [
      {
        id: "3-1",
        name: "Tech Campus Phase 2",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "3-2",
        name: "Tech Campus Phase 2",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "3-3",
        name: "Tech Campus Phase 2",
        status: "Done",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Mike Chen", avatar: "MC" },
      },
    ],
  },
];

interface NewTaskModalProps {
  onClose: () => void;
  onTaskDetailsClick: () => void;
}

export function NewTaskModal({
  onClose,
  onTaskDetailsClick,
}: NewTaskModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTaskDetailsPanel, setShowTaskDetailsPanel] = useState(false);

  if (showTaskDetailsPanel) {
    return <TaskDetailsPanel onClose={() => setShowTaskDetailsPanel(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-4">
          <h2 className="text-lg font-semibold text-[#4E53B1] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#4E53B1]" /> New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!showDetails ? (
          <div className="space-y-6">
            {/* Task Title */}
            <div className="flex items-center gap-4">
              <label className="w-24 text-gray-700 font-medium">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Type Here"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
              />
            </div>

            {/* Assign To */}
            <div className="flex items-center gap-4">
              <label className="w-24 text-gray-700 font-medium">
                Assign to
              </label>
              <select className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]">
                <option>Select</option>
                <option>Jane Cooper</option>
                <option>Robert Fox</option>
              </select>
            </div>

            {/* Add More Details Trigger */}
            <div
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-2 text-[#4E53B1] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add more details</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Task Details Trigger */}
            <p
              className="text-sm underline text-[#4E53B1] cursor-pointer"
              onClick={onTaskDetailsClick}
            >
              Task Details
            </p>

            <div>
              <label className="text-sm text-gray-700 font-medium">
                Task Title
              </label>
              <input
                type="text"
                placeholder=""
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Description
              </label>
              <textarea
                placeholder="Type here..."
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
              ></textarea>
              <div className="text-right text-xs text-gray-500 pt-1">
                <Paperclip className="inline-block w-4 h-4 mr-1" /> Attachment
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Location
              </label>
              <input
                type="text"
                placeholder="Type location"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
              />
            </div>

            {/* Start & Due Dates */}
            <div className="grid gap-4">
              <div className="flex-1">
                <div className="flex gap-4 mt-1">
                  <label className="text-sm text-gray-500 mt-2 font-medium">
                    Start Date
                  </label>
                  <input
                    type="text"
                    defaultValue="22/06/2025"
                    className="border border-gray-300 text-center text-gray-500 rounded-md px-2 py-2 w-30 text-sm"
                  />
                  <input
                    type="text"
                    defaultValue="9:00 am"
                    className="border border-gray-300 text-center text-gray-500 rounded-md px-2 py-1 w-28 text-sm"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex gap-4 mt-1">
                  <label className="text-sm text-gray-500 mt-2 font-medium">
                    Due Date
                  </label>
                  <input
                    type="text"
                    defaultValue="23/06/2025"
                    className="border border-gray-300 ml-2 text-gray-500 rounded-md px-2 py-2 text-center w-30 text-sm"
                  />
                  <input
                    type="text"
                    defaultValue="8:00 am"
                    className="border border-gray-300 text-gray-500 rounded-md text-center px-2 py-1 w-28 text-sm"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div>
              <LabelSelector />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="bg-[#4E53B1] hover:bg-[#3f45a0] text-white text-sm font-semibold px-5 py-2 rounded-md"
            >
              Publish Task
            </button>
            <button
              onClick={() => setShowTaskDetailsPanel(true)}
              className="border border-[#4E53B1] text-[#4E53B1] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#f2f2fc]"
            >
              Draft Task
            </button>
          </div>
          <button className="text-red-500 hover:text-red-700">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface TaskDetailsPanelProps {
  onClose: () => void;
}

function TaskDetailsPanel({ onClose }: TaskDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const [isTaskDone, setIsTaskDone] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, author: "mei", content: "Write a comment", time: "10:45 PM" },
    { id: 2, author: "haca", content: "Statue", time: "2:00 am" },
    { id: 3, author: "haca", content: "Label", time: "2:00 am" },
    { id: 4, author: "haca", content: "Start time", time: "2:00 am" },
  ]);

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Current User",
        content: comment,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  if (isEditing) {
    return <EditTaskForm onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-300 pb-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`text-sm font-medium ${
              activeTab === "details"
                ? "text-[#4E53B1] border-b-2 border-[#4E53B1]"
                : "text-gray-500"
            }`}
          >
            Task Details
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`text-sm font-medium ${
              activeTab === "comments"
                ? "text-[#4E53B1] border-b-2 border-[#4E53B1]"
                : "text-gray-500"
            }`}
          >
            Comments
          </button>
        </div>

        {activeTab === "details" ? (
          <>
            {/* Title */}
            <h2 className="text-xl font-medium mt-4 mb-3">
              City Bridge Renovations
            </h2>

            {/* Assigned to */}
            <div className="flex items-center border-t mt-6 mb-6 border-gray-300 gap-2">
              <div className="flex items-center mt-4 gap-2">
                <span className="text-sm text-gray-600 font-medium w-24">
                  Assigned to
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
                  JC
                </div>
                <span className="text-sm font-medium">Jane Cooper</span>
              </div>
            </div>

            {/* Frequency */}
            <div className="flex border-t py-4 border-gray-300">
              <span className="text-sm text-gray-600 font-medium w-24">
                Frequency
              </span>
              <span className="text-sm text-gray-700">One off task</span>
            </div>

            {/* Start Dates */}
            <div className="flex mb-3">
              <span className="text-sm text-gray-600 font-medium w-24">
                Start date
              </span>
              <span className="text-sm text-gray-700">
                22/06/25 at 10:00 am
              </span>
            </div>
            <div className="flex mb-3">
              <span className="text-sm text-gray-600 font-medium w-24">
                Due date
              </span>
              <span className="text-sm text-gray-700">
                23/06/25 at 10:00 am
              </span>
            </div>

            {/* Labels */}
            <div className="flex mb-4 border-t border-b border-gray-300 py-3">
              <span className="text-sm text-gray-600 font-medium w-24">
                Labels
              </span>
              <span className="bg-[#E0E7FF] text-[#4E53B1] px-3 py-1 rounded-full text-sm">
                General Tasks
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between mt-4 lg:mt-30">
              {!isTaskDone ? (
                <button
                  className="bg-green-500 hover:bg-[#373a77] cursor-pointer text-white text-sm px-4 py-1.5 rounded-md"
                  onClick={() => setIsTaskDone(true)}
                >
                  Mark task as done
                </button>
              ) : (
                <button
                  className="bg-[#4E53B1] hover:bg-[#373a77] cursor-pointer text-white text-sm px-8 py-1.5 rounded-md"
                  onClick={onClose}
                >
                  Publish
                </button>
              )}

              <button
                className="border border-[#4E53B1] hover:bg-[#898dd7] cursor-pointer text-[#4E53B1] px-4 py-1.5 text-sm rounded-md lg:-ml-30"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-red-500 cursor-pointer" />
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4">
            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex gap-3 mt-6 mb-3">
              <div className="w-9 h-9 mt-1 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
                JC
              </div>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
              />
              <button
                onClick={handleAddComment}
                className="text-white px-3 py-2 rounded-md text-sm"
              >
                <img src="../src/assets/send.png" alt="" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditTaskForm({ onCancel }: { onCancel: () => void }) {
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
              {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
              <img src="../src/assets/arrow_back.png" alt="" />
            </button>
            <h1 className="text-lg font-medium text-[#4E53B1]">Edit Task</h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Task Details Section */}
          <div>
            <h2 className="text-sm font-medium text-[#4E53B1] underline mb-4">
              Task Details
            </h2>

            {/* Task Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
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
                <label className="text-sm text-gray-700 font-medium">
                  Description
                </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Labels
              </label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between"
                  onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
                >
                  <div className="flex flex-wrap gap-1">
                    {labels.map((label, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
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

function TaskAndProject() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "open" | "done">(
    "tasks"
  );
  const [groupBy, setGroupBy] = useState<"title" | "label" | "assignedTo">(
    "title"
  );
  const [selectedDateRange, setSelectedDateRange] = useState("May 25 - May 30");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTaskDetailsPanel, setShowTaskDetailsPanel] = useState(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "dates">("list"); // New state for view mode

  // Filter tasks based on active tab
  const filteredProjects = projects.map((project) => ({
    ...project,
    name:
      groupBy === "title"
        ? project.name
        : groupBy === "label"
        ? project.id === "1"
          ? "Low Priority"
          : project.id === "2"
          ? "Medium Priority"
          : "High Priority"
        : project.tasks[0]?.assignedTo.name || project.name,
    assignedTo: project.tasks[0]?.assignedTo,
    tasks: project.tasks
      .filter((task) => {
        if (activeTab === "open")
          return task.status === "Open" || task.status === "Draft";
        if (activeTab === "done") return task.status === "Done";
        return true;
      })
      .map((task) => ({
        ...task,
        title: (task as any).title ?? task.name,
      })),
  }));

  const totalTasks = projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  const openTasks = projects.reduce(
    (acc, project) =>
      acc +
      project.tasks.filter(
        (task) => task.status === "Open" || task.status === "Draft"
      ).length,
    0
  );
  const doneTasks = projects.reduce(
    (acc, project) =>
      acc + project.tasks.filter((task) => task.status === "Done").length,
    0
  );

  const isTaskSelected = (taskId: string) => selectedTasks.includes(taskId);

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Draft":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Done":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    return colors[name.length % colors.length];
  };

  const toggleProject = (projectId: string) => {
    setActiveProject(activeProject === projectId ? null : projectId);
  };

  const getProjectNameForTask = (taskId: string) => {
    for (const project of projects) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) return project.name;
    }
    return "";
  };

  const handleTaskDetailsClick = () => {
    setShowTaskDetailsPanel(true);
    setShowNewTaskModal(false);
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl text-[#4E53B1] font-semibold">
            Task & Project Management
          </h1>
          <ActivityLog />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-gray-300 pb-4 sm:pb-0">
          <div className="flex mt-6 mb-6 flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm text-gray-600">View by:</span>
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 ${
                    viewMode === "list"
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600"
                  } text-sm`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />{" "}
                  <span className="hidden sm:inline">List</span>
                </button>

                <button
                  className={`flex items-center gap-1 ${
                    viewMode === "dates"
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600"
                  } text-sm`}
                  onClick={() => setViewMode("dates")}
                >
                  <Calendar className="w-4 h-4" />{" "}
                  <span className="hidden sm:inline">Dates</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm text-gray-600">Group by:</span>
              <select
                className="text-sm border rounded p-1 border-gray-300 bg-transparent text-gray-900 font-medium focus:outline-none w-full sm:w-auto"
                value={groupBy}
                onChange={(e) =>
                  setGroupBy(e.target.value as "title" | "label" | "assignedTo")
                }
              >
                <option value="title">Title</option>
                <option value="label">Label</option>
                <option value="assignedTo">Assigned to</option>
              </select>
            </div>

            <CalendarDropdown
              selectedRange={selectedDateRange}
              onSelectRange={setSelectedDateRange}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
              />
            </div>
            <button className="bg-[#4E53B1] text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto">
              Export
            </button>
          </div>
        </div>

        {/* Summary Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="text-black w-full sm:w-auto">
              The view contains
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-6 py-1 rounded-2xl border font-medium ${
                  activeTab === "tasks"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {totalTasks} Tasks
              </button>

              <button
                onClick={() => setActiveTab("open")}
                className={`px-6 py-1 rounded-2xl border font-medium ${
                  activeTab === "open"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {openTasks} Open tasks
              </button>

              <button
                onClick={() => setActiveTab("done")}
                className={`px-6 py-1 rounded-2xl border font-medium ${
                  activeTab === "done"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {doneTasks} Done tasks
              </button>

              <button className="">
                {" "}
                <OptionsDropdownButton />
              </button>

              <button
                onClick={() => setShowOverdueTasks(true)}
                className="flex items-center gap-1 text-red-600 border bg-red-200 border-gray-300 rounded-2xl px-2 py-2"
              >
                <span>2</span>
                <span>Overdue tasks</span>
              </button>

              {showOverdueTasks && (
                <div className="fixed inset-0 bg-blur bg-opacity-10 flex items-center justify-center z-50 p-4">
                  <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={() => setShowOverdueTasks(false)}
                      className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                    <OverdueTasks />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Task */}
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-[#4E53B1] text-white cursor-pointer px-4 py-2 rounded-2xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 sm:ml-auto"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Content Area - Switches between list view and TaskPage */}
        {viewMode === "list" ? (
          <>
            {/* Projects Items- Mobile Accordion */}
            <div className="block sm:hidden">
              {filteredProjects.map(
                (project) =>
                  project.tasks.length > 0 && (
                    <div
                      key={project.id}
                      className="bg-white mt-4 rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={project.tasks.every((t) =>
                              isTaskSelected(t.id)
                            )}
                            onChange={() => {
                              if (
                                project.tasks.every((t) => isTaskSelected(t.id))
                              ) {
                                setSelectedTasks(
                                  selectedTasks.filter(
                                    (id) =>
                                      !project.tasks.some((t) => t.id === id)
                                  )
                                );
                              } else {
                                setSelectedTasks([
                                  ...selectedTasks,
                                  ...project.tasks.map((t) => t.id),
                                ]);
                              }
                            }}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                          />
                          <div className="flex items-center gap-2">
                            {groupBy === "assignedTo" && project.assignedTo && (
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getAvatarColor(
                                  project.assignedTo.name
                                )}`}
                              >
                                {project.assignedTo.avatar}
                              </div>
                            )}
                            <h3 className="text-lg font-medium text-[#4E53B1]">
                              {groupBy === "assignedTo"
                                ? project.tasks[0]?.assignedTo.name
                                : project.name}
                            </h3>
                          </div>
                        </div>
                        <FaSortDown
                          className={`w-4 h-4 text-[#4E53B1] transition-transform ${
                            activeProject === project.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeProject === project.id && (
                        <div className="border-t border-gray-200">
                          {project.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="p-4 border-b border-gray-200"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <input
                                  type="checkbox"
                                  checked={isTaskSelected(task.id)}
                                  onChange={() => toggleTask(task.id)}
                                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900">
                                      {groupBy === "assignedTo"
                                        ? getProjectNameForTask(task.id)
                                        : task.name}
                                    </h4>
                                    <span
                                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                        task.status
                                      )}`}
                                    >
                                      {task.status}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        Label:
                                      </span>
                                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                                        {task.label}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <span className="font-medium">
                                        Start:
                                      </span>{" "}
                                      <span
                                        className={
                                          task.status === "Done"
                                            ? "text-black"
                                            : "text-red-600"
                                        }
                                      >
                                        {task.startTime}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <span className="font-medium">Due:</span>{" "}
                                      <span
                                        className={
                                          task.status === "Done"
                                            ? "text-black"
                                            : "text-red-600"
                                        }
                                      >
                                        {task.dueDate}
                                      </span>
                                    </div>
                                    {groupBy !== "assignedTo" && (
                                      <div className="mt-2 flex items-center gap-2">
                                        <div
                                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getAvatarColor(
                                            task.assignedTo.name
                                          )}`}
                                        >
                                          {task.assignedTo.avatar}
                                        </div>
                                        <span className="text-sm text-gray-900">
                                          {task.assignedTo.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="p-4">
                            <button className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
                              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                <Plus className="w-3 h-3 text-white" />
                              </div>
                              Add Task
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>

            {/* Projects Items - Desktop View */}
            <div className="hidden sm:block">
              {filteredProjects.map(
                (project) =>
                  project.tasks.length > 0 && (
                    <div
                      key={project.id}
                      className="bg-white mt-4 rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-13 gap-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="col-span-1">
                            <input
                              type="checkbox"
                              checked={project.tasks.every((t) =>
                                isTaskSelected(t.id)
                              )}
                              onChange={() => {
                                if (
                                  project.tasks.every((t) =>
                                    isTaskSelected(t.id)
                                  )
                                ) {
                                  setSelectedTasks(
                                    selectedTasks.filter(
                                      (id) =>
                                        !project.tasks.some((t) => t.id === id)
                                    )
                                  );
                                } else {
                                  setSelectedTasks([
                                    ...selectedTasks,
                                    ...project.tasks.map((t) => t.id),
                                  ]);
                                }
                              }}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                            />
                          </div>
                          <div className="col-span-2 text-[#4E53B1] text-lg -mt-2 lg:-ml-20 flex items-center gap-2">
                            {groupBy === "assignedTo" && project.assignedTo && (
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getAvatarColor(
                                  project.assignedTo.name
                                )}`}
                              >
                                {project.assignedTo.avatar}
                              </div>
                            )}
                            {groupBy === "assignedTo"
                              ? project.tasks[0]?.assignedTo.name
                              : project.name}
                          </div>
                          <div className="col-span-2 text-[#4E53B1]">
                            Status
                          </div>
                          <div className="col-span-2 text-[#4E53B1]">Label</div>
                          <div className="col-span-2 text-[#4E53B1]">
                            Start time
                          </div>
                          <div className="col-span-2 text-[#4E53B1]">
                            Due date
                          </div>
                          {groupBy !== "assignedTo" && (
                            <div className="col-span-2 text-[#4E53B1] text-right">
                              Assigned to
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="">
                        {project.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="px-6 py-8 hover:bg-gray-50 border-b border-gray-300 transition-colors"
                          >
                            <div className="grid grid-cols-13 gap-6 items-center">
                              <div className="col-span-1">
                                <input
                                  type="checkbox"
                                  checked={isTaskSelected(task.id)}
                                  onChange={() => toggleTask(task.id)}
                                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                />
                              </div>
                              <div className="col-span-2 lg:-ml-20 text-sm font-medium text-gray-600">
                                {groupBy === "assignedTo"
                                  ? getProjectNameForTask(task.id)
                                  : task.name}
                              </div>

                              <div className="col-span-2 flex gap-2">
                                <img src="../src/assets/forum.png" alt="" />

                                {task.status === "Draft" ? (
                                  <button
                                    onClick={() =>
                                      setShowTaskDetailsPanel(true)
                                    }
                                    className={`inline-flex px-6 py-2 text-xs font-medium rounded-full ${getStatusBadge(
                                      task.status
                                    )} hover:bg-red-200 transition`}
                                  >
                                    {task.status}
                                  </button>
                                ) : (
                                  <span
                                    className={`inline-flex px-6 py-2 text-xs font-medium rounded-full ${getStatusBadge(
                                      task.status
                                    )}`}
                                  >
                                    {task.status}
                                  </span>
                                )}
                              </div>

                              <div className="col-span-2">
                                <span className="inline-flex px-8 py-2 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 rounded-full">
                                  {task.label}
                                </span>
                              </div>
                              <div
                                className={`col-span-2 text-sm ${
                                  task.status === "Done"
                                    ? "text-black"
                                    : "text-red-600"
                                }`}
                              >
                                {task.startTime}
                              </div>
                              <div
                                className={`col-span-2 text-sm ${
                                  task.status === "Done"
                                    ? "text-black"
                                    : "text-red-600"
                                }`}
                              >
                                {task.dueDate}
                              </div>
                              {groupBy !== "assignedTo" && (
                                <div className="col-span-2 flex justify-end items-center gap-2">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getAvatarColor(
                                      task.assignedTo.name
                                    )}`}
                                  >
                                    {task.assignedTo.avatar}
                                  </div>
                                  <span className="text-sm text-gray-900">
                                    {task.assignedTo.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-6 py-4 border-t border-gray-200 mb-3">
                        <button className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
                          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-white" />
                          </div>
                          Add Task
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          </>
        ) : (
          <TaskPage
            projects={filteredProjects}
            activeTab={activeTab}
            groupBy={groupBy}
            selectedTasks={selectedTasks}
            toggleTask={toggleTask}
            isTaskSelected={isTaskSelected}
            onAddTask={() => setShowNewTaskModal(true)} // Add this prop
          />
        )}

        {/* Modals */}
        {showNewTaskModal && (
          <NewTaskModal
            onClose={() => setShowNewTaskModal(false)}
            onTaskDetailsClick={handleTaskDetailsClick}
          />
        )}

        {showTaskDetailsPanel && (
          <TaskDetailsPanel onClose={() => setShowTaskDetailsPanel(false)} />
        )}
      </div>
    </div>
  );
}

export default TaskAndProject;

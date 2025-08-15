import { useState } from "react";
import { Trash2, X } from "lucide-react";
import EditTaskForm from "./EditTaskForm";

interface TaskDetailsPanelProps {
  onClose: () => void;
}

export default function TaskDetailsPanel({ onClose }: TaskDetailsPanelProps) {
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-300 pb-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`text-sm font-medium ${activeTab === "details" ? "text-[#4E53B1] border-b-2 border-[#4E53B1]" : "text-gray-500"}`}
          >
            Task Details
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`text-sm font-medium ${activeTab === "comments" ? "text-[#4E53B1] border-b-2 border-[#4E53B1]" : "text-gray-500"}`}
          >
            Comments
          </button>
        </div>

        {activeTab === "details" ? (
          <>
            {/* Title */}
            <h2 className="text-xl font-medium mt-4 mb-3">City Bridge Renovations</h2>

            {/* Assigned to */}
            <div className="flex items-center border-t mt-6 mb-6 border-gray-300 gap-2">
              <div className="flex items-center mt-4 gap-2">
                <span className="text-sm text-gray-600 font-medium w-24">Assigned to</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">JC</div>
                <span className="text-sm font-medium">Jane Cooper</span>
              </div>
            </div>

            {/* Frequency */}
            <div className="flex border-t py-4 border-gray-300">
              <span className="text-sm text-gray-600 font-medium w-24">Frequency</span>
              <span className="text-sm text-gray-700">One off task</span>
            </div>

            {/* Start Dates */}
            <div className="flex mb-3">
              <span className="text-sm text-gray-600 font-medium w-24">Start date</span>
              <span className="text-sm text-gray-700">22/06/25 at 10:00 am</span>
            </div>
            <div className="flex mb-3">
              <span className="text-sm text-gray-600 font-medium w-24">Due date</span>
              <span className="text-sm text-gray-700">23/06/25 at 10:00 am</span>
            </div>

            {/* Labels */}
            <div className="flex mb-4 border-t border-b border-gray-300 py-3">
              <span className="text-sm text-gray-600 font-medium w-24">Labels</span>
              <span className="bg-[#E0E7FF] text-[#4E53B1] px-3 py-1 rounded-full text-sm">General Tasks</span>
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
                <button className="bg-[#4E53B1] hover:bg-[#373a77] cursor-pointer text-white text-sm px-8 py-1.5 rounded-md" onClick={onClose}>
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
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex gap-3 mt-6 mb-3">
              <div className="w-9 h-9 mt-1 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">JC</div>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
              />
              <button onClick={handleAddComment} className="text-white px-3 py-2 rounded-md text-sm">
                <img src="../src/assets/send.png" alt="" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

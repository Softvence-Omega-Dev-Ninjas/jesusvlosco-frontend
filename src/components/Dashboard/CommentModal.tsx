import { Edit2, Eye, Heart, MessageCircle, Mic, Trash2 } from "lucide-react";
import { useState } from "react";

const CommentModal = () => {
  const [likes, setLikes] = useState({ comment1: false, comment2: false });
  const [comment, setComment] = useState("");

  interface LikesState {
    comment1: boolean;
    comment2: boolean;
  }

  type CommentId = keyof LikesState;

  const handleLike = (commentId: CommentId) => {
    setLikes((prev: LikesState) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Sent recognition
        </h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Edit2 size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Recognition Card */}
      <div className="bg-orange-100 rounded-lg p-6 mb-4">
        <h3 className="text-center text-gray-800 font-medium mb-6">
          XYZ Company recognized Cody, Leslie & Robert
        </h3>

        <div className="flex items-center justify-between">
          {/* Company Logo */}
          <div className="text-center">
            <h4 className="text-gray-700 font-medium mb-3">XYZ Company</h4>
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center relative">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                {/* Light rays */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-400"></div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-400"></div>
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-400"></div>
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-400"></div>
                <div className="absolute -top-1 -left-1 w-1 h-1 bg-yellow-400 rotate-45"></div>
                <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-400 rotate-45"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-400 rotate-45"></div>
                <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-yellow-400 rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Cody Fisher"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">Cody Fisher</span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Leslie Alexander"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">
                Leslie Alexander
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                alt="Robert Fox"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">Robert Fox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>19/06/2025 at 14:46</span>
        <div className="flex items-center gap-1">
          <Eye size={16} />
          <span>10 people can see this</span>
        </div>
      </div>

      {/* Reactions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">😊</span>
          <span className="text-sm text-gray-500">1</span>
        </div>
        <span className="text-sm text-gray-500">1 comment</span>
      </div>

      {/* Comments */}
      <div className="space-y-4 mb-6">
        {/* Leslie's Comment */}
        <div className="bg-purple-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Leslie Alexander"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800 mb-1">
                Leslie Alexander
              </div>
              <div className="text-gray-700">Well-done! Keep it up.</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <span>2 days ago</span>
            <div className="flex gap-4">
              <button
                onClick={() => handleLike("comment1")}
                className={`flex items-center gap-1 hover:text-red-500 ${
                  likes.comment1 ? "text-red-500" : ""
                }`}
              >
                <Heart
                  size={16}
                  fill={likes.comment1 ? "currentColor" : "none"}
                />
                Like
              </button>
              <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                <MessageCircle size={16} />
                Comment
              </button>
            </div>
          </div>
        </div>

        {/* Cody's Comment */}
        <div className="ml-8">
          <div className="flex items-start gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Cody Fisher"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800 mb-1">Cody Fisher</div>
              <div className="text-gray-700">Thanks</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <span>2 days ago</span>
            <div className="flex gap-4">
              <button
                onClick={() => handleLike("comment2")}
                className={`flex items-center gap-1 hover:text-red-500 ${
                  likes.comment2 ? "text-red-500" : ""
                }`}
              >
                <Heart
                  size={16}
                  fill={likes.comment2 ? "currentColor" : "none"}
                />
                Like
              </button>
              <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                <MessageCircle size={16} />
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Write Something ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-4 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
};

export default CommentModal;

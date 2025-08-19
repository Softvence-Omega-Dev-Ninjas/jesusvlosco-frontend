import React from "react";
import { FiDownload, FiHeart } from "react-icons/fi";

interface RemotePolicyCardProps {
  onClose: () => void;
}

const RemotePolicyCard: React.FC<RemotePolicyCardProps> = ({
  announcement,
  onClose,
}) => {
  console.log(announcement, "announcement");
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-8xl mx-auto relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold text-indigo-800 mb-2">
        {announcement.title}
      </h2>

      <div className="flex items-center text-sm text-gray-500 mb-4 gap-4">
        <span>Posted by {announcement.author.email}</span>
        <span>•</span>
        <span>142 reads</span>
      </div>

      <p>{announcement.description}</p>

      {announcement.attachments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Attachments
          </h4>
          <ul className="space-y-2">
            {announcement.attachments.map((attachment) => {
              <li className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md text-sm">
                <span>Remote_Work_Policy_2024.pdf</span>
                <a
                  href="#"
                  className="text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <FiDownload className="w-4 h-4" />
                  Download
                </a>
              </li>;
            })}
          </ul>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600 gap-1 mt-4">
        <FiHeart className="w-4 h-4 text-pink-500" />
        <span>{announcement.likeCount} Likes</span>
      </div>
    </div>
  );
};

export default RemotePolicyCard;

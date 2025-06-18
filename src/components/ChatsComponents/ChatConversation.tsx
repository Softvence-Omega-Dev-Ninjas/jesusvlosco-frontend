import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Chat } from "./ChatWindow";

const ChatConversation = ({
  selectedChat,
  setShowChatInfo,
  setShowDeleteModal,
  setShowMemberModal,
}: {
  selectedChat: Chat;
  setShowChatInfo: (arg0: boolean) => void;
  setShowDeleteModal: (arg0: boolean) => void;
  setShowMemberModal: (arg0: boolean) => void;
}) => {
  const [messageInput, setMessageInput] = useState("");

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");

    console.log(`Sending message to ${selectedChat.name}: ${messageInput}`);
  };
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {selectedChat.initials}
              </span>
            </div>
            {selectedChat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedChat.name}
            </h2>
            <p className="text-sm text-green-600">
              {selectedChat.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <EllipsisVertical className="size-5 text-gray-600" />
            </button>

            <div className="absolute top-full *:cursor-pointer right-0 hidden group-hover:block bg-white rounded-2xl overflow-hidden shadow-md w-48 z-10">
              <button
                onClick={() => setShowChatInfo(true)}
                className="block w-full py-3 px-4 text-left hover:bg-gray-100 transition-colors duration-200"
              >
                Chat Information
              </button>
              <button
                onClick={() => setShowMemberModal(true)}
                className="block w-full py-3 px-4 text-left hover:bg-gray-100 transition-colors duration-200"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="block w-full py-3 px-4 text-left hover:bg-gray-100 transition-colors duration-200 text-red-600"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === "me" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <img
              src={message.avatar || "/placeholder.svg"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === "me"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Write Something ..."
              className="w-full min-h-[60px] px-4 py-3 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-200 rounded-full">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-200 rounded-full">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-primary text-white rounded-full hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;

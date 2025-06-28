import { Settings } from "lucide-react";
import React, { useState } from "react";


import { ChatMessage } from "./dashboard";
import { Avatar } from "./Avatar";

export const Chat: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = ["All", "Unread", "Team"];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Chat</h3>
        <Settings className="w-4 h-4 text-gray-400" />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search conversation"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeTab === tab
                ? "bg-indigo-100 text-indigo-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <Avatar initials={message.avatar} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{message.name}</span>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <div className="text-xs text-gray-600 truncate">
                {message.message}
              </div>
            </div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

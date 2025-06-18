import chatPersonImg from "@/assets/chat-person.jpg";

import { useState } from "react";

export default function ChatWindow() {
  const chatTabs = ["All", "Unread", "Team"];
  const [activeChatTab, setActiveChatTab] = useState("All");
  const [selectedChat, setSelectedChat] = useState("Project ABC");
  console.log(selectedChat);

  const chatList = [
    {
      id: 1,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "4 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
    {
      id: 5,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
    {
      id: 6,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: true,
    },
    {
      id: 7,
      name: "Sarah Johnson",
      message: "Thanks for the project...",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
  ];

  const messages = [
    {
      id: 1,
      text: "Hey! How is the new project coming along?",
      sender: "other",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2 min ago",
    },
    {
      id: 2,
      text: "Going great! Just finished the wireframes. Will share them with you shortly.",
      sender: "me",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1 min ago",
    },
    {
      id: 3,
      text: "Hey! How is the new project coming along?",
      sender: "other",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2 min ago",
    },
    {
      id: 4,
      text: "Going great! Just finished the wireframes. Will share them with you shortly.",
      sender: "me",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1 min ago",
    },
    {
      id: 5,
      text: "Hey! How is the new project coming along?",
      sender: "other",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2 min ago",
    },
    {
      id: 6,
      text: "Going great! Just finished the wireframes. Will share them with you shortly.",
      sender: "me",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1 min ago",
    },
  ];

  return (
    <div className="flex h-screen border border-website-color-border rounded-2xl overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 border-r border-website-color-border flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Chat</h1>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
            <input
              type="text"
              placeholder="Search conversation"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {chatTabs.map((tab) => (
              <button
                onClick={() => setActiveChatTab(tab)}
                className={`flex-1 py-2 px-3 text-sm cursor-pointer rounded-full duration-200 ${activeChatTab === tab
                  ? "font-medium text-white bg-primary"
                  : "bg-secondary hover:bg-primary/20"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto border-t border-website-color-border mt-2">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-website-color-border"
              onClick={() => setSelectedChat(chat.name)}
            >
              <div className="relative">
                <img
                  src={chatPersonImg}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.unread && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">2</span>
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.name}
                  </p>
                  <p className="text-xs text-gray-500">{chat.time}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Conversation */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-website-color-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">SJ</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Project ABC
              </h2>
              <p className="text-sm text-green-600">Online</p>
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
            <div className="relative">

              <button
                className="p-2 hover:bg-gray-100 rounded-full"
              // className="w-5 h-5 text-gray-600"
              >
                <svg fill="currentColor" viewBox="0 0 20 20">

                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              <div className="absolute top-full right-0 *:py-4 *:px-4 bg-white *:hover:bg-gray-100 rounded-2xl *:block w-max overflow-hidden shadow-md *:transition-colors *:duration-200 *:cursor-pointer">
                <span>Chat Information</span>
                <span>Add Member</span>
                <span>Delete Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.sender === "me"
                ? "flex-row-reverse space-x-reverse"
                : ""
                }`}
            >
              <img
                src={chatPersonImg || "/placeholder.svg"}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === "me"
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
                placeholder="Write Something ..."
                className="w-full min-h-[70px] px-4 py-3 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
            <button className="p-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors cursor-pointer">
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
    </div>
  );
}

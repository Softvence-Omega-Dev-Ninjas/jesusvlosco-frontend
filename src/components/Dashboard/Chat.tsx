import { Settings } from "lucide-react";
import { useState } from "react";
import { SearchIcon } from "./icons";

// Mock Avatar component
type AvatarProps = {
  initials: string;
  isActive?: boolean;
  imageUrl: string;
};

const Avatar = ({ initials, isActive = false, imageUrl }: AvatarProps) => (
  <div className="relative">
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img
        src={imageUrl}
        alt={initials}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials if image fails to load
          const img = e.target as HTMLImageElement;
          img.style.display = "none";
          if (img.nextSibling instanceof HTMLElement) {
            img.nextSibling.style.display = "flex";
          }
        }}
      />
      <div
        className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium"
        style={{ display: "none" }}
      >
        {initials}
      </div>
    </div>
    {isActive && (
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
    )}
  </div>
);

// Mock data
const chatMessages = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 2,
    isActive: true,
  },
  {
    id: "2",
    name: "Emily Chen",
    avatar: "EC",
    imageUrl: "https://randomuser.me/api/portraits/women/15.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 2,
    isActive: true,
  },
  {
    id: "3",
    name: "Michael Davis",
    avatar: "MD",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 0,
    isActive: true,
  },
  {
    id: "4",
    name: "Jessica Wilson",
    avatar: "JW",
    imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 0,
    isActive: true,
  },
  {
    id: "5",
    name: "David Brown",
    avatar: "DB",
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 0,
    isActive: true,
  },
  {
    id: "6",
    name: "Lisa Anderson",
    avatar: "LA",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 0,
    isActive: true,
  },
  {
    id: "7",
    name: "Robert Taylor",
    avatar: "RT",
    imageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    message: "Thanks for the project...",
    time: "2 min ago",
    unreadCount: 0,
    isActive: true,
  },
];

export const Chat = ({ messages = chatMessages }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = ["All", "Unread", "Team"];

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" rounded-2xl p-3 border border-gray-200">
      <div className="max-h-140 h-140 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 ">
          <h3 className="text-2xl font-bold text-primary">Chat</h3>
          <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>

        {/* Search Input */}
        <div className="mb-4 px-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* icon */} <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search conversation"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-6 mb-4 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex justify-center items-center px-4 py-2 text-sm font-medium cursor-pointer rounded-full transition-all ${
                activeTab === tab
                  ? "bg-primary text-white font-semibold"
                  : "bg-[#EDEEF7] text-[#484848] font-semibold"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat List with Scroll */}
        <div className="">
          <div className="space-y-1">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer group ${
                  message.unreadCount > 0 ? "bg-[#EDEEF7]" : ""
                }`}
              >
                <Avatar
                  initials={message.avatar}
                  isActive={message.isActive}
                  imageUrl={message.imageUrl}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {message.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {message.time}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {message.message}
                  </div>
                </div>

                {message.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <div className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {message.unreadCount}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">No conversations found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  MessageCircle,
  EllipsisVertical,
  Settings,
} from "lucide-react";

import personImg from "@/assets/chat-person.jpg";

import ChatInfoSidebar from "./ChatInfoSidebar";
import ChatDeleteModal from "./ChatDeleteModal";
import ChatConversation from "./ChatConversation";
import MemberSelectorModal from "./MemberSelectorModal";

// Define types for better type safety
interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "other";
  avatar: string;
  time: string;
}

export interface Chat {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  unread: boolean;
  messages: ChatMessage[];
  initials: string;
  online: boolean;
}

export default function ResponsiveChatWindow() {
  const chatTabs = ["All", "Unread", "Team"];
  const [activeChatTab, setActiveChatTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowMemberModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mobile view state - controls which panel is visible on mobile
  const [mobileView, setMobileView] = useState<"list" | "chat" | "info">(
    "list"
  );
  console.log(mobileView);
  // Replace the static chats array with state
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "Project ABC",
      message: "Going great! Just finished the wireframes.",
      time: "2 min ago",
      avatar: personImg,
      unread: true,
      initials: "PA",
      online: true,
      messages: [
        {
          id: 1,
          text: "Hey! How is the new project coming along?",
          sender: "other",
          avatar: personImg,
          time: "2 min ago",
        },
        {
          id: 2,
          text: "Going great! Just finished the wireframes. Will share them with you shortly.",
          sender: "me",
          avatar: personImg,
          time: "1 min ago",
        },
        {
          id: 3,
          text: "That's awesome! When do you think we can review them?",
          sender: "other",
          avatar: personImg,
          time: "Just now",
        },
      ],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      message: "Thanks for the project update!",
      time: "5 min ago",
      avatar: personImg,
      unread: false,
      initials: "SJ",
      online: true,
      messages: [
        {
          id: 1,
          text: "Hi there! I wanted to check in about the design review.",
          sender: "other",
          avatar: personImg,
          time: "10 min ago",
        },
        {
          id: 2,
          text: "I've completed the initial mockups for the landing page.",
          sender: "me",
          avatar: personImg,
          time: "8 min ago",
        },
        {
          id: 3,
          text: "Thanks for the project update!",
          sender: "other",
          avatar: personImg,
          time: "5 min ago",
        },
      ],
    },
    {
      id: 3,
      name: "Design Team",
      message: "Let's schedule a meeting for tomorrow.",
      time: "1 hour ago",
      avatar: personImg,
      unread: true,
      initials: "DT",
      online: false,
      messages: [
        {
          id: 1,
          text: "We need to discuss the new brand guidelines.",
          sender: "other",
          avatar: personImg,
          time: "2 hours ago",
        },
        {
          id: 2,
          text: "I agree. I have some ideas I'd like to share.",
          sender: "me",
          avatar: personImg,
          time: "1.5 hours ago",
        },
        {
          id: 3,
          text: "Let's schedule a meeting for tomorrow.",
          sender: "other",
          avatar: personImg,
          time: "1 hour ago",
        },
      ],
    },
    {
      id: 4,
      name: "Marketing Team",
      message: "Campaign results are looking good!",
      time: "3 hours ago",
      avatar: personImg,
      unread: false,
      initials: "MT",
      online: true,
      messages: [
        {
          id: 1,
          text: "Have you seen the latest campaign metrics?",
          sender: "other",
          avatar: personImg,
          time: "4 hours ago",
        },
        {
          id: 2,
          text: "Not yet, can you share them with me?",
          sender: "me",
          avatar: personImg,
          time: "3.5 hours ago",
        },
        {
          id: 3,
          text: "Campaign results are looking good! We've exceeded our targets by 15%.",
          sender: "other",
          avatar: personImg,
          time: "3 hours ago",
        },
      ],
    },
    {
      id: 5,
      name: "John Smith",
      message: "Can we discuss the budget for Q3?",
      time: "Yesterday",
      avatar: personImg,
      unread: false,
      initials: "JS",
      online: false,
      messages: [
        {
          id: 1,
          text: "Hi, I'm working on the quarterly budget report.",
          sender: "other",
          avatar: personImg,
          time: "Yesterday",
        },
        {
          id: 2,
          text: "Great, do you need any input from my team?",
          sender: "me",
          avatar: personImg,
          time: "Yesterday",
        },
        {
          id: 3,
          text: "Can we discuss the budget for Q3? I have some concerns about the allocation.",
          sender: "other",
          avatar: personImg,
          time: "Yesterday",
        },
      ],
    },
  ]);

  // Add this function after the state declarations
  const handleDeleteChat = () => {
    const updatedChats = chats.filter((chat) => chat.id !== selectedChatId);
    setChats(updatedChats);
    // If we deleted the currently selected chat, select the first remaining chat
    if (updatedChats.length > 0) {
      setSelectedChatId(updatedChats[0].id);
    }
    // Close the modal and sidebar
    setShowDeleteModal(false);
    setShowChatInfo(false);
    // Return to chat list on mobile
    setMobileView("list");
  };

  // Filter chats based on active tab
  const filteredChats = chats.filter((chat) => {
    if (activeChatTab === "All") return true;
    if (activeChatTab === "Unread") return chat.unread;
    if (activeChatTab === "Team") return chat.name.includes("Team");
    return true;
  });

  // Find the selected chat
  const selectedChat =
    chats.find((chat) => chat.id === selectedChatId) || chats[0];

  // Handle chat selection on mobile
  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
    setMobileView("chat");
  };

  // Handle back navigation on mobile
  const handleBackToList = () => {
    setMobileView("list");
    setShowChatInfo(false);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowDropdown]);

  // Add this condition before the return statement to handle empty chat list
  if (chats.length === 0) {
    return (
      <div className="flex h-screen border border-gray-200 rounded-none md:rounded-2xl overflow-hidden items-center justify-center">
        <div className="text-center p-4">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No chats available
          </h3>
          <p className="text-gray-500">
            Start a new conversation to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen border-0 md:border border-gray-200 rounded-none md:rounded-2xl overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <div
        className={`${
          mobileView === "list" ? "flex" : "hidden"
        } md:flex w-full md:w-80 border-r border-gray-200 flex-col`}
      >
        {/* Header */}
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-200 md:border-b-0">
          <h1 className="text-xl md:text-2xl font-semibold text-primary">
            Chat
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversation"
              className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {chatTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChatTab(tab)}
                className={`flex-1 py-2.5 md:py-2 px-3 text-sm cursor-pointer rounded-full duration-200 ${
                  activeChatTab === tab
                    ? "font-medium text-white bg-primary"
                    : "bg-gray-100 hover:bg-indigo-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChatId === chat.id && "bg-indigo-50 hover:bg-indigo-50"
              }`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="relative">
                <img
                  src={chat.avatar || "/placeholder.svg?height=48&width=48"}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
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
                  <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {chat.time}
                  </p>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {chat.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Conversation */}
      <div
        className={`${
          mobileView === "chat" ? "flex" : "hidden"
        } md:flex flex-1 flex-col`}
      >
        {/* Mobile Chat Header */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-200 bg-white">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center flex-1">
            <img
              src={
                selectedChat?.avatar || "/placeholder.svg?height=40&width=40"
              }
              alt={selectedChat?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedChat?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedChat?.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Video className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setShowDropdown(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <EllipsisVertical className="size-5 text-gray-600" />
            </button>

            {showDropdown && (
              <div
                ref={modalRef}
                className="absolute top-full *:cursor-pointer right-0 bg-white rounded-2xl overflow-hidden shadow-md w-48 z-10"
              >
                <button
                  onClick={() => {
                    setShowChatInfo(true);
                    setMobileView("info");
                    setShowDropdown(false);
                  }}
                  className="block w-full py-3 px-4 text-left hover:bg-gray-100 transition-colors duration-200"
                >
                  Chat Information
                </button>
                <button
                  onClick={() => {
                    setShowMemberModal(true);
                  }}
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
            )}
          </div>
        </div>

        {/* Desktop Chat Conversation */}
        <div className="hidden md:flex flex-1">
          <ChatConversation
            selectedChat={selectedChat}
            setShowChatInfo={setShowChatInfo}
            setShowDeleteModal={setShowDeleteModal}
            setShowMemberModal={setShowMemberModal}
          />
        </div>

        {/* Mobile Chat Messages */}
        <div className="lg:hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === "me"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.sender === "other" && (
                    <img
                      src={
                        message.avatar || "/placeholder.svg?height=32&width=32"
                      }
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === "me"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="p-2 bg-primary text-white rounded-full hover:bg-indigo-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Info Sidebar - Hidden on mobile when in list/chat view */}
      {showChatInfo && (
        <div className={`${mobileView === "info" ? "flex" : "hidden"} md:flex`}>
          <ChatInfoSidebar
            selectedChat={selectedChat}
            setShowChatInfo={setShowChatInfo}
            setMobileView={setMobileView}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ChatDeleteModal
          selectedChat={selectedChat}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteChat={handleDeleteChat}
        />
      )}

      {showAddMemberModal && (
        <MemberSelectorModal setShowMemberModal={setShowMemberModal} />
      )}
    </div>
  );
}

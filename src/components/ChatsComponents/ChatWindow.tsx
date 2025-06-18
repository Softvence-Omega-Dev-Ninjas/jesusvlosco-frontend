import { useState } from "react";
import personImg from "@/assets/chat-person.jpg";
import ChatInfoSidebar from "./ChatInfoSidebar";
import ChatDeleteModal from "./ChatDeleteModal";
import ChatConversation from "./ChatConversation";

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

export default function ChatWindow() {
  const chatTabs = ["All", "Unread", "Team"];
  const [activeChatTab, setActiveChatTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<number>(1);

  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // Add this condition before the return statement to handle empty chat list
  if (chats.length === 0) {
    return (
      <div className="flex h-screen border border-gray-200 rounded-2xl overflow-hidden items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
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
    <div className="flex h-screen border border-gray-200 rounded-2xl overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
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
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className={`flex-1 py-2 px-3 text-sm cursor-pointer rounded-full duration-200 ${
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
        <div className="flex-1 overflow-y-auto border-t border-gray-200 mt-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 ${
                selectedChatId === chat.id ? "bg-indigo-50" : ""
              }`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="relative">
                <img
                  src={chat.avatar || "/placeholder.svg"}
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
      <ChatConversation
        selectedChat={selectedChat}
        setShowChatInfo={setShowChatInfo}
        setShowDeleteModal={setShowDeleteModal}
      />

      {/* Chat Info Sidebar */}
      {showChatInfo && (
        <ChatInfoSidebar
          selectedChat={selectedChat}
          setShowChatInfo={setShowChatInfo}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ChatDeleteModal
          selectedChat={selectedChat}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteChat={handleDeleteChat}
        />
      )}
    </div>
  );
}

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
import ChatConversation from "./ChatConversation";
import MemberSelectorModal from "./MemberSelectorModal";
import { useNavigate } from "react-router-dom";
import {
  useGetChatByIdQuery,
  useGetPrivateChatQuery,
} from "@/store/api/private-chat/privateChatApi";
import { connectPrivateChat } from "@/utils/socket";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

// Define types for better type safety
interface ChatMessage {
  id: number;
  text: string;
  sender: {
    profile: {
      profileUrl: string;
      firstName: string;
    };
  };
  avatar: string;
  time: string;
  senderId: string;
  content: string;
}

export interface Chat {
  id: number;
  chatId: string;
  lastMessage: {
    content: string;
  };
  name: string;
  message: string;
  time: string;
  avatar: string;
  unread: boolean;
  messages: ChatMessage[];
  initials: string;
  online: boolean;
  participant: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      profileUrl: string;
    };
  };
  updatedAt: string;
}

export default function ResponsiveChatWindow() {
  const navigate = useNavigate();
  const chatTabs = ["All", "Unread", "Team"];
  const [activeChatTab, setActiveChatTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowMemberModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useAppSelector(selectUser);
  const [messageInput, setMessageInput] = useState("");
  console.log(showChatInfo, showDeleteModal);

  const { data: conversationsData } = useGetPrivateChatQuery([]);
  const privateChats = conversationsData?.data || [];

  const { data: privateChatData } = useGetChatByIdQuery(selectedChatId);
  const token = user?.accessToken as string;

  // Connect to the private chat socket when the component mounts
  useEffect(() => {
    connectPrivateChat(token);
  }, [token]);

  // Mobile view state - controls which panel is visible on mobile
  const [mobileView, setMobileView] = useState<"list" | "chat" | "info">(
    "list"
  );

  // Find the selected chat
  const selectedChat = privateChats?.find(
    (chat: Chat) => chat.chatId === selectedChatId
  );

  // Handle chat selection on mobile
  const handleChatSelect = (chatId: string) => {
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
  if (privateChats.length === 0) {
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

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    const userId = user?.id || "";
    const recipientId = selectedChat.participant.id || "";

    const formData = new FormData();
    formData.append("content", messageInput);
    formData.append("userId", userId);

    // if (file) {
    //   formData.append("file", file);
    // }

    try {
      await axios.post(
        `https://api.lgcglobalcontractingltd.com/js/private-chat/send-message/${recipientId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      setMessageInput("");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(privateChats);

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
          <button
            onClick={() => navigate("/user/user-chat-setting")}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
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
          {privateChats.map((chat: Chat) => (
            <div
              key={chat.chatId}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChatId === chat.chatId &&
                "bg-indigo-50 hover:bg-indigo-50"
              }`}
              onClick={() => handleChatSelect(chat.chatId)}
            >
              <div className="relative">
                <img
                  src={
                    chat.participant.profile.profileUrl ||
                    "https://avatar.iran.liara.run/public/boy?username=Ash"
                  }
                  alt={chat.participant.profile.firstName}
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
                  <p className="text-sm font-medium text-gray-900 truncate capitalize">
                    {chat.participant.profile.firstName +
                      " " +
                      chat.participant.profile.lastName}
                  </p>
                  <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(chat?.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {chat.lastMessage?.content || "N/A"}
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
                selectedChat?.avatar ||
                "https://avatar.iran.liara.run/public/boy?username=Ash"
              }
              alt={selectedChat?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {selectedChat?.participant?.profile?.firstName +
                  " " +
                  selectedChat?.participant?.profile?.lastName}
              </h2>
              {/* <p className="text-sm text-gray-500">
                {selectedChat?.online ? "Online" : "Offline"}
              </p> */}
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
          {selectedChatId ? (
            <ChatConversation
              selectedChat={privateChatData}
              selectedPrivateChatInfo={selectedChat}
              setShowChatInfo={setShowChatInfo}
              setShowDeleteModal={setShowDeleteModal}
              setShowMemberModal={setShowMemberModal}
            />
          ) : (
            // <div>Hello world</div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* Mobile Chat Messages */}
        <div className="lg:hidden flex-1 flex flex-col max-h-[calc(100vh-170px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {privateChatData?.messages?.map((message: ChatMessage) => {
              const isMe = message.senderId === user?.id; // currentUserId from auth
              // console.log(isMe, "isMe");
              const avatar =
                message.sender?.profile?.profileUrl ||
                "https://avatar.iran.liara.run/public/boy?username=Ash";

              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    isMe ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <img
                    src={avatar}
                    alt={`${message.sender?.profile?.firstName} avatar`}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Message bubble */}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isMe
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary text-white rounded-full hover:bg-indigo-600 transition-colors"
              >
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
      {/* {showChatInfo && (
        <div className={`${mobileView === "info" ? "flex" : "hidden"} md:flex`}>
          <ChatInfoSidebar
            selectedChat={selectedChat}
            setShowChatInfo={setShowChatInfo}
            setMobileView={setMobileView}
          />
        </div>
      )} */}

      {/* Delete Confirmation Modal */}
      {/* {showDeleteModal && (
        <ChatDeleteModal
          selectedChat={selectedChat}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteChat={handleDeleteChat}
        />
      )} */}

      {showAddMemberModal && (
        <MemberSelectorModal setShowMemberModal={setShowMemberModal} />
      )}
    </div>
  );
}

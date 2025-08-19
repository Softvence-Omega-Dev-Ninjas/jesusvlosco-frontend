import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import {
  ArrowLeft,
  MessageCircle,
  EllipsisVertical,
} from "lucide-react";
import ChatConversation from "./ChatConversation";
import MemberSelectorModal from "./MemberSelectorModal";
import { useNavigate } from "react-router-dom";
import {
  useGetChatByIdQuery,
  useGetPrivateChatQuery,
  useSendPrivateMessageMutation,
} from "@/store/api/private-chat/privateChatApi";
import { connectPrivateChat } from "@/utils/socket";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
// import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";
import Chat from "../Dashboard/Chat";

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

export interface TChat {
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

export default forwardRef<{ openChatWithUser: (userId: string) => void }>(function ResponsiveChatWindow(_props, ref) {
  const navigate = useNavigate();
  // const chatTabs = ["All", "Unread", "Team"];
  // const [activeChatTab, setActiveChatTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowMemberModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const user = useAppSelector(selectUser);
  const [messageInput, setMessageInput] = useState("");
  
  // Add the send message mutation
  const [sendPrivateMessage] = useSendPrivateMessageMutation();
  
  console.log(showChatInfo, showDeleteModal);

  const { data: conversationsData } = useGetPrivateChatQuery([]);
  const privateChats = conversationsData?.data || [];

  // const filteredChats = privateChats.filter((chat: Chat) => {
  //    return chat.participant.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  // });

    // console.log("Filtered Chats:", filteredChats);
  const { data: privateChatData } = useGetChatByIdQuery(selectedChatId);
  const token = user?.accessToken as string;

  // Expose openChatWithUser method to parent component
  useImperativeHandle(ref, () => ({
    openChatWithUser: async (userId: string) => {
      // First check if there's already a chat with this user
      const existingChat = privateChats.find((chat: TChat) => 
        chat.participant.id === userId
      );
      // console.log("Existing Chat:", existingChat);
      // console.log("User ID:", userId);

      if (existingChat) {
        // If chat exists, select it
        setSelectedChatId(existingChat.chatId);
        setMobileView("chat");
      } else {
        // If no chat exists, create a new one by sending the first message
        try {
          const result = await sendPrivateMessage({
            recipientId: userId,
            messageInput: '...', // Initial greeting message
            userId: user?.id || '',
            file: undefined
          }).unwrap();

          Swal.fire({
            icon: "success",
            title: "Chat Initiated",
            text: "You are connected to this user",
          });
          // After successfully sending the first message, find the new chat
          // The API should return the chatId or we can refetch the chat list
          if (result?.message?.conversationId) {
            setSelectedChatId(result.message.conversationId);
            setMobileView("chat");
          } else {
            // If chatId is not returned, wait a bit and refetch chats to find the new one
            setTimeout(() => {
              // The chat list will be automatically updated due to RTK Query cache invalidation
              const newChat = privateChats.find((chat: Chat) => 
                chat.participant.id === userId
              );
              if (newChat) {
                setSelectedChatId(newChat.chatId);
                setMobileView("chat");
              }
            }, 1000);
          }
        } catch (error) {
          console.error('Error creating chat:', error);
        }
      }
    }
  }));

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
    // console.log("handleChatSelect called with chatId:", chatId);
    // console.log("Setting selectedChatId to:", chatId);
    setSelectedChatId(chatId);
    setMobileView("chat");
    navigate(`/admin/communication/chat`);
  };

  // Handle back navigation on mobile
  const handleBackToList = () => {
    setMobileView("list");
    setShowChatInfo(false);
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);

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

  // Prevent scroll chaining: when user scrolls inside chat list, don't let page scroll
  useEffect(() => {
    const el = chatListRef.current;
    if (!el) return;

    let startY = 0;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollHeight <= el.clientHeight) {
        // nothing to scroll, prevent page scroll
        e.preventDefault();
        return;
      }

      const deltaY = e.deltaY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      if ((deltaY < 0 && atTop) || (deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (el.scrollHeight <= el.clientHeight) {
        e.preventDefault();
        return;
      }
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      if ((deltaY < 0 && atTop) || (deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel as EventListener);
      el.removeEventListener("touchstart", onTouchStart as EventListener);
      el.removeEventListener("touchmove", onTouchMove as EventListener);
    };
  }, []);

  // Add this condition before the return statement to handle empty chat list
  if (privateChats.length === 0) {
    return (
      <div className="flex border border-gray-200 rounded-none md:rounded-2xl overflow-hidden items-center justify-center">
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
    // console.log(`Sending message to ${recipientId}: ${messageInput}`);

    try {

       const result = await sendPrivateMessage({
            recipientId: recipientId,
            messageInput: messageInput, // Initial greeting message
            userId: userId || '',
            file: undefined
          }).unwrap();
      console.log("Message sent successfully:", result);
      setMessageInput("");
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(privateChats);

  return (
    <div className="flex min-h-[500px] border-0 md:border border-gray-200 rounded-none md:rounded-2xl overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <Chat
        handleChatSelect={handleChatSelect}
        selectedChatId={selectedChatId}
        className="hidden md:flex"
      />
      

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
});

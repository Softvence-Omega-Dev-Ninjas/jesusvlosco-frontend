import { Settings, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useGetPrivateChatQuery } from "@/store/api/private-chat/privateChatApi";
import { TChat, TPrivateChat } from "@/types/chatType";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
// import { useGetTeamChatQuery } from "@/store/api/admin/team-chat/teamChatApi";
// team tab removed - no team API used here

// Chat interface matching ChatWindow types

// Props interface for the Chat component
interface ChatProps {
  handleChatSelect?: (chatId: string) => void;
  selectedChatId?: string;
  className?: string;
}

export const Chat = ({
  handleChatSelect,
  selectedChatId,
  className = "",
}: ChatProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const user = useAppSelector(selectUser);
  console.log(user);
  const chatListRef = useRef<HTMLDivElement | null>(null);

  const tabs = ["All", "Unread"];

  // Fetch private chats using Redux
  const { data: conversationsData } = useGetPrivateChatQuery([]);
  const privateChats =
    conversationsData?.data.filter((chat: TChat) => chat.type !== "team") || [];
  // console.log(privateChats, "Private Chats Data in Chat");

  // Filter chats based on search term and active tab
  const filteredChats = privateChats.filter((chat: TPrivateChat) => {
    const matchesSearch =
      chat.participant.profile.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      chat.participant.profile.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (chat.lastMessage?.content || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "All" || (activeTab === "Unread" && chat.unread);

    return matchesSearch && matchesTab;
  });

  // No team tab - only private chats

  // Prevent scroll chaining: when user scrolls inside chat list, don't let page scroll
  useEffect(() => {
    const el = chatListRef.current;
    if (!el) return;

    let startY = 0;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollHeight <= el.clientHeight) {
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

  return (
    <div
      className={`min-w-sm rounded-2xl p-3 border border-gray-200 ${className}`}
    >
      <div className="max-h-140 h-140 overflow-hidden flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-primary">Chat</h3>
          <button
            onClick={() => navigate("/user/user-chat-setting")}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Settings className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4 px-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
        <div
          ref={chatListRef}
          className="flex-1 overflow-y-auto"
          style={{
            overscrollBehavior:
              "contain" as React.CSSProperties["overscrollBehavior"],
            touchAction: "pan-y",
          }}
        >
          <div className="space-y-1">
            {filteredChats.map((chat: TPrivateChat) => (
              <div
                key={chat.chatId}
                className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer group ${
                  chat.unread ? "bg-[#EDEEF7]" : ""
                } ${
                  selectedChatId === chat.chatId
                    ? "bg-indigo-50 hover:bg-indigo-50"
                    : ""
                }`}
                onClick={() => {
                  handleChatSelect?.(chat.chatId);
                }}
              >
                <div className="relative">
                  <img
                    src={
                      chat.participant.profile.profileUrl ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          chat.participant.profile.firstName +
                            " " +
                            chat.participant.profile.lastName
                        )
                    }
                    alt={chat.participant.profile.firstName}
                    className="w-10 h-10 rounded-full object-cover"
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900 truncate capitalize">
                      {chat.participant.profile.firstName +
                        " " +
                        chat.participant.profile.lastName}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatDistanceToNow(new Date(chat?.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {chat.lastMessage?.content || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredChats.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">No conversations found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

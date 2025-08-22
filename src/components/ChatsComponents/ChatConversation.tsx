/* eslint-disable @typescript-eslint/no-explicit-any */

import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TChat } from "./ChatWindow";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
import { initPrivateMessageListener } from "@/utils/socket";
import {
  useDeletePrivateMessageMutation,
  useSendPrivateMessageMutation,
} from "@/store/api/private-chat/privateChatApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChatConversation = ({
  selectedChat,
  selectedPrivateChatInfo,
  setSelectedChatId,
}: {
  selectedChat: TChat;
  selectedPrivateChatInfo: TChat;
  setSelectedChatId: (id: string) => void;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const me = useAppSelector(selectUser);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(selectedChat?.messages || []);
  const [sendPrivateMessage] = useSendPrivateMessageMutation();
  const [deletePrivateMessage] = useDeletePrivateMessageMutation();
  const navigate = useNavigate()
  console.log(selectedChat, "selectedChat");

  useEffect(() => {
    if (selectedChat?.messages) {
      setMessages(selectedChat?.messages);
    }
  }, [selectedChat?.messages]);

  useEffect(() => {
    initPrivateMessageListener((newMessage: any) => {
      setMessages((prev) => [...prev, newMessage]);
    });
  }, []);

  useEffect(() => {
    // Scrolls to the bottom when messages change or on mount
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteChat = (conversationId: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Conversation!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Call the delete mutation here
        try {
          const res = await deletePrivateMessage(conversationId);
          console.log(res, "res in deletePrivateMessage");
          if (res?.data?.count === 1) {
            Swal.fire("Deleted!", "Your chat has been deleted.", "success");
            setSelectedChatId("");
            setMessages([]);
            navigate("/admin/communication/chat");
          }
          
        } catch (error) {
          console.error("Error deleting chat:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting your chat.",
            "error"
          );
        }
      }
    });
  };
  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    const userId = me?.id || "";
    const recipientId = selectedPrivateChatInfo?.participant?.id || "";

    const formData = new FormData();
    formData.append("content", messageInput);
    formData.append("userId", userId);

    try {
      await sendPrivateMessage({
        recipientId: recipientId,
        messageInput: messageInput,
        userId: userId || "",
        file: undefined,
      }).unwrap();
      // console.log(result)

      setMessageInput("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={(() => {
                const profile = selectedPrivateChatInfo?.participant?.profile;
                const name = `${profile?.firstName ?? ""} ${
                  profile?.lastName ?? ""
                }`.trim();
                if (profile?.profileUrl) return profile.profileUrl;
                if (name)
                  return (
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(name)
                  );
                return "";
              })()}
              alt={selectedChat?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {(selectedPrivateChatInfo?.participant?.profile?.firstName ??
                "") +
                " " +
                (selectedPrivateChatInfo?.participant?.profile?.lastName ?? "")}
            </h2>
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
                onClick={() => handleDeleteChat(selectedChat?.conversationId)}
                className="block w-full py-3 px-4 text-left hover:bg-gray-100 transition-colors duration-200 text-red-600"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(70vh-170px)]">
        {messages?.map((message, idx) => {
          const isMe = message.senderId === me?.id;
          // console.log(isMe, "isMe");
          const avatar =
            message.sender?.profile?.profileUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(
                message.sender.profile?.firstName +
                  " " +
                  message.sender.profile?.lastName
              );

          const messageKey =
            message.id ?? `${message.senderId ?? "msg"}-${idx}`;

          return (
            <div
              key={messageKey}
              className={`flex items-start space-x-3 ${
                isMe ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <img
                src={avatar}
                alt={`${message.sender?.profile?.firstName} avatar`}
                className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${
                  isMe && "hidden"
                }`}
              />

              {/* Message bubble */}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isMe ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <div ref={bottomRef} />
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
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

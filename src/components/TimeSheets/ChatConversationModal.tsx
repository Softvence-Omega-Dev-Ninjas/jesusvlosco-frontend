import React from "react";
import ChatWindow from "../ChatsComponents/ChatWindow";

// Defining the Chat and Message interfaces for this component
interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  avatar?: string;
}

export interface Chat {
  // Exporting Chat interface as it's used by PendingRequestModal
  id: string;
  name: string;
  initials: string;
  online: boolean;
  messages: Message[];
}

interface ChatConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: Chat;
}

export const ChatConversationModal: React.FC<ChatConversationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col relative">
        {/* Modal বন্ধ করার বাটন */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-1 top-1 bg-gray-100 px-1.5 hover:bg-[#4E53B1] hover:text-white rounded-full text-gray-700 text-xl font-bold focus:outline-none z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <ChatWindow />
      </div>
    </div>
  );
};

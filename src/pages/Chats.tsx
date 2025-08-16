import ChatWindow from "@/components/ChatsComponents/ChatWindow";
import EmployeeDirectory from "@/components/ChatsComponents/EmployeeDirectory";
import TeamModal from "@/components/ChatsComponents/TeamModal";
import UserModal from "@/components/ChatsComponents/UserModal";
import { PenLine } from "lucide-react";
import { useState, useRef } from "react";

export const Chat = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const chatWindowRef = useRef<{ openChatWithUser: (userId: string) => void } | null>(null);

  const handleChatWithUser = (userId: string) => {
    if (chatWindowRef.current) {
      chatWindowRef.current.openChatWithUser(userId);
    }
  };
  return (
    <div className="flex flex-col 2xl:flex-row relative min-h-max">
      <div className="2xl:w-[80%] 2xl:pr-4 2xl:border-r border-website-color-border">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-primary">Chat</h2>
            <p className="text-gray-700 text-sm md:text-base">
              This is where your team chat messages will appear.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
            onClick={() => setShowTeamModal(true)}
            className="bg-primary hover:bg-primary/90 text-sm md:text-base transition-colors p-3 cursor-pointer px-4 flex items-center gap-2 rounded-lg text-white min-w-max"
          >
            <PenLine className="size-4 md:size-5" /> New Team Chat
          </button>
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-primary hover:bg-primary/90 text-sm md:text-base transition-colors p-3 cursor-pointer px-4 flex items-center gap-2 rounded-lg text-white min-w-max"
          >
            <PenLine className="size-4 md:size-5" /> Create New
          </button>
          </div>
        </div>

        {/* Add your chat interface here */}
        <ChatWindow ref={chatWindowRef} />
      </div>
      {/* Right side section - Employee Directory */}
      <div className="pl-4">
        <EmployeeDirectory onChatWithUser={handleChatWithUser} />
      </div>

    
      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-white/50 drop-shadow-xl bg-opacity-50 z-50 flex items-center justify-center p-4">
          <TeamModal setShowTeamModal={setShowTeamModal} />
        </div>
      )}

        {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-white/50 drop-shadow-xl bg-opacity-50 z-50 flex items-center justify-center p-4">
          <UserModal setShowUserModal={setShowUserModal} />
        </div>
      )}
    </div>
  );
};

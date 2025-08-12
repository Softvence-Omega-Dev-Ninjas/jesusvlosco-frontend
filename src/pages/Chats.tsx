import ChatWindow from "@/components/ChatsComponents/ChatWindow";
import EmployeeDirectory from "@/components/ChatsComponents/EmployeeDirectory";
import TeamModal from "@/components/ChatsComponents/TeamModal";
import { PenLine } from "lucide-react";
import { useState } from "react";

export const Chat = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  return (
    <div className="flex flex-col 2xl:flex-row relative">
      <div className="2xl:w-[80%] 2xl:pr-4 2xl:border-r border-website-color-border">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-primary">Chat</h2>
            <p className="text-gray-700 text-sm md:text-base">
              This is where your team chat messages will appear.
            </p>
          </div>

          <button
            onClick={() => setShowTeamModal(true)}
            className="bg-primary hover:bg-primary/90 text-sm md:text-base transition-colors p-3 cursor-pointer px-4 flex items-center gap-2 rounded-lg text-white min-w-max"
          >
            <PenLine className="size-4 md:size-5" /> Create New
          </button>
        </div>

        {/* Add your chat interface here */}
        <ChatWindow />
      </div>
      {/* Right side section - Employee Directory */}
      <div className="pl-4">
        <EmployeeDirectory />
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-white/50 drop-shadow-xl bg-opacity-50 z-50 flex items-center justify-center p-4">
          <TeamModal setShowTeamModal={setShowTeamModal} />
        </div>
      )}
    </div>
  );
};

import ChatWindow from "@/components/ChatsComponents/ChatWindow";
import { PenLine } from "lucide-react";

export const Chat = () => {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-primary">Chat</h2>
          <p className="text-gray-700">
            This is where your team chat messages will appear.
          </p>
        </div>

        <button className="bg-primary hover:bg-primary/90 transition-colors p-3 cursor-pointer px-4 flex items-center gap-2 rounded-lg text-white">
          <PenLine /> Create New
        </button>
      </div>

      {/* Add your chat interface here */}
      <ChatWindow />
    </div>
  );
};

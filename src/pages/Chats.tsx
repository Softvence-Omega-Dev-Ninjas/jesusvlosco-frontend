import ChatWindow from "@/components/ChatsComponents/ChatWindow";
import EmployeeDirectory from "@/components/ChatsComponents/EmployeeDirectory";
import { PenLine } from "lucide-react";

export const Chat = () => {
  return (
    <div className="flex">
      <div className="w-[80%] pr-4 border-r border-website-color-border">
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
      {/* Right side section - Employee Directory */}
      <div className="pl-4">
        <EmployeeDirectory />
      </div>
    </div>
  );
};

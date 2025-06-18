import personImg from "@/assets/chat-person.jpg";
import { Chat } from "./ChatWindow";

const ChatInfoSidebar = ({
  setShowChatInfo,
  selectedChat,
}: {
  setShowChatInfo: (arg0: boolean) => void;
  selectedChat: Chat;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-96 bg-white h-full overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Chat info</h2>
          <button
            onClick={() => setShowChatInfo(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat Name */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">Chat name</p>
          <p className="font-medium text-gray-900">{selectedChat.name}</p>
        </div>

        {/* Members Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">See members</h3>
          </div>

          {/* Search Members */}
          <div className="relative mb-4">
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
              placeholder="Search members"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {chatMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-900">{member.name}</span>
                {member.role === "admin" && (
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Media, Files & Links */}
        <div className="p-4">
          <h3 className="font-medium text-primary mb-4">Media, file & links</h3>

          {/* Media Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Media</h4>
              <button className="text-sm text-primary hover:text-indigo-700">
                View all
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {mediaFiles.slice(0, 12).map((media, index) => (
                <img
                  key={index}
                  src={media || "/placeholder.svg"}
                  alt={`Media ${index + 1}`}
                  className="w-full h-16 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Files Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Files</h4>
              <button className="text-sm text-primary hover:text-indigo-700">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.type}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{file.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Links</h4>
              <button className="text-sm text-primary hover:text-indigo-700">
                View all
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-primary hover:text-indigo-700 cursor-pointer">
                    {link}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoSidebar;

const chatMembers = [
  {
    id: 1,
    name: "Admin",
    avatar: personImg,
    role: "admin",
  },
  {
    id: 2,
    name: "Cody Fisher",
    avatar: personImg,
    role: "member",
  },
  {
    id: 3,
    name: "Leslie Alexander",
    avatar: personImg,
    role: "member",
  },
  {
    id: 4,
    name: "Kristin Watson",
    avatar: personImg,
    role: "member",
  },
  {
    id: 5,
    name: "Robert Fox",
    avatar: personImg,
    role: "member",
  },
  {
    id: 6,
    name: "Jacob Jones",
    avatar: personImg,
    role: "member",
  },
  {
    id: 7,
    name: "Theresa Webb",
    avatar: personImg,
    role: "member",
  },
];

const mediaFiles = [
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
];

const files = [
  {
    name: "Project_X_Progress_Report_March_2025.pdf",
    size: "18 MB",
    type: "PDF",
    date: "13/06/2025",
  },
  {
    name: "Machinery_Invent_List_Site_A_March_2025.docx",
    size: "16 MB",
    type: "PDF",
    date: "13/06/2025",
  },
  {
    name: "Construction_Site_Milestones_Overview.xl",
    size: "16 MB",
    type: "PDF",
    date: "13/06/2025",
  },
];

const links = ["http://drive.google.com"];

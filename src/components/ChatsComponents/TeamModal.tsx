import { useState } from "react";
import user1 from "@/assets/user1.png";
import user2 from "@/assets/user2.png";
import user3 from "@/assets/user3.png";
import user4 from "@/assets/user4.png";
import { X } from "lucide-react";

const suggestedContacts = [
  {
    name: "Theresa Webb",
    initials: "TW",
    bgColor: "bg-orange-500",
    img: user1,
  },
  {
    name: "Robert Fox",
    initials: "RF",
    bgColor: "bg-purple-500",
    img: user2,
  },
  {
    name: "Arlene McCoy",
    initials: "AM",
    bgColor: "bg-yellow-500",
    img: user3,
  },
  {
    name: "Wade Warren",
    initials: "WW",
    bgColor: "bg-blue-500",
    img: user4,
  },
];

export default function TeamModal({
  setShowTeamModal,
}: {
  setShowTeamModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [showNewTeam, setShowNewTeam] = useState(false);

  if (showNewTeam) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 relative">
        <span
          onClick={() => setShowTeamModal(false)}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <X />
        </span>
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewTeam(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">New Team</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            Add image
          </button>

          <div className="space-y-2">
            <label
              htmlFor="team-name"
              className="block text-sm font-medium text-gray-700"
            >
              Create team name
            </label>
            <input
              id="team-name"
              type="text"
              placeholder="Enter team name here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Choose members
            </label>

            <div className="space-y-3">
              <div className="space-y-1">
                <label
                  htmlFor="select-team"
                  className="block text-sm text-gray-600"
                >
                  Select Team
                </label>
                <div className="relative">
                  <select
                    id="select-team"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Team</option>
                    <option value="marketing">Marketing Team</option>
                    <option value="development">Development Team</option>
                    <option value="design">Design Team</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="select-members"
                  className="block text-sm text-gray-600"
                >
                  Select specific members
                </label>
                <div className="relative">
                  <select
                    id="select-members"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select member</option>
                    {suggestedContacts.map((contact) => (
                      <option
                        key={contact.name}
                        value={contact.name.toLowerCase().replace(" ", "-")}
                      >
                        {contact.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 relative">
      <span
        onClick={() => setShowTeamModal(false)}
        className="absolute top-3 right-3 cursor-pointer"
      >
        <X />
      </span>
      <div className="p-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <input
            type="text"
            placeholder="To : Type a name or group"
            className="w-full px-5 py-2.5 bg-[#F5F5F5] rounded-full placeholder:text-[#5B5B5B] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowNewTeam(true)}
          className="flex items-center gap-2 text-primary transition-colors font-semibold cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          New Team
        </button>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Suggested</h3>
          <div className="space-y-3">
            {suggestedContacts.map((contact) => (
              <div
                key={contact.name}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div>
                  <img src={contact.img} alt="" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {contact.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

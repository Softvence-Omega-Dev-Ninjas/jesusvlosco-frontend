
import user1 from "@/assets/user1.png";
import { X } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useGetAllTeamsQuery } from "@/store/api/admin/team/CreateTeamApi";
import { TTeam } from "@/types/teamtype";
import { useState } from "react";


export default function TeamModal({
  setShowTeamModal,
}: {
  setShowTeamModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const teams = useGetAllTeamsQuery({});
  const teamList = teams?.data?.data?.teams || [];
  console.log(teamList);

  const filteredTeams = teamList.filter((team: TTeam) =>
    team.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  


  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 relative">
      <span
        onClick={() => setShowTeamModal(false)}
        className="absolute top-3 right-3 cursor-pointer"
      >
        <X />
      </span>
      <div className="p-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">New Team Message</h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <input
            type="text"
             value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="To : Type a name of group"
            className="w-full px-5 py-2.5 bg-[#F5F5F5] rounded-full placeholder:text-[#5B5B5B] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => navigate("/admin/create-team")}
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
            {filteredTeams?.map((team: TTeam) => (
              <div
                key={team.id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                  <img className="w-10 h-10 rounded-full" src={team.image || user1} alt="" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {team.title}
                </span>
                </div>
                <div>
                  <span className="text-sm bg-gray-100 text-gray-800 px-2.5 py-1 rounded-3xl">{team.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

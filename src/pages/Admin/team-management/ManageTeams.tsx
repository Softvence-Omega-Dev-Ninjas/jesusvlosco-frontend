import { useState, useMemo } from "react";
import { useGetAllTeamDataQuery } from "@/store/api/admin/shift-sheduling/getAllTeamApi";
import { Edit3, Trash2, Users, FolderOpen, LoaderIcon } from "lucide-react";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import Swal from "sweetalert2";
import { useDeleteTeamMutation } from "@/store/api/admin/team/CreateTeamApi";
import { useNavigate } from "react-router-dom";
import UpdateTeamModal from "./UpdateTeamModal";

interface Team {
  id: string;
  title: string;
  description: string;
  department: string;
  image?: string;
  members: {
    user: {
      id: string;
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  }[];
    projects: { title: string }[];
  createdAt: string;
}

const ManageTeams = () => {
    const { data: teamsResponse, isLoading, isFetching, refetch, error } = useGetAllTeamDataQuery({ limit: 50 });
    const [updateTeam, setUpdateTeam] = useState<Team | null>(null);
    const [deleteTeam] = useDeleteTeamMutation();
    const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
    const [hoveredType, setHoveredType] = useState<'members' | 'projects' | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    const navigate = useNavigate();
    // console.log(teamsResponse, "Teams Response");

    // Sort teams by createdAt (newest first)
    const sortedTeams = useMemo(() => {
        const teams = teamsResponse?.data?.teams || [];
        return [...teams].sort((a: Team, b: Team) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [teamsResponse]);

    // Paginated slice of teams
    const paginatedTeams = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedTeams.slice(start, start + itemsPerPage);
    }, [sortedTeams, currentPage]);

    const handleEditTeam = (team: Team) => {
        console.log('Edit team:', team);
        setUpdateTeam(team);
    };

    const handleDeleteTeam = async(teamId: string) => {
        console.log('Delete team:', teamId);
        // setDeleteTeamId(teamId);
           const result = await Swal.fire({
              title: `Delete this team?`,
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            });
             if (result.isConfirmed) {
                  const res = await deleteTeam(teamId);
                    console.log(res, "Delete Team Response");
                  if (res?.data?.success) {
                    await Swal.fire({
                      title: "Deleted!",
                      text: "Your file has been deleted.",
                      icon: "success",
                    });
                    refetch();
                  }
                }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleMouseEnter = (teamId: string, event: React.MouseEvent, type: 'members' | 'projects' = 'members') => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
        setHoveredTeam(teamId);
        setHoveredType(type);
    };

    const handleMouseLeave = () => {
        setHoveredTeam(null);
        setHoveredType(null);
    };

    const getTeamMemberNames = (team: Team) => {
        return team.members?.map(member => 
            `${member.user.profile.firstName} ${member.user.profile.lastName}`
        ) || [];
    };

    const getProjectTitles = (team: Team) => {
        return team.projects?.map(p => p.title) || [];
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[#4E53B1]">Manage Teams</h1>
                <button onClick={() => navigate("/admin/create-team")} className="bg-[#4E53B1] hover:bg-[#3C419C] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Users size={16} />
                    Add New Team
                </button>
            </div>

            {/* Teams Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading || isFetching ? (
                        <div className="bg-transparent min-h-[300px] w-full flex justify-center items-center">
                            <LoaderIcon
                                size={52}
                                className="animate-spin text-blue-600 duration-1000"
                            />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-red-500">
                            <p className="text-lg font-medium">Error loading teams</p>
                            <span className="text-sm text-gray-400">
                                Please try refreshing the page.
                            </span>
                        </div>
                    ) : sortedTeams.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                            <Users className="w-16 h-16 mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No teams found</p>
                            <span className="text-sm text-gray-400">
                                Create your first team to get started.
                            </span>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Team
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Department
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Members
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Projects
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Created
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 relative">
                                {paginatedTeams.map((team: Team) => (
                                    <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Team Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {team.image ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={team.image}
                                                            alt={`${team.title} team`}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).onerror = null;
                                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.title)}&background=4E53B1&color=ffffff&size=40`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-[#4E53B1] flex items-center justify-center">
                                                            <span className="text-white font-medium text-sm">
                                                                {team.title.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {team.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                        {team.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Department */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {team.department || 'Not specified'}
                                            </div>
                                        </td>

                                        {/* Members Count */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div 
                                                className="flex items-center text-sm text-gray-900 cursor-pointer hover:text-[#4E53B1] transition-colors relative"
                                                onMouseEnter={(e) => handleMouseEnter(team.id, e)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <Users size={16} className="mr-1 text-gray-400" />
                                                {team.members?.length || 0}
                                            </div>
                                        </td>

                                        {/* Projects Count */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div 
                                                className="flex items-center text-sm text-gray-900 cursor-pointer hover:text-[#4E53B1] transition-colors relative"
                                                onMouseEnter={(e) => handleMouseEnter(team.id, e, 'projects')}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <FolderOpen size={16} className="mr-1 text-gray-400" />
                                                {team.projects?.length || 0}
                                            </div>
                                        </td>

                                        {/* Created Date */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(team.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditTeam(team)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                                                    title="Edit team"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTeam(team.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Delete team"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {!isLoading && isFetching && <TableLoadingSpinner />}
                        </table>
                    )}
                </div>
                {/* Pagination Controls */}
                {sortedTeams.length > itemsPerPage && (
                    <div className="flex items-center justify-end p-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {Array.from({ length: Math.ceil(sortedTeams.length / itemsPerPage) }).map((_, idx) => {
                                const page = idx + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-[#4E53B1] text-white' : 'bg-white'}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(sortedTeams.length / itemsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(sortedTeams.length / itemsPerPage)}
                                className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Member Names Tooltip */}
            {hoveredTeam && (
                <div 
                    className="fixed z-50 bg-gray-800 text-white text-xs rounded-md px-3 py-2 max-w-xs shadow-lg"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: 'translateX(-50%) translateY(-100%)',
                        pointerEvents: 'none'
                    }}
                >
                    {hoveredType === 'projects' ? (
                        <>
                            <div className="font-medium mb-1">Projects:</div>
                            {(() => {
                                const currentTeam = sortedTeams.find(team => team.id === hoveredTeam);
                                const titles = getProjectTitles(currentTeam!);
                                if (titles.length === 0) {
                                    return <div className="text-gray-300">No projects</div>;
                                }
                                return (
                                    <div className="space-y-1">
                                        {titles.map((t, idx) => (
                                            <div key={idx} className="text-gray-200">• {t}</div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </>
                    ) : (
                        <>
                            <div className="font-medium mb-1">Team Members:</div>
                            {(() => {
                                const currentTeam = sortedTeams.find(team => team.id === hoveredTeam);
                                const memberNames = getTeamMemberNames(currentTeam!);
                                if (memberNames.length === 0) {
                                    return <div className="text-gray-300">No members assigned</div>;
                                }
                                return (
                                    <div className="space-y-1">
                                        {memberNames.map((name, index) => (
                                            <div key={index} className="text-gray-200">• {name}</div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </>
                    )}
                    {/* Arrow */}
                    <div 
                        className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
                    />
                </div>
            )}

            {/* Update Confirmation Modal - Basic implementation */}
            {updateTeam && (
                <UpdateTeamModal updateTeam={updateTeam} setUpdateTeam={setUpdateTeam} refetch={refetch} />
            )}
        </div>
    );
};

export default ManageTeams;
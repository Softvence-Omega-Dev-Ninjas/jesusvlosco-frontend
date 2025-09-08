/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Search, Trash2, Plus } from "lucide-react";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { TUser } from "@/types/usertype";
import { useUpdateTeamInfoMutation } from "@/store/api/admin/team/CreateTeamApi";
import Swal from "sweetalert2";

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

interface UpdateTeamModalProps {
  updateTeam: Team | null;
  setUpdateTeam: (team: Team | null) => void;
  refetch: () => void;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  department: string;
  members?: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  }[];
}

const UpdateTeamModal = ({ updateTeam, setUpdateTeam, refetch }: UpdateTeamModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  console.log(updateTeam);
  // Use the same pattern as EmployeeDirectory
  const usersQuery = useGetAllUserQuery({ searchTerm: searchTerm });
  const [updateTeamInfo] = useUpdateTeamInfoMutation();
  const users = usersQuery?.data?.data?.filter((user: TUser) => user.role !== "ADMIN") || [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      id: updateTeam?.id || "",
      title: "",
      description: "",
      department: "",
      members: [],
    },
  });

  const departmentOptions = ["IT", "DEVELOPMENT", "HR", "FINANCE", "MARKETING", "SEALS", "LABOURER", "CARPENTER", "ELECTRICIAN", "DRIVER"];

  const currentMembers = watch("members") ?? [];

  // Reset form when updateTeam changes
  useEffect(() => {
    if (updateTeam) {
      // Transform from {user: {id, profile}} to {id, profile}
      const transformedMembers = updateTeam.members.map((member) => ({
        id: member.user.id,
        profile: {
          firstName: member.user.profile.firstName,
          lastName: member.user.profile.lastName,
        },
      }));

      reset({
        id: updateTeam.id,
        title: updateTeam.title,
        description: updateTeam.description,
        department: updateTeam.department,
        members: transformedMembers,
      });
    }
  }, [updateTeam, reset]);

  // Filter users for search - only show when there's a search term
  const filteredUsers = searchTerm
    ? users.filter((user: TUser) => {
        const fullName = `${user.profile.firstName} ${user.profile.lastName}`.toLowerCase();
        const existingMembers = currentMembers ?? [];
        const isNotAlreadyMember = !existingMembers.some((member) => member.id === user.id);
        return fullName.includes(searchTerm.toLowerCase()) && isNotAlreadyMember;
      })
    : [];

  const removeMember = (userId: string) => {
    const updatedMembers = currentMembers.filter((member) => member.id !== userId);
    setValue("members", updatedMembers);
  };

  const addMember = (user: TUser) => {
    const newMember = {
      id: user.id,
      profile: {
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
      },
    };
    setValue("members", [...currentMembers, newMember]);
    setSearchTerm("");
    setShowUserSearch(false);
  };

  const onSubmit = async (data: any) => {
    // console.log('Members structure:', data.members);
    data.members = data.members.map((member: any) => member.id);
    //  console.log('Update team data:', data);
    try {
      await updateTeamInfo(data).unwrap();
      Swal.fire("Team updated successfully");
      refetch(); // Refetch the teams data to update the table

      // Handle success (e.g., show a success message, close the modal, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the team. Please try again.",
      });
    }

    setUpdateTeam(null);
  };

  if (!updateTeam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Team</h2>
          <button onClick={() => setUpdateTeam(null)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Title</label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Team title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                    placeholder="Enter team title"
                  />
                )}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                    placeholder="Enter team description"
                  />
                )}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                  >
                    <option value="">Select a department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept} className="capitalize">
                        {dept.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
            </div>

            {/* Current Members */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members ({currentMembers.length})</label>

              {currentMembers.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {currentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#4E53B1] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {(member.profile.firstName?.[0] || "").toUpperCase()}
                            {(member.profile.lastName?.[0] || "").toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {member.profile.firstName} {member.profile.lastName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mb-4 p-3 bg-gray-50 rounded-md text-center">No members assigned</div>
              )}

              {/* Add Member Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Add New Member</h4>
                  <button
                    type="button"
                    onClick={() => setShowUserSearch(!showUserSearch)}
                    className="text-[#4E53B1] hover:text-[#3C419C] text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Add Member</span>
                  </button>
                </div>

                {showUserSearch && (
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                        autoComplete="off"
                      />
                    </div>

                    {/* Search Results */}
                    {searchTerm && (
                      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                        {usersQuery.isLoading ? (
                          <div className="p-3 text-gray-500 text-sm text-center">Searching users...</div>
                        ) : filteredUsers.length > 0 ? (
                          filteredUsers.slice(0, 8).map((user: TUser) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => addMember(user)}
                              className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-3 border-b last:border-b-0 transition-colors"
                            >
                              <img
                                src={
                                  user.profile.profileUrl ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    (user.profile.firstName || "") + " " + (user.profile.lastName || "")
                                  )}&background=4E53B1&color=ffffff&size=32`
                                }
                                alt={`${user.profile.firstName} ${user.profile.lastName}`}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    (user.profile.firstName || "") + " " + (user.profile.lastName || "")
                                  )}&background=4E53B1&color=ffffff&size=32`;
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {user.profile.firstName} {user.profile.lastName}
                                </div>
                                {user.profile.jobTitle && <div className="text-xs text-gray-500 truncate">{user.profile.jobTitle}</div>}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-gray-500 text-sm text-center">No users found matching "{searchTerm}"</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => setUpdateTeam(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#4E53B1] text-white rounded-md hover:bg-[#3C419C] transition-colors">
                Update Team
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeamModal;

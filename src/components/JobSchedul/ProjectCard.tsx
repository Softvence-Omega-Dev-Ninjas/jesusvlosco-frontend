/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { TProject } from "@/types/projectType";
import { TUser } from "@/types/usertype";
import Swal from "sweetalert2";
import { useDeleteProjectMutation, useUpdateProjectTitleMutation } from "@/store/api/admin/shift-sheduling/CreateProjectapi";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { FiSearch } from "react-icons/fi";
import { useUpdateProjectUserMutation } from "@/store/api/user/project/projectApi";



interface ProjectCardProps {
  project: TProject;
  // Use string id (TProject.id is string) and accept an optional button ref
  toggleMoreModal: (
    id: string,
    buttonRef?: React.RefObject<HTMLButtonElement | null>
  ) => void;
  isMoreModalOpen: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [menuModal, setMenuModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProjectTitle] = useUpdateProjectTitleMutation();
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const [updateProjectUser] = useUpdateProjectUserMutation();

  // User search and selection states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Debounce search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce effect for search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get users from API with server-side search (only call when debounced search term changes)
  const users = useGetAllUserQuery({
    searchTerm: debouncedSearchTerm,
    limit: 10
  });

  // Get the users data directly from API (server-side search handles filtering)
  const userList = users?.data?.data.filter((user: TUser) => user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") || [];

  // Handle user selection
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Handle update button click
  const handleUpdateUsers = async () => {
    console.log("Selected user IDs:", selectedUsers);
    const data = {
      employees: selectedUsers,
      id: project.id
    }
    const res = await updateProjectUser(data);
    setAddUserModal(false);
    if (res?.data?.success) {
      Swal.fire({
        title: "Updated!",
        text: "Project users have been updated.",
        icon: "success",
      });
    }else{
      Swal.fire({
        title: "Error!",
        text: "Failed to update project users.",
        icon: "error",
      });
    }
    // You can add your logic here to update the project with selected users
  };

  const handleDeleteProject = async () => {
    const result = await Swal.fire({
      title: `Delete Project ${project.title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res: any = await deleteProject(project.id);
      if (res?.data?.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    }
  };

  const handleAddUserToProject = (projectId: string) => {
    // Logic to add user to project
    console.log(`Adding user to project ${projectId}`);
    setAddUserModal(true);
  };
  const handleEditProject = async() => {
    const data = project.title
    const { value: projectName } = await Swal.fire({
      title: "Edit Project Name",
      input: "text",
      inputLabel: "Project Name",
      inputValue: data,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
    if (projectName) {
      const res: any = await updateProjectTitle({ projectId: project.id, title: projectName });
      if (res?.data?.success) {
        Swal.fire(`Your project name is ${projectName}`);
      }
    }
  };

  return (
    <div
      className={`relative bg-white border border-gray-300 rounded-xl p-5 shadow-sm overflow-hidden`}
    >
      {/* Backdrop overlay for this card only */}
      {menuModal && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40 rounded-xl"
          onClick={() => setMenuModal(false)}
        />
      )}

      {/* Menu Modal positioned within the card */}
      {menuModal && (
        <div className="absolute top-16 right-4 bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2 flex flex-col space-y-2 z-50 min-w-32">
          <button
            className="text-left px-2 py-1 hover:bg-gray-100 rounded"
            onClick={() => { handleEditProject(); setMenuModal(false); }}
          >
            Edit
          </button>
          <button
            className="text-left px-2 py-1 hover:bg-gray-100 rounded text-red-600"
            onClick={() => {
              setMenuModal(false);
              handleDeleteProject();
            }}
          >
            Delete
          </button>
        </div>
      )}

      <div className={`flex flex-col justify-between relative z-30`}>
        <div>
          <p className="text-[18px] mb-4">Job Scheduling</p>
          <h4 className="text-primary font-semibold text-lg mb-4">
            {project.title}
          </h4>

          <div className="mb-4 flex items-center gap-12">
            <p className="text-[18px] text-gray-400">Assigned</p>
            <div className="flex items-center -space-x-4">
              {project.projectUsers?.slice(0, 4).map((pu, idx) => (
                <img
                  key={idx}
                  src={
                    pu.user?.profile?.profileUrl ||
                    `https://placehold.co/40x40/cccccc/000000?text=${(
                      pu.user?.profile?.firstName || "U"
                    )
                      .charAt(0)
                      .toUpperCase()}`
                  }
                  alt="assigned"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (
                      e.target as HTMLImageElement
                    ).src = `https://placehold.co/40x40/cccccc/000000?text=${"U"}`;
                  }}
                />
              ))}
              <button className="w-10 h-10 rounded-full border border-gray-500 text-black flex items-center justify-center text-sm cursor-pointer">
                <Plus onClick={() => handleAddUserToProject(project.id)} size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <p className="text-[18px] text-gray-400">Admins</p>
            <div className="flex">
              {(project.manager ? [project.manager] : []).map((mgr, idx) => (
                <img
                  key={idx}
                  src={
                    mgr?.profile?.profileUrl ||
                    `https://placehold.co/40x40/cccccc/000000?text=${"M"}`
                  }
                  alt="admin"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (
                      e.target as HTMLImageElement
                    ).src = `https://placehold.co/40x40/cccccc/000000?text=${"M"}`;
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center border-t-2 border-gray-200 pt-4">
          <button
            ref={moreButtonRef}
            onClick={() => setMenuModal(true)}
            className={`w-10 h-10 border border-gray-300 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-100 cursor-pointer`}
          >
            <MoreHorizontal size={20} />
          </button>

          <Link to={`/admin/schedule/overviewProjects/${project.id}`}>
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer">
              Access Schedule
            </button>
          </Link>
        </div>
      </div>

      {addUserModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setAddUserModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              X
            </button>
            <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-300">Add User to Project: {project.title}</h3>

            {/* Search Input */}
            <div className="relative mt-4 mb-4">
              <input
                type="text"
                placeholder="Search by name, job title, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {/* Users List */}
            <div className="max-h-60 overflow-y-auto">
              {users.isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2">Loading users...</p>
                </div>
              ) : !users?.data?.data ? (
                <div className="text-center py-4 text-gray-500">Failed to load users</div>
              ) : userList.length === 0 && searchTerm ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No users found matching "{searchTerm}"</p>
                  <p className="text-sm mt-1">Try searching by name, job title, or email</p>
                </div>
              ) : userList.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No users available</div>
              ) : (
                <div className="space-y-2">
                  {userList.map((user: TUser) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="ml-3 flex-1 cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-indigo-600">{user.profile?.jobTitle}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Summary */}
            {selectedUsers.length > 0 && (
              <div className="mt-3 p-2 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">
                  <span className="font-medium">{selectedUsers.length}</span> user{selectedUsers.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}

            {/* Search Results Count */}
            {searchTerm && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Showing <span className="font-medium">{userList.length}</span> users matching "{searchTerm}"
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setAddUserModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUsers}
                disabled={selectedUsers.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update ({selectedUsers.length})
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;

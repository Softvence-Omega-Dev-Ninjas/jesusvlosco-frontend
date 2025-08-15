import React, { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { useGetAllTeamDataQuery } from "@/store/api/admin/shift-sheduling/getAllTeamApi";

import { useCreateProjectMutation, useGetAllProjectsQuery } from "@/store/api/admin/shift-sheduling/CreateProjectapi";
import { Link } from "react-router-dom";




interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: string;
  name: string;
  assigned: string[];
  admins: string[];
}

interface ModalsProps {
  openMoreModalId: number | null;
  moreModalPosition: { top: number; left: number } | null;
  handleEditClick: (projectId: number) => void;
  handleDeleteClick: (projectId: number) => void;
  moreModalRef: React.RefObject<HTMLDivElement | null>;

  showEditModal: boolean;
  editModalProjectName: string;
  setEditModalProjectName: React.Dispatch<React.SetStateAction<string>>;
  handleConfirmEdit: () => void;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProjectIdForEdit: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  editModalRef: React.RefObject<HTMLDivElement | null>;

  showDeleteConfirmModal: boolean;
  handleConfirmDelete: () => void;
  setShowDeleteConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectIdToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  deleteConfirmModalRef: React.RefObject<HTMLDivElement | null>;

  showCreateNewModal: boolean;
  newProjectName: string;
  setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
  selectedCreateMembers: string[];
  setSelectedCreateMembers: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelectMember: (memberId: string) => void;
  handleCreateNewConfirm: () => void;
  setShowCreateNewModal: React.Dispatch<React.SetStateAction<boolean>>;
  createNewModalRef: React.RefObject<HTMLDivElement | null>;
  showProjectDropdown: boolean;
  setShowProjectDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  projectDropdownRef: React.RefObject<HTMLDivElement | null>;
  projectDropdownButtonRef: React.RefObject<HTMLButtonElement | null>;
  showMembersDropdown: boolean;
  setShowMembersDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  membersDropdownRef: React.RefObject<HTMLDivElement | null>;
  membersDropdownButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const Modals: React.FC<ModalsProps> = ({
  openMoreModalId,
  moreModalPosition,
  handleEditClick,
  handleDeleteClick,
  moreModalRef,
  showEditModal,
  editModalProjectName,
  setEditModalProjectName,
  handleConfirmEdit,
  setShowEditModal,
  setSelectedProjectIdForEdit,
  editModalRef,
  showDeleteConfirmModal,
  handleConfirmDelete,
  setShowDeleteConfirmModal,
  setProjectIdToDelete,
  deleteConfirmModalRef,
  showCreateNewModal,
  newProjectName,
  setNewProjectName,
  selectedCreateMembers,
  setSelectedCreateMembers,
  handleSelectMember,
  setShowCreateNewModal,
  createNewModalRef,
  showProjectDropdown,
  setShowProjectDropdown,
  projectDropdownRef,
  projectDropdownButtonRef,
  showMembersDropdown,
  setShowMembersDropdown,
  membersDropdownRef,
  membersDropdownButtonRef,
}) => {
  // API call for teams & members
  const { data } = useGetAllTeamDataQuery(undefined);

  // Create Project Mutation hook
  const [createProject, { isLoading, isError, error }] =
    useCreateProjectMutation();

  console.log(createProject);

  const { data: allProjects, refetch } = useGetAllProjectsQuery(undefined);
  console.log(allProjects);

  const [selectedCreateProjectId, setSelectedCreateProjectId] =
    useState<string>("");
  const [selectedCreateProjectName, setSelectedCreateProjectName] =
    useState<string>("");

  // Location state
  const [location, setLocation] = useState("");

  // Teams list for dropdown
  const availableProjectsForDropdown: Project[] = useMemo(() => {
    return (
      data?.data?.teams?.map((team: any) => ({
        id: team.id,
        name: team.title,
        assigned: [],
        admins: [],
      })) || []
    );
  }, [data]);

  // Members of the selected team
  const allMembers: Member[] = useMemo(() => {
    const selectedTeam = data?.data?.teams?.find(
      (t: any) => t.id === selectedCreateProjectId
    );

    return (
      selectedTeam?.members?.map((m: any) => ({
        id: m.user.id, // will be sent to API
        name: `${m.user.profile.firstName} ${m.user.profile.lastName}`, // shown in UI
        role: m.user.role,
        avatar: m.user.profile.profileUrl || m.user.image || "", // fallback
      })) || []
    );
  }, [data, selectedCreateProjectId]);

  // Confirm handler for creating project - calls API
  const handleCreateNewConfirmInternal = async () => {
    if (!newProjectName.trim()) {
      alert("Please enter project name");
      return;
    }
    if (!selectedCreateProjectId) {
      alert("Please select a team");
      return;
    }
    if (selectedCreateMembers.length === 0) {
      alert("Please select at least one member");
      return;
    }
    if (!location.trim()) {
      alert("Please enter location");
      return;
    }

    try {
      await createProject({
        title: newProjectName.trim(),
        teamId: selectedCreateProjectId,
        members: selectedCreateMembers,
        managerId: selectedCreateMembers[0],
        projectLocation: location.trim(),
      }).unwrap();
      refetch();

      alert("Project created successfully!");

      setShowCreateNewModal(false);

      // Reset fields
      setNewProjectName("");
      setSelectedCreateProjectId("");
      setSelectedCreateProjectName("");
      setSelectedCreateMembers([]);
      setLocation("");
      setShowProjectDropdown(false);
      setShowMembersDropdown(false);
    } catch (err) {
      alert(
        "Failed to create project: " +
        ((err as any)?.data?.message ||
          (err as any)?.error ||
          "Unknown error")
      );
    }
  };

  return (
    <>
      {/* More modal */}
      {openMoreModalId !== null && moreModalPosition && (
        <div
          ref={moreModalRef}
          className="fixed bg-white rounded-lg shadow-lg border w-32 py-1 z-30"
          style={{ top: moreModalPosition.top, left: moreModalPosition.left }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm cursor-pointer"
            onClick={() => handleEditClick(openMoreModalId)}
          >
            Edit
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600 cursor-pointer"
            onClick={() => handleDeleteClick(openMoreModalId)}
          >
            Delete
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed bg-white  w-32  py-1 z-30"

            onClick={() => {
              setShowEditModal(false);
              setEditModalProjectName("");
              setSelectedProjectIdForEdit(null);
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              ref={editModalRef}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditModalProjectName("");
                  setSelectedProjectIdForEdit(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                aria-label="Close Edit Modal"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-6 text-center">
                Title this scheduler
              </h3>
              <input
                type="text"
                placeholder="Project 1"
                value={editModalProjectName}
                onChange={(e) => setEditModalProjectName(e.target.value)}
                className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-center text-lg"
                autoFocus
              />
              <button
                onClick={handleConfirmEdit}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium text-lg cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            ref={deleteConfirmModalRef}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative text-center border"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <X className="text-red-500" size={36} strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              Do you really want to delete this project? This process cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setProjectIdToDelete(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Modal */}
      {showCreateNewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            ref={createNewModalRef}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border"
          >
            <button
              onClick={() => {
                setShowCreateNewModal(false);
                setNewProjectName("");
                setSelectedCreateProjectId("");
                setSelectedCreateProjectName("");
                setSelectedCreateMembers([]);
                setLocation("");
                setShowProjectDropdown(false);
                setShowMembersDropdown(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-6 text-center">
              Create Project Name
            </h3>
            <input
              type="text"
              placeholder="Enter project name here"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-lg"
            />

            {/* Team Dropdown */}
            <h4 className="text-md font-semibold mb-2">Choose Team</h4>
            <div className="relative mb-4">
              <button
                ref={projectDropdownButtonRef}
                onClick={() => setShowProjectDropdown((prev) => !prev)}
                className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center text-lg"
              >
                {selectedCreateProjectName || "Select Team"}
                <svg
                  className={`fill-current h-4 w-4 transform ${showProjectDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L6.757 7.586L5.343 9z" />
                </svg>
              </button>
              {showProjectDropdown && (
                <div
                  ref={projectDropdownRef}
                  className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
                >
                  {availableProjectsForDropdown.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedCreateProjectName(p.name); // show team name
                        setSelectedCreateProjectId(p.id); // store id
                        setShowProjectDropdown(false);
                      }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {p.name}
                    </button>

                  ))}
                  <Link to={`/admin/create-team`} className="block w-full px-4 py-2 text-blue-500 text-left hover:bg-gray-100">
                    Create Team
                  </Link>
                </div>
              )}
            </div>

            {/* Members Dropdown */}
            <h4 className="text-md font-semibold mb-2">
              Choose Specific Members
            </h4>
            <div className="relative mb-6">
              <button
                ref={membersDropdownButtonRef}
                onClick={() => setShowMembersDropdown((prev) => !prev)}
                className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center text-lg focus:ring-1 focus:ring-blue-400"
              >
                {selectedCreateMembers.length
                  ? selectedCreateMembers
                    .map((id) => {
                      const mem = allMembers.find((m) => m.id === id);
                      return mem ? mem.name : id; // show name instead of id
                    })
                    .join(", ")
                  : "Select member"}

                <svg
                  className={`fill-current h-4 w-4 transform ${showMembersDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L6.757 7.586L5.343 9z" />
                </svg>
              </button>
              {showMembersDropdown && (
                <div
                  ref={membersDropdownRef}
                  className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
                >
                  {allMembers.map((mem) => (
                    <button
                      key={mem.id}
                      onClick={() => handleSelectMember(mem.id)}
                      className="flex items-center w-full py-2 hover:bg-gray-100"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{mem.name}</div>
                      </div>
                      {selectedCreateMembers.includes(mem.id) && (
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586L15.707 5.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <h4 className="text-md font-semibold mb-2">Location</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select location"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateNewConfirmInternal}
              disabled={isLoading}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center disabled:opacity-50"
            >
              <Plus size={20} className="mr-2" /> Create New
            </button>

            {isError && (
              <p className="text-red-500 mt-2">
                Error:{" "}
                {(error as any)?.data?.message || "Failed to create project"}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;

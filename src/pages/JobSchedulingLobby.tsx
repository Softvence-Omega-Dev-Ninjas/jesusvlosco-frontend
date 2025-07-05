import React, { useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import ProjectCard from "@/components/JobSchedul/ProjectCard";
import Modals from "@/components/JobSchedul/Modals";

interface Project {
  id: number;
  name: string;
  assigned: string[];
  admins: string[];
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const allMembers: Member[] = [
  {
    id: "m1",
    name: "Jane Cooper",
    role: "Project Manager",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "m2",
    name: "Robert Fox",
    role: "Construction Site Manager",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "m3",
    name: "Esther Howard",
    role: "Assistant Project Manager",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "m4",
    name: "Desirae Botosh",
    role: "Superintendent",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "m5",
    name: "Marley Stanton",
    role: "Coordinator",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "m6",
    name: "Kaylynn Stanton",
    role: "Site Supervisor",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "m7",
    name: "Brandon Vaccaro",
    role: "Operations Manager",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "m8",
    name: "Erin Press",
    role: "Estimating Manager",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "m9",
    name: "Makenna Dorwart",
    role: "Structural Engineer",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: "m10",
    name: "Ann Gouse",
    role: "Mechanical Engineer",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: "m11",
    name: "Emery Westervelt",
    role: "Site Engineer",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "m12",
    name: "Jocelyn Lubin",
    role: "Safety Engineer",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

const JobSchedulingLobby: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Project 1",
      assigned: ["https://randomuser.me/api/portraits/men/10.jpg"],
      admins: ["https://randomuser.me/api/portraits/men/30.jpg"],
    },
    {
      id: 2,
      name: "Project 2",
      assigned: ["https://randomuser.me/api/portraits/men/15.jpg"],
      admins: ["https://randomuser.me/api/portraits/men/25.jpg"],
    },
    {
      id: 3,
      name: "Project 3",
      assigned: ["https://randomuser.me/api/portraits/men/20.jpg"],
      admins: ["https://randomuser.me/api/portraits/men/35.jpg"],
    },
    {
      id: 4,
      name: "Project 4",
      assigned: ["https://randomuser.me/api/portraits/men/22.jpg"],
      admins: ["https://randomuser.me/api/portraits/men/40.jpg"],
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMoreModalId, setOpenMoreModalId] = useState<number | null>(null);
  const [moreModalPosition, setMoreModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalProjectName, setEditModalProjectName] = useState("");
  const [selectedProjectIdForEdit, setSelectedProjectIdForEdit] = useState<
    number | null
  >(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(
    null
  );

  const [showCreateNewModal, setShowCreateNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedCreateProject, setSelectedCreateProject] = useState("");
  const [selectedCreateMembers, setSelectedCreateMembers] = useState<string[]>(
    []
  );
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  // Refs
  const moreModalRef = useRef<HTMLDivElement | null>(null);
  const editModalRef = useRef<HTMLDivElement | null>(null);
  const deleteConfirmModalRef = useRef<HTMLDivElement | null>(null);
  const createNewModalRef = useRef<HTMLDivElement | null>(null);
  const projectDropdownRef = useRef<HTMLDivElement | null>(null);
  const projectDropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const membersDropdownRef = useRef<HTMLDivElement | null>(null);
  const membersDropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const mainContentWrapperRef = useRef<HTMLDivElement | null>(null);

  const isAnyModalOpen =
    openMoreModalId !== null ||
    showEditModal ||
    showDeleteConfirmModal ||
    showCreateNewModal;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openMoreModalId !== null &&
        moreModalRef.current &&
        !moreModalRef.current.contains(e.target as Node)
      ) {
        setOpenMoreModalId(null);
        setMoreModalPosition(null);
      }
      if (
        showEditModal &&
        editModalRef.current &&
        !editModalRef.current.contains(e.target as Node)
      ) {
        setShowEditModal(false);
        setEditModalProjectName("");
        setSelectedProjectIdForEdit(null);
      }
      if (
        showDeleteConfirmModal &&
        deleteConfirmModalRef.current &&
        !deleteConfirmModalRef.current.contains(e.target as Node)
      ) {
        setShowDeleteConfirmModal(false);
        setProjectIdToDelete(null);
      }
      if (showCreateNewModal) {
        if (
          createNewModalRef.current &&
          !createNewModalRef.current.contains(e.target as Node)
        ) {
          setShowCreateNewModal(false);
          setNewProjectName("");
          setSelectedCreateProject("");
          setSelectedCreateMembers([]);
          setShowProjectDropdown(false);
          setShowMembersDropdown(false);
        } else {
          if (
            showProjectDropdown &&
            projectDropdownRef.current &&
            !projectDropdownRef.current.contains(e.target as Node) &&
            projectDropdownButtonRef.current &&
            !projectDropdownButtonRef.current.contains(e.target as Node)
          ) {
            setShowProjectDropdown(false);
          }
          if (
            showMembersDropdown &&
            membersDropdownRef.current &&
            !membersDropdownRef.current.contains(e.target as Node) &&
            membersDropdownButtonRef.current &&
            !membersDropdownButtonRef.current.contains(e.target as Node)
          ) {
            setShowMembersDropdown(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    openMoreModalId,
    showEditModal,
    showDeleteConfirmModal,
    showCreateNewModal,
    showProjectDropdown,
    showMembersDropdown,
  ]);

  const closeAllOtherModals = () => {
    setOpenMoreModalId(null);
    setMoreModalPosition(null);
    setShowEditModal(false);
    setEditModalProjectName("");
    setSelectedProjectIdForEdit(null);
    setShowDeleteConfirmModal(false);
    setProjectIdToDelete(null);
    setShowCreateNewModal(false);
    setNewProjectName("");
    setSelectedCreateProject("");
    setSelectedCreateMembers([]);
    setShowProjectDropdown(false);
    setShowMembersDropdown(false);
  };

  const toggleMoreModal = (
    id: number,
    buttonRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    closeAllOtherModals();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setOpenMoreModalId(id);
      setMoreModalPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left,
      });
    }
  };

  const handleEditClick = (projectId: number) => {
    closeAllOtherModals();
    const p = projects.find((proj) => proj.id === projectId);
    if (p) {
      setEditModalProjectName(p.name);
      setSelectedProjectIdForEdit(projectId);
      setShowEditModal(true);
    }
  };

  const handleConfirmEdit = () => {
    if (selectedProjectIdForEdit !== null) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProjectIdForEdit
            ? { ...p, name: editModalProjectName }
            : p
        )
      );
    }
    closeAllOtherModals();
  };

  const handleDeleteClick = (projectId: number) => {
    closeAllOtherModals();
    setProjectIdToDelete(projectId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (projectIdToDelete !== null) {
      setProjects((prev) => prev.filter((p) => p.id !== projectIdToDelete));
    }
    closeAllOtherModals();
  };

  const handleAddNewClick = () => {
    closeAllOtherModals();
    setShowCreateNewModal(true);
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedCreateMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateNewConfirm = () => {
    const newId = projects.length
      ? Math.max(...projects.map((p) => p.id)) + 1
      : 1;
    const assignedAvatars = selectedCreateMembers.map((id) => {
      const member = allMembers.find((m) => m.id === id);
      return member
        ? member.avatar
        : `https://placehold.co/40x40/cccccc/000000?text=${id[0].toUpperCase()}`;
    });
    const newProject: Project = {
      id: newId,
      name: newProjectName,
      assigned: assignedAvatars,
      admins: assignedAvatars.length
        ? [assignedAvatars[0]]
        : [`https://placehold.co/40x40/cccccc/000000?text=A`],
    };
    setProjects((prev) => [...prev, newProject]);
    closeAllOtherModals();
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      <div
        ref={mainContentWrapperRef}
        className={`p-8 relative transition-opacity duration-300 ${
          isAnyModalOpen ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
        style={{ zIndex: isAnyModalOpen ? 1 : "auto" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Job Scheduling Lobby
          </h2>
          <button
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            onClick={handleAddNewClick}
          >
            <Plus size={16} className="mr-2" /> Add New
          </button>
        </div>

        <h3 className="text-primary font-semibold mb-4">Active Projects</h3>

        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.length ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                toggleMoreModal={toggleMoreModal}
                isMoreModalOpen={openMoreModalId === project.id}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg py-10">
              No projects found matching your search.
            </div>
          )}
        </div>
      </div>

      <Modals
        openMoreModalId={openMoreModalId}
        moreModalPosition={moreModalPosition}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        moreModalRef={moreModalRef}
        showEditModal={showEditModal}
        editModalProjectName={editModalProjectName}
        setEditModalProjectName={setEditModalProjectName}
        handleConfirmEdit={handleConfirmEdit}
        setShowEditModal={setShowEditModal}
        setSelectedProjectIdForEdit={setSelectedProjectIdForEdit}
        editModalRef={editModalRef}
        showDeleteConfirmModal={showDeleteConfirmModal}
        handleConfirmDelete={handleConfirmDelete}
        setShowDeleteConfirmModal={setShowDeleteConfirmModal}
        setProjectIdToDelete={setProjectIdToDelete}
        deleteConfirmModalRef={deleteConfirmModalRef}
        showCreateNewModal={showCreateNewModal}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        selectedCreateProject={selectedCreateProject}
        setSelectedCreateProject={setSelectedCreateProject}
        selectedCreateMembers={selectedCreateMembers}
        setSelectedCreateMembers={setSelectedCreateMembers}
        handleSelectMember={handleSelectMember}
        handleCreateNewConfirm={handleCreateNewConfirm}
        setShowCreateNewModal={setShowCreateNewModal}
        createNewModalRef={createNewModalRef}
        allMembers={allMembers}
        availableProjectsForDropdown={projects}
        showProjectDropdown={showProjectDropdown}
        setShowProjectDropdown={setShowProjectDropdown}
        projectDropdownRef={projectDropdownRef}
        projectDropdownButtonRef={projectDropdownButtonRef}
        showMembersDropdown={showMembersDropdown}
        setShowMembersDropdown={setShowMembersDropdown}
        membersDropdownRef={membersDropdownRef}
        membersDropdownButtonRef={membersDropdownButtonRef}
      />
    </div>
  );
};

export default JobSchedulingLobby;

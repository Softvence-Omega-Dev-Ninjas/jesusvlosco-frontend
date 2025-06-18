import React, { useEffect, useRef, useState } from 'react';
import { Plus, MoreHorizontal, Search, X } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  assigned: string[];
  admins: string[];
}

// Dummy data for members, mimicking your screenshot
const allMembers = [
  { id: 'm1', name: 'Jane Cooper', role: 'Project Manager', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 'm2', name: 'Robert Fox', role: 'Construction Site Manager', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 'm3', name: 'Esther Howard', role: 'Assistant Project Manager', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 'm4', name: 'Desirae Botosh', role: 'Superintendent', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 'm5', name: 'Marley Stanton', role: 'Coordinator', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 'm6', name: 'Kaylynn Stanton', role: 'Site Supervisor', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { id: 'm7', name: 'Brandon Vaccaro', role: 'Operations Manager', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: 'm8', name: 'Erin Press', role: 'Estimating Manager', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: 'm9', name: 'Makenna Dorwart', role: 'Structural Engineer', avatar: 'https://randomuser.me/api/portraits/women/9.jpg' },
  { id: 'm10', name: 'Ann Gouse', role: 'Mechanical Engineer', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { id: 'm11', name: 'Emery Westervelt', role: 'Site Engineer', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { id: 'm12', name: 'Jocelyn Lubin', role: 'Safety Engineer', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
];

const JobSchedulingLobby: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Project 1",
      assigned: [
        "https://randomuser.me/api/portraits/men/10.jpg",
        "https://randomuser.me/api/portraits/women/11.jpg",
      ],
      admins: ["https://randomuser.me/api/portraits/men/30.jpg"],
    },
    {
      id: 2,
      name: "Project 2",
      assigned: [
        "https://randomuser.me/api/portraits/men/15.jpg",
        "https://randomuser.me/api/portraits/women/16.jpg",
      ],
      admins: ["https://randomuser.me/api/portraits/men/25.jpg"],
    },
    {
      id: 3,
      name: "Project 3",
      assigned: [
        "https://randomuser.me/api/portraits/women/18.jpg",
        "https://randomuser.me/api/portraits/men/20.jpg",
      ],
      admins: ["https://randomuser.me/api/portraits/men/35.jpg"],
    },
    {
      id: 4,
      name: "Project 4",
      assigned: [
        "https://randomuser.me/api/portraits/women/21.jpg",
        "https://randomuser.me/api/portraits/men/22.jpg",
      ],
      admins: ["https://randomuser.me/api/portraits/men/40.jpg"],
    },
  ]);

  // New state for search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [openMoreModalId, setOpenMoreModalId] = useState<number | null>(null);
  const [moreModalPosition, setMoreModalPosition] = useState<{ top: number; left: number } | null>(null);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editModalProjectName, setEditModalProjectName] = useState<string>('');
  const [selectedProjectIdForEdit, setSelectedProjectIdForEdit] = useState<number | null>(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(null);

  const [showCreateNewModal, setShowCreateNewModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [selectedCreateProject, setSelectedCreateProject] = useState<string>('');
  const [selectedCreateMembers, setSelectedCreateMembers] = useState<string[]>([]);

  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState<boolean>(false);

  const moreModalRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const editModalRef = useRef<HTMLDivElement | null>(null);
  const deleteConfirmModalRef = useRef<HTMLDivElement | null>(null);
  const createNewModalRef = useRef<HTMLDivElement | null>(null);
  const projectDropdownRef = useRef<HTMLDivElement | null>(null);
  const projectDropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const membersDropdownRef = useRef<HTMLDivElement | null>(null);
  const membersDropdownButtonRef = useRef<HTMLButtonElement | null>(null);

  const mainContentWrapperRef = useRef<HTMLDivElement>(null);

  const isAnyModalOpen = openMoreModalId !== null || showEditModal || showDeleteConfirmModal || showCreateNewModal;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openMoreModalId !== null &&
        moreModalRef.current &&
        !moreModalRef.current.contains(e.target as Node) &&
        moreButtonRefs.current[openMoreModalId] &&
        !moreButtonRefs.current[openMoreModalId]?.contains(e.target as Node)
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
        setEditModalProjectName('');
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

      if (
        showCreateNewModal &&
        createNewModalRef.current &&
        !createNewModalRef.current.contains(e.target as Node)
      ) {
        setShowCreateNewModal(false);
        setNewProjectName('');
        setSelectedCreateProject('');
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMoreModalId, showEditModal, showDeleteConfirmModal, showCreateNewModal, showProjectDropdown, showMembersDropdown]);

  const closeAllOtherModals = () => {
    setOpenMoreModalId(null);
    setMoreModalPosition(null);
    setShowEditModal(false);
    setEditModalProjectName('');
    setSelectedProjectIdForEdit(null);
    setShowDeleteConfirmModal(false);
    setProjectIdToDelete(null);
    setShowCreateNewModal(false);
    setNewProjectName('');
    setSelectedCreateProject('');
    setSelectedCreateMembers([]);
    setShowProjectDropdown(false);
    setShowMembersDropdown(false);
  };

  const toggleMoreModal = (id: number) => {
    closeAllOtherModals();
    if (openMoreModalId !== id) {
      setOpenMoreModalId(id);
      const button = moreButtonRefs.current[id];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMoreModalPosition({
          top: rect.bottom + window.scrollY + 5,
          left: rect.left,
        });
      }
    }
  };

  const handleEditClick = (projectId: number) => {
    closeAllOtherModals();
    const projectToEdit = projects.find(p => p.id === projectId);
    if (projectToEdit) {
      setEditModalProjectName(projectToEdit.name);
      setSelectedProjectIdForEdit(projectId);
      setShowEditModal(true);
    }
  };

  const handleConfirmEdit = () => {
    if (selectedProjectIdForEdit !== null) {
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProjectIdForEdit
            ? { ...project, name: editModalProjectName }
            : project
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
      setProjects(prevProjects =>
        prevProjects.filter(project => project.id !== projectIdToDelete)
      );
    }
    closeAllOtherModals();
  };

  const handleAddNewClick = () => {
    closeAllOtherModals();
    setShowCreateNewModal(true);
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedCreateMembers(prevSelected => {
      if (prevSelected.includes(memberId)) {
        return prevSelected.filter(id => id !== memberId);
      } else {
        return [...prevSelected, memberId];
      }
    });
  };

  const handleCreateNewConfirm = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;

    const assignedAvatars = selectedCreateMembers.map(memberId => {
      const member = allMembers.find(m => m.id === memberId);
      return member ? member.avatar : `https://placehold.co/40x40/cccccc/000000?text=${memberId.charAt(0).toUpperCase()}`;
    });

    const newProject: Project = {
      id: newId,
      name: newProjectName,
      assigned: assignedAvatars,
      admins: assignedAvatars.length > 0 ? [assignedAvatars[0]] : ["https://placehold.co/40x40/cccccc/000000?text=A"],
    };

    setProjects(prevProjects => [...prevProjects, newProject]);
    closeAllOtherModals();
  };

  // Filtered projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      <div
        ref={mainContentWrapperRef}
        className={`p-8 relative transition-opacity duration-300 ${
          isAnyModalOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
        style={{ zIndex: isAnyModalOpen ? 1 : 'auto' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Job Scheduling Lobby
          </h2>
          <button
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm cursor-pointer"
            onClick={handleAddNewClick}
          >
            <Plus size={16} className="mr-2" /> Add New
          </button>
        </div>

        <h3 className="text-primary font-semibold text-md mb-4">
          Active Projects
        </h3>

        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery} // Bind value to searchQuery state
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on change
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render filtered projects instead of original projects */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-[18px] mb-4">Job Scheduling</p>
                <h4 className="text-primary font-semibold text-lg mb-4">
                  {project.name}
                </h4>

                <div className="mb-4 flex items-center gap-12">
                  <p className="text-[18px] text-gray-400">Assigned</p>
                  <div className="flex items-center -space-x-4">
                    {project.assigned.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="assigned"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://placehold.co/40x40/cccccc/000000?text=${'User'.charAt(0).toUpperCase()}`;
                        }}
                      />
                    ))}
                    <button className="w-10 h-10 rounded-full border border-gray-500 text-black flex items-center justify-center text-sm cursor-pointer">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <p className="text-[18px] text-gray-400">Admins</p>
                  <div className="flex">
                    {project.admins.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="admin"
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://placehold.co/40x40/cccccc/000000?text=${'Admin'.charAt(0).toUpperCase()}`;
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center border-t-2 border-gray-200 pt-4">
                <button
                  ref={(el) => {
                    moreButtonRefs.current[project.id] = el;
                  }}
                  onClick={() => toggleMoreModal(project.id)}
                  className="w-10 h-10 border border-gray-300 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                >
                  <MoreHorizontal size={20} />
                </button>
                <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer ">
                  Access Schedule
                </button>
              </div>
            </div>
          ))}
          {/* Optional: Message if no projects match the search */}
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg py-10">
              No projects found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same as in your previous code */}
      {openMoreModalId !== null && moreModalPosition && (
        <div
          ref={moreModalRef}
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 w-32 py-1 z-30"
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

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
          <div ref={editModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-gray-200 relative">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditModalProjectName('');
                setSelectedProjectIdForEdit(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Title this scheduler
            </h3>

            <input
              type="text"
              placeholder="Project 1"
              value={editModalProjectName}
              onChange={(e) => setEditModalProjectName(e.target.value)}
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-center text-lg"
            />

            <button
              onClick={handleConfirmEdit}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors focus:outline-none cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div ref={deleteConfirmModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-gray-200 relative text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <X className="text-red-500" size={36} strokeWidth={2} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-600 mb-6">
              Do you really want to delete these record? This process cannot be undone.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setProjectIdToDelete(null);
                }}
                className="cursor-pointer px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateNewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div ref={createNewModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-200 relative cursor-pointer">
            <button
              onClick={() => {
                setShowCreateNewModal(false);
                setNewProjectName('');
                setSelectedCreateProject('');
                setSelectedCreateMembers([]);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Create Project Name
            </h3>

            <input
              type="text"
              placeholder="Enter project name here"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-lg"
            />

            <h4 className="text-md font-semibold text-gray-700 mb-2">Choose Projects</h4>
            <div className="relative mb-4">
              <button
                ref={projectDropdownButtonRef}
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex justify-between items-center text-lg focus:outline-none"
              >
                {selectedCreateProject || "Select project"}
                <svg className={`fill-current h-4 w-4 transform transition-transform ${showProjectDropdown ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </button>
              {showProjectDropdown && (
                <div
                  ref={projectDropdownRef}
                  className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedCreateProject(project.name);
                        setShowProjectDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h4 className="text-md font-semibold text-gray-700 mb-2">Choose Specific Members</h4>
            <div className="relative mb-6">
              <button
                ref={membersDropdownButtonRef}
                onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex justify-between items-center text-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                {selectedCreateMembers.length > 0
                  ? selectedCreateMembers.map(memberId => allMembers.find(m => m.id === memberId)?.name).join(', ')
                  : "Select member"}
                <svg className={`fill-current h-4 w-4 transform transition-transform ${showMembersDropdown ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </button>
              {showMembersDropdown && (
                <div
                  ref={membersDropdownRef}
                  className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {allMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMember(member.id)}
                      className="flex items-center w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://placehold.co/32x32/cccccc/000000?text=${member.name.charAt(0).toUpperCase()}`;
                        }}
                      />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </div>
                      {selectedCreateMembers.includes(member.id) && (
                        <svg className="ml-auto w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCreateNewConfirm}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
            >
              <Plus size={20} className="mr-2" /> Create New
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSchedulingLobby;
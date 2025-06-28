import React from 'react';
import { Plus, X } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: number;
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
  setSelectedProjectIdForEdit: React.Dispatch<React.SetStateAction<number | null>>;
  editModalRef: React.RefObject<HTMLDivElement | null>;

  showDeleteConfirmModal: boolean;
  handleConfirmDelete: () => void;
  setShowDeleteConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectIdToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  deleteConfirmModalRef: React.RefObject<HTMLDivElement | null>;

  showCreateNewModal: boolean;
  newProjectName: string;
  setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
  selectedCreateProject: string;
  setSelectedCreateProject: React.Dispatch<React.SetStateAction<string>>;
  selectedCreateMembers: string[];
  setSelectedCreateMembers: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelectMember: (memberId: string) => void;
  handleCreateNewConfirm: () => void;
  setShowCreateNewModal: React.Dispatch<React.SetStateAction<boolean>>;
  createNewModalRef: React.RefObject<HTMLDivElement | null>;
  allMembers: Member[];
  availableProjectsForDropdown: Project[];
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
  selectedCreateProject,
  setSelectedCreateProject,
  selectedCreateMembers,
  setSelectedCreateMembers,
  handleSelectMember,
  handleCreateNewConfirm,
  setShowCreateNewModal,
  createNewModalRef,
  allMembers,
  availableProjectsForDropdown,
  showProjectDropdown,
  setShowProjectDropdown,
  projectDropdownRef,
  projectDropdownButtonRef,
  showMembersDropdown,
  setShowMembersDropdown,
  membersDropdownRef,
  membersDropdownButtonRef,
}) => (
  <>
    {openMoreModalId !== null && moreModalPosition && (
      <div
        ref={moreModalRef}
        className="fixed bg-white rounded-lg shadow-lg border w-32 py-1 z-30"
        style={{ top: moreModalPosition.top, left: moreModalPosition.left }}
      >
        <button
          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
          onClick={() => handleEditClick(openMoreModalId)}
        >
          Edit
        </button>
        <button
          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
          onClick={() => handleDeleteClick(openMoreModalId)}
        >
          Delete
        </button>
      </div>
    )}

    {showEditModal && (
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
        <div ref={editModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border relative">
          <button
            onClick={() => {
              setShowEditModal(false);
              setEditModalProjectName('');
              setSelectedProjectIdForEdit(null);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-bold mb-6 text-center">Title this scheduler</h3>

          <input
            type="text"
            placeholder="Project 1"
            value={editModalProjectName}
            onChange={e => setEditModalProjectName(e.target.value)}
            className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-center text-lg"
          />

          <button
            onClick={handleConfirmEdit}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium text-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    )}

    {showDeleteConfirmModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div ref={deleteConfirmModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative text-center border">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <X className="text-red-500" size={36} strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
          <p className="text-gray-600 mb-6">
            Do you really want to delete this project? This process cannot be undone.
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

    {showCreateNewModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div ref={createNewModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border">
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

          <h3 className="text-xl font-bold mb-6 text-center">Create Project Name</h3>

          <input
            type="text"
            placeholder="Enter project name here"
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-lg"
          />

          <h4 className="text-md font-semibold mb-2">Choose Projects</h4>
          <div className="relative mb-4">
            <button
              ref={projectDropdownButtonRef}
              onClick={() => setShowProjectDropdown(prev => !prev)}
              className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center text-lg"
            >
              {selectedCreateProject || "Select project"}
              <svg className={`fill-current h-4 w-4 transform ${showProjectDropdown ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L6.757 7.586L5.343 9z" />
              </svg>
            </button>
            {showProjectDropdown && (
              <div ref={projectDropdownRef} className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {availableProjectsForDropdown.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedCreateProject(p.name);
                      setShowProjectDropdown(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h4 className="text-md font-semibold mb-2">Choose Specific Members</h4>
          <div className="relative mb-6">
            <button
              ref={membersDropdownButtonRef}
              onClick={() => setShowMembersDropdown(prev => !prev)}
              className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center text-lg focus:ring-1 focus:ring-blue-400"
            >
              {selectedCreateMembers.length
                ? selectedCreateMembers.map(id => allMembers.find(m => m.id === id)?.name).join(', ')
                : "Select member"}
              <svg className={`fill-current h-4 w-4 transform ${showMembersDropdown ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L6.757 7.586L5.343 9z" />
              </svg>
            </button>
            {showMembersDropdown && (
              <div ref={membersDropdownRef} className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {allMembers.map(mem => (
                  <button
                    key={mem.id}
                    onClick={() => handleSelectMember(mem.id)}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <img
                      src={mem.avatar}
                      alt={mem.name}
                      className="w-8 h-8 rounded-full mr-3"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).onerror = null;
                        e.currentTarget.src = `https://placehold.co/32x32/cccccc/000000?text=${mem.name.charAt(0).toUpperCase()}`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{mem.name}</div>
                      <div className="text-sm text-gray-500">{mem.role}</div>
                    </div>
                    {selectedCreateMembers.includes(mem.id) && (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586L15.707 5.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCreateNewConfirm}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" /> Create New
          </button>
        </div>
      </div>
    )}
  </>
);

export default Modals;

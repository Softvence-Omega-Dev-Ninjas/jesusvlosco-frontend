/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { TProject } from "@/types/projectType";
import Swal from "sweetalert2";
import { useDeleteProjectMutation, useUpdateProjectTitleMutation } from "@/store/api/admin/shift-sheduling/CreateProjectapi";


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
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProjectTitle] = useUpdateProjectTitleMutation();
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

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
                <Plus size={14} />
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
    </div>
  );
};

export default ProjectCard;

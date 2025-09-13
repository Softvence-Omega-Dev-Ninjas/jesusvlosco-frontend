import {
  useGetProjectManagementDataQuery,
  useManageProjectsMutation,
} from "@/store/api/admin/settings/getProjectManagementApi";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../assets/delete.png";
import distanceIcon from "../../assets/distance (1).png";

interface Project {
  id?: string; // optional because new ones may not have ID yet
  projectName: string;
  projectLocation: string;
  managerName: string;
}

const ProjectManagement: React.FC = () => {
  const { data, isLoading } = useGetProjectManagementDataQuery(undefined);
  const [manageProjects, { isLoading: isSaving }] = useManageProjectsMutation();

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (data?.data) {
      const mappedProjects = data.data.map((item: any) => ({
        id: item.id,
        projectName: item.title || "Project name",
        projectLocation: item.projectLocation || "Project Location",
        managerName: item.manager
          ? `${item.manager.profile?.firstName || ""} ${
              item.manager.profile?.lastName || ""
            }`.trim()
          : "Type Here",
      }));
      setProjects(mappedProjects);
    }
  }, [data]);

  const handleDeleteProject = (idToDelete: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== idToDelete)
    );
  };

  const handleProjectChange = (
    idToUpdate: string,
    field: keyof Project,
    newValue: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === idToUpdate ? { ...project, [field]: newValue } : project
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      // Only send id + title (not manager update for now)
      const payload = projects.map((p) => ({
        id: p.id,
        title: p.projectName,
      }));

      await manageProjects(payload).unwrap();
      alert("Projects updated successfully!");
    } catch (err) {
      console.error("Error updating projects:", err);
      alert("Failed to save changes.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <h1 className="text-2xl text-primary mb-8">
        Manage Your Project's Location, Titles & Manager
      </h1>

      <div className="w-full max-w-4xl">
        <div className="space-y-4 border border-gray-200 p-6 rounded-md ">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col md:flex-row items-center"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 w-full text-[#484848]">
                {/* Project Title Editable */}
                <div className="md:col-span-2">
                  <label
                    htmlFor={`project-name-${project.id}`}
                    className="block text-[#484848] text-sm font-semibold mb-1"
                  >
                    Project
                  </label>

                  <input
                    id={`project-name-${project.id}`}
                    type="text"
                    value={project.projectName}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id!,
                        "projectName",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="flex items-center text-[#484848] gap-2 mt-2">
                    <img src={distanceIcon} alt="distance" />
                    <span>{project.projectLocation}</span>
                  </div>
                </div>

                {/* Manager stays unchanged for now */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <label
                    htmlFor={`manager-${project.id}`}
                    className="text-[#484848] text-sm font-semibold mx-6"
                  >
                    Manager
                  </label>
                  <input
                    id={`manager-${project.id}`}
                    type="text"
                    value={project.managerName}
                    disabled
                    className="border border-gray-200 bg-gray-100 rounded-md p-2 flex-1"
                  />
                </div>
              </div>

              <button
                onClick={() => handleDeleteProject(project.id!)}
                className="pl-4 "
                aria-label="Delete project"
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-end mt-8">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="bg-primary text-white cursor-pointer py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProjectManagement;

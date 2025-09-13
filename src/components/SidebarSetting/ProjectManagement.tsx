import {
  useGetProjectManagementDataQuery,
  useManageProjectsMutation,
} from "@/store/api/admin/settings/getProjectManagementApi";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../assets/delete.png";

interface Project {
  id?: string;
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
      const payload = projects.map((p) => ({
        id: p.id,
        title: p.projectName,
        projectLocation: p.projectLocation,
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
      <h1 className="text-2xl text-primary mb-8 font-semibold">
        Manage Your Projects
      </h1>

      <div className="w-full max-w-3xl space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative border border-gray-200 rounded-lg p-5 shadow-sm"
          >
            {/* Delete Icon */}
            <button
              onClick={() => handleDeleteProject(project.id!)}
              className="absolute top-3 right-3"
              aria-label="Delete project"
            >
              <img src={deleteIcon} alt="delete" className="w-5 h-5" />
            </button>

            {/* Project Title */}
            <div className="mb-4">
              <label
                htmlFor={`project-name-${project.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Title
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
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                htmlFor={`location-${project.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`location-${project.id}`}
                  type="text"
                  value={project.projectLocation}
                  onChange={(e) =>
                    handleProjectChange(
                      project.id!,
                      "projectLocation",
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Manager */}
            <div>
              <label
                htmlFor={`manager-${project.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Manager
              </label>
              <input
                id={`manager-${project.id}`}
                type="text"
                value={project.managerName}
                disabled
                className="border border-gray-200 bg-gray-100 rounded-md p-2 w-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl flex justify-end mt-8">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="bg-primary text-white py-2 px-6 rounded-lg shadow-md hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProjectManagement;

import { useGetProjectManagementDataQuery } from "@/store/api/admin/settings/getProjectManagementApi";
import { MapPinIcon, PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  projectName: string;
  projectLocation: string;
  managerName: string;
}

const ProjectManagement: React.FC = () => {
  const { data } = useGetProjectManagementDataQuery(undefined);

  // State to hold projects (initialized empty, will load from API)
  const [projects, setProjects] = useState<Project[]>([]);

  // Load API data when it arrives
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

  const handleAddProject = () => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        id: String(Date.now()),
        projectName: "Project name",
        projectLocation: "Project Location",
        managerName: "",
      },
    ]);
  };

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

  const handleSaveChanges = () => {
    console.log("Saving changes:", projects);
    alert("Changes saved! (Check console for data)");
  };

  return (
    <div className="min-h-screen  flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <h1 className="text-2xl  text-primary mb-8">Project Management</h1>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Project</h2>
          <button
            onClick={handleAddProject}
            className="flex items-center text-primary font-medium cursor-pointer py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Project
          </button>
        </div>

        <div className="space-y-4 border border-gray-200 p-6 rounded-md ">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col md:flex-row items-center"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-[#484848]">
                <div>
                  <label
                    htmlFor={`project-name-${project.id}`}
                    className="block text-[#484848] text-sm font-semibold mb-1"
                  >
                    Project
                  </label>
                  <select
                    id={`project-name-${project.id}`}
                    value={project.projectName}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "projectName",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.projectName}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center text-[#484848] text-sm mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{project.projectLocation}</span>{" "}
                    {/* This is already mapped */}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`manager-${project.id}`}
                    className="block text-[#484848] text-sm font-semibold mb-1"
                  >
                    Manager
                  </label>
                  <input
                    id={`manager-${project.id}`}
                    type="text"
                    value={project.managerName}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "managerName",
                        e.target.value
                      )
                    }
                    placeholder="Type here"
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleDeleteProject(project.id)}
                className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                aria-label="Delete project"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-end mt-8">
        <button
          onClick={handleSaveChanges}
          className="bg-primary text-white cursor-pointer py-2 px-4 rounded-lg shadow-md transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProjectManagement;

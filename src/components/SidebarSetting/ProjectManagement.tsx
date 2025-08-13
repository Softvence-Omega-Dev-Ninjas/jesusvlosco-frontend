import { useGetProjectManagementDataQuery } from "@/store/api/admin/settings/getProjectManagementApi";
import {  PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

import deleteIcon from '../../assets/delete.png';
import distanceIcon from '../../assets/distance (1).png';
import arrowIcon from '../../assets/arrow.png';

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
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 w-full text-[#484848]">
                {/* Project field - 2 columns */}
                <div className="md:col-span-2">
  <label
    htmlFor={`project-name-${project.id}`}
    className="block text-[#484848] text-sm font-semibold mb-1"
  >
    Project
  </label>

  <div className="relative w-full">
    <select
      id={`project-name-${project.id}`}
      value={project.projectName}
      onChange={(e) =>
        handleProjectChange(project.id, "projectName", e.target.value)
      }
      className="appearance-none border border-gray-300 rounded-md p-2 w-full pr-10 focus:ring-blue-500 focus:border-blue-500"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.projectName}>
          {p.projectName}
        </option>
      ))}
    </select>

    <img
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none "
      src={arrowIcon}
      alt="Arrow"
    />
  </div>

  <div className="flex items-center text-[#484848] gap-2 mt-2">
    <img src={distanceIcon} alt="distance"  />
    <span>{project.projectLocation}</span>
  </div>
</div>


                {/* Manager field - 3 columns */}
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
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "managerName",
                        e.target.value
                      )
                    }
                    placeholder="Type here"
                    className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleDeleteProject(project.id)}
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
          className="bg-primary text-white cursor-pointer py-2 px-4 rounded-lg shadow-md transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProjectManagement;

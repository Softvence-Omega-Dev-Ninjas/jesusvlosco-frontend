import { MapPinIcon, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

// Define the shape of a single project object
interface Project {
  id: string; // Unique ID for each project entry
  projectName: string;
  projectLocation: string;
  managerName: string; // Now can be any string from an input
}

const ProjectManagement: React.FC = () => {
  // State to hold all the projects
  // Initialized with three default project entries
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      projectName: 'Project 1',
      projectLocation: 'New York City',
      managerName: 'Brooklyn Simmons',
    },
    {
      id: '2',
      projectName: 'Project name', // Default placeholder name
      projectLocation: 'Project Location', // Default placeholder location
      managerName: 'Type Here', // Default placeholder for manager
    },
    {
      id: '3',
      projectName: 'Project name', // Default placeholder name
      projectLocation: 'Project Location', // Default placeholder location
      managerName: 'Type Here', // Default placeholder for manager
    },
  ]);

  // Function to add a new project
  const handleAddProject = () => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        id: String(Date.now()), // Simple unique ID generation based on timestamp
        projectName: 'Project name', // Default value for new project
        projectLocation: 'Project Location', // Default value for new project
        managerName: '', // Default to empty string for the new input field
      },
    ]);
  };

  // Function to delete a project by its ID
  const handleDeleteProject = (idToDelete: string) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== idToDelete));
  };

  // Function to update a project's details based on its ID and the field to update
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

  // Function to handle saving changes (placeholder for actual API call)
  const handleSaveChanges = () => {
    console.log('Saving changes:', projects);
    // In a real application, you would typically send this 'projects' data to a backend API.
    // Using alert for demonstration purposes, but for production, use a custom modal/notification.
    alert('Changes saved! (Check console for data)');
  };

  return (
    <div className="min-h-screen  flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Page Title */}
      <h1 className="text-2xl  text-primary mb-8">Project Management</h1>

      {/* Main Container for Project Cards */}
      <div className="   w-full max-w-4xl"> {/* Restored bg-white and shadow-xl */}
        {/* Header section for the project list */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Project</h2>
          <button
            onClick={handleAddProject}
            className="flex items-center text-primary font-medium cursor-pointer py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" /* Restored blue colors and ring */
          >
            <PlusIcon className="h-5 w-5 mr-1" /> {/* Plus icon from Lucide React */}
            Add Project
          </button>
        </div>

        {/* List of individual Project Entry components */}
        <div className="space-y-4 border border-gray-200 p-6 rounded-md ">
          {projects.map((project) => (
            <div
              key={project.id} // Unique key for list rendering
              className="flex flex-col md:flex-row items-center " /* Restored bg-gray-50, padding, rounded, shadow, border */
            >
              {/* Flex-1 ensures this section takes available space */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-[#484848]">
                {/* Project Details (Left Side - Project Name and Location) */}
                <div>
                  {/* Label for Project Name (now visible, consistent with Manager) */}
                  <label htmlFor={`project-name-${project.id}`} className="block text-[#484848] text-sm font-semibold mb-1">
                    Project
                  </label>
                  <select
                    id={`project-name-${project.id}`}
                    value={project.projectName}
                    onChange={(e) =>
                      handleProjectChange(project.id, 'projectName', e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500" /* Restored focus styles */
                  >
                    <option value="Project 1">Project 1</option>
                    <option value="Project 2">Project 2</option>
                    <option value="Project 3">Project 3</option>
                    <option value="Project name">Project name</option> {/* Default option */}
                  </select>
                  <div className="flex items-center text-[#484848] text-sm mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" /> {/* Map pin icon from Lucide React */}
                    <span>{project.projectLocation}</span>
                  </div>
                </div>

                {/* Manager Details (Right Side - Manager label above input field) */}
                {/* This div no longer uses flex items-center, allowing the label to stack */}
                <div>
                  <label htmlFor={`manager-${project.id}`} className="block text-[#484848] text-sm font-semibold mb-1">
                    Manager
                  </label>
                  <input
                    id={`manager-${project.id}`}
                    type="text"
                    value={project.managerName}
                    onChange={(e) =>
                      handleProjectChange(project.id, 'managerName', e.target.value)
                    }
                    placeholder="Type here"
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500" /* Restored focus styles */
                  />
                </div>
              </div>

              {/* Delete Button for each project entry */}
              <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-red-500 hover:text-red-700 cursor-pointer">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button Container - now aligns button to the right */}
      <div className="w-full max-w-4xl flex justify-end mt-8"> {/* New div to control alignment */}
        <button
          onClick={handleSaveChanges}
          className="bg-primary text-white cursor-pointer py-2 px-4 rounded-lg shadow-md transition " /* Restored indigo colors and ring */
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProjectManagement;

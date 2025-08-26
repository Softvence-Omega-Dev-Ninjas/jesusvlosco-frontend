/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, Search, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ProjectCard from "@/components/JobSchedul/ProjectCard";
// import Modals from "@/components/JobSchedul/Modals";
import { useGetAllProjectsQuery, useCreateProjectMutation } from "@/store/api/admin/shift-sheduling/CreateProjectapi";
import { TProject } from "@/types/projectType";
import { useGetAllTeamDataQuery } from "@/store/api/admin/shift-sheduling/getAllTeamApi";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";






interface ProjectFormData {
  projectName: string;
  team: string;
  manager: string;
  projectLocation: string;
}

const ScheduleAssignPage: React.FC = () => {
    const projects = useGetAllProjectsQuery({});
    const [createProject] = useCreateProjectMutation();
    const teams = useGetAllTeamDataQuery({limit: 50});
  const users = useGetAllUserQuery({limit: 1000});
  // Ensure managers is always an array to avoid calling .map on undefined
  const managers = users.data?.data || []
   
    const allTeams = teams.data?.data?.teams || [];
    console.log(allTeams, "Teams");
  
    const allProjects = (projects as any).data?.data?.projects || [];

    const [openMoreModalId, setOpenMoreModalId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form setup
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectFormData>();

    // toggle handler expected by ProjectCard
    const toggleMoreModal = (id: string) => {
        setOpenMoreModalId((prev) => (prev === id ? null : id));
    };

    // Form submission
    const onSubmit = async (data: ProjectFormData) => {
        console.log(data);
        try {
            await createProject({
                title: data.projectName,
                teamId: data.team,
                managerId: data.manager,
                projectLocation: data.projectLocation,
            }).unwrap();
            
            setShowCreateModal(false);
            reset();
            // Success notification could be added here
        } catch (error) {
            console.error('Failed to create project:', error);
            // Error notification could be added here
        }
    };

    // Filter projects based on search
    const filteredProjects = allProjects.filter((project: TProject) =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(allProjects);



  return (
    <div className="min-h-screen relative">
      <div
        className={`p-8 relative transition-opacity duration-300`
        }
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Job Scheduling Lobby
          </h2>
          <button
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            onClick={() => setShowCreateModal(true)}
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
            filteredProjects.map((project: TProject) => (
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
          )
           } 
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  {...register("projectName", { required: "Project name is required" })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-xs mt-1">{errors.projectName.message}</p>
                )}
              </div>

              {/* Teams Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team *
                </label>
                <select
                  {...register("team", { required: "Team selection is required" })}
                  className="capitalize w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {
                    allTeams.map((team: any) => (
                      <option key={team.id} value={team.id}>
                        {team.title}
                      </option>
                    ))
                  }
                </select>
                {errors.team && (
                  <p className="text-red-500 text-xs mt-1">{errors.team.message}</p>
                )}
              </div>

              {/* Manager Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager *
                </label>
                <select
                  {...register("manager", { required: "Manager selection is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a manager</option>
                 {
                   managers.map((manager: any) => (
                     <option key={manager.id} value={manager.id}>
                       {manager.profile?.firstName} {manager.profile?.lastName}
                     </option>
                   ))
                 }
                </select>
                {errors.manager && (
                  <p className="text-red-500 text-xs mt-1">{errors.manager.message}</p>
                )}
              </div>

              {/* Project Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Location *
                </label>
                <input
                  {...register("projectLocation", { required: "Project location is required" })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project location"
                />
                {errors.projectLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.projectLocation.message}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAssignPage;   
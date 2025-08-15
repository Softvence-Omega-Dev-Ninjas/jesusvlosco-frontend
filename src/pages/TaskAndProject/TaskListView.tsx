import { IProject } from "@/types/taskTypes";
import ProjectGroup from "./ProjectGroup";

interface TaskListViewProps {
  projects: IProject[];
  groupBy: "title" | "label" | "assignedTo";
  activeProject: string | null;
  isTaskSelected: (taskId: string) => boolean;
  toggleTask: (taskId: string) => void;
  toggleProject: (projectId: string) => void;
  getProjectNameForTask: (taskId: string) => string;
}

export default function TaskListView({
  projects,
  groupBy,
  activeProject,
  isTaskSelected,
  toggleTask,
  toggleProject,
  getProjectNameForTask,
}: TaskListViewProps) {
  return (
    <>
      {/* Mobile View */}
      <div className="block sm:hidden">
        {projects.map(
          (project) =>
            project.tasks.length > 0 && (
              <ProjectGroup
                key={project.id}
                project={project}
                groupBy={groupBy}
                isMobile={true}
                isExpanded={activeProject === project.id}
                isTaskSelected={isTaskSelected}
                toggleTask={toggleTask}
                toggleProject={toggleProject}
                getProjectNameForTask={getProjectNameForTask}
              />
            )
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        {projects.map(
          (project) =>
            project.tasks.length > 0 && (
              <ProjectGroup
                key={project.id}
                project={project}
                groupBy={groupBy}
                isMobile={false}
                isExpanded={true}
                isTaskSelected={isTaskSelected}
                toggleTask={toggleTask}
                toggleProject={toggleProject}
                getProjectNameForTask={getProjectNameForTask}
              />
            )
        )}
      </div>
    </>
  );
}

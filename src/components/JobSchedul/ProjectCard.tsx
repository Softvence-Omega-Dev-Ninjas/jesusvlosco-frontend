import React, { useRef } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAllTeamDataQuery } from '@/store/api/admin/shift-sheduling/getAllTeamApi';

// Define the Project interface here, as ProjectCard directly uses it
interface Project {
  id: number;
  name: string;
  assigned: string[];
  admins: string[];
}

interface ProjectCardProps {
  project: Project;
  // Change the type of buttonRef to accept HTMLButtonElement or null
  toggleMoreModal: (id: number, buttonRef: React.RefObject<HTMLButtonElement | null>) => void;
  isMoreModalOpen: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, toggleMoreModal, isMoreModalOpen }) => {

   const {data}=useGetAllTeamDataQuery(undefined)
  console.log(data)
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm flex flex-col justify-between">
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
          ref={moreButtonRef}
          onClick={() => {
          
            toggleMoreModal(project.id, moreButtonRef);
          }}
          className={`w-10 h-10 border border-gray-300 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-100 cursor-pointer ${isMoreModalOpen ? 'bg-gray-100' : ''}`}
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
  );
};

export default ProjectCard;
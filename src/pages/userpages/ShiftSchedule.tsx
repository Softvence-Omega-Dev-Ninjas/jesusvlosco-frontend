/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetMyProjectsQuery } from "@/store/api/user/project/projectApi";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from "lucide-react";

const ShiftSchedule = () => {
  const { data, isLoading, isFetching } = useGetMyProjectsQuery({});
  const projects = data?.data?.projectWithShifts || [];

  const getTotalShifts = (project: any) => {
    return project.shifts?.length || 0;
  };

  const getPublishedShifts = (project: any) => {
    return project.shifts?.filter((shift: any) => shift.shiftStatus)?.length || 0;
  };

  const getShiftStatus = (project: any) => {
    const published = getPublishedShifts(project);
    const total = getTotalShifts(project);
    
    if (total === 0) return { status: 'no-shifts', color: 'gray', icon: AlertCircle };
    if (published === total) return { status: 'all-published', color: 'green', icon: CheckCircle2 };
    if (published > 0) return { status: 'partial', color: 'yellow', icon: Clock };
    return { status: 'none-published', color: 'red', icon: AlertCircle };
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-5">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage your assigned projects and track shift schedules
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              {projects.length} Active Project{projects.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              {projects.reduce((acc: number, p: any) => acc + getPublishedShifts(p), 0)} Shifts Published
            </span>
          </div>
        </div>
      </div>            {/* Enhanced Loading skeleton */}
            {(isLoading || isFetching) && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="group p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 animate-pulse"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-2"></div>
                                </div>
                                <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                            </div>
                            
                            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Enhanced Empty state */}
            {!isLoading && !isFetching && projects.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                    <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                        <AlertCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Assigned</h3>
                    <p className="text-gray-500 text-center max-w-md leading-relaxed">
                        You currently don't have any assigned projects with published shifts. 
                        Check back later or contact your manager for new assignments.
                    </p>
                    <div className="mt-6 flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Projects will appear here when assigned</span>
                    </div>
                </div>
            )}

            {/* Enhanced Projects grid */}
            {!isLoading && !isFetching && projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project: any) => {
                        const publishedShifts = getPublishedShifts(project);
                        const totalShifts = getTotalShifts(project);
                        const status = getShiftStatus(project);
                        const StatusIcon = status.icon;
                        
                        return (
                            <div
                                key={project.project.id}
                                className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Gradient background accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {project.project.title}
                                                </h3>
                                            </div>
                                            
                                            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    {project.project.location || "Location not specified"}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Status indicator */}
                                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                            status.color === 'green' ? 'bg-green-100 text-green-800' :
                                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                            status.color === 'red' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            <StatusIcon className="h-3 w-3" />
                                            <span className="hidden sm:inline">
                                                {status.status === 'all-published' ? 'Complete' :
                                                 status.status === 'partial' ? 'In Progress' :
                                                 status.status === 'none-published' ? 'Pending' : 'No Shifts'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-900">Published Shifts</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-lg font-bold text-blue-600">{publishedShifts}</span>
                                                {totalShifts > 0 && (
                                                    <span className="text-sm text-blue-500">/ {totalShifts}</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {totalShifts > 0 && (
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${
                                                        publishedShifts === totalShifts ? 'bg-green-500' :
                                                        publishedShifts > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${(publishedShifts / totalShifts) * 100}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    <Link
                                        to={`${project.project.id}`}
                                        aria-label={`Access project ${project.project.title}`}
                                        className="group/btn flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                                    >
                                        <span>Access Project</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ShiftSchedule;
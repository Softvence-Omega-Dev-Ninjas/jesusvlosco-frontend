import { useGetUserProfileQuery } from "@/store/api/auth/authApi";
import { useGetAllProjectUserQuery } from "@/store/api/user/project/projectApi";
import { TProject } from "@/types/projectType";


const ShiftSchedule = () => {
    const userProjects = useGetUserProfileQuery({})
    console.log(userProjects, "userProjects");
    const projects = useGetAllProjectUserQuery({})
    console.log(projects, "allProjects");
    return (
        <div>
            <h1>Projects Assigned</h1>
            <ul>
                {userProjects?.data?.data?.projects.map((project: TProject) => (
                    <li key={project.id}>{project.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default ShiftSchedule;
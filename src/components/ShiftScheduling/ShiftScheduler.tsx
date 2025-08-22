/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import EmployeeAvailability from "./EmployeeAvailability";
import WeeklyScheduleGrid from "./WeeklySchedule";
import { useParams } from "react-router-dom";
import { useGetSingleProjectQuery } from "@/store/api/admin/shift-sheduling/CreateProjectapi";

const ShiftScheduler: FC = () => {
  const currentProjectId = useParams().id;
  const projectInformation = useGetSingleProjectQuery(
    currentProjectId as string
  );
  const projectData = (projectInformation as any).data?.data;
  return (
    <div className="flex flex-col gap-5 items-start lg:flex-row w-full h-full">
      <EmployeeAvailability projectInformation={projectData} />
      <WeeklyScheduleGrid projectInformation={projectData} />
    </div>
  );
};

export default ShiftScheduler;

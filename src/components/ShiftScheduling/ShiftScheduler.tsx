import { FC } from "react";
import EmployeeAvailability from "./EmployeeAvailability";
import WeeklyScheduleGrid from "./WeeklySchedule";

const ShiftScheduler: FC = () => {
  return (
    <div className="flex flex-col gap-5 items-start lg:flex-row w-full h-full">
      <EmployeeAvailability />
      <WeeklyScheduleGrid />
    </div>
  );
};

export default ShiftScheduler;

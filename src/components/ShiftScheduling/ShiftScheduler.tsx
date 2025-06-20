import { FC } from "react";
import EmployeeAvailability from "./EmployeeAvailability";
import WeeklySchedule from "./WeeklySchedule";

const ShiftScheduler: FC = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <EmployeeAvailability />
      <WeeklySchedule />
    </div>
  );
};

export default ShiftScheduler;
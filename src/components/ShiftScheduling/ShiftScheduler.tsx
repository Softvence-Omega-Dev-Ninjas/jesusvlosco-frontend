
import { FC } from "react";
import WeeklyScheduleGrid from "./WeeklySchedule";

const ShiftScheduler: FC = () => {
  return (
    <div className=" flex flex-col gap-5 items-start lg:flex-row w-full h-full">
      <WeeklyScheduleGrid />
    </div>
  );
};

export default ShiftScheduler;

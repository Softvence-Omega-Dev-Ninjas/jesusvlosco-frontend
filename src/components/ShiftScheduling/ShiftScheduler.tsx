
import { FC, useState } from "react";
import EmployeeAvailability from "./EmployeeAvailability";
import WeeklyScheduleGrid from "./WeeklySchedule";


interface PublishedShift {
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  tasksDone: boolean;
  status: 'published' | 'draft';
}

const ShiftScheduler: FC = () => {
  const [publishedShifts, setPublishedShifts] = useState<PublishedShift[]>([]);

  const addPublishedShift = (newShift: PublishedShift) => {
    setPublishedShifts([...publishedShifts, newShift]);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <EmployeeAvailability addPublishedShift={addPublishedShift} />
      <WeeklyScheduleGrid publishedShifts={publishedShifts} />
    </div>
  );
};

export default ShiftScheduler;




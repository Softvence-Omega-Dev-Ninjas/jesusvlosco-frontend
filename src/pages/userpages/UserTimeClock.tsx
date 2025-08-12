import TimeSheet from "@/components/UserTimeClockComponents/TimeSheet";
import TimeTrackingDashboard from "@/components/ShiftScheduling/UserClock";

export default function UserTimeClock() {
  return (
    <div className="space-y-14 px-4">
      <TimeTrackingDashboard />
      <TimeSheet />
    </div>
  );
}

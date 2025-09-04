/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { useSendUpdateLocationMutation } from "@/store/api/clockInOut/clockinoutapi";
import {
  getCurrentLocationWithGoogleMaps,
  formatLocationForAPI,
} from "@/utils/googleMapsLocation";
import { AlarmIcon } from "./icons";
import { Shift } from "./types";

interface CurrentShiftCardProps {
  shift: Shift;
  team: any[];
  clockStatus: "ACTIVE" | "COMPLETED";
  // isClockedIn: boolean;
  isClockedOut: boolean;
}

const CurrentShiftCard: React.FC<CurrentShiftCardProps> = ({
  shift,
  team,
  clockStatus,
  // isClockedIn,
  isClockedOut,
}) => {
  const [isClocking, setIsClocking] = useState(false);
  const [isClockOut, setIsClockOut] = useState(false);
  const [sendUpdateLocation] = useSendUpdateLocationMutation();

  // 🔹 Common function for Clock In / Out
  const handleClockAction = async (action: "CLOCK_IN" | "CLOCK_OUT") => {
    if (action === "CLOCK_IN") {
      setIsClocking(true);
    } else {
      setIsClockOut(true);
    }
    try {
      const locationResult = await getCurrentLocationWithGoogleMaps();
      const formattedLocation = formatLocationForAPI(locationResult);

      const response = await sendUpdateLocation({
        lat: formattedLocation.latitude,
        lng: formattedLocation.longitude,
        action,
      }).unwrap();

      console.log(`📡 ${action} response:`, response);

      // Use API message if available
      toast.success(
        response.message || `${action.replace("_", " ")} successful!`
      );
    } catch (error: any) {
      console.error(`❌ ${action} error:`, error);

      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsClocking(false);
      setIsClockOut(false);
    }
  };

  const isClockInButtonDisabled =
    isClocking || clockStatus === "ACTIVE" || shift.startTime === "No shift";
  const isClockOutButtonDisabled =
    isClockOut || isClockedOut || shift.startTime === "No shift";

  return (
    <div className="bg-[#EDEEF7] h-full rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-5">
        <AlarmIcon />
        <button className="text-[#484848] cursor-pointer font-medium">
          Todays Schedule
        </button>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-[#484848] mb-3">
          {shift?.startTime} - {shift?.endTime}
        </h2>
        <p className="text-[#484848] mb-3">{shift?.date}</p>
        <button className="text-primary cursor-pointer font-medium">
          {shift?.location}
        </button>
      </div>
      <div className="text-center">
        <p className="text-gray-600 mb-5">Your Team members</p>
        <div className="flex justify-center space-x-2">
          {team?.map((member: any, index: number) => (
            <div
              key={index}
              className="w-14 h-14 bg-[#C8CAE7] rounded-full flex items-center justify-center text-[#484848] font-bold text-2xl"
            >
              <img
                className="rounded-full"
                src={
                  member.profileUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(`${member.firstName} ${member.lastName}`)
                }
                alt="Profile"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-5 py-5">
          <button
            onClick={() => handleClockAction("CLOCK_IN")}
            disabled={isClockInButtonDisabled}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-green-500 text-white font-bold ${
              isClockInButtonDisabled || shift.startTime === "No shift"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isClocking ? "Processing..." : "Clock In"}
          </button>
          <button
            onClick={() => handleClockAction("CLOCK_OUT")}
            disabled={isClockOutButtonDisabled}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-red-500 text-white font-bold ${
              isClockOutButtonDisabled || shift.startTime === "No shift"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isClockOut ? "Processing..." : "Clock Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentShiftCard;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { useSendUpdateLocationMutation } from "@/store/api/clockInOut/clockinoutapi";
import {
  getCurrentLocationWithGoogleMaps,
  formatLocationForAPI,
} from "@/utils/googleMapsLocation";
import { AlarmIcon } from "./icons";
import { Shift } from "./types";
import Swal from "sweetalert2";

interface CurrentShiftCardProps {
  shift: Shift;
  team: any[];
  clockStatus: "ACTIVE" | "COMPLETED" | "INACTIVE";
  // isClockedIn: boolean;
  isClockedOut: boolean;
  refetch: () => void;
}

const CurrentShiftCard: React.FC<CurrentShiftCardProps> = ({
  shift,
  team,
  clockStatus,
  // isClockedIn,
  isClockedOut,
  refetch,
}) => {
  const [isClocking, setIsClocking] = useState(false);
  const [isClockOut, setIsClockOut] = useState(false);
  const [sendUpdateLocation] = useSendUpdateLocationMutation();

  console.log(
    { shift, team, clockStatus, isClockedOut },
    "CurrentShiftCard Props"
  );

  // 🔹 Common function for Clock In / Out
  const handleClockAction = async (action: "CLOCK_IN" | "CLOCK_OUT", retryCount = 0) => {
    const maxRetries = 1;
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

      // Retry once for timeout errors
      if (error?.code === 3 && retryCount < maxRetries) {
        console.log(`🔄 Retrying ${action} due to timeout (attempt ${retryCount + 1})`);
        toast.info("Location request timed out. Retrying...");
        return handleClockAction(action, retryCount + 1);
      }

      // Provide specific error messages based on error code
      let errorMessage = "Something went wrong";
      let errorTitle = "Error";

      if (error?.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access was denied. Please enable location permissions and try again.";
            errorTitle = "Location Access Denied";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location information is unavailable. Please check your GPS settings and try again.";
            errorTitle = "Location Unavailable";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please ensure you're in an open area with good GPS signal and try again.";
            errorTitle = "Location Timeout";
            break;
          default:
            errorMessage = error?.message || "An unknown location error occurred.";
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
      });
    } finally {
      setIsClocking(false);
      setIsClockOut(false);
      refetch(); // Refresh data after action
    }
  };

  const isClockInButtonDisabled =
    isClocking || clockStatus === "ACTIVE" || shift.startTime === "No shift";
  const isClockOutButtonDisabled =
    isClockOut ||
    clockStatus === "INACTIVE" ||
    isClockedOut ||
    shift.startTime === "No shift";

  console.log(
    {
      isClockInButtonDisabled,
      isClockOutButtonDisabled,
      clockStatus,
      isClockedOut,
      shiftStartTime: shift.startTime,
    },
    "Button Disabled States"
  );
  return (
    <div className="bg-[#EDEEF7] h-full rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-5">
        <AlarmIcon />
        <button className="text-[#484848] cursor-pointer font-medium">
          {shift?.isToday
            ? "Today's Shift"
            : shift?.isUpcomming
            ? "Upcoming Shift"
            : "Latest Shift History"}
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
          {team?.slice(0,3).map((member: any, index: number) => (
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

           {
              team?.length > 3 &&  <div
              className="w-14 h-14 bg-[#C8CAE7] rounded-full flex items-center justify-center text-[#484848] font-bold text-2xl"
            >
              +{team.length - 3}
            </div>
            }
        </div>
        <div className="flex items-center justify-center space-x-5 py-5">
          <button
            onClick={() => handleClockAction("CLOCK_IN")}
            disabled={isClockInButtonDisabled}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-green-500 text-white font-bold flex items-center justify-center space-x-2 ${
              isClockInButtonDisabled || shift.startTime === "No shift"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isClocking && <FaSpinner className="animate-spin" />}
            <span>{isClocking ? "Getting Location..." : "Clock In"}</span>
          </button>
          <button
            onClick={() => handleClockAction("CLOCK_OUT")}
            disabled={isClockOutButtonDisabled}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-red-500 text-white font-bold flex items-center justify-center space-x-2 ${
              isClockOutButtonDisabled || shift.startTime === "No shift"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isClockOut && <FaSpinner className="animate-spin" />}
            <span>{isClockOut ? "Getting Location..." : "Clock Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentShiftCard;

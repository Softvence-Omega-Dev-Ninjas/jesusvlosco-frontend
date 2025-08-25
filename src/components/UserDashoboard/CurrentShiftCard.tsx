/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { useSendUpdateLocationMutation } from "@/store/api/clockInOut/clockinoutapi";
import { getCurrentLocationWithGoogleMaps, formatLocationForAPI } from "@/utils/googleMapsLocation";
import { AlarmIcon } from "./icons";
import { Shift } from "./types";
import Swal from "sweetalert2";

interface CurrentShiftCardProps {
  shift: Shift;
  team: any[]; 
}



const CurrentShiftCard: React.FC<CurrentShiftCardProps> = ({ shift, team }) => {
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [sendUpdateLocation] = useSendUpdateLocationMutation();

  console.log(shift, "Shift Information")
  const getCurrentLocationAndClockIn = async () => {
    setIsClockingIn(true);

    try {
      // Get current location using Google Maps API for better accuracy
      const locationResult = await getCurrentLocationWithGoogleMaps();
      
      // Format location data for API
      const formattedLocation = formatLocationForAPI(locationResult);
      
      console.log('📍 Accurate location obtained via Google Maps:', formattedLocation);
      
      // Send location update to backend with enhanced data
      const response = await sendUpdateLocation({
        lat: formattedLocation.latitude,
        lng: formattedLocation.longitude,
        action: 'CLOCK_IN',
      }).unwrap();

      
      console.log('📡 Clock-in location updated successfully:', response);
      toast.success(`Clocked in successfully! 📍 ${formattedLocation.address}`);
      
    } catch (error: any) {
      console.error('❌ Location error:', error);
        Swal.fire({
          title: 'Clock-In Failed',
          text: error.data.message || 'Unable to clock in. Please try again.',
          icon: 'error',
          timer: 2000,
        })
   
      
    } finally {
      setIsClockingIn(false);
    }
  };

  const handleClockIn = () => {
    getCurrentLocationAndClockIn();
  };

  const handleClockOut = async () => {
    try{
      const locationResult = await getCurrentLocationWithGoogleMaps();
      
      // Format location data for API
      const formattedLocation = formatLocationForAPI(locationResult);
      
      console.log('📍 Accurate location obtained via Google Maps:', formattedLocation);
      
      // Send location update to backend with enhanced data
      const response = await sendUpdateLocation({
        lat: formattedLocation.latitude,
        lng: formattedLocation.longitude,
        action: 'CLOCK_OUT',
      }).unwrap();
      console.log('📡 Clock-out location updated successfully:', response);
      toast.success(`Clocked out successfully! 📍 ${formattedLocation.address}`);
    } catch (error: any) {
      console.error('❌ Clock-out error:', error);
      Swal.fire({
        title: 'Clock-Out Failed',
        text: error.data.message || 'Unable to clock out. Please try again.',
        icon: 'error',
        timer: 2000,
      });
    }
    // Clock out logic without location update

  };
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
          {team?.map((member : any, index: number) => (
            <div
              key={index}
              className="w-14 h-14 bg-[#C8CAE7] rounded-full flex items-center justify-center text-[#484848] font-bold text-2xl"
            >
              <img className="rounded-full" src={member.profileUrl || "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(
                member.firstName +
                  " " +
                  member.lastName
              )} alt="Default Profile" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-5 py-5">
          <button 
            onClick={handleClockIn}
            disabled={isClockingIn || shift.startTime ==="No shift"}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-green-500 text-white font-bold ${shift.startTime ==="No shift" ? "disabled:cursor-not-allowed disabled opacity-50" : ""}`}
          >
            {isClockingIn ? 'Clocking In...' : 'Clock In'}
          </button>
          <button 
            onClick={handleClockOut}
            disabled={shift.startTime ==="No shift"}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-red-500 text-white font-bold ${shift.startTime ==="No shift" ? "disabled:cursor-not-allowed disabled opacity-50" : ""}`}
          >
            Clock Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentShiftCard;

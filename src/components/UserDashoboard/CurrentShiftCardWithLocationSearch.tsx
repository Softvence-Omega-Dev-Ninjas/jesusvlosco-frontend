/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { useSendUpdateLocationMutation } from "@/store/api/clockInOut/clockinoutapi";
import { getCurrentLocationWithGoogleMaps, formatLocationForAPI } from "@/utils/googleMapsLocation";
import { LocationSearchComponent, LocationData } from "@/components/LocationSearch";
import { AlarmIcon } from "./icons";
import { Shift } from "./types";

interface CurrentShiftCardProps {
  shift: Shift;
  team: any[]; 
}

const CurrentShiftCardWithLocationSearch: React.FC<CurrentShiftCardProps> = ({ shift, team }) => {
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [sendUpdateLocation] = useSendUpdateLocationMutation();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  console.log(shift, "Shift Information")

  // Handle location selection from search
  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    console.log('📍 Location selected from search:', location);
    toast.success(`Location selected: ${location.address}`);
  };

  // Get current location and clock in
  const getCurrentLocationAndClockIn = async () => {
    setIsClockingIn(true);

    try {
      // Use selected location from search if available, otherwise get current location
      let locationResult;
      
      if (selectedLocation) {
        // Use the selected location from search
        locationResult = {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: selectedLocation.formattedAddress || selectedLocation.address,
          accuracy: 10, // High accuracy for searched locations
          timestamp: Date.now(),
        };
      } else {
        // Get current location using Google Maps API for better accuracy
        locationResult = await getCurrentLocationWithGoogleMaps();
      }
      
      // Format location data for API
      const formattedLocation = formatLocationForAPI(locationResult);
      
      console.log('📍 Location for clock-in:', formattedLocation);
      
      // Send location update to backend with enhanced data
      const response = await sendUpdateLocation({
        lat: formattedLocation.latitude,
        lng: formattedLocation.longitude,
        action: 'CLOCK_IN',
        locationSource: selectedLocation ? 'SEARCH' : 'GPS',
        address: formattedLocation.address,
      }).unwrap();

      console.log('📡 Clock-in location updated successfully:', response);
      toast.success(`Clocked in successfully! 📍 ${formattedLocation.address}`);
      
      // Reset location search after successful clock-in
      setSelectedLocation(null);
      setShowLocationSearch(false);
      
    } catch (error: any) {
      console.error('❌ Location error:', error);
      
      // Handle different types of location errors
      if (error.code === 1) {
        toast.error('Location access denied. Please enable location permissions or search for your location.');
        setShowLocationSearch(true); // Show search as fallback
      } else if (error.code === 2) {
        toast.error('Location unavailable. Please use the location search instead.');
        setShowLocationSearch(true);
      } else if (error.code === 3) {
        toast.error('Location request timed out. Please try searching for your location.');
        setShowLocationSearch(true);
      } else {
        toast.error(`Location error: ${error.message || 'Unable to get location'}`);
      }
      
    } finally {
      setIsClockingIn(false);
    }
  };

  const handleClockIn = () => {
    getCurrentLocationAndClockIn();
  };

  const handleClockOut = () => {
    // Clock out logic without location update
    toast.success('Clocked out successfully!');
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

      {/* Location Search Section */}
      {showLocationSearch && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              🔍 Search Your Location
            </h3>
            <button
              onClick={() => setShowLocationSearch(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <LocationSearchComponent
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for your work location..."
            className="w-full"
            showMap={false} // Don't show map in compact view
            initialLocation={selectedLocation}
          />
          <p className="text-sm text-gray-600 mt-2">
            💡 Search for your workplace or any location where you're clocking in
          </p>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-green-700">Selected Location:</span>
            <div className="text-green-800 mt-1">{selectedLocation.address}</div>
            <div className="text-green-600 text-xs mt-1">
              {selectedLocation.formattedAddress}
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-600 mb-5">Your Team members</p>
        <div className="flex justify-center space-x-2">
          {team?.map((member : any, index: number) => (
            <div
              key={index}
              className="w-14 h-14 bg-[#C8CAE7] rounded-full flex items-center justify-center text-[#484848] font-bold text-2xl"
            >
              <img 
                className="rounded-full" 
                src={member.profileUrl || "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(member.firstName + " " + member.lastName)} 
                alt="Default Profile" 
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-5 py-5">
          <div className="flex flex-col items-center space-y-2">
            <button 
              onClick={handleClockIn}
              disabled={isClockingIn || shift.startTime === "No shift"}
              className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-green-500 text-white font-bold ${
                shift.startTime === "No shift" ? "disabled:cursor-not-allowed disabled opacity-50" : ""
              }`}
            >
              {isClockingIn ? 'Clocking In...' : 'Clock In'}
            </button>
            
            {/* Location Search Toggle */}
            <button
              onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {showLocationSearch ? 'Hide Search' : 'Search Location'}
            </button>
          </div>

          <button 
            onClick={handleClockOut}
            disabled={shift.startTime === "No shift"}
            className={`px-5 py-3 rounded-md border-1 border-gray-400 bg-red-500 text-white font-bold ${
              shift.startTime === "No shift" ? "disabled:cursor-not-allowed disabled opacity-50" : ""
            }`}
          >
            Clock Out
          </button>
        </div>

        {/* Location Status */}
        <div className="text-xs text-gray-500 mt-2">
          {selectedLocation ? (
            <span className="text-green-600">
              📍 Will clock in at: {selectedLocation.address}
            </span>
          ) : (
            <span>
              📍 Will use current GPS location (or search above)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentShiftCardWithLocationSearch;

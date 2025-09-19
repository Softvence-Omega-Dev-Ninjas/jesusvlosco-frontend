// src/components/MapLocation.tsx
import { useGetClockInOutQuery } from "@/store/api/clockInOut/clockinoutapi";
import { ApiShiftData } from "@/utils/shiftUtils";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "8px",
};



const MapLocation: React.FC = () => {
  const { data } = useGetClockInOutQuery({});
  const currentApiShift = data?.data?.shift as ApiShiftData | undefined;

  const locations = [
  {
    id: 1,
    position: { lat: currentApiShift?.locationLat || 23.7785, lng: currentApiShift?.locationLng || 90.4008 }, // Mohakhali
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="95" viewBox="0 0 90 95" fill="none">
      <ellipse opacity="0.5" cx="31.9836" cy="32.6995" rx="31.8703" ry="31.7581" fill="#FFBA5C"/>
      <ellipse opacity="0.5" cx="31.9852" cy="32.6994" rx="21.2469" ry="21.1721" fill="#FF9200"/>
      <ellipse cx="31.9831" cy="32.6993" rx="8.49875" ry="8.46882" fill="#FF9200"/>
    </svg>`,
  },
];


  const [userLocation, setUserLocation] =
    useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [isWatchingLocation, setIsWatchingLocation] = useState(false);


  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('loading');
      
      // Enhanced geolocation options for maximum accuracy
      const highAccuracyOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout for better accuracy
        maximumAge: 60000, // Reduced cache time to 1 minute for fresher data
      };

      // First, try to get a quick position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLocationAccuracy(position.coords.accuracy);
          setLocationError(null);
          setLocationStatus('success');

          // If accuracy is poor (> 50 meters), try to get better location
          if (position.coords.accuracy > 50) {
            setIsWatchingLocation(true);
            
            // Watch for better location
            const watchId = navigator.geolocation.watchPosition(
              (betterPosition) => {
                // Only update if we get significantly better accuracy
                if (betterPosition.coords.accuracy < position.coords.accuracy * 0.8) {
                  setUserLocation([
                    betterPosition.coords.latitude,
                    betterPosition.coords.longitude,
                  ]);
                  setLocationAccuracy(betterPosition.coords.accuracy);
                }
                
                // Stop watching after 30 seconds or when accuracy is good enough
                if (betterPosition.coords.accuracy <= 20) {
                  navigator.geolocation.clearWatch(watchId);
                  setIsWatchingLocation(false);
                }
              },
              (watchError) => {
                console.error("Watch position error:", watchError);
                navigator.geolocation.clearWatch(watchId);
                setIsWatchingLocation(false);
              },
              highAccuracyOptions
            );

            // Clear watch after 30 seconds regardless
            setTimeout(() => {
              navigator.geolocation.clearWatch(watchId);
              setIsWatchingLocation(false);
            }, 30000);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          
          // Provide more specific error messages
          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access and refresh the page.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable. Try moving to an area with better GPS signal.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Please try again.";
              break;
            default:
              errorMessage += "Please enable location services and try again.";
              break;
          }
          
          setLocationError(errorMessage);
          setLocationStatus('error');
        },
        highAccuracyOptions
      );
    } else {
      setLocationError("Geolocation is not supported by this browser. Please use a modern browser with location support.");
      setLocationStatus('error');
    }

    // Cleanup function
    return () => {
      // Clear any active watches when component unmounts
      setIsWatchingLocation(false);
    };
  }, []);

  return (
    <div className="rounded-2xl py-6 px-8 border mb-20 border-gray-200 mx-auto">
     {
      userLocation && <div>
         <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Map Location
      </h2>

      {locationError && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{locationError}</p>
        </div>
      )}

      {locationStatus === 'loading' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <p className="text-sm text-blue-800">
              {isWatchingLocation ? "Improving location accuracy..." : "Getting your current location..."}
            </p>
          </div>
        </div>
      )}

      {locationStatus === 'success' && userLocation && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-green-800">
                ✅ Current location detected: {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
              </p>
              {locationAccuracy && (
                <p className="text-xs text-green-600 mt-1">
                  Accuracy: ±{Math.round(locationAccuracy)}m 
                  {locationAccuracy <= 20 && " (High precision)"} 
                  {locationAccuracy > 20 && locationAccuracy <= 50 && " (Good precision)"} 
                  {locationAccuracy > 50 && " (Low precision)"}
                  {isWatchingLocation && " • Improving..."}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                500m radius
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-green-600 bg-green-100 hover:bg-green-200 px-2 py-1 rounded transition-colors duration-200"
                title="Refresh location"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={userLocation}
        zoom={14}
        style={containerStyle}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Current Location with Dynamic Accuracy Circle */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={L.divIcon({
                html: `
                  <div style="
                    width: 20px;
                    height: 20px;
                    background-color: #FF0000;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                    position: relative;
                  ">
                    <div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 8px;
                      height: 8px;
                      background-color: white;
                      border-radius: 50%;
                    "></div>
                  </div>
                `,
                className: "custom-current-location-marker",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                Your Current Location (±{locationAccuracy ? Math.round(locationAccuracy) : 'unknown'}m accuracy)
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={500}
              pathOptions={{
                color: locationAccuracy && locationAccuracy <= 20 ? "#00AA00" : locationAccuracy && locationAccuracy <= 50 ? "#FF8C00" : "#FF4444",
                fillColor: locationAccuracy && locationAccuracy <= 20 ? "#00FF00" : locationAccuracy && locationAccuracy <= 50 ? "#FFA500" : "#FF6B6B",
                fillOpacity: 0.15,
                weight: 2,
              }}
            />
            {/* Add a smaller inner circle for the exact position */}
            <Circle
              center={userLocation}
              radius={3}
              pathOptions={{
                color: "#FF0000",
                fillColor: "#FF0000",
                fillOpacity: 0.8,
                weight: 1,
              }}
            />
          </>
        )}

        {/* Custom Location Markers */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.position.lat, loc.position.lng]}
            icon={L.divIcon({
              html: loc.svg,
              className: "custom-shift-marker",
              iconSize: [64, 65],
              iconAnchor: [32, 65],
            })}
          >
            <Popup>Shift Location</Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-gray-700">
        {/* Current Location Legend */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            <div className={`absolute inset-0 w-4 h-4 border-2 rounded-full opacity-30 ${
              locationAccuracy && locationAccuracy <= 20 ? 'border-green-500' : 
              locationAccuracy && locationAccuracy <= 50 ? 'border-orange-500' : 'border-red-500'
            }`}></div>
          </div>
          <span>
            Current Location 
            {locationAccuracy && ` (±${Math.round(locationAccuracy)}m accuracy)`}
          </span>
        </div>

        {/* Accuracy Legend */}
        {locationAccuracy && (
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full opacity-30"></div>
              <span>High (≤20m)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full opacity-30"></div>
              <span>Good (≤50m)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full opacity-30"></div>
              <span>Low (&gt;50m)</span>
            </div>
          </div>
        )}

        {/* Existing Location Legends */}
        {
          currentApiShift && <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#1EBD66" fillOpacity="0.36" />
            <circle cx="10" cy="10" r="6" fill="#06843F" />
          </svg>
          <span>Shift Location</span>
        </div>
        }
      </div>
      </div>
     }
    </div>
  );
};

export default MapLocation;

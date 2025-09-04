// src/components/MapLocation.tsx
import { GoogleMap, Marker, Circle, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "8px",
};

const center = { lat: 23.785, lng: 90.4008 };

const locations = [
  {
    id: 1,
    position: { lat: 23.7785, lng: 90.4008 }, // Mohakhali
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="65" viewBox="0 0 64 65" fill="none">
      <ellipse opacity="0.5" cx="31.9836" cy="32.6995" rx="31.8703" ry="31.7581" fill="#FFBA5C"/>
      <ellipse opacity="0.5" cx="31.9852" cy="32.6994" rx="21.2469" ry="21.1721" fill="#FF9200"/>
      <ellipse cx="31.9831" cy="32.6993" rx="8.49875" ry="8.46882" fill="#FF9200"/>
    </svg>`,
  },
  {
    id: 2,
    position: { lat: 23.7925, lng: 90.4078 }, // Gulshan
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="65" viewBox="0 0 64 65" fill="none">
      <ellipse cx="32.0871" cy="32.5882" rx="31.8703" ry="31.7581" fill="#AB070F" fill-opacity="0.37"/>
      <ellipse cx="32.0887" cy="32.5891" rx="21.2469" ry="21.1721" fill="#AB070F" fill-opacity="0.37"/>
      <ellipse cx="32.0883" cy="32.589" rx="10.6234" ry="10.586" fill="#AB070F"/>
    </svg>`,
  },
  {
    id: 3,
    position: { lat: 23.7945, lng: 90.4043 }, // Banani
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none">
      <ellipse opacity="0.4" cx="32.5598" cy="31.7581" rx="31.8703" ry="31.7581" fill="#1EBD66"/>
      <ellipse opacity="0.4" cx="32.5613" cy="31.758" rx="21.2469" ry="21.1721" fill="#06843F"/>
      <ellipse cx="32.5609" cy="31.7579" rx="10.6234" ry="10.586" fill="#06843F"/>
    </svg>`,
  },
];

// Hide POIs and extra icons
const mapStyles = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

const MapLocation: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('loading');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
          setLocationStatus('success');
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Please enable location services.");
          setLocationStatus('error');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationStatus('error');
    }
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="rounded-2xl py-6 px-8 border mb-20 border-gray-200 mx-auto">
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
            <p className="text-sm text-blue-800">Getting your current location...</p>
          </div>
        </div>
      )}

      {locationStatus === 'success' && userLocation && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-800">
              ✅ Current location detected: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              500m radius
            </div>
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={userLocation ? 16 : 14}
        options={{
          styles: mapStyles,
          streetViewControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          disableDefaultUI: false,
          mapTypeControl: false,
        }}
      >
        {/* Current Location with 500m Radius Circle */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#FF0000",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
              }}
              title="Your Current Location"
            />
            <Circle
              center={userLocation}
              radius={300} // 500 meters radius
              options={{
                fillColor: "#4285F4",
                fillOpacity: 0.15,
                strokeColor: "#4285F4",
                strokeOpacity: 0.6,
                strokeWeight: 2,
              }}
            />
          </>
        )}

        {/* Custom Location Markers */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.position}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                loc.svg
              )}`,
              scaledSize: new google.maps.Size(64, 64),
              anchor: new google.maps.Point(32, 32),
            }}
          />
        ))}
      </GoogleMap>
      <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-gray-700">
        {/* Current Location Legend */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            <div className="absolute inset-0 w-4 h-4 border-2 border-blue-500 rounded-full opacity-30"></div>
          </div>
          <span>Current Location (500m radius)</span>
        </div>

        {/* Existing Location Legends */}
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#1EBD66" fill-opacity="0.36" />
            <circle cx="10" cy="10" r="6" fill="#06843F" />
          </svg>
          <span>Location 1</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#AB070F" fill-opacity="0.37" />
            <circle cx="10" cy="10" r="6" fill="#AB070F" />
          </svg>
          <span>Location 2</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#FFB600" fill-opacity="0.5" />
            <circle cx="10" cy="10" r="6" fill="#FFB600" />
          </svg>
          <span>Location 3</span>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;

// src/components/MapLocation.tsx
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="rounded-2xl py-6 px-8 border mb-20 border-gray-200 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Map Location
      </h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
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
        {/* User Live Location (Red Dot) */}
        {userLocation && (
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
          />
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
      <div className="mt-4 flex justify-center space-x-8 text-sm text-gray-700">
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

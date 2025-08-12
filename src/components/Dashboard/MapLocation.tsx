import React, { useEffect, useState } from "react";

export const MapLocation = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const locations = [
    {
      id: 1,
      name: "Location 1",
      color: "#10b981", // green
      lat: 44.9778,
      lng: -93.265,
      intensity: 0.8,
    },
    {
      id: 2,
      name: "Location 2",
      color: "#ef4444", // red
      lat: 44.9728,
      lng: -93.2469,
      intensity: 0.9,
    },
    {
      id: 3,
      name: "Location 3",
      color: "#f97316", // orange
      lat: 44.9808,
      lng: -93.27,
      intensity: 0.7,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const SCALE = 10000;
  const BASE_LAT = 44.98;
  const BASE_LNG = -93.27;

  interface Location {
    id: number;
    name: string;
    color: string;
    lat: number;
    lng: number;
    intensity: number;
  }

  interface MarkerStyle {
    position: "absolute";
    left: string;
    top: string;
    width: string;
    height: string;
    borderRadius: string;
    backgroundColor: string;
    opacity: number;
    transform: string;
    animation: string;
    zIndex: number;
  }

  const getMarkerStyle = (location: Location): MarkerStyle => {
    const baseSize = 60;
    const size = baseSize * location.intensity;

    return {
      position: "absolute",
      left: `${200 + (location.lng - BASE_LNG) * SCALE}px`,
      top: `${200 - (location.lat - BASE_LAT) * SCALE}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      backgroundColor: location.color,
      opacity: 0.3,
      transform: "translate(-50%, -50%)",
      animation: "pulse 2s infinite",
      zIndex: 1,
    };
  };

  interface PinStyle {
    position: "absolute";
    left: string;
    top: string;
    transform: string;
    zIndex: number;
  }

  const getPinStyle = (location: Location): PinStyle => ({
    position: "absolute",
    left: `${200 + (location.lng - BASE_LNG) * SCALE}px`,
    top: `${200 - (location.lat - BASE_LAT) * SCALE}px`,
    transform: "translate(-50%, -50%)",
    zIndex: 2,
  });

  return (
    <div className="rounded-2xl py-6 px-8 border mb-20 border-gray-200 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Map Location
      </h2>

      <div className="relative">
        {/* Map Container */}
        <div
          className="relative h-96 rounded-2xl overflow-hidden border border-gray-200"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundColor: "#f8fafc",
          }}
        >
          {/* Map Features */}
          <div className="absolute inset-0">
            {/* Horizontal streets */}
            <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300"></div>
            <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-gray-300"></div>
            <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300"></div>

            {/* Vertical streets */}
            <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {/* Water feature */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-blue-200 rounded-l-3xl opacity-60"></div>

            {/* Park areas */}
            <div className="absolute top-4 right-20 w-12 h-8 bg-green-200 rounded opacity-50"></div>
            <div className="absolute bottom-8 left-4 w-10 h-6 bg-green-200 rounded opacity-50"></div>
          </div>

          {/* Markers */}
          {mapLoaded &&
            locations.map((location) => (
              <React.Fragment key={location.id}>
                <div style={getMarkerStyle(location)}></div>
                <div style={getPinStyle(location)}>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: location.color }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </React.Fragment>
            ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded shadow-md">
            <button className="block px-3 py-2 text-sm border-b border-gray-200 hover:bg-gray-50">
              Satellite
            </button>
            <button className="block px-3 py-2 text-sm hover:bg-gray-50">
              Traffic
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 bg-white rounded shadow-md">
            <button className="block w-8 h-8 text-lg border-b border-gray-200 hover:bg-gray-50">
              +
            </button>
            <button className="block w-8 h-8 text-lg hover:bg-gray-50">
              −
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-6">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: location.color }}
              ></div>
              <span className="text-sm text-gray-700 font-medium">
                {location.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default MapLocation;

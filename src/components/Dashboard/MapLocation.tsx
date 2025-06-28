import { MapPin } from "lucide-react";
import React from "react";

export const MapLocation: React.FC = () => {
  const locations = [
    {
      name: "Location 1",
      color: "bg-green-500",
      position: "bottom-12 left-12",
    },
    { name: "Location 2", color: "bg-red-500", position: "top-8 right-8" },
    { name: "Location 3", color: "bg-orange-500", position: "top-16 left-1/3" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Map Location</h2>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
        {locations.map((location, index) => (
          <MapPin
            key={index}
            className={`absolute ${
              location.position
            } w-6 h-6 text-${location.color.split("-")[1].toString()}-500`}
          />
        ))}
        <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
          {locations.map((location, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${location.color}`}></div>
              <span>{location.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

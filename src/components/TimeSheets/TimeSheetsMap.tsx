import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { createUserIcon, getUniqueUserLocations } from "./timeSheetsUtils";

interface Props {
  uniqueUserLocations: ReturnType<typeof getUniqueUserLocations>;
  mapRef: React.MutableRefObject<L.Map | null>;
  formatTime: (timeString: string) => string;
}

const defaultCoordinates: [number, number] = [51.1514578, -114.0825065];
const mapZoom = 11;
const mapStyle = {
  height: "650px",
  width: "100%",
  borderRadius: "0.5rem",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
};

const TimeSheetsMap: React.FC<Props> = ({ uniqueUserLocations, mapRef, formatTime }) => {
  // Handle marker click - zoom to max level and center on location
  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView([lat, lng], 18, {
        animate: true,
        duration: 1.0,
      });
    }
  };

  return (
    <section className="mt-6 ">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Employee Locations ({uniqueUserLocations.length} users)
        </h3>
        {uniqueUserLocations.length > 0 && (
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            � = Employee Profile Image (Circular)
          </div>
        )}
      </div>
      {uniqueUserLocations.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            📍 No employee locations found for the selected date. Select a
            different date to view employee locations on the map.
          </p>
        </div>
      )}
      <MapContainer
        key="employee-locations-map"
        center={
          uniqueUserLocations.length > 0
            ? [uniqueUserLocations[0].lat, uniqueUserLocations[0].lng]
            : defaultCoordinates
        }
        zoom={uniqueUserLocations.length > 0 ? 12 : mapZoom}
        style={mapStyle}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {uniqueUserLocations.map((userLocation) => (
          <Marker
            key={userLocation.id}
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon(userLocation.profileUrl, userLocation.name)}
            eventHandlers={{
              click: () => handleMarkerClick(userLocation.lat, userLocation.lng),
            }}
          >
            <Popup
              maxWidth={350}
              minWidth={300}
              maxHeight={400}
              className="custom-popup"
              closeButton={true}
              autoClose={false}
              closeOnEscapeKey={true}
            >
              <div className="p-4 min-w-[300px] max-w-[340px]">
                <div className="flex items-center space-x-3 mb-4">
                  {userLocation.profileUrl && (
                    <img
                      src={userLocation.profileUrl}
                      alt={userLocation.name}
                      className="w-14 h-14 rounded-full border-2 border-blue-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-lg truncate">
                      {userLocation.name}
                    </h4>
                    <p className="text-sm text-blue-600 font-medium truncate">
                      {userLocation.shiftTitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">
                          Clock In
                        </p>
                        <p className="text-green-800 font-semibold text-sm">
                          {formatTime(userLocation.clockIn)}
                        </p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs text-red-600 font-medium mb-1">
                          Clock Out
                        </p>
                        <p className="text-red-800 font-semibold text-sm">
                          {formatTime(userLocation.clockOut)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium mb-2">
                        📍 GPS Coordinates
                      </p>
                      <p className="text-gray-800 font-mono text-sm break-all">
                        {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-2">
                        📅 Work Date
                      </p>
                      <p className="text-blue-800 text-sm font-medium">
                        {new Date(userLocation.clockIn).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center font-medium">
                    🔍 Zoomed to maximum level for precise location
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {uniqueUserLocations.length === 0 && (
          <Marker position={defaultCoordinates}>
            <Popup>
              No employee locations found for the selected date.
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </section>
  );
};

export default TimeSheetsMap;
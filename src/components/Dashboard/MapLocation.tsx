/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";

const center: [number, number] = [44.98, -93.27]; // Minneapolis approx center

// Custom colored circles for markers like the image:
const location1Color = "#3b82f6"; // blueish-green (for green marker)
const location2Color = "#b91c1c"; // red
const location3Color = "#fbbf24"; // yellow-orange

// Marker icons fix for react-leaflet + leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const MapLocation = () => {
  return (
    <div className="rounded-2xl py-6 px-8 border mb-20 border-gray-200 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Map Location
      </h2>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-96 rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location 1 - blueish-green circle */}
        <Marker position={[44.975, -93.254]} />
        <Circle
          center={[44.975, -93.254]}
          radius={70}
          pathOptions={{
            color: location1Color,
            fillColor: location1Color,
            fillOpacity: 0.4,
          }}
        />

        {/* Location 2 - red circle */}
        <Marker position={[44.978, -93.275]} />
        <Circle
          center={[44.978, -93.275]}
          radius={70}
          pathOptions={{
            color: location2Color,
            fillColor: location2Color,
            fillOpacity: 0.5,
          }}
        />

        {/* Location 3 - orange circle */}
        <Marker position={[44.969, -93.293]} />
        <Circle
          center={[44.969, -93.293]}
          radius={70}
          pathOptions={{
            color: location3Color,
            fillColor: location3Color,
            fillOpacity: 0.4,
          }}
        />
      </MapContainer>

      <div className="mt-4 flex justify-center space-x-8 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: location1Color }}
          ></div>
          <span>Location 1</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: location2Color }}
          ></div>
          <span>Location 2</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: location3Color }}
          ></div>
          <span>Location 3</span>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;

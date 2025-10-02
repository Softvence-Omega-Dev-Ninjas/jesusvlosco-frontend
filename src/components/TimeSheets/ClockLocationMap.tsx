import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  clockInLat: number;
  clockInLng: number;
  clockOutLat?: number;
  clockOutLng?: number;
  userName?: string;
}

export default function ClockLocationMap({
  clockInLat,
  clockInLng,
  clockOutLat,
  clockOutLng,
  userName,
}: Props) {
  useEffect(() => {
    const map = L.map("clock-location-map", {
      center: [clockInLat, clockInLng],
      zoom: 13,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Clock In Marker
    L.marker([clockInLat, clockInLng])
      .addTo(map)
      .bindPopup(`<b>${userName || "User"}</b><br/>Clock In`)
      .openPopup();

    // Clock Out Marker
    if (clockOutLat && clockOutLng) {
      L.marker([clockOutLat, clockOutLng])
        .addTo(map)
        .bindPopup(`<b>${userName || "User"}</b><br/>Clock Out`);
    }

    // Fit bounds to markers
    const bounds = L.latLngBounds([
      [clockInLat, clockInLng],
      ...(clockOutLat && clockOutLng
        ? [L.latLng(clockOutLat, clockOutLng)]
        : []),
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
    };
  }, [clockInLat, clockInLng, clockOutLat, clockOutLng, userName]);

  return <div id="clock-location-map" className="w-full h-64 rounded-md" />;
}

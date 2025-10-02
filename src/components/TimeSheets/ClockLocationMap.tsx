import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DateTime } from "luxon";
import { TimeSheetEntry } from "@/pages/TimeSheets";

export default function ClockLocationMap({ entry }: { entry: TimeSheetEntry }) {
  const mapId = `clock-location-map-${entry.id}`;

  // custom icons
  const clockInIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });


  const getAvatarUrl = () =>
    entry.user.profileUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      entry.user.name
    )}&background=random`;

  useEffect(() => {
    const map = L.map(mapId, {
      center: [entry.clockInLat, entry.clockInLng],
      zoom: 13,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markers: L.Marker[] = [];

    // Marker
    if (entry.clockInLat && entry.clockInLng) {
      const clockInPopup = `
        <div>
          <div style="display:flex; align-items:center; gap:10px; min-width:150px;">
            <img src="${getAvatarUrl()}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" />
             <div>
            <div style="font-weight:600;">${entry.user.name}</div>
            <div style="font-size:12px; color:#555;">${entry.user.email}</div>
              </div>
          </div>
         
          <div style="display:flex; align-items:center; gap:10px; min-width:150px;">
            <div style="margin-top:6px; font-size:13px;">
              <b>Clock In:</b><br/> ${DateTime.fromISO(
                entry.clockIn
              ).toLocaleString(DateTime.DATETIME_MED)}
            </div>
            <div style="margin-top:6px; font-size:13px;">
              <b>Clock Out:</b><br/> ${DateTime.fromISO(
                entry.clockOut
              ).toLocaleString(DateTime.DATETIME_MED)}
            </div>
           
          </div>
           <div style="font-size:13px; margin-top:4px;">
              <b>Location:</b> ${entry.location || "N/A"}
            </div>
        </div>
      `;
      markers.push(
        L.marker([entry.clockInLat, entry.clockInLng], { icon: clockInIcon })
          .addTo(map)
          .bindPopup(clockInPopup)
      );
    }

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => m.getLatLng()));
      map.fitBounds(bounds, { padding: [50, 50] });
      markers[0].openPopup();
    }

    return () => {
      map.remove();
    };
  }, [entry, mapId]);

  return <div id={mapId} className="w-full h-64 rounded-md" />;
}

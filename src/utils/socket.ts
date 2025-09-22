import { io, Socket } from "socket.io-client";

let locationSocket: Socket | null = null;

// Location tracking socket connection
export const connectLocationTracking = (token: string) => {
  if (locationSocket) return locationSocket;

  locationSocket = io("https://api.lgcglobalcontractingltd.com/js/clock", {
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ["websocket", "polling"],
  });

  locationSocket.on("connect", () => {
    console.log("✅ Connected to location tracking:", locationSocket?.id);
  });

  // Specific listener for the location update event (matches sendLocationUpdate)
  locationSocket.on("clock-status", (payload: unknown) => {
    console.log("📍 Received location-update from server:", payload);
  });

  locationSocket.on("disconnect", () => {
    console.log("❌ Disconnected from location tracking");
  });

  return locationSocket;
};

// Send location update via socket
export const sendLocationUpdate = (lat: number, lng: number) => {
  if (!locationSocket) {
    console.error("⚠️ Location socket not connected");
    return;
  }

  const locationData = { lat, lng };
  console.log("📍 Sending location update:", locationData);

  locationSocket.emit("location-update", locationData);
};

// Disconnect location tracking socket
export const disconnectLocationTracking = () => {
  if (locationSocket) {
    console.log("🔌 Disconnecting location tracking socket");
    locationSocket.disconnect();
    locationSocket = null;
  }
};

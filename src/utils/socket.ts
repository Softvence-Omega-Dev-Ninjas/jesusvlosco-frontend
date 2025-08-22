import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let locationSocket: Socket | null = null;

export const connectPrivateChat = (token: string) => {
  if (socket) return socket;

  socket = io("wss://api.lgcglobalcontractingltd.com/js/private", {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    // transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to private chat:", socket?.id);
  });

  // socket.on("disconnect", () => {
  //   console.log("❌ Disconnected from private chat");
  // });

  socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });

  return socket;
};

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
  // Debug: log any incoming events and their data
  // locationSocket.onAny((event: string, ...args: any[]) => {
  //   console.log(`📨 Location socket event: ${event}`, ...args);
  // });

  // Specific listener for the location update event (matches sendLocationUpdate)
  locationSocket.on("clock-status", (payload: any) => {
    console.log("📍 Received location-update from server:", payload);
  });
  locationSocket.on("disconnect", () => {
    console.log("❌ Disconnected from location tracking");
  });

  // locationSocket.on("connect_error", (err) => {
  //   console.error("❌ Location tracking connection error:", err.message);
  // });

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

export const initPrivateMessageListener = (onMessage: (msg: unknown) => void) => {
  if (!socket) {
    console.error("⚠️ Socket not connected");
    return;
  }

  socket.on("private:new_message", (message) => {
    console.log("📩 New private message received:", message);
    onMessage(message);
  });
};

export const sendPrivateMessage = (
  recipientId: string,
  dto: { content: string },
  userId: string
) => {
  if (!socket) {
    console.error("⚠️ Socket not connected");
    return;
  }

  socket.emit("private:send_message", {
    recipientId,
    dto, // ✅ matches backend expectation
    userId,
  });
};

export const onNewPrivateMessage = (callback: (message: unknown) => void) => {
  if (!socket) return;
  socket.on("private:new_message", callback);
};

export const disconnectPrivateChat = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

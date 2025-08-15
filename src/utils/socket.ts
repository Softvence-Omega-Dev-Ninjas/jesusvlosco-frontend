import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

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

export const initPrivateMessageListener = (onMessage: (msg: any) => void) => {
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

export const onNewPrivateMessage = (callback: (message: any) => void) => {
  if (!socket) return;
  socket.on("private:new_message", callback);
};

export const disconnectPrivateChat = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

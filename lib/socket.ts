import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils/token";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

let socket: Socket | null = null;

/**
 * Get (or lazily create) the singleton Socket.io client.
 * Passes the stored JWT token as auth so the server can verify the user.
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token: getToken() },
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

/**
 * Disconnect and destroy the singleton socket.
 * Call this on logout.
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

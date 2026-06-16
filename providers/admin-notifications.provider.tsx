"use client";

import { useAppSelector } from "@/store/hooks";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { disconnectSocket } from "@/lib/socket";
import { useEffect } from "react";

/**
 * AdminNotificationsGate
 *
 * Reads the current user from Redux. If the user is an admin, it mounts the
 * useAdminNotifications hook (which connects to the socket and listens for
 * real-time task events). Non-admin users are never connected.
 *
 * Renders nothing — it's a side-effect-only component.
 */
function AdminSocketConsumer() {
  useAdminNotifications();

  useEffect(() => {
    // Disconnect socket when this component unmounts (e.g. on logout)
    return () => {
      disconnectSocket();
    };
  }, []);

  return null;
}

export default function AdminNotificationsGate() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.role !== "admin") return null;

  return <AdminSocketConsumer />;
}

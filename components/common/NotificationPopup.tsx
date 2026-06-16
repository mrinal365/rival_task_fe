"use client";

import React, { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  Notification,
  dismissNotification,
  clearAllNotifications,
} from "@/store/notification.slice";

const NOTIFICATION_AUTO_DISMISS_MS = 8000;

const getIndicatorColorClass = (type: Notification["type"]) => {
  switch (type) {
    case "task_created":
      return "bg-emerald-500";
    case "task_updated":
      return "bg-[#2957ff]";
    case "task_deleted":
      return "bg-red-500";
    default:
      return "bg-zinc-500";
  }
};

/* ─── single notification card ─── */
const NotificationCard: React.FC<{
  notification: Notification;
  onDismiss: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, NOTIFICATION_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  let titleText = "Task Updated just now";
  if (notification.type === "task_created") {
    titleText = "Task Added just now";
  } else if (notification.type === "task_deleted") {
    titleText = "Task Deleted just now";
  }

  const taskTitle = notification.title.replace(/^"(.*)"$/, "$1");

  return (
    <div className="notification-card-enter bg-white border border-zinc-200 rounded-xl px-[18px] py-[14px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_8px_-1px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 w-[380px] relative">
      {/* Left indicator dot */}
      <div className={`w-2 h-2 rounded-full shrink-0 ${getIndicatorColorClass(notification.type)}`} />

      {/* Texts */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-slate-900 leading-tight">
          {titleText}
        </span>
        <span className="text-xs text-slate-500 overflow-hidden truncate whitespace-nowrap leading-normal">
          {taskTitle} {notification.performedBy ? `by ${notification.performedBy}` : ""}
        </span>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onDismiss(notification.id)}
        className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1 flex items-center justify-center text-xs transition-colors duration-150"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
};

/* ─── notification container ─── */
export default function NotificationPopup() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);

  const handleDismiss = useCallback(
    (id: string) => {
      dispatch(dismissNotification(id));
    },
    [dispatch]
  );

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-h-[calc(100vh-32px)] overflow-y-auto overflow-x-hidden pointer-events-none">
      {/* Clear all button when multiple */}
      {notifications.length > 1 && (
        <button
          onClick={() => dispatch(clearAllNotifications())}
          className="self-end bg-white/95 border border-zinc-200 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer pointer-events-auto transition-all duration-150 backdrop-blur-sm"
        >
          Clear all ({notifications.length})
        </button>
      )}

      {notifications.map((n) => (
        <div key={n.id} className="pointer-events-auto">
          <NotificationCard notification={n} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
}

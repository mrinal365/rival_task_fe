"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket.events";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTask, updateTask, deleteTask, Task } from "@/store/task.slice";
import {
  pushNotification,
  markTaskRecentlyUpdated,
  unmarkTaskRecentlyUpdated,
} from "@/store/notification.slice";

const HIGHLIGHT_DURATION_MS = 20_000;

interface TaskCreatedPayload {
  task: Task;
  performedByUserId: string;
  performedByName?: string;
}

interface TaskUpdatedPayload {
  task: Task;
  changes: Record<string, { old: unknown; new: unknown }>;
  performedByUserId: string;
  performedByName?: string;
}

interface TaskDeletedPayload {
  taskId: string;
  taskTitle?: string;
  performedByUserId: string;
  performedByName?: string;
}

/**
 * useAdminNotifications
 *
 * Connects to the Socket.io server and listens for task events emitted only
 * to admin sockets. Pushes custom notifications and updates the Redux task
 * list in real-time with a 20-second highlight effect.
 *
 * Only mount this hook when the current user is an admin.
 */
export const useAdminNotifications = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const socket = getSocket();

    const handleTaskCreated = (payload: TaskCreatedPayload) => {
      const { task, performedByUserId, performedByName } = payload;

      // Don't notify if the current user performed the action
      if (performedByUserId === currentUser?.id) return;

      // Add the task to the Redux store in real-time
      dispatch(addTask(task));

      // Highlight for 20 seconds
      dispatch(markTaskRecentlyUpdated(task.id));
      setTimeout(() => {
        dispatch(unmarkTaskRecentlyUpdated(task.id));
      }, HIGHLIGHT_DURATION_MS);

      // Push custom notification
      dispatch(
        pushNotification({
          id: `task-created-${task.id}-${Date.now()}`,
          type: "task_created",
          title: `"${task.title}"`,
          message: `${task.priority || "medium"} priority`,
          performedBy: performedByName || "",
          taskId: task.id,
          timestamp: Date.now(),
        })
      );
    };

    const handleTaskUpdated = (payload: TaskUpdatedPayload) => {
      const { task, changes, performedByUserId, performedByName } = payload;

      // Don't notify if the current user performed the action
      if (performedByUserId === currentUser?.id) return;

      // Update the task in Redux store in real-time
      dispatch(updateTask(task));

      // Highlight for 20 seconds
      dispatch(markTaskRecentlyUpdated(task.id));
      setTimeout(() => {
        dispatch(unmarkTaskRecentlyUpdated(task.id));
      }, HIGHLIGHT_DURATION_MS);

      const changedFields = Object.keys(changes).join(", ");

      // Push custom notification
      dispatch(
        pushNotification({
          id: `task-updated-${task.id}-${Date.now()}`,
          type: "task_updated",
          title: `"${task.title}"`,
          message: `${changedFields} changed`,
          performedBy: performedByName || "",
          taskId: task.id,
          timestamp: Date.now(),
          changes,
        })
      );
    };

    const handleTaskDeleted = (payload: TaskDeletedPayload) => {
      const { taskId, taskTitle, performedByUserId, performedByName } = payload;

      // Don't notify if the current user performed the action
      if (performedByUserId === currentUser?.id) return;

      // Remove from Redux store in real-time
      dispatch(deleteTask(taskId));

      // Push custom notification
      dispatch(
        pushNotification({
          id: `task-deleted-${taskId}-${Date.now()}`,
          type: "task_deleted",
          title: `"${taskTitle || `Task #${taskId}`}"`,
          message: "has been removed",
          performedBy: performedByName || "",
          taskId,
          timestamp: Date.now(),
        })
      );
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
    socket.on(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);

    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
      socket.off(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
    };
  }, [dispatch, currentUser?.id]);
};

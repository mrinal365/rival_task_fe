import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: "task_created" | "task_updated" | "task_deleted";
  title: string;
  message: string;
  performedBy: string;
  taskId: string;
  timestamp: number;
  changes?: Record<string, { old: unknown; new: unknown }>;
}

interface NotificationState {
  notifications: Notification[];
  /** Task IDs that were recently updated via WS — used for highlighting */
  recentlyUpdatedTaskIds: string[];
}

const initialState: NotificationState = {
  notifications: [],
  recentlyUpdatedTaskIds: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<Notification>) => {
      // Keep max 20 notifications in memory
      state.notifications = [action.payload, ...state.notifications].slice(0, 20);
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    markTaskRecentlyUpdated: (state, action: PayloadAction<string>) => {
      if (!state.recentlyUpdatedTaskIds.includes(action.payload)) {
        state.recentlyUpdatedTaskIds.push(action.payload);
      }
    },
    unmarkTaskRecentlyUpdated: (state, action: PayloadAction<string>) => {
      state.recentlyUpdatedTaskIds = state.recentlyUpdatedTaskIds.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const {
  pushNotification,
  dismissNotification,
  clearAllNotifications,
  markTaskRecentlyUpdated,
  unmarkTaskRecentlyUpdated,
} = notificationSlice.actions;

export default notificationSlice.reducer;

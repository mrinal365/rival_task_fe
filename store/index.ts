import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import taskReducer from "./task.slice";
import notificationReducer from "./notification.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

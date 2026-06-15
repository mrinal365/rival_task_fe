import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import taskReducer from "./task.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

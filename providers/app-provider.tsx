"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./auth.provider";
import AdminNotificationsGate from "./admin-notifications.provider";
import NotificationPopup from "@/components/common/NotificationPopup";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {/* Real-time admin socket notifications — no-ops for non-admins */}
        <AdminNotificationsGate />
        {/* Custom WS notification popup (separate from toastify) */}
        <NotificationPopup />
        {children}
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}


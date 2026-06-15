"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#000",
            secondary: "#fff",
          },
        },
        error: {
          style: {
            background: "#000",
            color: "#fff",
          },
        },
      }}
    />
  );
}

import { useState, type ReactNode } from "react";
import { ToastNotificationContext } from "./toastNotificationContext";
type ToastNotificationProviderProps = {
  children: ReactNode;
};

export function ToastNotificationProvider({
  children,
}: ToastNotificationProviderProps) {
  const [toastNotification, setToastNotification] = useState("");
  const value = {
    toastNotification,
    setToastNotification,
  };
  return (
    <ToastNotificationContext.Provider value={value}>
      {children}
    </ToastNotificationContext.Provider>
  );
}

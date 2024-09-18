import { useState, type ReactNode, useEffect } from "react";
import { ToastNotificationContext } from "./toastNotificationContext";
import {
  ToastNotificationType,
  ToastNotification,
} from "@/lib/utils/definitions";
import { useCallback } from "react";

type ToastNotificationProviderProps = {
  children: ReactNode;
  seconds: number;
};
const INITIAL_STATE: ToastNotification = {
  message: "",
  type: "message",
};
export function ToastNotificationProvider({
  children,
  seconds,
}: ToastNotificationProviderProps) {
  const [toastNotification, setToastNotification] =
    useState<ToastNotification>(INITIAL_STATE);

  /*
   Decided to updated state.
   To not to have replace the setter around the project, the solution was to replace it with the handler.
  */
  const handleSetToastNotification = useCallback(
    (message: string, type?: ToastNotificationType) => {
      setToastNotification({
        message,
        type: type ?? "message",
      });
    },
    []
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (toastNotification.message) {
      timeoutId = setTimeout(() => {
        setToastNotification(INITIAL_STATE);
      }, seconds * 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [toastNotification, seconds]);

  const value = {
    toastNotification,
    setToastNotification: handleSetToastNotification,
  };
  return (
    <ToastNotificationContext.Provider value={value}>
      {children}
    </ToastNotificationContext.Provider>
  );
}

import { useContext, createContext } from "react";
import {
  ToastNotification,
  ToastNotificationType,
} from "@/lib/utils/definitions";

type ToastNotificationModel = {
  toastNotification: ToastNotification;
  setToastNotification: (message: string, type?: ToastNotificationType) => void;
};

export function useToastNotificationContext() {
  return useContext(ToastNotificationContext);
}
export const ToastNotificationContext = createContext(
  {} as ToastNotificationModel
);

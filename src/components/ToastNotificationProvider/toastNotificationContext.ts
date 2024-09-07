import {
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type ToastNotificationModel = {
  toastNotification: string;
  setToastNotification: Dispatch<SetStateAction<string>>;
};

export function useToastNotificationContext() {
  return useContext(ToastNotificationContext);
}
export const ToastNotificationContext = createContext(
  {} as ToastNotificationModel
);

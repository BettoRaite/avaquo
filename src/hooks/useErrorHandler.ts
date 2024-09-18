import { useCallback } from "react";
import { useToastNotificationContext } from "@/components/ToastNotificationProvider/toastNotificationContext";
import { useTranslation } from "react-i18next";
import { AppError } from "@/lib/utils/error";
import { FirebaseError } from "firebase/app";
import { ERROR_MESSAGES, FIREBASE_ERROR_MESSAGES } from "@/lib/utils/constants";
import { errorLogger } from "@/lib/utils/errorLogger";

export function useErrorHandler() {
  const { setToastNotification } = useToastNotificationContext();
  const { t } = useTranslation();
  const handleError = useCallback(
    (error: Error, action: string) => {
      let scopeData: Record<string, unknown> = {};
      if (error instanceof AppError && error.isOperational) {
        scopeData = error.scopeData ?? {};
        setToastNotification(
          error.isOperational ? t(error.message) : t("unexpected_error")
        );
      } else if (error instanceof FirebaseError) {
        setToastNotification(
          FIREBASE_ERROR_MESSAGES[error.code] ??
            ERROR_MESSAGES.common.unexpectedError
        );
        scopeData = error.customData ?? {};
      } else {
        setToastNotification(ERROR_MESSAGES.common.unexpectedError);
      }
      errorLogger(`Action ${action} has failed\n`, error, scopeData);
    },
    [setToastNotification, t]
  );
  return handleError;
}

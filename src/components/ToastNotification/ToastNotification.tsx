import { useToastNotificationContext } from "../ToastNotificationProvider/toastNotificationContext";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { MdWarning } from "react-icons/md";

const TOAST_COLORS = {
  error: "bg-red-400",
  warn: "bg-yellow-400",
  message: "bg-blue-400",
  success: "bg-green-400",
  info: "bg-cyan-400",
  loading: "bg-gray-400",
};

export function ToastNotification() {
  const { toastNotification } = useToastNotificationContext();
  const { message, type } = toastNotification;
  return (
    message && (
      <AnimatePresence>
        <motion.section
          key="toast"
          className={clsx(
            "absolute z-10 bottom-5 right-5 min-w-80 min-h-30 rounded-lg p-4 text-white font-semibold border border-transparent shadow-lg transition-transform transform hover:scale-105",
            TOAST_COLORS[type] // Use the color mapping based on the type
          )}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            x: 0,
            y: -20,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.8,
          }}
          transition={{ ease: "linear", mass: 1, stiffness: 100 }}
        >
          <div className="flex items-center gap-2">
            <MdWarning className="icon--1_5rem" />
            <span>{message}</span>
          </div>
        </motion.section>
      </AnimatePresence>
    )
  );
}

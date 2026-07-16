"use client";

import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/stores";
import { ToastItem } from "./toast-item";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      className="fixed top-4 right-4 z-toast flex flex-col gap-2 max-w-full pointer-events-none [&>*]:pointer-events-auto"
      aria-live="assertive"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

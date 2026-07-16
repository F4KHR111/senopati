"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { useToastStore, type Toast } from "@/stores";

const iconMap = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
  error: <AlertCircle className="h-4 w-4 text-error" />,
  warning: <AlertCircle className="h-4 w-4 text-warning" />,
  info: <Info className="h-4 w-4 text-info" />,
};

interface ToastItemProps {
  toast: Toast;
}

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className="flex w-80 items-start gap-3 rounded-lg border border-border bg-bg p-4 shadow-lg"
    >
      <div className="shrink-0 mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-text-primary leading-tight">
          {toast.title}
        </span>
        {toast.description && (
          <span className="text-[11px] text-text-secondary leading-relaxed">
            {toast.description}
          </span>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-text-tertiary hover:text-text-primary p-0.5 rounded transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

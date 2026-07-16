"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeIn, scaleIn, easeTransition } from "@/lib/animations";
import { Button } from "../ui/button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  type?: "info" | "warning" | "danger" | "success";
  isLoading?: boolean;
}

const iconMap = {
  info: <Info className="h-6 w-6 text-info" />,
  success: <CheckCircle className="h-6 w-6 text-success" />,
  warning: <AlertCircle className="h-6 w-6 text-warning" />,
  danger: <AlertCircle className="h-6 w-6 text-error" />,
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  onConfirm,
  type = "info",
  isLoading = false,
}: DialogProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          {/* Backdrop overlay */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={easeTransition}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={easeTransition}
            className="relative w-full max-w-md bg-bg border border-border shadow-xl rounded-lg p-6 overflow-hidden flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div className="shrink-0">{iconMap[type]}</div>
              <div className="flex flex-col gap-1.5">
                <h2 id="dialog-title" className="text-base font-semibold text-text-primary">
                  {title}
                </h2>
                <p id="dialog-description" className="text-sm text-text-secondary">
                  {description}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-2">
              <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button
                variant={type === "danger" ? "danger" : "primary"}
                size="sm"
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

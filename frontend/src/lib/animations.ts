import type { Variants } from "framer-motion";

/**
 * Framer Motion animation presets untuk SENOPATI.
 * Digunakan oleh Modal, Dialog, Dropdown, Toast, dan komponen overlay lainnya.
 */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
};

export const easeTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1] as const,
};

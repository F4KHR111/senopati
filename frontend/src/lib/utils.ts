import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility untuk menggabungkan class Tailwind secara aman.
 * Menghindari duplikasi dan konflik class (e.g., `p-2 p-4` → `p-4`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

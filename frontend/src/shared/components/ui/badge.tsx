import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

const variantMap = {
  primary: "bg-primary text-text-inverse border-transparent",
  secondary: "bg-bg-secondary text-text-secondary border-border",
  accent: "bg-accent/10 text-accent-dark border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-error/10 text-error border-error/20",
  info: "bg-info/10 text-info border-info/20",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[10px] font-semibold rounded",
  md: "px-2.5 py-0.5 text-xs font-semibold rounded-md",
};

export function Badge({ className, variant = "secondary", size = "md", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border font-sans select-none transition-colors",
        variantMap[variant],
        sizeMap[size],
        className
      )}
      {...props}
    />
  );
}

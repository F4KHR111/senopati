import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantMap = {
  primary:
    "bg-primary text-text-inverse hover:bg-primary-light active:bg-primary-dark",
  secondary:
    "bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary active:bg-border",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-text-inverse active:bg-primary-dark",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary active:bg-bg-tertiary",
  danger:
    "bg-error text-text-inverse hover:bg-error/90 active:bg-error/80",
};

const sizeMap = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-9 px-4 text-sm gap-2 rounded-md",
  lg: "h-11 px-6 text-sm gap-2 rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:pointer-events-none disabled:opacity-50",
          variantMap[variant],
          sizeMap[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

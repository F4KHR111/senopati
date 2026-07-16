import { forwardRef, type ComponentPropsWithoutRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2.5">
          <div className="flex h-5 items-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              className={cn(
                "h-4.5 w-4.5 rounded border border-border bg-bg text-accent focus:ring-accent",
                "transition-colors cursor-pointer",
                "focus:ring-2 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-error focus:ring-error" : "hover:border-border-hover",
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-text-primary select-none cursor-pointer">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="pl-7 text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

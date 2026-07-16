import { forwardRef, type ComponentPropsWithoutRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  error?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, id: externalId, checked, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              {...props}
            />
            <div
              className={cn(
                "w-9 h-5 bg-bg-tertiary rounded-full peer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-accent",
                "peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
                "after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent",
                "transition-colors",
                className
              )}
            />
          </label>
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-text-primary select-none cursor-pointer">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };

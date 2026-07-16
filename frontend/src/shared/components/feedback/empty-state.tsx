import { type ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <Inbox className="h-10 w-10 text-text-tertiary" strokeWidth={1.2} />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-lg bg-bg-secondary/35 min-h-[300px] gap-4",
        className
      )}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-bg-secondary border border-border/80">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <p className="text-xs leading-relaxed text-text-tertiary">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

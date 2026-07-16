"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg font-semibold",
  xl: "h-20 w-20 text-2xl font-semibold",
};

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-secondary border border-border select-none",
        sizeMap[size],
        className
      )}
    >
      {src && !error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-text-secondary uppercase">{fallback.slice(0, 2)}</span>
      )}
    </div>
  );
}

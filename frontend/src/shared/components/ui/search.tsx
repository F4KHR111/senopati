"use client";

import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/shared/hooks";

export interface SearchProps extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "value"> {
  onSearch: (value: string) => void;
  debounceMs?: number;
  initialValue?: string;
}

export function Search({
  className,
  onSearch,
  debounceMs = 300,
  initialValue = "",
  placeholder = "Cari...",
  ...props
}: SearchProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={cn("relative w-full max-w-sm flex items-center", className)}>
      <div className="pointer-events-none absolute left-3 flex items-center text-text-tertiary">
        <SearchIcon className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full rounded-md border border-border bg-bg pl-9.5 pr-8 text-sm text-text-primary",
          "placeholder:text-text-tertiary",
          "transition-colors",
          "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent hover:border-border-hover",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        {...props}
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 flex items-center text-text-tertiary hover:text-text-primary p-0.5 rounded transition-colors"
          aria-label="Hapus pencarian"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

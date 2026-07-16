"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console/analytics
    console.error("Runtime error caught at boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-secondary p-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 border border-error/20 text-error animate-bounce">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-primary">Terjadi Kesalahan Sistem</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Terjadi masalah saat merender komponen aplikasi. Kami telah mencatat log kesalahan ini.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Ulangi Memuat Halaman
        </Button>
      </div>
    </div>
  );
}
